import type { SupabaseClient } from "@supabase/supabase-js";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { TailoredCvOutputSchema } from "@/lib/validation/schemas";
import { buildCvTailorPrompt } from "@/lib/ai/prompts";
import { trackedAICall } from "@/lib/ai/trackedCall";
import { logger } from "@/lib/logger";
import type { JobAnalysis, ParsedCvData, TailoredCv } from "@/types";

export interface TailorCvResult {
  tailoredCv: TailoredCv;
  tailoring_notes: string[];
  summary: string | undefined;
}

/**
 * Tailor a user's active CV against a saved job analysis. Persists a row in
 * tailored_cvs and returns the row plus the prompt's qualitative output.
 *
 * Caller is responsible for: rate-limit check + consume, and any UI gating.
 */
export async function tailorCvForAnalysis(args: {
  supabase: SupabaseClient;
  userId: string;
  jobAnalysisId: string;
}): Promise<TailorCvResult> {
  const { supabase, userId, jobAnalysisId } = args;

  // Fetch job analysis
  const { data: analysisData, error: analysisError } = await supabase
    .from("job_analyses")
    .select("*")
    .eq("id", jobAnalysisId)
    .eq("user_id", userId)
    .single();

  if (analysisError || !analysisData) throw new Error("Job analysis not found");
  const analysis = analysisData as JobAnalysis;

  // Fetch active CV
  const { data: cvData, error: cvError } = await supabase
    .from("cvs")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .maybeSingle();

  if (cvError || !cvData || !cvData.parsed_data) {
    throw new Error("No active parsed CV found. Upload and parse your CV first.");
  }

  const cv = cvData.parsed_data as ParsedCvData;

  const prompt = buildCvTailorPrompt(
    cv,
    analysis.job_title,
    analysis.company ?? undefined,
    analysis.job_raw_text,
    analysis.matched_skills ?? [],
    analysis.missing_skills ?? [],
  );

  const { object } = await trackedAICall(
    { route: "/api/cv/tailor", userId, model: "claude-haiku-4-5", aiFunction: "generateObject" },
    () =>
      generateObject({
        model: anthropic("claude-haiku-4-5"),
        schema: TailoredCvOutputSchema,
        prompt,
      })
  );

  const tailoredData: ParsedCvData = {
    current_role: cv.current_role,
    seniority_level: cv.seniority_level,
    years_of_experience: cv.years_of_experience,
    skills: object.skills,
    education: object.education,
    experience: object.experience,
    achievements: cv.achievements,
  };

  // Append-only: every tailor run creates a new row at version = max + 1.
  // Previous versions are preserved so users can compare variants.
  const { data: latest } = await supabase
    .from("tailored_cvs")
    .select("version")
    .eq("job_analysis_id", jobAnalysisId)
    .eq("user_id", userId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = (latest?.version ?? 0) + 1;

  const { data: inserted, error: insertError } = await supabase
    .from("tailored_cvs")
    .insert({
      user_id: userId,
      cv_id: cvData.id,
      job_analysis_id: jobAnalysisId,
      tailored_data: tailoredData,
      version: nextVersion,
    })
    .select()
    .single();
  if (insertError || !inserted) {
    logger.error("Failed to insert tailored CV", { jobAnalysisId, version: nextVersion }, insertError);
    throw new Error("Failed to save tailored CV");
  }

  return {
    tailoredCv: inserted as TailoredCv,
    tailoring_notes: object.tailoring_notes,
    summary: object.summary,
  };
}
