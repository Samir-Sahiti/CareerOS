import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, consumeRateLimit } from "@/lib/rateLimit";
import { tailorCvForAnalysis } from "@/lib/ai/tailorCv";
import { generateCoverLetterForAnalysis } from "@/lib/ai/generateCoverLetter";
import { logger } from "@/lib/logger";
import { errorResponse, successResponse, rateLimitResponse } from "@/lib/apiResponse";
import { z } from "zod";

export const maxDuration = 60;

const bundleSchema = z.object({
  job_analysis_id: z.string().uuid("job_analysis_id must be a valid UUID"),
  include_tailored_cv: z.boolean().default(true),
  include_cover_letter: z.boolean().default(true),
});

/**
 * POST /api/applications/bundle
 * Atomic-ish "Quick apply" — creates an application row plus (optionally) a
 * tailored CV and a cover letter. Order matters because the application row
 * stores foreign keys to the artifacts produced first.
 *
 * Rate limits are checked per artifact's own route limit, since each one is
 * a real AI call. If any check fails before that artifact runs, we return 429
 * for that step and persist whatever's already been created.
 */
export async function POST(req: Request) {
  try {
    let body: unknown;
    try { body = await req.json(); } catch { return errorResponse("Invalid JSON body", 400); }

    const parsed = bundleSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0]?.message ?? "Invalid request", 400);

    const { job_analysis_id, include_tailored_cv, include_cover_letter } = parsed.data;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return errorResponse("Unauthorized", 401);

    // Verify the analysis exists and belongs to the user; pull title/company for the application row.
    const { data: analysis, error: analysisError } = await supabase
      .from("job_analyses")
      .select("id, job_title, company")
      .eq("id", job_analysis_id)
      .eq("user_id", user.id)
      .single();

    if (analysisError || !analysis) return errorResponse("Job analysis not found", 404);

    // If an application already exists for this analysis, treat it as the target row
    const { data: existingApp } = await supabase
      .from("applications")
      .select("*")
      .eq("job_analysis_id", job_analysis_id)
      .eq("user_id", user.id)
      .maybeSingle();

    let tailoredCvId: string | null = existingApp?.tailored_cv_id ?? null;
    let coverLetterId: string | null = existingApp?.cover_letter_id ?? null;

    // Step 1 — tailored CV (optional)
    if (include_tailored_cv) {
      const limit = await checkRateLimit(supabase, user.id, "/api/cv/tailor");
      if (!limit.allowed) return rateLimitResponse(limit.message!);

      const result = await tailorCvForAnalysis({
        supabase,
        userId: user.id,
        jobAnalysisId: job_analysis_id,
      });
      await consumeRateLimit(supabase, user.id, "/api/cv/tailor");
      tailoredCvId = result.tailoredCv.id;
    }

    // Step 2 — cover letter (optional)
    if (include_cover_letter) {
      const limit = await checkRateLimit(supabase, user.id, "/api/cover-letter/generate");
      if (!limit.allowed) return rateLimitResponse(limit.message!);

      const result = await generateCoverLetterForAnalysis({
        supabase,
        userId: user.id,
        jobAnalysisId: job_analysis_id,
      });
      await consumeRateLimit(supabase, user.id, "/api/cover-letter/generate");
      coverLetterId = result.letter.id;
    }

    // Step 3 — application row (upsert via id)
    let applicationId: string;
    if (existingApp) {
      const { data: updated, error: updateError } = await supabase
        .from("applications")
        .update({
          tailored_cv_id: tailoredCvId,
          cover_letter_id: coverLetterId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingApp.id)
        .eq("user_id", user.id)
        .select("id")
        .single();
      if (updateError || !updated) {
        logger.error("Failed to update application in bundle", { job_analysis_id }, updateError);
        return errorResponse("Failed to update application", 500);
      }
      applicationId = updated.id;
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("applications")
        .insert({
          user_id: user.id,
          job_analysis_id,
          job_title: analysis.job_title,
          company: analysis.company ?? null,
          status: "saved",
          tailored_cv_id: tailoredCvId,
          cover_letter_id: coverLetterId,
        })
        .select("id")
        .single();
      if (insertError || !inserted) {
        logger.error("Failed to create application in bundle", { job_analysis_id }, insertError);
        return errorResponse("Failed to create application", 500);
      }
      applicationId = inserted.id;
    }

    return successResponse({
      application_id: applicationId,
      tailored_cv_id: tailoredCvId,
      cover_letter_id: coverLetterId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    logger.error("Bundle error", { route: "/api/applications/bundle" }, error);
    return errorResponse(message, 500);
  }
}
