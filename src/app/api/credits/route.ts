import { NextRequest, NextResponse } from "next/server";
import { getCredits, useCredit } from "@/lib/credits";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const credits = await getCredits(email);
  return NextResponse.json({ credits });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = body.email as string;
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const success = await useCredit(email);
  if (!success) {
    return NextResponse.json(
      { error: "Insufficient credits", credits: 0 },
      { status: 402 }
    );
  }

  const remaining = await getCredits(email);
  return NextResponse.json({ success: true, credits: remaining });
}
