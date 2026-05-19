import type { SupabaseClient } from "@supabase/supabase-js";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { buildCoverLetterPrompt, COVER_LETTER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { trackedAICall } from "@/lib/ai/trackedCall";
import { logger } from "@/lib/logger";
import type { CoverLetter, JobAnalysis, ParsedCvData } from "@/types";

export interface CoverLetterResult {
  letter: CoverLetter;
}

/**
 * Generate and persist a cover letter for a saved job analysis.
 * Caller handles rate-limit check/consume + UI gating.
 */
export async function generateCoverLetterForAnalysis(args: {
  supabase: SupabaseClient;
  userId: string;
  jobAnalysisId: string;
}): Promise<CoverLetterResult> {
  const { supabase, userId, jobAnalysisId } = args;

  // Fetch analysis (for job_title, company, raw text)
  const { data: analysisData, error: analysisError } = await supabase
    .from("job_analyses")
    .select("*")
    .eq("id", jobAnalysisId)
    .eq("user_id", userId)
    .single();

  if (analysisError || !analysisData) throw new Error("Job analysis not found");
  const analysis = analysisData as JobAnalysis;

  // Active CV
  const { data: cvData } = await supabase
    .from("cvs")
    .select("parsed_data")
    .eq("user_id", userId)
    .eq("is_active", true)
    .maybeSingle();

  if (!cvData?.parsed_data) {
    throw new Error("No parsed CV found. Upload and parse your CV first.");
  }

  const cv = cvData.parsed_data as ParsedCvData;

  const { text } = await trackedAICall(
    { route: "/api/cover-letter/generate", userId, model: "claude-haiku-4-5", aiFunction: "generateText" },
    () =>
      generateText({
        model: anthropic("claude-haiku-4-5"),
        system: COVER_LETTER_SYSTEM_PROMPT,
        prompt: buildCoverLetterPrompt(cv, analysis.job_title, analysis.company ?? undefined, analysis.job_raw_text),
      })
  );

  const content = text.trim();

  const { data: letter, error: insertError } = await supabase
    .from("cover_letters")
    .insert({
      user_id: userId,
      job_analysis_id: jobAnalysisId,
      job_title: analysis.job_title,
      company: analysis.company ?? null,
      content,
    })
    .select("*")
    .single();

  if (insertError || !letter) {
    logger.error("Failed to save cover letter", { jobAnalysisId }, insertError);
    throw new Error("Failed to save cover letter");
  }

  return { letter: letter as CoverLetter };
}
