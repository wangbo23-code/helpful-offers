/**
 * Site configuration — HelpfulOffers
 */
export const siteConfig = {
  name: "HelpfulOffers",
  description: "AI-powered specific help suggestion generator for supporting friends and family in crisis",
  url: (process.env.NEXTAUTH_URL ?? "http://localhost:3000").trim(),
  contactEmail: "support@forgetool.co",

  hero: {
    title: "Stop Saying 'Let Me Know If I Can Help' — Say THIS Instead",
    subtitle:
      "Enter the situation and your relationship, get specific, meaningful offers of help with ready-to-send messages.",
    cta: "Get Help Suggestions →",
  },

  howItWorks: [
    { step: "1", title: "Describe the situation", description: "Select the crisis type, your relationship, and any specific details." },
    { step: "2", title: "AI generates suggestions", description: "Our AI creates specific, actionable offers of help tailored to the situation." },
    { step: "3", title: "Send with confidence", description: "Get ready-to-send messages, timing advice, and things to avoid." },
  ] as { step: string; title: string; description: string }[],

  faqs: [
    { q: "How does HelpfulOffers work?", a: "Enter the type of crisis, your relationship to the person, and any details. Our AI generates specific offers of help, ready-to-send messages, and timing guidance." },
    { q: "Why are specific offers better than 'let me know if you need anything'?", a: "People in crisis are overwhelmed and rarely ask for help. Specific offers remove the burden of figuring out what they need and make it easy to say yes." },
    { q: "Can I try it for free?", a: "Yes! You get 3 free uses when you sign up. No credit card required." },
    { q: "Is this a replacement for professional counseling?", a: "No. HelpfulOffers helps you be a better friend or family member. It does not provide therapy or crisis intervention. If someone is in immediate danger, call 911." },
    { q: "How accurate are the suggestions?", a: "Our AI generates thoughtful, situation-appropriate suggestions based on best practices for supporting people in crisis. Always use your own judgment about what fits your relationship." },
    { q: "Is my data private?", a: "We do not store your input data after generating results. See our Privacy Policy for details." },
  ] as { q: string; a: string }[],

  pricing: {
    price: "$5",
    period: "one-time" as "one-time" | "monthly",
    credits: 50,
    features: [
      "Specific help offers with timing",
      "Ready-to-send message templates",
      "Things to avoid saying",
      "Practical & emotional support guide",
    ],
  },

  credits: {
    freeOnSignup: 3,
    perUse: 1,
  },

  seo: {
    keywords: [
      "how to help friend in crisis",
      "specific help offers",
      "what to say when someone is grieving",
      "how to help someone who lost a loved one",
      "what to do when friend loses job",
      "how to support someone going through divorce",
      "practical help for new parents",
      "how to help sick friend",
      "meaningful offers of help",
      "what to say instead of let me know",
    ],
    metaTitle: "Stop Saying 'Let Me Know If I Can Help' — Get Specific Help Suggestions | HelpfulOffers",
    metaDescription: "AI-powered tool that generates specific, meaningful offers of help for friends and family in crisis. Get ready-to-send messages, timing advice, and things to avoid. Free to try.",
  },

  lemonSqueezy: {
    productId: process.env.LEMONSQUEEZY_PRODUCT_ID ?? "",
    variantId: process.env.LEMONSQUEEZY_VARIANT_ID ?? "",
  },
};

export type SiteConfig = typeof siteConfig;
