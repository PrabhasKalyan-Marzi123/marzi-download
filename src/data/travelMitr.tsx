import React from 'react';

// ─── Travel Assistance — content for /travel-assistance ──────────
//
// Edit copy here without touching component code. Phone numbers,
// CTAs, card text, and form labels are all in this single file.

export const TRAVEL_MITR_PHONE = "+918792237778";
export const TRAVEL_MITR_PHONE_DISPLAY = "+91 87922 37778";

// WhatsApp uses the international number without "+" or spaces
export const TRAVEL_MITR_WHATSAPP_URL =
  `https://wa.me/${TRAVEL_MITR_PHONE.replace(/[^\d]/g, "")}` +
  `?text=${encodeURIComponent("Hi Marzi Travel Mitr, I'd like some travel guidance.")}`;

export const TRAVEL_MITR_CALL_URL = `tel:${TRAVEL_MITR_PHONE}`;

// Django endpoint for the Travel Mitr lead form. In production this should
// be the absolute URL of the backend (e.g. https://api.marzi.life/...).
// For local dev with the backend running on :8000, set NEXT_PUBLIC_API_BASE_URL
// to "http://localhost:8000" in .env.local.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
export const TRAVEL_INQUIRY_ENDPOINT = `${API_BASE_URL}/api/home/travel-inquiry/create/`;

// Identifiers sent in the create payload so the backend can tag each lead
// with the page it came from. The values must match TravelInquiry.ALLOWED_PUBLIC_SOURCES
// in apps/home/models/travel_inquiry.py.
export const INQUIRY_SOURCE = {
  LANDING: "travel_mitr_landing",
  SAVINGS: "travel_mitr_savings",
  BALI: "travel_mitr_bali",
  EUROPE: "travel_mitr_europe",
  VIETNAM: "travel_mitr_vietnam",
  KASHMIR: "travel_mitr_kashmir",
} as const;

export type InquirySource = (typeof INQUIRY_SOURCE)[keyof typeof INQUIRY_SOURCE];

export const DESTINATIONS_CONTENT = {
  BALI: {
    hero: {
      headline: "Planning a Bali trip?",
      headlineAccent: <>Don’t overpay for <br className="sm:hidden" />the wrong choices.</>,
      subHeadline: "3N Kuta | 2N Ubud",
      description: "Kuta brings the buzz. Ubud brings the calm. Together, they make Bali complete. Five nights designed to give you both, without missing a thing.",
      backgroundImage: "/bali.avif",
    },
    source: INQUIRY_SOURCE.BALI,
  },
  EUROPE: {
    hero: {
      headline: "Planning an Europe trip?",
      headlineAccent: <>Don’t overpay for <br className="sm:hidden" />the wrong choices.</>,
      subHeadline: "2N Rome | 1N Pisa | 2N Venice | 3N Zurich | 2N Frankfurt",
      description: "Rome, Pisa, Venice, Zurich, Frankfurt — 10 nights, zero compromise. Every stop curated, every detail handled.",
      backgroundImage: "/europe.avif",
    },
    source: INQUIRY_SOURCE.EUROPE,
  },
  VIETNAM: {
    hero: {
      headline: "Planning a Vietnam trip?",
      headlineAccent: <>Don’t overpay for <br className="sm:hidden" />the wrong choices.</>,
      subHeadline: "3N Da Nang | 3N Phu Quoc | 1N Hanoi | 1N Halong Bay | 1N Ho Chi Minh",
      description: "Da Nang, Phu Quoc, Hanoi, Ha Long Bay, Ho Chi Minh — Vietnam in full. We pace it right so you feel everything.",
      backgroundImage: "/vietnam.avif",
    },
    source: INQUIRY_SOURCE.VIETNAM,
  },
  KASHMIR: {
    hero: {
      headline: "Planning a Kashmir trip?",
      headlineAccent: <>Don’t overpay for <br className="sm:hidden" />the wrong choices.</>,
      subHeadline: "2N Pahalgam | 4N Sri Nagar",
      description: "Meadows in Pahalgam, lakes in Srinagar — Kashmir has layers. We help you discover all of them.",
      backgroundImage: "/kashmir.avif",
    },
    source: INQUIRY_SOURCE.KASHMIR,
  },
} as const;

// Variant copy for the /travel-assistance-savings route. Same form, same sections —
// only the hero headline + sub-copy differ. Pass these as props to <TravelHero />.
export const TRAVEL_HERO_BADGE = "Exclusively for Travelers above the age of 50.";

export const TRAVEL_HERO = {
  headline: "Planning a trip?",
  headlineAccent: "Travel without confusion or worry.",
  description:
    "A real person who helps you plan every step simply, clearly, and with confidence.",
  whatsappLabel: "Chat on WhatsApp",
  callLabel: "Talk to a Travel Advisor",
  formTitle: "Get Started",
  formSubtitle: "Share a few details and we'll reach out.",
  formCtaLabel: "Request a Call Back",
  fields: {
    name: { label: "Full Name", placeholder: "Your name" },
    phone: { label: "Mobile Number", placeholder: "10-digit mobile number" },
    age: { label: "Age", placeholder: "e.g. 58" },
  },
};

export const LANDING_CONTENT = {
  hero: TRAVEL_HERO,
  intro: {
    heading: (
      <>
        Too many travel options.<br />
        <span className="text-primary">It’s hard to know what’s right</span> especially when comfort, safety, and pace matter.
      </>
    ),
    cardTitle: "Expert navigation for your next journey.",
    cardSubtitle: "Your personal navigator: simplifying the path ahead so you can move forward with total certainty.",
    checkpoints: [
      "Speak to a real advisor (not a bot).",
      "Guidance designed for 50+ travellers.",
      "Simple, clear answers — no confusion."
    ]
  },
  help: {
    header: "What We Help You With",
    heading: "Expert clarity for every challenge.",
    subtitle: "Whatever you’re unsure about — we guide you.",
    cards: [
      {
        title: "Before You Travel",
        points: [
          "What documents you need to carry.",
          "How to plan a route that suits your pace.",
          "Packing tips for comfortable travel.",
          "Planning your first solo or couple trip.",
        ],
      },
      {
        title: "Booking Guidance",
        points: [
          "Which flights, trains, or routes are easiest.",
          "How to avoid confusing booking platforms.",
          "Senior citizen discounts you may miss.",
          "Choosing safe, comfortable stays.",
        ],
      },
      {
        title: "Health & Safety",
        points: [
          "Medicines you can carry (and how).",
          "Staying safe in unfamiliar places.",
          "What to do if you feel unwell while travelling.",
          "Emergency planning and contacts.",
        ],
      },
      {
        title: "During Your Trip",
        points: [
          "Help with local transport and navigation.",
          "Food choices that are safe and suitable.",
          "Staying connected with family.",
          "Someone to call if anything feels off.",
        ],
      },
    ],
  },
  reasons: {
    header: "Why Marzi Travel Mitr",
    heading: "Travel, refined. We handle the complexity so you can focus on the experience.",
    items: [
      {
        title: "Personal Guidance",
        quote: "Real advisors who understand your 50+ travel needs",
      },
      {
        title: "Expert Experience",
        quote: "Guidance based on years of real-world travel experience",
      },
      {
        title: "Comfort & Safety",
        quote: "A strict focus on your pace, comfort, and total safety",
      },
      {
        title: "Full Support",
        quote: "Someone to call for support before and during your trip",
      },
    ],
    footer: "You don’t have to figure this out alone.",
  },
  how: {
    heading: "How It Works",
    steps: [
      {
        number: "1",
        title: "Share your travel plan",
        description: "Tell us where you want to go and what you need help with",
      },
      {
        number: "2",
        title: "Speak to a Travel Advisor",
        description: "We guide you step-by-step — based on your comfort and preferences",
      },
      {
        number: "3",
        title: "Travel with confidence",
        description: "Clear plan. No confusion. Support when you need it",
      },
    ],
  },
  unsure: {
    heading: "Not sure where to start?",
    subtitle: "Talk to a Marzi Travel Advisor and plan your trip with clarity and confidence.",
  }
};

export const SAVINGS_CONTENT = {
  hero: {
    headline: "Planning a trip?",
    headlineAccent: "Don’t overpay for the wrong choices.",
    description: "Smart choices. Strategic savings. Absolute comfort. We ensure every trip is high-value and zero-stress.",
  },
  intro: {
    heading: {
      type: "masterpiece",
      headline: "Superior Travel Standards. Strategic Price Advantage.",
      accent: "Price Advantage.",
      pitfalls: [
        { 
          text: "The Value Upgrade: We find superior stays and flights within your existing budget.", 
          highlight: "within your existing budget.", 
          type: "spend" 
        },
        { 
          text: "Cost Intelligence: Identifying premium choices that actually cost you less.", 
          highlight: "actually cost you less.", 
          type: "compromise" 
        }
      ]
    },
    cardTitle: "Strategic spending. Superior travel.",
    cardSubtitle: "Marzi Travel Mitr helps you get the best value without compromising on quality.",
    checkpoints: [
      "Pay only for what actually matters.",
      "Avoid overpriced or unsuitable options.",
      "Get comfortable, well-planned travel within your budget."
    ]
  },
  help: {
    header: "Strategic Value Areas",
    heading: "Strategic travel choices that protect both your comfort and your budget.",
    subtitle: "Expert insights that ensure every rupee spent is high-value.",
    bulletMarker: "✦",
    cards: [
      {
        title: "Booking Smarter",
        iconType: "flights",
        points: [
          "Which flights and trains offer best value (not just lowest price).",
          "When to book to avoid peak pricing.",
          "Avoiding hidden costs across platforms.",
          "Using senior citizen discounts effectively.",
        ],
      },
      {
        title: "Stay Selection",
        iconType: "hotels",
        points: [
          "Choosing hotels that are worth the price.",
          "Avoiding expensive but inconvenient locations.",
          "Getting comfort without overpaying for luxury you don’t need.",
          "Finding safe and well-rated stays within budget.",
        ],
      },
      {
        title: "Trip Planning",
        iconType: "transport",
        points: [
          "Optimising itinerary to reduce unnecessary travel costs.",
          "Avoiding expensive last-minute decisions.",
          "Choosing the right number of days for value.",
          "Balancing experiences vs spend.",
        ],
      },
      {
        title: "During Your Trip",
        iconType: "health",
        points: [
          "Avoiding tourist pricing traps.",
          "Choosing reliable and fairly priced local transport.",
          "Eating well without overspending.",
          "Knowing where not to spend.",
        ],
      },
    ],
  },
  reasons: {
    header: "Why Marzi Travel Mitr",
    heading: "Travelling better isn’t about spending more. It’s about choosing smarter.",
    items: [
      {
        title: "Strategic Value",
        quote: "Maximize every rupee without cutting comfort on your trip",
      },
      {
        title: "Practical Advice",
        quote: "Guidance based on real travel experience and insights",
      },
      {
        title: "Expert Clarity",
        quote: "Direct, expert guidance — no more confusing travel options",
      },
      {
        title: "Designed for 50+",
        quote: "Support tailored for the needs of travellers above 50",
      },
    ],
    footer: "You get better value — not just lower prices.",
  },
  how: {
    heading: "How It Works",
    steps: [
      {
        number: "1",
        title: "Share your travel plan",
        description: "Tell us your destination, dates, and budget",
      },
      {
        number: "2",
        title: "Get personalised guidance",
        description: "We help you choose the best options - flights, stays, itinerary",
      },
      {
        number: "3",
        title: "Travel smarter",
        description: "Spend where it matters. Save where it doesn’t.",
      },
    ],
  },
  unsure: {
    heading: "Want to plan a trip without overspending?",
    subtitle: "Talk to a Marzi Travel Advisor and make better travel decisions.",
  }
} as const;

