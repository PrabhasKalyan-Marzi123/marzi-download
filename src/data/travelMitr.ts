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
} as const;

export type InquirySource = (typeof INQUIRY_SOURCE)[keyof typeof INQUIRY_SOURCE];

// Variant copy for the /travel-assistance-savings route. Same form, same sections —
// only the hero headline + sub-copy differ. Pass these as props to <TravelHero />.
export const TRAVEL_SAVINGS_HERO = {
  headline: "Travelling?",
  headlineAccent: "Save more money.",
  description:
    "Introducing Marzi Mitr — a real person who helps you find the best deals on flights, hotels and transport, so you travel well and spend less.",
};

// Eyebrow badge shown below the hero description on every Travel Mitr variant.
export const TRAVEL_HERO_BADGE = "Exclusive service for people above 50 years.";

export const TRAVEL_HERO = {
  headline: "Planning a trip?",
  headlineAccent: "Have doubts?",
  description:
    "Talk to Marzi Travel Mitr — friendly travel guidance for travellers 50+. Get clear answers on bookings, health, safety, and what to expect on the way.",
  whatsappLabel: "Chat on WhatsApp",
  callLabel: "Call Travel Mitr",
  formTitle: "Get Started",
  formSubtitle: "Share a few details and we'll reach out.",
  formCtaLabel: "Get Free Guidance Now",
  fields: {
    name: { label: "Full Name", placeholder: "Your name" },
    phone: { label: "Mobile Number", placeholder: "10-digit mobile number" },
    age: { label: "Age", placeholder: "e.g. 58" },
  },
};

export const HELP_CARDS = {
  heading: "What We Help You With",
  subtitle: "Whatever you're unsure about — we'll guide you.",
  cards: [
    {
      title: "Before you travel",
      points: [
        "What documents you need to carry",
        "How to plan a route that suits your pace",
        "Packing tips for older travellers",
        "What to do if you've never travelled solo before",
      ],
    },
    {
      title: "Booking guidance",
      points: [
        "Which trains, flights or buses are best for you",
        "How to book without getting confused by apps",
        "Senior citizen discounts you may be missing",
        "Where to look for safe, comfortable stays",
      ],
    },
    {
      title: "Health & safety",
      points: [
        "Which medicines to keep handy on the trip",
        "How to stay safe in unfamiliar places",
        "What to do if you feel unwell on the way",
        "Emergency contacts to keep within reach",
      ],
    },
    {
      title: "During your trip",
      points: [
        "Help with local transport once you arrive",
        "What food is safe and easy on the stomach",
        "Easy ways to stay in touch with family",
        "Someone to call if anything feels off",
      ],
    },
  ],
};

export const HELP_SAVINGS_CARDS = {
  heading: "Where We Save You Money",
  subtitle: "Real advice that keeps more money in your pocket.",
  bulletMarker: "✦",
  cards: [
    {
      title: "Save on flights",
      iconType: "flights",
      points: [
        "Find the cheapest comfortable flights for your dates",
        "Avoid overpriced last-minute bookings",
        "Know the best time to book for lowest fares",
        "Compare airlines without spending hours online",
      ],
    },
    {
      title: "Save on hotels",
      subtitle: "No commissions, only advice",
      iconType: "hotels",
      points: [
        "Get honest recommendations for affordable, safe stays",
        "Avoid tourist-trap pricing near popular spots",
        "Find deals on senior-friendly hotels",
        "Know when to book for the best rates",
      ],
    },
    {
      title: "Save on insurance & health",
      iconType: "health",
      points: [
        "Don't overpay for travel insurance you don't need",
        "Find the right coverage at the right price",
        "Avoid unnecessary medical costs abroad",
        "Know which vaccinations are free vs. paid",
      ],
    },
    {
      title: "Save on local transport",
      iconType: "transport",
      points: [
        "Avoid overpriced taxis and tourist traps",
        "Know the cheapest way to get around locally",
        "Find affordable day-trip options",
      ],
    },
  ],
};

export const HOW_IT_WORKS = {
  heading: "How It Works",
  steps: [
    {
      number: "1",
      title: "Reach out to Marzi Travel Mitr",
      description:
        "Send us a WhatsApp message or fill the form — whichever feels easier.",
    },
    {
      number: "2",
      title: "Share your plan with us",
      description:
        "Tell us where you're going, when, and what you're worried about.",
    },
    {
      number: "3",
      title: "Get clear, simple guidance",
      description:
        "We'll walk you through what to do — step by step, in plain language.",
    },
  ],
};

export const REASONS = {
  heading: "Why People Use Marzi Travel Mitr",
  items: [
    {
      quote:
        "Speak to a real person, not a chatbot.",
      author: "What our travellers tell us",
    },
    {
      quote:
        "Advice tailored to your pace and your comfort.",
      author: "What our travellers tell us",
    },
    {
      quote:
        "No selling, no commissions — just honest help.",
      author: "What our travellers tell us",
    },
    {
      quote:
        "Designed specifically for the 50+ traveller.",
      author: "What our travellers tell us",
    },
  ],
};

export const STILL_UNSURE = {
  heading: "Still unsure?",
  subtitle: "That's exactly why we're here. Reach out — it's free.",
};
