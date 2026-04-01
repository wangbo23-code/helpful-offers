/**
 * API retry with exponential backoff — extracted from Claude Code patterns
 *
 * Handles 429 (rate limit) and 503 (capacity) errors with smart retry.
 * Non-retryable errors (400, 401, 403) fail immediately.
 */

const BASE_DELAY_MS = 500;
const MAX_DELAY_MS = 10000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface RetryOptions {
  maxRetries?: number;
  onRetry?: (attempt: number, status: number, delay: number) => void;
}

/**
 * Wrapper around fetch() that retries on transient errors.
 *
 * - 429 / 503 / 529: retry with exponential backoff + jitter
 * - Network errors (ECONNRESET, timeout): retry
 * - 400 / 401 / 403 / 404: fail immediately (not transient)
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const { maxRetries = 2, onRetry } = retryOptions;
  let delay = BASE_DELAY_MS;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        signal: options.signal ?? AbortSignal.timeout(30000), // 30s timeout
      });

      // Success
      if (res.ok) return res;

      // Retryable status codes
      const isRetryable = [429, 503, 529].includes(res.status);
      if (isRetryable && attempt < maxRetries) {
        // Check Retry-After header
        const retryAfter = res.headers.get("retry-after");
        if (retryAfter) {
          const retryMs = parseInt(retryAfter, 10) * 1000;
          if (!isNaN(retryMs) && retryMs > 0 && retryMs < MAX_DELAY_MS) {
            delay = retryMs;
          }
        }

        onRetry?.(attempt + 1, res.status, delay);
        await sleep(delay);
        delay = Math.min(delay * (1.5 + Math.random()), MAX_DELAY_MS);
        continue;
      }

      // Non-retryable or exhausted retries
      return res;
    } catch (err) {
      // Network error — retry if attempts remain
      if (attempt < maxRetries) {
        onRetry?.(attempt + 1, 0, delay);
        await sleep(delay);
        delay = Math.min(delay * (1.5 + Math.random()), MAX_DELAY_MS);
        continue;
      }
      throw err;
    }
  }

  // TypeScript: should never reach here
  throw new Error("fetchWithRetry: unexpected end of retry loop");
}
