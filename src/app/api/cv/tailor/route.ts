import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, consumeRateLimit } from "@/lib/rateLimit";
import { tailorCvSchema } from "@/lib/validation/schemas";
import { tailorCvForAnalysis } from "@/lib/ai/tailorCv";
import { logger } from "@/lib/logger";
import { errorResponse, successResponse, rateLimitResponse } from "@/lib/apiResponse";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    let body: unknown;
    try { body = await req.json(); } catch { return errorResponse("Invalid JSON body", 400); }

    const parsed = tailorCvSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    const { jobAnalysisId } = parsed.data;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const rateLimit = await checkRateLimit(supabase, user.id, "/api/cv/tailor");
    if (!rateLimit.allowed) return rateLimitResponse(rateLimit.message!);

    const result = await tailorCvForAnalysis({ supabase, userId: user.id, jobAnalysisId });

    await consumeRateLimit(supabase, user.id, "/api/cv/tailor");

    return successResponse({
      ...result.tailoredCv,
      tailoring_notes: result.tailoring_notes,
      summary: result.summary,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    logger.error("CV tailoring error", { route: "/api/cv/tailor" }, error);
    return errorResponse(message, 500);
  }
}

export async function PATCH(req: Request) {
  // Save user edits to a tailored CV
  try {
    let body: unknown;
    try { body = await req.json(); } catch { return errorResponse("Invalid JSON body", 400); }

    const { tailoredCvId, userEdits } = body as { tailoredCvId: string; userEdits: unknown };
    if (!tailoredCvId) return errorResponse("tailoredCvId is required", 400);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const { data, error } = await supabase
      .from("tailored_cvs")
      .update({ user_edits: userEdits, updated_at: new Date().toISOString() })
      .eq("id", tailoredCvId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) return errorResponse("Failed to save edits", 500);
    return successResponse(data);
  } catch (error: unknown) {
    logger.error("Tailored CV PATCH error", {}, error);
    return errorResponse("Internal server error", 500);
  }
}
