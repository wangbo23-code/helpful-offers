/**
 * Credits system — public API for business logic
 *
 * Wraps db.ts credit operations with config-aware defaults.
 * Safe for AI to import and use in the sandbox.
 */
import {
  getCredits as dbGetCredits,
  useCredits as dbUseCredits,
  addCredits as dbAddCredits,
  hasCredits as dbHasCredits,
} from "./db";
import { siteConfig } from "./config";

/**
 * Get remaining credits for a user
 */
export async function getCredits(userEmail: string): Promise<number> {
  return dbGetCredits(userEmail);
}

/**
 * Use credits for one tool action. Returns false if insufficient.
 */
export async function useCredit(userEmail: string): Promise<boolean> {
  return dbUseCredits(userEmail, siteConfig.credits.perUse);
}

/**
 * Add credits (typically called from webhook after payment)
 */
export async function addCredits(
  userEmail: string,
  amount: number
): Promise<void> {
  return dbAddCredits(userEmail, amount);
}

/**
 * Check if user has enough credits for one use
 */
export async function hasCredits(userEmail: string): Promise<boolean> {
  return dbHasCredits(userEmail, siteConfig.credits.perUse);
}
