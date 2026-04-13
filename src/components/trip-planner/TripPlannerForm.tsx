"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, MapPin, Plus, Printer, X } from "lucide-react";
import ItineraryDocument from "./ItineraryDocument";
import {
  Card,
  Checkbox,
  extractError,
  Field,
  FieldSm,
  INPUT,
  INPUT_SM,
  SelectField,
  TEXTAREA,
  unwrap,
} from "@/components/shared/form-utils";
import {
  ACCOMMODATION_OPTIONS,
  BUDGET_LEVEL_OPTIONS,
  EMPTY_ACTIVITY,
  EMPTY_DAY,
  EMPTY_ITINERARY,
  FOOD_PREFERENCE_OPTIONS,
  PACE_OPTIONS,
  TRAVEL_MODE_ACTIVITY_OPTIONS,
  TRAVEL_MODE_OPTIONS,
  TRIP_ITINERARY_ENDPOINT,
  TRIP_PLANNER_HERO,
  TRIP_TYPE_OPTIONS,
  type ActivityInput,
  type DayInput,
  type TripItineraryInput,
  type TripItineraryResponse,
} from "@/data/tripPlanner";

type Status = "idle" | "submitting" | "success" | "error";

const MAX_DAYS = 60;
const MAX_ACTIVITIES_PER_DAY = 20;

export default function TripPlannerForm() {
  const [form, setForm] = useState<TripItineraryInput>(() => ({
    ...EMPTY_ITINERARY,
    days: [{ ...EMPTY_DAY, activities: [{ ...EMPTY_ACTIVITY }] }],
  }));
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<TripItineraryResponse | null>(null);

  const clearErr = () => {
    setStatus((p) => (p === "error" ? "idle" : p));
    setErrorMsg(null);
  };

  const set = <K extends keyof TripItineraryInput>(k: K, v: TripItineraryInput[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
    clearErr();
  };

  const setDay = (idx: number, patch: Partial<DayInput>) => {
    setForm((p) => ({
      ...p,
      days: p.days.map((d, i) => (i === idx ? { ...d, ...patch } : d)),
    }));
    clearErr();
  };

  const setActivity = (dayIdx: number, actIdx: number, patch: Partial<ActivityInput>) => {
    setForm((p) => ({
      ...p,
      days: p.days.map((d, di) =>
        di === dayIdx
          ? {
              ...d,
              activities: d.activities.map((a, ai) =>
                ai === actIdx ? { ...a, ...patch } : a
              ),
            }
          : d
      ),
    }));
    clearErr();
  };

  const addDay = () => {
    setForm((p) => {
      if (p.days.length >= MAX_DAYS) return p;
      return {
        ...p,
        days: [
          ...p.days,
          { ...EMPTY_DAY, day_number: p.days.length + 1, activities: [{ ...EMPTY_ACTIVITY }] },
        ],
      };
    });
  };

  const removeDay = (idx: number) => {
    setForm((p) => {
      if (p.days.length <= 1) return p;
      const days = p.days
        .filter((_, i) => i !== idx)
        .map((d, i) => ({ ...d, day_number: i + 1 }));
      return { ...p, days };
    });
  };

  const addActivity = (dayIdx: number) => {
    setForm((p) => ({
      ...p,
      days: p.days.map((d, i) =>
        i === dayIdx && d.activities.length < MAX_ACTIVITIES_PER_DAY
          ? {
              ...d,
              activities: [
                ...d.activities,
                { ...EMPTY_ACTIVITY, order: d.activities.length + 1 },
              ],
            }
          : d
      ),
    }));
  };

  const removeActivity = (dayIdx: number, actIdx: number) => {
    setForm((p) => ({
      ...p,
      days: p.days.map((d, di) =>
        di === dayIdx && d.activities.length > 1
          ? {
              ...d,
              activities: d.activities
                .filter((_, ai) => ai !== actIdx)
                .map((a, i) => ({ ...a, order: i + 1 })),
            }
          : d
      ),
    }));
  };

  const resetAll = () => {
    setForm({
      ...EMPTY_ITINERARY,
      days: [{ ...EMPTY_DAY, activities: [{ ...EMPTY_ACTIVITY }] }],
    });
    setStatus("idle");
    setErrorMsg(null);
    setResult(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = form.traveler_name.trim().replace(/\s+/g, " ");
    if (name.length < 2) {
      setStatus("error");
      setErrorMsg("Please enter the traveller's name.");
      return;
    }
    if (form.departure_city.trim().length < 2) {
      setStatus("error");
      setErrorMsg("Please enter a departure city.");
      return;
    }
    if (form.destination_country.trim().length < 2) {
      setStatus("error");
      setErrorMsg("Please enter a destination country.");
      return;
    }
    if (!form.start_date || !form.end_date) {
      setStatus("error");
      setErrorMsg("Please enter both start and end dates.");
      return;
    }
    if (form.end_date < form.start_date) {
      setStatus("error");
      setErrorMsg("End date must be on or after the start date.");
      return;
    }

    const numTravelers = Number(form.number_of_travelers);
    if (!Number.isInteger(numTravelers) || numTravelers < 1) {
      setStatus("error");
      setErrorMsg("Number of travellers must be at least 1.");
      return;
    }

    if (form.days.length === 0) {
      setStatus("error");
      setErrorMsg("Add at least one day to the itinerary.");
      return;
    }
    for (const [i, d] of form.days.entries()) {
      if (d.title.trim().length < 2) {
        setStatus("error");
        setErrorMsg(`Day ${i + 1}: please enter a title.`);
        return;
      }
      for (const [j, act] of d.activities.entries()) {
        if (act.place_name.trim().length < 2) {
          setStatus("error");
          setErrorMsg(`Day ${i + 1}, place ${j + 1}: please enter a place name.`);
          return;
        }
      }
    }

    setStatus("submitting");
    setErrorMsg(null);

    const ageRaw = form.traveler_age.trim();
    const payload = {
      traveler_name: name,
      traveler_phone: form.traveler_phone.trim() || null,
      traveler_age: ageRaw ? Number(ageRaw) : null,
      number_of_travelers: numTravelers,
      departure_city: form.departure_city.trim(),
      destination_country: form.destination_country.trim(),
      destination_cities: form.destination_cities.trim() || null,
      start_date: form.start_date,
      end_date: form.end_date,
      trip_type: form.trip_type,
      budget_level: form.budget_level,
      accommodation_preference: form.accommodation_preference,
      food_preference: form.food_preference,
      pace: form.pace,
      interests: form.interests.trim() || null,
      travel_mode: form.travel_mode,
      needs_visa_assistance: form.needs_visa_assistance,
      needs_travel_insurance: form.needs_travel_insurance,
      needs_airport_transfers: form.needs_airport_transfers,
      medical_conditions: form.medical_conditions.trim() || null,
      special_requests: form.special_requests.trim() || null,
      internal_notes: form.internal_notes.trim() || null,
      days: form.days.map((d, i) => ({
        day_number: i + 1,
        title: d.title.trim(),
        location: d.location.trim() || null,
        start_point: d.start_point.trim() || null,
        end_point: d.end_point.trim() || null,
        description: d.description.trim() || null,
        accommodation: d.accommodation.trim() || null,
        accommodation_url: d.accommodation_url.trim() || null,
        breakfast_included: d.breakfast_included,
        lunch_included: d.lunch_included,
        dinner_included: d.dinner_included,
        transport: d.transport.trim() || null,
        activities: d.activities.map((a, j) => ({
          order: j + 1,
          time: a.time.trim() || null,
          place_name: a.place_name.trim(),
          activity: a.activity.trim() || null,
          duration: a.duration.trim() || null,
          notes: a.notes.trim() || null,
          location_url: a.location_url.trim() || null,
          travel_mode: a.travel_mode || null,
          travel_duration: a.travel_duration.trim() || null,
        })),
      })),
    };

    try {
      const res = await fetch(TRIP_ITINERARY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        if (res.status === 429)
          throw new Error("Too many requests. Please try again shortly.");
        let body: unknown = null;
        try { body = await res.json(); } catch { /* non-JSON */ }
        throw new Error(
          extractError(unwrap(body), "Something went wrong. Please try again.")
        );
      }
      const body = await res.json();
      setResult(unwrap<TripItineraryResponse>(body));
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  // ─── Success view ─────────────────────────────────────────────
  if (status === "success" && result) {
    return (
      <div className="pb-16">
        <div className="no-print mx-auto max-w-[820px] px-4 pt-6 pb-2 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            <Printer size={18} /> Download / print itinerary
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            <ArrowLeft size={18} /> Create a new itinerary
          </button>
        </div>
        <ItineraryDocument data={result} />
      </div>
    );
  }

  // ─── Form view ────────────────────────────────────────────────
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-2">
        {TRIP_PLANNER_HERO.titleLeft}{" "}
        <span className="text-primary">{TRIP_PLANNER_HERO.titleRight}</span>
      </h1>
      <p className="text-gray-600 mb-8">{TRIP_PLANNER_HERO.subtitle}</p>

      <form onSubmit={onSubmit} noValidate className="space-y-6">
        {/* ─── Traveller info ─────────────────────────────────── */}
        <Card title="Traveller info">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name *">
              <input type="text" required placeholder="e.g. Rajesh Kumar" value={form.traveler_name} onChange={(e) => set("traveler_name", e.target.value)} className={INPUT} />
            </Field>
            <Field label="Phone">
              <input type="tel" placeholder="e.g. 9876543210" value={form.traveler_phone} onChange={(e) => set("traveler_phone", e.target.value)} className={INPUT} />
            </Field>
            <Field label="Age">
              <input type="number" min={1} max={120} inputMode="numeric" placeholder="e.g. 65" value={form.traveler_age} onChange={(e) => set("traveler_age", e.target.value)} className={INPUT} />
            </Field>
            <Field label="No. of travellers *">
              <input type="number" required min={1} max={50} inputMode="numeric" value={form.number_of_travelers} onChange={(e) => set("number_of_travelers", e.target.value)} className={INPUT} />
            </Field>
          </div>
        </Card>

        {/* ─── Trip details ───────────────────────────────────── */}
        <Card title="Trip details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Departure city *">
              <input type="text" required placeholder="e.g. Bangalore" value={form.departure_city} onChange={(e) => set("departure_city", e.target.value)} className={INPUT} />
            </Field>
            <Field label="Destination country *">
              <input type="text" required placeholder="e.g. Japan" value={form.destination_country} onChange={(e) => set("destination_country", e.target.value)} className={INPUT} />
            </Field>
            <Field label="Destination cities" className="sm:col-span-2">
              <input type="text" placeholder="e.g. Tokyo, Kyoto, Osaka" value={form.destination_cities} onChange={(e) => set("destination_cities", e.target.value)} className={INPUT} />
            </Field>
            <Field label="Start date *">
              <input type="date" required value={form.start_date} onChange={(e) => set("start_date", e.target.value)} className={INPUT} />
            </Field>
            <Field label="End date *">
              <input type="date" required value={form.end_date} onChange={(e) => set("end_date", e.target.value)} className={INPUT} />
            </Field>
          </div>
        </Card>

        {/* ─── Preferences ────────────────────────────────────── */}
        <Card title="Preferences">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SelectField label="Trip type" value={form.trip_type} options={TRIP_TYPE_OPTIONS} onChange={(v) => set("trip_type", v)} />
            <SelectField label="Budget" value={form.budget_level} options={BUDGET_LEVEL_OPTIONS} onChange={(v) => set("budget_level", v)} />
            <SelectField label="Pace" value={form.pace} options={PACE_OPTIONS} onChange={(v) => set("pace", v)} />
            <SelectField label="Food" value={form.food_preference} options={FOOD_PREFERENCE_OPTIONS} onChange={(v) => set("food_preference", v)} />
            <SelectField label="Accommodation" value={form.accommodation_preference} options={ACCOMMODATION_OPTIONS} onChange={(v) => set("accommodation_preference", v)} />
            <SelectField label="Travel mode" value={form.travel_mode} options={TRAVEL_MODE_OPTIONS} onChange={(v) => set("travel_mode", v)} />
          </div>
          <Field label="Interests" className="mt-4">
            <input type="text" placeholder="e.g. temples, street food, cherry blossoms, shopping" value={form.interests} onChange={(e) => set("interests", e.target.value)} className={INPUT} />
          </Field>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Checkbox label="Needs visa assistance" checked={form.needs_visa_assistance} onChange={(v) => set("needs_visa_assistance", v)} />
            <Checkbox label="Needs travel insurance" checked={form.needs_travel_insurance} onChange={(v) => set("needs_travel_insurance", v)} />
            <Checkbox label="Airport transfers" checked={form.needs_airport_transfers} onChange={(v) => set("needs_airport_transfers", v)} />
          </div>
        </Card>

        {/* ─── Day-wise itinerary ─────────────────────────────── */}
        <Card title="Day-wise itinerary">
          <div className="space-y-5">
            {form.days.map((day, dayIdx) => (
              <div
                key={dayIdx}
                className="relative rounded-xl border border-gray-200 bg-gray-50/60 p-4 pt-5"
              >
                {/* Day header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                      {dayIdx + 1}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      Day {dayIdx + 1}
                    </span>
                  </span>
                  {form.days.length > 1 && (
                    <button type="button" onClick={() => removeDay(dayIdx)} aria-label={`Remove day ${dayIdx + 1}`} className="rounded-md p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors">
                      <X size={18} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Title *">
                    <input type="text" required placeholder="e.g. Arrival & Tokyo Exploration" value={day.title} onChange={(e) => setDay(dayIdx, { title: e.target.value })} className={INPUT} />
                  </Field>
                  <Field label="Location / City">
                    <input type="text" placeholder="e.g. Tokyo" value={day.location} onChange={(e) => setDay(dayIdx, { location: e.target.value })} className={INPUT} />
                  </Field>
                </div>

                {/* ─── Places to visit ─────────────────────────── */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" /> Places to visit
                  </p>
                  <div className="space-y-2">
                    {day.activities.map((act, actIdx) => (
                      <div key={actIdx}>
                        {/* Travel segment — how to get here */}
                        <div className="flex items-center gap-2 py-1.5 px-2 my-1 rounded-md bg-primary/5 border border-primary/10">
                          <ArrowRight size={12} className="text-primary shrink-0" />
                          <span className="text-[11px] text-gray-500 shrink-0">
                            {actIdx === 0 ? "Getting there" : "Next stop"}
                          </span>
                          <select
                            value={act.travel_mode}
                            onChange={(e) => setActivity(dayIdx, actIdx, { travel_mode: e.target.value })}
                            className="rounded border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary/40"
                          >
                            {TRAVEL_MODE_ACTIVITY_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="e.g. 20 min"
                            value={act.travel_duration}
                            onChange={(e) => setActivity(dayIdx, actIdx, { travel_duration: e.target.value })}
                            className="w-20 rounded border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary/40"
                          />
                        </div>

                        {/* Activity card */}
                        <div className="relative rounded-lg border border-gray-200 bg-white p-3">
                          {day.activities.length > 1 && (
                            <button type="button" onClick={() => removeActivity(dayIdx, actIdx)} aria-label={`Remove place ${actIdx + 1}`} className="absolute top-1.5 right-1.5 rounded p-0.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                              <X size={14} />
                            </button>
                          )}
                          <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[80px_1fr_1fr] gap-2">
                            <FieldSm label="Time">
                              <input type="text" placeholder="9:00 AM" value={act.time} onChange={(e) => setActivity(dayIdx, actIdx, { time: e.target.value })} className={INPUT_SM} />
                            </FieldSm>
                            <FieldSm label="Place name *" className="sm:col-span-1 col-span-1">
                              <input type="text" required placeholder="e.g. Senso-ji Temple" value={act.place_name} onChange={(e) => setActivity(dayIdx, actIdx, { place_name: e.target.value })} className={INPUT_SM} />
                            </FieldSm>
                            <FieldSm label="Activity" className="col-span-2 sm:col-span-1">
                              <input type="text" placeholder="e.g. Explore temple grounds" value={act.activity} onChange={(e) => setActivity(dayIdx, actIdx, { activity: e.target.value })} className={INPUT_SM} />
                            </FieldSm>
                            <FieldSm label="Duration">
                              <input type="text" placeholder="1.5 hrs" value={act.duration} onChange={(e) => setActivity(dayIdx, actIdx, { duration: e.target.value })} className={INPUT_SM} />
                            </FieldSm>
                            <FieldSm label="Location URL" className="col-span-1">
                              <input type="url" placeholder="Google Maps link" value={act.location_url} onChange={(e) => setActivity(dayIdx, actIdx, { location_url: e.target.value })} className={INPUT_SM} />
                            </FieldSm>
                            <FieldSm label="Notes" className="col-span-1">
                              <input type="text" placeholder="e.g. Entry fee ¥500" value={act.notes} onChange={(e) => setActivity(dayIdx, actIdx, { notes: e.target.value })} className={INPUT_SM} />
                            </FieldSm>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addActivity(dayIdx)}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <Plus size={14} /> Add place
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <Field label="Accommodation">
                    <input type="text" placeholder="e.g. Hotel Gracery Shinjuku" value={day.accommodation} onChange={(e) => setDay(dayIdx, { accommodation: e.target.value })} className={INPUT} />
                  </Field>
                  <Field label="Accommodation URL">
                    <input type="url" placeholder="Google Maps or booking link" value={day.accommodation_url} onChange={(e) => setDay(dayIdx, { accommodation_url: e.target.value })} className={INPUT} />
                  </Field>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <Checkbox label="Breakfast" checked={day.breakfast_included} onChange={(v) => setDay(dayIdx, { breakfast_included: v })} />
                  <Checkbox label="Lunch" checked={day.lunch_included} onChange={(v) => setDay(dayIdx, { lunch_included: v })} />
                  <Checkbox label="Dinner" checked={day.dinner_included} onChange={(v) => setDay(dayIdx, { dinner_included: v })} />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addDay}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:text-primary text-gray-500 py-3 font-medium transition-colors"
          >
            <Plus size={18} /> Add another day
          </button>
        </Card>

        {/* ─── Additional notes ───────────────────────────────── */}
        <Card title="Additional notes">
          <div className="space-y-4">
            <Field label="Medical / special needs">
              <textarea placeholder="e.g. Diabetic — carries insulin. Knee pain — avoid long walks. Wheelchair at airport. Room on lower floor." value={form.medical_conditions} onChange={(e) => set("medical_conditions", e.target.value)} className={TEXTAREA} />
            </Field>
            <Field label="Internal notes (not shown in document)">
              <textarea placeholder="Team-only notes — not included in the printed itinerary." value={form.internal_notes} onChange={(e) => set("internal_notes", e.target.value)} className={TEXTAREA} />
            </Field>
          </div>
        </Card>

        {/* ─── Submit ─────────────────────────────────────────── */}
        <div className="space-y-4">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
          >
            {status === "submitting" ? "Generating…" : "Generate itinerary ↗"}
          </button>

          {status === "error" && errorMsg && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}
        </div>
      </form>
    </section>
  );
}
