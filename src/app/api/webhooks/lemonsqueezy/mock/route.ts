/**
 * Mock payment endpoint for development
 * Simulates a successful payment by adding credits directly
 */
import { NextRequest, NextResponse } from "next/server";
import { addCredits } from "@/lib/credits";
import { siteConfig } from "@/lib/config";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const creditsToAdd = siteConfig.pricing.credits;
  await addCredits(email, creditsToAdd);

  console.log(`[MockPayment] Added ${creditsToAdd} credits to ${email}`);

  // Redirect back to tool page with success message
  return NextResponse.redirect(
    new URL("/tool?payment=success", req.url)
  );
}
