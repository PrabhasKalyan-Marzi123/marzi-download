// ─── Marzi Medicine Checker — content + config for /marzi-medicine-checker ──

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
export const MEDICINE_ASSESSMENT_ENDPOINT = `${API_BASE_URL}/api/home/medicine-assessment/create/`;

export const MEDICINE_CHECKER_CONTACT = {
  name: "Darshan",
  phone: "8792237778",
  website: "www.marzi.life",
} as const;

export const MEDICINE_CHECKER_HERO = {
  titleLeft: "marzi",
  titleRight: "medicine checker",
  subtitle:
    "Capture traveller details and medicines, add team assessment — generate a branded guidance document.",
} as const;

// ─── Dropdowns (sync with Django model TextChoices) ─────────────

export const MEDICINE_FORM_OPTIONS = [
  { value: "tablet", label: "Tablet" },
  { value: "capsule", label: "Capsule" },
  { value: "liquid", label: "Liquid / Syrup" },
  { value: "injection", label: "Injection" },
  { value: "inhaler", label: "Inhaler" },
  { value: "cream", label: "Cream / Ointment" },
  { value: "drops", label: "Drops" },
  { value: "patch", label: "Patch" },
  { value: "other", label: "Other" },
] as const;

export type MedicineForm = (typeof MEDICINE_FORM_OPTIONS)[number]["value"];

export const MEDICINE_FORM_LABEL: Record<MedicineForm, string> = Object.fromEntries(
  MEDICINE_FORM_OPTIONS.map((opt) => [opt.value, opt.label])
) as Record<MedicineForm, string>;

export const CARRY_STATUS_OPTIONS = [
  { value: "allowed", label: "Allowed", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { value: "allowed_with_conditions", label: "Allowed with conditions", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { value: "restricted", label: "Restricted", color: "text-orange-700 bg-orange-50 border-orange-200" },
  { value: "not_allowed", label: "Not allowed", color: "text-red-700 bg-red-50 border-red-200" },
  { value: "check_required", label: "Check required", color: "text-gray-600 bg-gray-50 border-gray-200" },
] as const;

export type CarryStatus = (typeof CARRY_STATUS_OPTIONS)[number]["value"];

export const CARRY_STATUS_LABEL: Record<string, string> = Object.fromEntries(
  CARRY_STATUS_OPTIONS.map((o) => [o.value, o.label])
);

export const CARRY_STATUS_COLOR: Record<string, string> = Object.fromEntries(
  CARRY_STATUS_OPTIONS.map((o) => [o.value, o.color])
);

export const DOCUMENT_CHECKLIST = [
  { key: "has_valid_prescription", label: "Valid doctor prescription(s)" },
  { key: "has_travel_letter", label: "Doctor's travel letter" },
  { key: "has_original_packaging", label: "Original medicine packaging" },
  { key: "has_pharmacy_bill", label: "Pharmacy bill / invoice" },
] as const;

export type DocumentChecklistKey = (typeof DOCUMENT_CHECKLIST)[number]["key"];

// ─── Types ──────────────────────────────────────────────────────

export type MedicineItemInput = {
  // User input
  brand_name: string;
  generic_name: string;
  form: MedicineForm;
  strength: string;
  quantity: string;
  frequency: string;
  condition: string;
  has_prescription: boolean;
  is_otc_in_india: boolean;
  is_emergency_use: boolean;
  // Team response
  carry_status: CarryStatus;
  prescription_required_for_destination: boolean;
  quantity_limit: string;
  special_instructions: string;
  customs_declaration_needed: boolean;
  team_notes: string;
  active_ingredient: string;
  import_status: string;
  documents_to_carry: string;
  quantity_guidance: string;
  if_run_out_at_destination: string;
};

export type MedicineAssessmentInput = {
  // Traveller info
  traveler_name: string;
  traveler_phone: string;
  // Trip details
  destination_country: string;
  destination_city: string;
  transit_countries: string;
  trip_duration_days: string;
  traveler_age: string;
  // Documents
  has_valid_prescription: boolean;
  has_travel_letter: boolean;
  has_original_packaging: boolean;
  has_pharmacy_bill: boolean;
  // Team assessment
  overall_recommendation: string;
  additional_documents_needed: string;
  important_warnings: string;
  // Items
  items: MedicineItemInput[];
};

export type MedicineAssessmentResponse = {
  id: number;
  uuid: string;
  traveler_name: string | null;
  traveler_phone: string | null;
  destination_country: string;
  destination_city: string | null;
  transit_countries: string | null;
  trip_duration_days: number;
  traveler_age: number | null;
  has_valid_prescription: boolean;
  has_travel_letter: boolean;
  has_original_packaging: boolean;
  has_pharmacy_bill: boolean;
  overall_recommendation: string | null;
  additional_documents_needed: string | null;
  important_warnings: string | null;
  items: Array<{
    id: number;
    brand_name: string;
    generic_name: string | null;
    form: MedicineForm;
    strength: string | null;
    quantity: string | null;
    frequency: string | null;
    condition: string | null;
    has_prescription: boolean;
    is_otc_in_india: boolean;
    is_emergency_use: boolean;
    carry_status: CarryStatus;
    prescription_required_for_destination: boolean;
    quantity_limit: string | null;
    special_instructions: string | null;
    customs_declaration_needed: boolean;
    team_notes: string | null;
    active_ingredient: string | null;
    import_status: string | null;
    documents_to_carry: string | null;
    quantity_guidance: string | null;
    if_run_out_at_destination: string | null;
  }>;
  created: string;
};

export const EMPTY_MEDICINE_ITEM: MedicineItemInput = {
  brand_name: "",
  generic_name: "",
  form: "tablet",
  strength: "",
  quantity: "",
  frequency: "",
  condition: "",
  has_prescription: false,
  is_otc_in_india: false,
  is_emergency_use: false,
  carry_status: "check_required",
  prescription_required_for_destination: false,
  quantity_limit: "",
  special_instructions: "",
  customs_declaration_needed: false,
  team_notes: "",
  active_ingredient: "",
  import_status: "",
  documents_to_carry: "",
  quantity_guidance: "",
  if_run_out_at_destination: "",
};

export const EMPTY_ASSESSMENT: MedicineAssessmentInput = {
  traveler_name: "",
  traveler_phone: "",
  destination_country: "",
  destination_city: "",
  transit_countries: "",
  trip_duration_days: "",
  traveler_age: "",
  has_valid_prescription: false,
  has_travel_letter: false,
  has_original_packaging: false,
  has_pharmacy_bill: false,
  overall_recommendation: "",
  additional_documents_needed: "",
  important_warnings: "",
  items: [{ ...EMPTY_MEDICINE_ITEM }],
};
