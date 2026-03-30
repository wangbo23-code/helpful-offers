/**
 * Server-side checkout URL generator
 * Returns the correct checkout URL (real LS or mock) based on env vars
 */
import { NextRequest, NextResponse } from "next/server";
import { getCheckoutUrl } from "@/lib/payment";
import { siteConfig } from "@/lib/config";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const variantId = siteConfig.lemonSqueezy.variantId;
  const checkoutUrl = getCheckoutUrl(variantId, email);

  return NextResponse.json({ url: checkoutUrl });
}
