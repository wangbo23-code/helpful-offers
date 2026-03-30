/**
 * Lemon Squeezy Webhook handler — ⛔ AI MUST NOT modify this file
 *
 * Receives payment events and updates user credits.
 */
import { NextRequest, NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  parseWebhookEvent,
} from "@/lib/payment";
import { addCredits } from "@/lib/credits";
import { siteConfig } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-signature") ?? "";

    // Verify webhook authenticity
    if (!verifyWebhookSignature(body, signature)) {
      console.error("[Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = parseWebhookEvent(body);
    if (!event) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    console.log(`[Webhook] Received event: ${event.event_name}`);

    switch (event.event_name) {
      case "order_created": {
        const email = event.data.attributes.user_email;
        if (email) {
          const creditsToAdd = siteConfig.pricing.credits;
          await addCredits(email, creditsToAdd);
          console.log(
            `[Webhook] Added ${creditsToAdd} credits to ${email}`
          );
        }
        break;
      }

      case "subscription_created":
      case "subscription_updated": {
        const email = event.data.attributes.user_email;
        const status = event.data.attributes.status;
        console.log(
          `[Webhook] Subscription ${status} for ${email}`
        );
        // TODO: Handle subscription status changes
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event: ${event.event_name}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Webhook] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
