/**
 * Cost tracker for AI API calls — logs token usage to Supabase
 *
 * Records input/output tokens, model, cost, and tool name for each invocation.
 * Falls back to console.log when Supabase is unavailable (mock mode).
 */

import { supabase } from "./db";

// OpenRouter model pricing (per 1M tokens, as of 2026-03)
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  "anthropic/claude-sonnet-4": { input: 3.0, output: 15.0 },
  "anthropic/claude-opus-4": { input: 15.0, output: 75.0 },
  "anthropic/claude-haiku-3.5": { input: 0.8, output: 4.0 },
};

const DEFAULT_PRICING = { input: 3.0, output: 15.0 };

export interface UsageRecord {
  toolName: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  userEmail?: string;
  durationMs?: number;
}

/**
 * Calculate cost from token counts and model
 */
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = MODEL_PRICING[model] ?? DEFAULT_PRICING;
  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;
  return Math.round((inputCost + outputCost) * 1_000_000) / 1_000_000; // 6 decimal places
}

/**
 * Extract usage from OpenRouter API response JSON
 */
export function extractUsage(
  responseJson: Record<string, unknown>
): { inputTokens: number; outputTokens: number } {
  const usage = responseJson.usage as
    | { prompt_tokens?: number; completion_tokens?: number }
    | undefined;

  return {
    inputTokens: usage?.prompt_tokens ?? 0,
    outputTokens: usage?.completion_tokens ?? 0,
  };
}

/**
 * Log a tool invocation's cost to Supabase
 *
 * Non-blocking: errors are caught and logged, never thrown.
 */
export async function logToolUsage(record: UsageRecord): Promise<void> {
  try {
    if (!supabase) {
      // Mock mode — just log to console
      console.log(
        `[CostTracker] ${record.toolName} | ${record.model} | ` +
          `in=${record.inputTokens} out=${record.outputTokens} | ` +
          `$${record.costUsd.toFixed(6)} | ${record.userEmail ?? "anonymous"}`
      );
      return;
    }

    await supabase.from("tool_usage_logs").insert({
      tool_name: record.toolName,
      model: record.model,
      input_tokens: record.inputTokens,
      output_tokens: record.outputTokens,
      cost_usd: record.costUsd,
      user_email: record.userEmail ?? null,
      duration_ms: record.durationMs ?? null,
    });
  } catch (err) {
    // Never block the main request for logging failures
    console.error("[CostTracker] Failed to log usage:", err);
  }
}

/**
 * Convenience: extract usage from response, calculate cost, and log — all in one call.
 *
 * Usage in API routes:
 * ```
 * const json = await res.json();
 * trackAndLog("stableshift", json, "anthropic/claude-sonnet-4", userEmail);
 * ```
 */
export async function trackAndLog(
  toolName: string,
  responseJson: Record<string, unknown>,
  model: string,
  userEmail?: string,
  durationMs?: number
): Promise<UsageRecord> {
  const { inputTokens, outputTokens } = extractUsage(responseJson);
  const costUsd = calculateCost(model, inputTokens, outputTokens);

  const record: UsageRecord = {
    toolName,
    model,
    inputTokens,
    outputTokens,
    costUsd,
    userEmail,
    durationMs,
  };

  await logToolUsage(record);
  return record;
}
