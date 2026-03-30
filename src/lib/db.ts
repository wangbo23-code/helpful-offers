import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

// In mock mode (no Supabase configured), we use in-memory storage
const isMockMode = !supabaseUrl || !supabaseKey;

export const supabase = isMockMode
  ? null
  : createClient(supabaseUrl!, supabaseKey!);

if (isMockMode) {
  console.warn(
    "[DB] Running in MOCK mode — no Supabase configured. Data is in-memory only."
  );
}

// ============================================
// Mock in-memory store (for development)
// ============================================
interface MockUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  credits: number;
  project_slug: string;
}

const mockUsers = new Map<string, MockUser>();

// ============================================
// Public API — used by business logic
// ============================================

export interface DbUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  credits: number;
  project_slug: string;
}

/**
 * Find or create user on login
 */
export async function upsertUser(params: {
  email: string;
  name: string;
  avatarUrl: string;
  projectSlug: string;
  freeCredits: number;
}): Promise<DbUser> {
  if (isMockMode) {
    const existing = mockUsers.get(params.email);
    if (existing) {
      existing.name = params.name;
      existing.avatar_url = params.avatarUrl;
      return existing;
    }
    const newUser: MockUser = {
      id: crypto.randomUUID(),
      email: params.email,
      name: params.name,
      avatar_url: params.avatarUrl,
      credits: params.freeCredits,
      project_slug: params.projectSlug,
    };
    mockUsers.set(params.email, newUser);
    return newUser;
  }

  // Real Supabase
  const { data, error } = await supabase!
    .from("users")
    .upsert(
      {
        email: params.email,
        name: params.name,
        avatar_url: params.avatarUrl,
        project_slug: params.projectSlug,
        credits: params.freeCredits,
      },
      { onConflict: "email" }
    )
    .select()
    .single();

  if (error) throw new Error(`DB upsert user failed: ${error.message}`);
  return data as DbUser;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<DbUser | null> {
  if (isMockMode) {
    return mockUsers.get(email) ?? null;
  }

  const { data, error } = await supabase!
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return null;
  return data as DbUser;
}

/**
 * Get user credits
 */
export async function getCredits(email: string): Promise<number> {
  const user = await getUserByEmail(email);
  return user?.credits ?? 0;
}

/**
 * Consume credits. Returns false if insufficient.
 */
export async function useCredits(
  email: string,
  amount: number = 1
): Promise<boolean> {
  if (isMockMode) {
    const user = mockUsers.get(email);
    if (!user || user.credits < amount) return false;
    user.credits -= amount;
    return true;
  }

  // Atomic decrement with check
  const { data, error } = await supabase!.rpc("use_credits", {
    user_email: email,
    amount,
  });

  if (error) {
    console.error("useCredits error:", error.message);
    return false;
  }
  return data as boolean;
}

/**
 * Add credits (called after payment)
 */
export async function addCredits(
  email: string,
  amount: number
): Promise<void> {
  if (isMockMode) {
    const user = mockUsers.get(email);
    if (user) user.credits += amount;
    return;
  }

  const { error } = await supabase!.rpc("add_credits", {
    user_email: email,
    amount,
  });

  if (error) throw new Error(`addCredits failed: ${error.message}`);
}

/**
 * Check if user has enough credits
 */
export async function hasCredits(
  email: string,
  amount: number = 1
): Promise<boolean> {
  const credits = await getCredits(email);
  return credits >= amount;
}
