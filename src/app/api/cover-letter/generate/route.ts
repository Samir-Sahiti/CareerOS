import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, consumeRateLimit } from "@/lib/rateLimit";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { ParsedCvData } from "@/types";
import { generateCoverLetterSchema } from "@/lib/validation/schemas";
import { buildCoverLetterPrompt, COVER_LETTER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { logger } from "@/lib/logger";
import { errorResponse, successResponse, rateLimitResponse } from "@/lib/apiResponse";
import { trackedAICall } from "@/lib/ai/trackedCall";
import { generateCoverLetterForAnalysis } from "@/lib/ai/generateCoverLetter";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse("Invalid JSON body", 400);
    }

    const parsed = generateCoverLetterSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message ?? "jobTitle is required", 400);
    }

    const { jobTitle, company, jobRawText, jobAnalysisId } = parsed.data;

    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return errorResponse("Unauthorized", 401);
    }

    const rateLimit = await checkRateLimit(supabase, user.id, "/api/cover-letter/generate");
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.message!);
    }

    // Path 1: analysis-based generation — delegate to lib function
    if (jobAnalysisId) {
      const result = await generateCoverLetterForAnalysis({
        supabase,
        userId: user.id,
        jobAnalysisId,
      });
      await consumeRateLimit(supabase, user.id, "/api/cover-letter/generate");
      return successResponse({ id: result.letter.id, content: result.letter.content });
    }

    // Path 2: ad-hoc generation with raw text (legacy entry point)
    const { data: cvData } = await supabase
      .from("cvs")
      .select("parsed_data")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (!cvData?.parsed_data) {
      return errorResponse("No parsed CV found. Please upload and process a CV first.", 400);
    }

    const cv = cvData.parsed_data as ParsedCvData;

    const { text } = await trackedAICall(
      { route: "/api/cover-letter/generate", userId: user.id, model: "claude-haiku-4-5", aiFunction: "generateText" },
      () =>
        generateText({
          model: anthropic("claude-haiku-4-5"),
          system: COVER_LETTER_SYSTEM_PROMPT,
          prompt: buildCoverLetterPrompt(cv, jobTitle, company, jobRawText ?? ""),
        })
    );

    const content = text.trim();

    const { data: letter, error: insertError } = await supabase
      .from("cover_letters")
      .insert({
        user_id: user.id,
        job_analysis_id: null,
        job_title: jobTitle,
        company: company || null,
        content,
      })
      .select("*")
      .single();

    if (insertError || !letter) {
      logger.error("Failed to save cover letter", { route: "/api/cover-letter/generate", jobTitle }, insertError);
      return errorResponse("Failed to save cover letter", 500);
    }

    await consumeRateLimit(supabase, user.id, "/api/cover-letter/generate");

    return successResponse({ id: letter.id, content: letter.content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    logger.error("Cover letter generation error", { route: "/api/cover-letter/generate" }, error);
    return errorResponse(message, 500);
  }
}
