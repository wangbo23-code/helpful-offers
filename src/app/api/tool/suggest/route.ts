import { NextRequest, NextResponse } from "next/server";

interface SuggestInput {
  crisisType: string;
  relationship: string;
  details: string;
}

const SYSTEM_PROMPT = `You are an empathy and support expert who helps people offer meaningful, specific help to friends and family in crisis.

Given the crisis type, the helper's relationship, and any details, generate specific, actionable suggestions. You MUST output ONLY valid JSON with this exact structure:

{
  "specificOffers": [
    {
      "offer": "<specific offer, e.g. 'I'll bring dinner Tuesday and Thursday this week'>",
      "why": "<why this helps, e.g. 'Cooking is overwhelming when grieving, and specific days remove decision fatigue'>",
      "timing": "<when to offer this, e.g. 'First week'>"
    }
  ],
  "messageTemplates": [
    {
      "situation": "<when to send, e.g. 'Initial reach out'>",
      "message": "<ready-to-send message text>"
    }
  ],
  "thingsToAvoid": ["<thing to avoid saying or doing>"],
  "timingGuide": [
    {
      "when": "<timeframe, e.g. 'First 24 hours'>",
      "what": "<what to do during this time>"
    }
  ],
  "practicalHelp": ["<practical help idea>"],
  "emotionalSupport": ["<emotional support tip>"]
}

Guidelines:
- Generate 5-7 specific offers with concrete details (days, times, items)
- Generate 3-4 message templates for different moments
- Generate 4-6 things to avoid
- Generate 4-5 timing guide entries
- Generate 5-7 practical help ideas
- Generate 4-6 emotional support tips
- Tailor formality and intimacy to the relationship level
- For acquaintances, keep offers lighter and less personal
- For close friends/family, include more intimate and involved help
- Be culturally sensitive and inclusive
- Never suggest anything that could be intrusive or boundary-crossing for the relationship level

ONLY output valid JSON. No markdown, no explanation outside the JSON.`;

export async function POST(req: NextRequest) {
  try {
    const input: SuggestInput = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(generateFallbackSuggestions(input));
    }

    const model = process.env.AI_MODEL ?? "anthropic/claude-sonnet-4";

    const userPrompt = `Generate specific help suggestions for this situation:

CRISIS TYPE: ${input.crisisType}
RELATIONSHIP: ${input.relationship}
ADDITIONAL DETAILS: ${input.details || "None provided"}

Please provide specific, actionable, and sensitive suggestions tailored to this relationship level and crisis type.`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://helpfuloffers.forgetool.co",
        "X-Title": "HelpfulOffers",
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      console.error("OpenRouter error:", await res.text());
      return NextResponse.json(generateFallbackSuggestions(input));
    }

    const json = await res.json();
    const text = json.choices?.[0]?.message?.content ?? "";
    const cleanText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const suggestions = JSON.parse(cleanText);
    return NextResponse.json(suggestions);
  } catch (err) {
    console.error("Suggestion error:", err);
    return NextResponse.json(
      { error: "Failed to generate suggestions. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * Simple fallback when AI is unavailable
 */
function generateFallbackSuggestions(input: SuggestInput) {
  const isClose = input.relationship === "close-friend" || input.relationship === "family";
  const crisisLabel = input.crisisType.replace(/-/g, " ");

  return {
    specificOffers: [
      {
        offer: isClose
          ? "I'll bring dinner on Tuesday evening around 6pm"
          : "I'd like to drop off a meal this week — what day works best?",
        why: "Meals are universally helpful and remove one daily burden.",
        timing: "First week",
      },
      {
        offer: isClose
          ? "I'm free Saturday morning to help with errands — groceries, pharmacy, whatever you need"
          : "Can I pick up groceries for you this weekend?",
        why: "Routine tasks become overwhelming during a crisis.",
        timing: "First two weeks",
      },
      {
        offer: "I'll check in on you next Thursday — no need to respond if you're not up for it",
        why: "Scheduled check-ins show sustained care without pressure.",
        timing: "Ongoing",
      },
      {
        offer: isClose
          ? "I can take the kids to the park Saturday afternoon so you can rest"
          : "If you need someone to walk the dog or water plants, I'm happy to help",
        why: "Specific childcare or pet care offers are easier to accept than vague help.",
        timing: "First month",
      },
      {
        offer: "I set a reminder to check on you in a month — most people forget after the first week",
        why: "Long-term support matters more than the initial rush of help.",
        timing: "One month out",
      },
    ],
    messageTemplates: [
      {
        situation: "Initial reach out",
        message: isClose
          ? `I just heard about what happened. I love you and I'm here. I'm going to bring you dinner on [day] — you don't need to do anything. I'll leave it at the door if you're not up for company.`
          : `I heard about your ${crisisLabel} and I'm so sorry. I'd like to help in a concrete way — can I drop off a meal this week? No need to respond right away.`,
      },
      {
        situation: "Follow-up check in",
        message: "Thinking of you today. No need to reply — just wanted you to know you're on my mind.",
      },
      {
        situation: "Offering specific help",
        message: `I'm heading to the store tomorrow. I'm going to grab a few things for you — text me your list, or I'll just get the basics. Either way, I'll drop a bag by around 5.`,
      },
    ],
    thingsToAvoid: [
      "Don't say 'Let me know if you need anything' — they won't ask",
      "Don't compare their situation to others or your own experiences",
      "Don't say 'Everything happens for a reason' or similar platitudes",
      "Don't ask 'How are you?' — they're obviously not OK",
      "Don't share their news with others without permission",
      "Don't disappear after the first week — long-term support matters most",
    ],
    timingGuide: [
      { when: "First 24 hours", what: "Send a brief message. Don't expect a reply. Don't visit unannounced." },
      { when: "First week", what: "Deliver practical help: meals, errands, childcare. Keep visits short." },
      { when: "Weeks 2-4", what: "Continue checking in. Most people stop helping now — don't be most people." },
      { when: "Month 2+", what: "Mark your calendar to reach out. Acknowledge hard dates (anniversaries, holidays)." },
      { when: "Ongoing", what: "Remember that grief and recovery are not linear. Keep showing up." },
    ],
    practicalHelp: [
      "Prepare and deliver freezer-friendly meals with reheating instructions",
      "Offer to handle specific errands: grocery runs, pharmacy pickups, dry cleaning",
      "Help with household tasks: laundry, dishes, yard work",
      "Coordinate with others to set up a meal train or help schedule",
      isClose ? "Stay overnight if they don't want to be alone" : "Offer to walk their dog or water their plants",
      "Research resources they might need: support groups, financial aid, specialists",
    ],
    emotionalSupport: [
      "Listen more than you talk — presence matters more than words",
      "Say 'I don't know what to say, but I'm here' — honesty beats platitudes",
      "Follow their lead on whether they want to talk about it or be distracted",
      "Don't try to fix it or find a silver lining — just acknowledge the pain",
      "Remember important dates and check in around them",
      "Accept that you can't make it better — showing up consistently is enough",
    ],
  };
}
