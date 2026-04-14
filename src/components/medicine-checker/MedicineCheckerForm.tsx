"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Printer, X } from "lucide-react";
import MedicineAIDocument from "./MedicineAIDocument";
import MedicineDocument from "./MedicineDocument";
import {
  Checkbox,
  extractError,
  Field,
  INPUT,
  SelectField,
  TEXTAREA,
  unwrap,
} from "@/components/shared/form-utils";
import {
  CARRY_STATUS_OPTIONS,
  DOCUMENT_CHECKLIST,
  EMPTY_ASSESSMENT,
  EMPTY_MEDICINE_ITEM,
  MEDICINE_ASSESSMENT_ENDPOINT,
  MEDICINE_CHECKER_CONTACT,
  MEDICINE_CHECKER_HERO,
  MEDICINE_FORM_OPTIONS,
  type CarryStatus,
  type DocumentChecklistKey,
  type MedicineAssessmentInput,
  type MedicineAssessmentResponse,
  type MedicineForm,
  type MedicineItemInput,
} from "@/data/medicineChecker";

type Status = "idle" | "submitting" | "success" | "error";

const MAX_ITEMS = 25;

export default function MedicineCheckerForm() {
  const [form, setForm] = useState<MedicineAssessmentInput>(() => ({
    ...EMPTY_ASSESSMENT,
    items: [{ ...EMPTY_MEDICINE_ITEM }],
  }));
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<MedicineAssessmentResponse | null>(null);

  // Any edit after a terminal state should clear the banner so the user
  // isn't looking at a stale error while correcting their input.
  const clearBannerOnEdit = () => {
    setStatus((prev) => (prev === "error" ? "idle" : prev));
    setErrorMsg(null);
  };

  const updateField = <K extends keyof MedicineAssessmentInput>(
    key: K,
    value: MedicineAssessmentInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearBannerOnEdit();
  };

  const updateItem = (index: number, patch: Partial<MedicineItemInput>) => {
    setForm((prev) => {
      const items = prev.items.map((it, i) => (i === index ? { ...it, ...patch } : it));
      return { ...prev, items };
    });
    clearBannerOnEdit();
  };

  const addItem = () => {
    setForm((prev) => {
      if (prev.items.length >= MAX_ITEMS) return prev;
      return { ...prev, items: [...prev.items, { ...EMPTY_MEDICINE_ITEM }] };
    });
  };

  const removeItem = (index: number) => {
    setForm((prev) => {
      if (prev.items.length <= 1) return prev; // always keep at least one row
      return { ...prev, items: prev.items.filter((_, i) => i !== index) };
    });
  };

  const resetAll = () => {
    setForm({ ...EMPTY_ASSESSMENT, items: [{ ...EMPTY_MEDICINE_ITEM }] });
    setStatus("idle");
    setErrorMsg(null);
    setResult(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ─── Client-side validation ────────────────────────────────
    const travelerName = form.traveler_name.trim().replace(/\s+/g, " ");
    if (travelerName.length < 1) {
      setStatus("error");
      setErrorMsg("Please enter the traveller's name.");
      return;
    }

    const country = form.destination_country.trim().replace(/\s+/g, " ");
    if (country.length < 2) {
      setStatus("error");
      setErrorMsg("Please enter a destination country.");
      return;
    }

    const duration = Number(form.trip_duration_days);
    if (!Number.isInteger(duration) || duration < 1 || duration > 365) {
      setStatus("error");
      setErrorMsg("Please enter a valid trip duration (1–365 days).");
      return;
    }

    const ageRaw = form.traveler_age.trim();
    let ageNum: number | null = null;
    if (ageRaw) {
      const parsed = Number(ageRaw);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 120) {
        setStatus("error");
        setErrorMsg("Please enter a valid age (1–120).");
        return;
      }
      ageNum = parsed;
    }

    if (form.items.length === 0) {
      setStatus("error");
      setErrorMsg("Add at least one medicine.");
      return;
    }
    for (const [i, item] of form.items.entries()) {
      if (item.brand_name.trim().length < 2) {
        setStatus("error");
        setErrorMsg(`Medicine ${i + 1}: brand name is required.`);
        return;
      }
    }

    setStatus("submitting");
    setErrorMsg(null);

    const payload = {
      traveler_name: travelerName,
      traveler_phone: form.traveler_phone.trim() || null,
      destination_country: country,
      destination_city: form.destination_city.trim() || null,
      transit_countries: form.transit_countries.trim() || null,
      trip_duration_days: duration,
      traveler_age: ageNum,
      has_valid_prescription: form.has_valid_prescription,
      has_travel_letter: form.has_travel_letter,
      has_original_packaging: form.has_original_packaging,
      has_pharmacy_bill: form.has_pharmacy_bill,
      overall_recommendation: form.overall_recommendation.trim() || null,
      additional_documents_needed: form.additional_documents_needed.trim() || null,
      important_warnings: form.important_warnings.trim() || null,
      items: form.items.map((it) => ({
        brand_name: it.brand_name.trim().replace(/\s+/g, " "),
        generic_name: it.generic_name.trim() || null,
        form: it.form,
        strength: it.strength.trim() || null,
        quantity: it.quantity.trim() || null,
        frequency: it.frequency.trim() || null,
        condition: it.condition.trim() || null,
        has_prescription: it.has_prescription,
        is_otc_in_india: it.is_otc_in_india,
        is_emergency_use: it.is_emergency_use,
        carry_status: it.carry_status,
        prescription_required_for_destination: it.prescription_required_for_destination,
        quantity_limit: it.quantity_limit.trim() || null,
        special_instructions: it.special_instructions.trim() || null,
        customs_declaration_needed: it.customs_declaration_needed,
        team_notes: it.team_notes.trim() || null,
        active_ingredient: it.active_ingredient.trim() || null,
        import_status: it.import_status.trim() || null,
        documents_to_carry: it.documents_to_carry.trim() || null,
        quantity_guidance: it.quantity_guidance.trim() || null,
        if_run_out_at_destination: it.if_run_out_at_destination.trim() || null,
      })),
    };

    try {
      const res = await fetch(MEDICINE_ASSESSMENT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Too many requests. Please try again in a little while.");
        }
        let body: unknown = null;
        try {
          body = await res.json();
        } catch {
          // Non-JSON body (HTML error page, network blip) — fall through.
        }
        throw new Error(
          extractError(unwrap(body), "Something went wrong. Please try again.")
        );
      }

      const body = await res.json();
      setResult(unwrap<MedicineAssessmentResponse>(body));
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  // ─── Success: show AI document if available, else manual document ──
  if (status === "success" && result) {
    const hasAI = result.ai_output && !("error" in result.ai_output) && Object.keys(result.ai_output).length > 0;

    return (
      <div className="pb-16">
        <div className="no-print mx-auto max-w-[820px] px-4 pt-6 pb-2 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            <Printer size={18} /> Download / print document
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            <ArrowLeft size={18} /> Start a new assessment
          </button>
        </div>
        {hasAI ? <MedicineAIDocument data={result} /> : <MedicineDocument data={result} />}
      </div>
    );
  }

  // ─── Form view ──────────────────────────────────────────────────
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-2">
        {MEDICINE_CHECKER_HERO.titleLeft}{" "}
        <span className="text-primary">{MEDICINE_CHECKER_HERO.titleRight}</span>
      </h1>
      <p className="text-gray-600 mb-8">{MEDICINE_CHECKER_HERO.subtitle}</p>

      <form onSubmit={onSubmit} noValidate className="space-y-6">
        {/* ─── 1. Traveller info ─────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Traveller info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Traveller name *">
              <input
                type="text"
                required
                placeholder="Full name"
                value={form.traveler_name}
                onChange={(e) => updateField("traveler_name", e.target.value)}
                className={INPUT}
              />
            </Field>
            <Field label="Phone (optional)">
              <input
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={form.traveler_phone}
                onChange={(e) => updateField("traveler_phone", e.target.value)}
                className={INPUT}
              />
            </Field>
          </div>
        </section>

        {/* ─── 2. Medicine inquiry (user input) ────────────────── */}
        {/* Trip details */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Trip details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Destination country *">
              <input
                type="text"
                required
                placeholder="Country Name"
                value={form.destination_country}
                onChange={(e) => updateField("destination_country", e.target.value)}
                className={INPUT}
              />
            </Field>
            <Field label="Destination city">
              <input
                type="text"
                placeholder="e.g. Tokyo, Dubai"
                value={form.destination_city}
                onChange={(e) => updateField("destination_city", e.target.value)}
                className={INPUT}
              />
            </Field>
            <Field label="Transit countries (if any)" className="sm:col-span-2">
              <input
                type="text"
                placeholder="Leave blank if none"
                value={form.transit_countries}
                onChange={(e) => updateField("transit_countries", e.target.value)}
                className={INPUT}
              />
            </Field>
            <Field label="Trip duration (days) *">
              <input
                type="number"
                required
                min={1}
                max={365}
                inputMode="numeric"
                placeholder="e.g. 10"
                value={form.trip_duration_days}
                onChange={(e) => updateField("trip_duration_days", e.target.value)}
                className={INPUT}
              />
            </Field>
            <Field label="Traveller age">
              <input
                type="number"
                min={1}
                max={120}
                inputMode="numeric"
                placeholder="e.g. 65"
                value={form.traveler_age}
                onChange={(e) => updateField("traveler_age", e.target.value)}
                className={INPUT}
              />
            </Field>
          </div>
        </section>

        {/* Medicines list */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Medicines to check</h2>
          <p className="text-sm text-gray-500 mb-4">
            Indian brand names are fine. Add as many medicines as needed.
          </p>

          <div className="space-y-4">
            {form.items.map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-xl border border-gray-200 bg-gray-50/60 p-4 pt-5"
              >
                {form.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    aria-label={`Remove medicine ${idx + 1}`}
                    className="absolute top-2 right-2 rounded-md p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}

                {/* ── User input fields ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Brand name *">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ecosprin, Metformin"
                      value={item.brand_name}
                      onChange={(e) => updateItem(idx, { brand_name: e.target.value })}
                      className={INPUT}
                    />
                  </Field>
                  <Field label="Generic (if known)">
                    <input
                      type="text"
                      placeholder="e.g. Aspirin, Metformin"
                      value={item.generic_name}
                      onChange={(e) => updateItem(idx, { generic_name: e.target.value })}
                      className={INPUT}
                    />
                  </Field>
                  <SelectField
                    label="Form"
                    value={item.form}
                    options={MEDICINE_FORM_OPTIONS}
                    onChange={(v) => updateItem(idx, { form: v as MedicineForm })}
                  />
                  <Field label="Strength">
                    <input
                      type="text"
                      placeholder="e.g. 50mg"
                      value={item.strength}
                      onChange={(e) => updateItem(idx, { strength: e.target.value })}
                      className={INPUT}
                    />
                  </Field>
                  <Field label="Qty to carry">
                    <input
                      type="text"
                      placeholder="e.g. 30 tablets"
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, { quantity: e.target.value })}
                      className={INPUT}
                    />
                  </Field>
                  <Field label="Frequency">
                    <input
                      type="text"
                      placeholder="e.g. once daily"
                      value={item.frequency}
                      onChange={(e) => updateItem(idx, { frequency: e.target.value })}
                      className={INPUT}
                    />
                  </Field>
                  <Field label="Condition (optional)" className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="e.g. blood pressure"
                      value={item.condition}
                      onChange={(e) => updateItem(idx, { condition: e.target.value })}
                      className={INPUT}
                    />
                  </Field>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <Checkbox
                    label="Have prescription"
                    checked={item.has_prescription}
                    onChange={(v) => updateItem(idx, { has_prescription: v })}
                  />
                  <Checkbox
                    label="OTC in India"
                    checked={item.is_otc_in_india}
                    onChange={(v) => updateItem(idx, { is_otc_in_india: v })}
                  />
                  <Checkbox
                    label="Emergency use"
                    checked={item.is_emergency_use}
                    onChange={(v) => updateItem(idx, { is_emergency_use: v })}
                  />
                </div>

                {/* ── Divider + Team assessment per medicine ── */}
                <div className="mt-5 mb-4 flex items-center gap-3">
                  <div className="flex-1 border-t border-gray-300" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Team assessment
                  </span>
                  <div className="flex-1 border-t border-gray-300" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SelectField
                    label="Carry status"
                    value={item.carry_status}
                    options={CARRY_STATUS_OPTIONS}
                    onChange={(v) =>
                      updateItem(idx, { carry_status: v as CarryStatus })
                    }
                  />
                  <Field label="Active ingredient">
                    <input
                      type="text"
                      placeholder="e.g. Paracetamol (acetaminophen) — non-opioid analgesic"
                      value={item.active_ingredient}
                      onChange={(e) =>
                        updateItem(idx, { active_ingredient: e.target.value })
                      }
                      className={INPUT}
                    />
                  </Field>
                  <Field label="Import status in destination" className="sm:col-span-2">
                    <textarea
                      placeholder="Any note"
                      value={item.import_status}
                      onChange={(e) =>
                        updateItem(idx, { import_status: e.target.value })
                      }
                      className={TEXTAREA}
                    />
                  </Field>
                  <Field label="Documents to carry" className="sm:col-span-2">
                    <textarea
                      placeholder="e.g. Original packaging · "
                      value={item.documents_to_carry}
                      onChange={(e) =>
                        updateItem(idx, { documents_to_carry: e.target.value })
                      }
                      className={TEXTAREA}
                    />
                  </Field>
                  <Field label="Quantity guidance" className="sm:col-span-2">
                    <textarea
                      placeholder="e.g. For 7 days at once daily, 10–14 tablets is appropriate. No stated quantity cap."
                      value={item.quantity_guidance}
                      onChange={(e) =>
                        updateItem(idx, { quantity_guidance: e.target.value })
                      }
                      className={TEXTAREA}
                    />
                  </Field>
                  <Field label="If you run out at destination" className="sm:col-span-2">
                    <textarea
                      placeholder="Place where Medicine can be available"
                      value={item.if_run_out_at_destination}
                      onChange={(e) =>
                        updateItem(idx, { if_run_out_at_destination: e.target.value })
                      }
                      className={TEXTAREA}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:text-primary text-gray-500 py-3 font-medium transition-colors"
          >
            <Plus size={18} /> Add another medicine
          </button>
        </section>

        {/* ─── Documents checklist ─────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Documents you currently have</h2>
          <div className="space-y-2">
            {DOCUMENT_CHECKLIST.map((doc) => (
              <Checkbox
                key={doc.key}
                label={doc.label}
                checked={form[doc.key as DocumentChecklistKey]}
                onChange={(v) => updateField(doc.key as DocumentChecklistKey, v)}
              />
            ))}
          </div>
        </section>

        {/* ─── 3. Team assessment (overall) ────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Overall team assessment</h2>
          <div className="space-y-4">
            <Field label="Overall recommendation">
              <textarea
                placeholder="Summary recommendation for the traveller"
                value={form.overall_recommendation}
                onChange={(e) =>
                  updateField("overall_recommendation", e.target.value)
                }
                className={TEXTAREA}
              />
            </Field>
            <Field label="Important warnings">
              <textarea
                placeholder="Critical warnings or alerts for the traveller"
                value={form.important_warnings}
                onChange={(e) =>
                  updateField("important_warnings", e.target.value)
                }
                className={TEXTAREA}
              />
            </Field>
          </div>
        </section>

        {/* ─── Submit + info ───────────────────────────────────── */}
        <div className="space-y-4">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
          >
            {status === "submitting" ? "Generating\u2026" : "Check my medicines \u2197"}
          </button>

          {status === "error" && errorMsg && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-gray-700 leading-relaxed">
            Results delivered as a <strong>branded document</strong> — Marzi logo header ·
            Travel Mitr footer · {MEDICINE_CHECKER_CONTACT.name}:{" "}
            {MEDICINE_CHECKER_CONTACT.phone} · {MEDICINE_CHECKER_CONTACT.website}.
          </div>
        </div>
      </form>
    </section>
  );
}
