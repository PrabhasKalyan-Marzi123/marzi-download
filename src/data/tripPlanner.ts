// ─── Marzi Trip Planner — questionnaire-style intake form ───────────────────

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
export const TRIP_ITINERARY_ENDPOINT = `${API_BASE_URL}/api/home/trip-itinerary/create/`;

export const TRIP_PLANNER_HERO = {
  title: "Plan Your Perfect Senior Journey",
  subtitle:
    "Fill in all 9 sections below. Every answer shapes your itinerary — the system designs around your pace, comfort and preferences. No detail is too small.",
} as const;

// ─── Section 2: Trip Purpose (multi-select chips) ────────────────

export const TRIP_PURPOSE_OPTIONS = [
  { value: "religious", label: "Religious / Darshan" },
  { value: "leisure", label: "Leisure / Relaxation" },
  { value: "exploration", label: "Exploration / Sightseeing"},
  { value: "family", label: "Family Time"},
  { value: "nature", label: "Nature & Wellness"},
  { value: "spiritual", label: "Spiritual"},
] as const;

// ─── Section 3: Walking Capacity (single-select pills) ──────────

export const WALKING_CAPACITY_OPTIONS = [
  { value: "under_15", label: "Under 15 mins" },
  { value: "15_30", label: "15 – 30 mins" },
  { value: "over_30", label: "Over 30 mins" },
] as const;

// ─── Section 4: Daily Energy (single-select pills) ──────────────

export const DAILY_ENERGY_OPTIONS = [
  { value: "2_4", label: "2 – 4 hrs" },
  { value: "4_6", label: "4 – 6 hrs" },
  { value: "6_8", label: "6 – 8 hrs" },
  { value: "over_8", label: "Over 8 hrs" },
] as const;

// ─── Section 5: Preferred Start Time (single-select pills) ──────

export const START_TIME_OPTIONS = [
  { value: "early", label: "Early  5 – 7 AM" },
  { value: "normal", label: "Normal  7 – 9 AM" },
  { value: "late", label: "Late  After 9 AM" },
] as const;

// ─── Section 6: Travel Time Tolerance (single-select pills) ─────

export const TRAVEL_TOLERANCE_OPTIONS = [
  { value: "max_2", label: "Max 2 hrs / day" },
  { value: "2_4", label: "2 – 4 hrs / day" },
  { value: "4_6", label: "4 – 6 hrs / day" },
  { value: "no_limit", label: "No limit" },
] as const;

// ─── Section 7: Stay Preference (multi-select pills) ────────────

export const STAY_PREFERENCE_OPTIONS = [
  { value: "premium", label: "Premium  4 – 5 Star" },
  { value: "clean", label: "Clean & Convenient" },
  { value: "3_star", label: "3 Star" },
  { value: "close_key", label: "Close to Key Location" },
] as const;

// ─── Section 8: Non-Negotiables (multi-select chips) ────────────

export const NON_NEGOTIABLE_OPTIONS = [
  { value: "no_crowds", label: "No crowds" },
  { value: "no_long_queues", label: "No long queues" },
  { value: "no_early_mornings", label: "No early mornings" },
  { value: "vegetarian_only", label: "Vegetarian food only" },
  { value: "no_touts", label: "No touts / hawkers" },
  { value: "no_long_drives", label: "Avoid long drives" },
  { value: "need_lift", label: "Need lift access" },
  { value: "wheelchair", label: "Wheelchair access" },
  { value: "no_spicy", label: "No spicy food" },
  { value: "no_isolated", label: "No isolated locations" },
  { value: "no_stairs", label: "No stairs" },
] as const;

// ─── Types ──────────────────────────────────────────────────────

export type TripIntakeInput = {
  ages_of_travellers: string;
  number_of_travelers: string;
  gender_mix: string;
  health_limitations: string;
  start_date: string;
  end_date: string;
  starting_city: string;
  return_city: string;
  transit_mode_text: string;
  trip_purpose: string[];
  walking_capacity: string;
  daily_energy_hours: string;
  preferred_start_time: string;
  travel_time_tolerance: string;
  stay_preference: string[];
  non_negotiables: string[];
  other_avoidances: string;
  destination_route: string;
  trip_duration_nights: string;
};

export type TripIntakeResponse = {
  id: number;
  uuid: string;
  ages_of_travellers: string | null;
  number_of_travelers: number;
  gender_mix: string | null;
  health_limitations: string | null;
  start_date: string | null;
  end_date: string | null;
  departure_city: string | null;
  return_city: string | null;
  transit_mode_text: string | null;
  trip_purpose: string[];
  walking_capacity: string | null;
  daily_energy_hours: string | null;
  preferred_start_time: string | null;
  travel_time_tolerance: string | null;
  stay_preference: string[];
  non_negotiables: string[];
  other_avoidances: string | null;
  destination_route: string | null;
  trip_duration_nights: number | null;
  ai_output: Record<string, unknown> | null;
  created: string;
};

export const EMPTY_INTAKE: TripIntakeInput = {
  ages_of_travellers: "",
  number_of_travelers: "",
  gender_mix: "",
  health_limitations: "",
  start_date: "",
  end_date: "",
  starting_city: "",
  return_city: "",
  transit_mode_text: "",
  trip_purpose: [],
  walking_capacity: "",
  daily_energy_hours: "",
  preferred_start_time: "",
  travel_time_tolerance: "",
  stay_preference: [],
  non_negotiables: [],
  other_avoidances: "",
  destination_route: "",
  trip_duration_nights: "",
};
