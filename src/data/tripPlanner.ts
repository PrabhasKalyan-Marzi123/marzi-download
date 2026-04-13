// ─── Marzi Trip Planner — content + config for /marzi-trip-planner ──────────
//
// Copy, form options, types, and endpoint for the internal trip planner tool.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
export const TRIP_ITINERARY_ENDPOINT = `${API_BASE_URL}/api/home/trip-itinerary/create/`;

export const TRIP_PLANNER_CONTACT = {
  name: "Darshan",
  phone: "8792237778",
  website: "www.marzi.life",
} as const;

export const TRIP_PLANNER_HERO = {
  titleLeft: "marzi",
  titleRight: "trip planner",
  subtitle:
    "Fill in traveller details, preferences, and the day-wise plan — generate a branded itinerary document.",
} as const;

// ─── Activity travel mode options ────────────────────────────────────

export const TRAVEL_MODE_ACTIVITY_OPTIONS = [
  { value: "", label: "— None —" },
  { value: "walking", label: "Walking" },
  { value: "metro", label: "Metro / Subway" },
  { value: "taxi", label: "Taxi / Cab" },
  { value: "bus", label: "Bus" },
  { value: "train", label: "Train" },
  { value: "flight", label: "Flight" },
  { value: "ferry", label: "Ferry" },
  { value: "car", label: "Car / Self-drive" },
  { value: "auto", label: "Auto-rickshaw" },
  { value: "other", label: "Other" },
] as const;

export const TRAVEL_MODE_ACTIVITY_LABEL: Record<string, string> = Object.fromEntries(
  TRAVEL_MODE_ACTIVITY_OPTIONS.filter((o) => o.value).map((o) => [o.value, o.label])
);

// ─── Choice options (must match Django model TextChoices) ────────────

export const TRIP_TYPE_OPTIONS = [
  { value: "leisure", label: "Leisure" },
  { value: "pilgrimage", label: "Pilgrimage" },
  { value: "adventure", label: "Adventure" },
  { value: "family", label: "Family" },
  { value: "honeymoon", label: "Honeymoon" },
  { value: "solo", label: "Solo" },
  { value: "group", label: "Group Tour" },
  { value: "business", label: "Business" },
] as const;

export const BUDGET_LEVEL_OPTIONS = [
  { value: "budget", label: "Budget" },
  { value: "moderate", label: "Moderate" },
  { value: "premium", label: "Premium" },
  { value: "luxury", label: "Luxury" },
] as const;

export const FOOD_PREFERENCE_OPTIONS = [
  { value: "no_preference", label: "No Preference" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "non_vegetarian", label: "Non-Vegetarian" },
  { value: "jain", label: "Jain" },
  { value: "vegan", label: "Vegan" },
  { value: "eggetarian", label: "Eggetarian" },
] as const;

export const PACE_OPTIONS = [
  { value: "relaxed", label: "Relaxed" },
  { value: "moderate", label: "Moderate" },
  { value: "packed", label: "Packed" },
] as const;

export const ACCOMMODATION_OPTIONS = [
  { value: "hotel", label: "Hotel" },
  { value: "resort", label: "Resort" },
  { value: "homestay", label: "Homestay" },
  { value: "hostel", label: "Hostel" },
  { value: "apartment", label: "Apartment" },
  { value: "no_preference", label: "No Preference" },
] as const;

export const TRAVEL_MODE_OPTIONS = [
  { value: "flight", label: "Flight" },
  { value: "train", label: "Train" },
  { value: "bus", label: "Bus" },
  { value: "self_drive", label: "Self Drive" },
  { value: "mixed", label: "Mixed" },
] as const;

// Lookup maps for the document renderer
export const LABEL_MAP = {
  ...Object.fromEntries(TRIP_TYPE_OPTIONS.map((o) => [o.value, o.label])),
  ...Object.fromEntries(BUDGET_LEVEL_OPTIONS.map((o) => [o.value, o.label])),
  ...Object.fromEntries(FOOD_PREFERENCE_OPTIONS.map((o) => [o.value, o.label])),
  ...Object.fromEntries(PACE_OPTIONS.map((o) => [o.value, o.label])),
  ...Object.fromEntries(ACCOMMODATION_OPTIONS.map((o) => [o.value, o.label])),
  ...Object.fromEntries(TRAVEL_MODE_OPTIONS.map((o) => [o.value, o.label])),
} as Record<string, string>;

// ─── Types ──────────────────────────────────────────────────────────

export type ActivityInput = {
  order: number;
  time: string;
  place_name: string;
  activity: string;
  duration: string;
  notes: string;
  location_url: string;
  travel_mode: string;
  travel_duration: string;
};

export type DayInput = {
  day_number: number;
  title: string;
  location: string;
  start_point: string;
  end_point: string;
  description: string;
  accommodation: string;
  accommodation_url: string;
  breakfast_included: boolean;
  lunch_included: boolean;
  dinner_included: boolean;
  transport: string;
  activities: ActivityInput[];
};

export type TripItineraryInput = {
  traveler_name: string;
  traveler_phone: string;
  traveler_age: string;
  number_of_travelers: string;
  departure_city: string;
  destination_country: string;
  destination_cities: string;
  start_date: string;
  end_date: string;
  trip_type: string;
  budget_level: string;
  accommodation_preference: string;
  food_preference: string;
  pace: string;
  interests: string;
  travel_mode: string;
  needs_visa_assistance: boolean;
  needs_travel_insurance: boolean;
  needs_airport_transfers: boolean;
  medical_conditions: string;
  special_requests: string;
  internal_notes: string;
  days: DayInput[];
};

export type TripItineraryResponse = {
  id: number;
  uuid: string;
  traveler_name: string;
  traveler_phone: string | null;
  traveler_age: number | null;
  number_of_travelers: number;
  departure_city: string;
  destination_country: string;
  destination_cities: string | null;
  start_date: string;
  end_date: string;
  trip_type: string;
  budget_level: string;
  accommodation_preference: string;
  food_preference: string;
  pace: string;
  interests: string | null;
  travel_mode: string;
  needs_visa_assistance: boolean;
  needs_travel_insurance: boolean;
  needs_airport_transfers: boolean;
  medical_conditions: string | null;
  special_requests: string | null;
  internal_notes: string | null;
  days: Array<{
    id: number;
    day_number: number;
    title: string;
    location: string | null;
    start_point: string | null;
    end_point: string | null;
    description: string | null;
    accommodation: string | null;
    accommodation_url: string | null;
    breakfast_included: boolean;
    lunch_included: boolean;
    dinner_included: boolean;
    transport: string | null;
    activities: Array<{
      id: number;
      order: number;
      time: string | null;
      place_name: string;
      activity: string | null;
      duration: string | null;
      notes: string | null;
      location_url: string | null;
      travel_mode: string | null;
      travel_duration: string | null;
    }>;
  }>;
  created: string;
};

export const EMPTY_ACTIVITY: ActivityInput = {
  order: 1,
  time: "",
  place_name: "",
  activity: "",
  duration: "",
  notes: "",
  location_url: "",
  travel_mode: "",
  travel_duration: "",
};

export const EMPTY_DAY: DayInput = {
  day_number: 1,
  title: "",
  location: "",
  start_point: "",
  end_point: "",
  description: "",
  accommodation: "",
  accommodation_url: "",
  breakfast_included: false,
  lunch_included: false,
  dinner_included: false,
  transport: "",
  activities: [{ ...EMPTY_ACTIVITY }],
};

export const EMPTY_ITINERARY: TripItineraryInput = {
  traveler_name: "",
  traveler_phone: "",
  traveler_age: "",
  number_of_travelers: "1",
  departure_city: "",
  destination_country: "",
  destination_cities: "",
  start_date: "",
  end_date: "",
  trip_type: "leisure",
  budget_level: "moderate",
  accommodation_preference: "hotel",
  food_preference: "no_preference",
  pace: "moderate",
  interests: "",
  travel_mode: "flight",
  needs_visa_assistance: false,
  needs_travel_insurance: false,
  needs_airport_transfers: false,
  medical_conditions: "",
  special_requests: "",
  internal_notes: "",
  days: [{ ...EMPTY_DAY }],
};
