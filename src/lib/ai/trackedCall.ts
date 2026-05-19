import { createAdminClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

type AIFunction = "generateObject" | "generateText" | "streamObject";

interface CallMeta {
  route: string;
  userId: string | null;
  model: string;
  aiFunction: AIFunction;
}

interface UsageShape {
  inputTokens?: number;
  outputTokens?: number;
  promptTokens?: number;
  completionTokens?: number;
}

interface AIResult {
  usage?: UsageShape | Promise<UsageShape>;
}

// Pricing per 1M tokens (USD). Update when model pricing changes.
const MODEL_PRICING: Record<string, { input_per_1m: number; output_per_1m: number }> = {
  "claude-haiku-4-5": { input_per_1m: 1.0, output_per_1m: 5.0 },
};

function computeCost(model: string, inputTokens?: number, outputTokens?: number): number | null {
  const pricing = MODEL_PRICING[model];
  if (!pricing) return null;
  const input = inputTokens ?? 0;
  const output = outputTokens ?? 0;
  return (input / 1_000_000) * pricing.input_per_1m + (output / 1_000_000) * pricing.output_per_1m;
}

function extractTokens(usage: UsageShape | undefined): { input?: number; output?: number } {
  if (!usage) return {};
  return {
    input: usage.inputTokens ?? usage.promptTokens,
    output: usage.outputTokens ?? usage.completionTokens,
  };
}

async function persistEvent(
  meta: CallMeta,
  duration_ms: number,
  success: boolean,
  tokens: { input?: number; output?: number },
  errorMessage: string | null,
) {
  try {
    const admin = createAdminClient();
    await admin.from("ai_call_events").insert({
      user_id: meta.userId,
      route: meta.route,
      model: meta.model,
      ai_function: meta.aiFunction,
      duration_ms,
      input_tokens: tokens.input ?? null,
      output_tokens: tokens.output ?? null,
      estimated_cost_usd: computeCost(meta.model, tokens.input, tokens.output),
      success,
      error_message: errorMessage,
    });
  } catch (err) {
    // Telemetry must never break the call. Log but swallow.
    logger.error("ai_call_events insert failed", { route: meta.route, userId: meta.userId ?? undefined }, err);
  }
}

/**
 * Wraps an AI SDK call (generateObject / generateText / streamObject) to record
 * latency, token usage, cost, and success in ai_call_events.
 *
 * Best-effort telemetry — failures to persist never propagate.
 *
 * For streamObject, pass the result's `usage` promise into trackStreamUsage
 * separately, since the wrapper returns before the stream consumes.
 */
export async function trackedAICall<T extends AIResult>(
  meta: CallMeta,
  fn: () => Promise<T>,
): Promise<T> {
  const start = Date.now();
  let result: T | undefined;
  let errorMessage: string | null = null;
  let success = false;
  try {
    result = await fn();
    success = true;
    return result;
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err);
    throw err;
  } finally {
    const duration_ms = Date.now() - start;
    const rawUsage = result?.usage;
    // For streamObject, usage is a Promise we don't await here. Token fields stay null.
    const usage =
      rawUsage && typeof (rawUsage as Promise<UsageShape>).then !== "function"
        ? (rawUsage as UsageShape)
        : undefined;
    const tokens = extractTokens(usage);
    void persistEvent(meta, duration_ms, success, tokens, errorMessage);
  }
}

/**
 * For streamObject calls: pass the promise returned by `result.usage` here to
 * resolve token counts after the stream completes and update the row.
 *
 * Currently we just insert a fresh row tagged ai_function='streamObject' once
 * the usage resolves — simpler than updating the in-flight row.
 */
export function trackStreamUsage(
  meta: CallMeta,
  usagePromise: Promise<UsageShape> | undefined,
  startedAt: number,
) {
  if (!usagePromise) return;
  void usagePromise
    .then((usage) => {
      const duration_ms = Date.now() - startedAt;
      const tokens = extractTokens(usage);
      return persistEvent(meta, duration_ms, true, tokens, null);
    })
    .catch(() => {
      // Already counted on failure path elsewhere if main call threw.
    });
}
