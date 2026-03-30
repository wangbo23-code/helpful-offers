/**
 * Authentication configuration — ⛔ AI MUST NOT modify this file
 *
 * Uses NextAuth.js with Google OAuth provider.
 * In mock mode (no Google credentials), uses a demo credential provider.
 */
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { upsertUser } from "./db";
import { siteConfig } from "./config";

const isMockAuth =
  !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET;

const providers: NextAuthConfig["providers"] = [];

if (isMockAuth) {
  // Mock provider for development
  providers.push(
    Credentials({
      name: "Demo Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@example.com" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string) || "demo@example.com";
        return {
          id: email,
          email,
          name: "Demo User",
          image: "",
        };
      },
    })
  );
} else {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        await upsertUser({
          email: user.email,
          name: user.name ?? "",
          avatarUrl: user.image ?? "",
          projectSlug: process.env.PROJECT_SLUG ?? "default",
          freeCredits: siteConfig.credits.freeOnSignup,
        });
      }
      return true;
    },
    async session({ session }) {
      return session;
    },
  },
});

/**
 * Get current authenticated user's email. Returns null if not logged in.
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Require authentication — throws if not logged in.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user?.email) {
    throw new Error("Authentication required");
  }
  return user;
}
