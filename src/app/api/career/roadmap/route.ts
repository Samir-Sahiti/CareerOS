import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, consumeRateLimit } from "@/lib/rateLimit";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { ParsedCvData } from "@/types";
import { logger } from "@/lib/logger";
import { errorResponse, successResponse, rateLimitResponse } from "@/lib/apiResponse";
import { generateRoadmapSchema } from "@/lib/validation/schemas";
import { CAREER_ROADMAP_SYSTEM_PROMPT, buildCareerRoadmapPrompt } from "@/lib/ai/prompts";
import { getTaxonomyIndex, normalizeSkill } from "@/lib/skills";
import { trackedAICall } from "@/lib/ai/trackedCall";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    let force = false;
    try {
      const body = await req.json();
      const parsed = generateRoadmapSchema.safeParse(body);
      if (parsed.success) force = parsed.data.force ?? false;
    } catch {
      // default force=false if body is missing or malformed
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const { data: cvData, error: cvError } = await supabase
      .from("cvs")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (cvError || !cvData || !cvData.parsed_data) {
      return errorResponse("No active parsed CV exists. Please analyse a CV first.", 400);
    }

    const { uploaded_at, parsed_data } = cvData;

    if (!force) {
      const { data: latestRoadmap } = await supabase
        .from("career_roadmaps")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestRoadmap && new Date(latestRoadmap.created_at) > new Date(uploaded_at)) {
        return successResponse({ roadmap: latestRoadmap, cached: true });
      }
    }

    const rateLimit = await checkRateLimit(supabase, user.id, "/api/career/roadmap");
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.message!);
    }

    const cv = parsed_data as ParsedCvData;

    const { object } = await trackedAICall(
      { route: "/api/career/roadmap", userId: user.id, model: "claude-haiku-4-5", aiFunction: "generateObject" },
      () =>
        generateObject({
          model: anthropic("claude-haiku-4-5"),
          system: CAREER_ROADMAP_SYSTEM_PROMPT,
          prompt: buildCareerRoadmapPrompt(cv),
          schema: z.object({
            current_role: z.string(),
            paths: z.array(
              z.object({
                path_title: z.string().describe('e.g. "IC Track", "Management Track"'),
                next_role: z.string().describe('e.g. "Senior Frontend Developer"'),
                timeline_estimate: z.string().describe('e.g. "12–18 months"'),
                missing_skills: z
                  .array(z.string())
                  .describe(
                    'Specific skills needed formatted as "Skill Name: Why it matters for this role"'
                  ),
                recommended_projects: z
                  .array(z.string())
                  .describe("Concrete, actionable portfolio projects to build missing skills"),
                experience_needed: z
                  .string()
                  .describe("Plaintext description of the type of experience they must gain first"),
              })
            ),
          }),
        })
    );

    const { data: insertedRoadmap, error: insertError } = await supabase
      .from("career_roadmaps")
      .insert({
        user_id: user.id,
        current_role: object.current_role,
        paths: object.paths,
      })
      .select("*")
      .single();

    if (insertError) throw insertError;

    // T2-4 + SG-5: Create roadmap_items from paths' missing_skills and recommended_projects.
    // Normalize skill titles to populate skill_id for auto-completion.
    let taxonomyIndex;
    try {
      taxonomyIndex = await getTaxonomyIndex();
    } catch {
      taxonomyIndex = null;
    }

    const itemsToInsert: {
      user_id: string;
      roadmap_id: string;
      item_type: string;
      title: string;
      description: string | null;
      skill_id: string | null;
      path_idx: number;
    }[] = [];

    object.paths.forEach((path, pathIdx) => {
      for (const skill of path.missing_skills ?? []) {
        const colonIdx = skill.indexOf(":");
        const title = colonIdx > 0 ? skill.substring(0, colonIdx).trim() : skill;
        const description = colonIdx > 0 ? skill.substring(colonIdx + 1).trim() : null;

        // SG-5: Normalize skill title against taxonomy
        let skill_id: string | null = null;
        if (taxonomyIndex) {
          const result = normalizeSkill(title, taxonomyIndex);
          skill_id = result.canonical?.id ?? null;
        }

        itemsToInsert.push({ user_id: user.id, roadmap_id: insertedRoadmap.id, item_type: "skill", title, description, skill_id, path_idx: pathIdx });
      }
      for (const proj of path.recommended_projects ?? []) {
        itemsToInsert.push({ user_id: user.id, roadmap_id: insertedRoadmap.id, item_type: "project", title: proj, description: null, skill_id: null, path_idx: pathIdx });
      }
    });

    if (itemsToInsert.length > 0) {
      await supabase.from("roadmap_items").insert(itemsToInsert);
    }

    await consumeRateLimit(supabase, user.id, "/api/career/roadmap");

    return successResponse({ roadmap: insertedRoadmap, cached: false });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate roadmap";
    logger.error("Roadmap generation error", { route: "/api/career/roadmap" }, error);
    return errorResponse(message, 500);
  }
}

// PATCH /api/career/roadmap — update which path the user has committed to
const selectPathSchema = z.object({
  roadmap_id: z.string().uuid(),
  selected_path_idx: z.number().int().min(0).nullable(),
});

export async function PATCH(req: Request) {
  try {
    let body: unknown;
    try { body = await req.json(); } catch { return errorResponse("Invalid JSON body", 400); }

    const parsed = selectPathSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0]?.message ?? "Invalid request", 400);

    const { roadmap_id, selected_path_idx } = parsed.data;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return errorResponse("Unauthorized", 401);

    // Validate the index is within bounds of paths[]
    if (selected_path_idx !== null) {
      const { data: existing } = await supabase
        .from("career_roadmaps")
        .select("paths")
        .eq("id", roadmap_id)
        .eq("user_id", user.id)
        .single();
      if (!existing) return errorResponse("Roadmap not found", 404);
      const pathsLen = Array.isArray(existing.paths) ? existing.paths.length : 0;
      if (selected_path_idx >= pathsLen) {
        return errorResponse(`selected_path_idx out of range (paths has ${pathsLen} entries)`, 400);
      }
    }

    const { data: updated, error: updateError } = await supabase
      .from("career_roadmaps")
      .update({ selected_path_idx })
      .eq("id", roadmap_id)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (updateError || !updated) {
      logger.error("Failed to update selected path", { roadmap_id, selected_path_idx }, updateError);
      return errorResponse("Failed to update selected path", 500);
    }

    return successResponse(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    logger.error("Roadmap PATCH error", { route: "/api/career/roadmap" }, error);
    return errorResponse(message, 500);
  }
}
