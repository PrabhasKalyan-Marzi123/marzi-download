"use client";

import { useState } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import ItineraryAIDocument from "./ItineraryAIDocument";
import {
  extractError,
  Field,
  INPUT,
  TEXTAREA,
  unwrap,
} from "@/components/shared/form-utils";
import {
  DAILY_ENERGY_OPTIONS,
  EMPTY_INTAKE,
  NON_NEGOTIABLE_OPTIONS,
  START_TIME_OPTIONS,
  STAY_PREFERENCE_OPTIONS,
  TRAVEL_TOLERANCE_OPTIONS,
  TRIP_ITINERARY_ENDPOINT,
  TRIP_PLANNER_HERO,
  TRIP_PURPOSE_OPTIONS,
  WALKING_CAPACITY_OPTIONS,
  type TripIntakeInput,
  type TripIntakeResponse,
} from "@/data/tripPlanner";

type Status = "idle" | "submitting" | "success" | "error";

export default function TripPlannerForm() {
  const [form, setForm] = useState<TripIntakeInput>({ ...EMPTY_INTAKE });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<TripIntakeResponse | null>(null);

  const clearErr = () => {
    setStatus((p) => (p === "error" ? "idle" : p));
    setErrorMsg(null);
  };

  const set = <K extends keyof TripIntakeInput>(k: K, v: TripIntakeInput[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
    clearErr();
  };

  const toggleMulti = (key: "trip_purpose" | "stay_preference" | "non_negotiables", value: string) => {
    setForm((p) => {
      const arr = p[key];
      return { ...p, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
    clearErr();
  };

  const setSingle = (key: keyof TripIntakeInput, value: string) => {
    setForm((p) => ({ ...p, [key]: p[key] === value ? "" : value }));
    clearErr();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.ages_of_travellers.trim()) {
      setStatus("error");
      setErrorMsg("Please enter the ages of travellers.");
      return;
    }
    if (!form.number_of_travelers.trim()) {
      setStatus("error");
      setErrorMsg("Please enter the number of travellers.");
      return;
    }
    if (!form.start_date || !form.end_date) {
      setStatus("error");
      setErrorMsg("Please enter both travel start and end dates.");
      return;
    }
    if (form.end_date < form.start_date) {
      setStatus("error");
      setErrorMsg("End date must be on or after the start date.");
      return;
    }
    if (!form.starting_city.trim()) {
      setStatus("error");
      setErrorMsg("Please enter a starting city.");
      return;
    }
    if (form.trip_purpose.length === 0) {
      setStatus("error");
      setErrorMsg("Please select at least one trip purpose.");
      return;
    }
    if (!form.walking_capacity) {
      setStatus("error");
      setErrorMsg("Please select your walking capacity.");
      return;
    }
    if (!form.daily_energy_hours) {
      setStatus("error");
      setErrorMsg("Please select daily energy hours.");
      return;
    }
    if (!form.destination_route.trim()) {
      setStatus("error");
      setErrorMsg("Please enter a destination or route.");
      return;
    }

    setStatus("submitting");
    setErrorMsg(null);

    const numTravelers = Number(form.number_of_travelers) || 1;
    const nights = form.trip_duration_nights.trim() ? Number(form.trip_duration_nights) : null;

    const payload = {
      ages_of_travellers: form.ages_of_travellers.trim(),
      number_of_travelers: numTravelers,
      gender_mix: form.gender_mix.trim() || null,
      health_limitations: form.health_limitations.trim() || null,
      start_date: form.start_date,
      end_date: form.end_date,
      departure_city: form.starting_city.trim(),
      return_city: form.return_city.trim() || null,
      transit_mode_text: form.transit_mode_text.trim() || null,
      trip_purpose: form.trip_purpose,
      walking_capacity: form.walking_capacity || null,
      daily_energy_hours: form.daily_energy_hours || null,
      preferred_start_time: form.preferred_start_time || null,
      travel_time_tolerance: form.travel_time_tolerance || null,
      stay_preference: form.stay_preference,
      non_negotiables: form.non_negotiables,
      other_avoidances: form.other_avoidances.trim() || null,
      destination_route: form.destination_route.trim(),
      trip_duration_nights: nights,
    };

    try {
      const res = await fetch(TRIP_ITINERARY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        if (res.status === 429) throw new Error("Too many requests. Please try again shortly.");
        let body: unknown = null;
        try { body = await res.json(); } catch { /* non-JSON */ }
        throw new Error(extractError(unwrap(body), "Something went wrong. Please try again."));
      }
      const body = await res.json();
      setResult(unwrap<TripIntakeResponse>(body));
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  // ─── Success: show AI-generated document ───────────────────────
  if (status === "success" && result) {
    const aiData = (result.ai_output ?? {}) as Record<string, unknown>;
    const hasAI = aiData && !("error" in aiData) && Object.keys(aiData).length > 0;

    return (
      <div className="pb-16">
        <div className="no-print mx-auto max-w-[820px] px-4 pt-6 pb-2 flex flex-wrap gap-3">
          {hasAI && (
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              <Printer size={18} /> Download / print itinerary
            </button>
          )}
          <button
            type="button"
            onClick={() => { setForm({ ...EMPTY_INTAKE }); setStatus("idle"); setResult(null); }}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            <ArrowLeft size={18} /> New itinerary
          </button>
        </div>
        {hasAI ? (
          <ItineraryAIDocument data={aiData} refId={result.id} />
        ) : (
          <div className="mx-auto max-w-[820px] px-4 py-8 text-center">
            <p className="text-red-600 font-medium">AI generation failed.</p>
            <p className="text-sm text-gray-500 mt-1">{String((aiData as Record<string,unknown>)?.error || "Unknown error")}</p>
          </div>
        )}
      </div>
    );
  }

  // ─── Form ─────────────────────────────────────────────────────
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-2 italic font-[family-name:var(--font-playfair)]">
        {TRIP_PLANNER_HERO.title}
      </h1>
      <p className="text-sm text-gray-600 mb-10 max-w-xl">{TRIP_PLANNER_HERO.subtitle}</p>

      <form onSubmit={onSubmit} noValidate className="space-y-8">
        {/* ── 1. Traveller Details ───────────────────────────── */}
        <Section num={1} title="Traveller Details" subtitle="Sets the hard constraints — pace, transport, feasibility">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Ages of all travellers *">
              <input type="text" required placeholder="e.g. 62, 65, 32" value={form.ages_of_travellers} onChange={(e) => set("ages_of_travellers", e.target.value)} className={INPUT} />
            </Field>
            <Field label="Number of travellers *">
              <input type="text" required placeholder="e.g. 2" value={form.number_of_travelers} onChange={(e) => set("number_of_travelers", e.target.value)} className={INPUT} />
            </Field>
            <Field label="Gender mix">
              <input type="text" placeholder="e.g. 1M 1F, Solo female, 2F 2M" value={form.gender_mix} onChange={(e) => set("gender_mix", e.target.value)} className={INPUT} />
            </Field>
            <Field label="Health / mobility limitations">
              <input type="text" placeholder="e.g. knee pain, avoids stairs, wheelchair" value={form.health_limitations} onChange={(e) => set("health_limitations", e.target.value)} className={INPUT} />
            </Field>
            <Field label="Travel start date *">
              <input type="date" required value={form.start_date} onChange={(e) => set("start_date", e.target.value)} className={INPUT} />
            </Field>
            <Field label="Travel end date *">
              <input type="date" required value={form.end_date} onChange={(e) => set("end_date", e.target.value)} className={INPUT} />
            </Field>
            <Field label="Starting city *">
              <input type="text" required placeholder="e.g. Bangalore, Delhi, Mumbai" value={form.starting_city} onChange={(e) => set("starting_city", e.target.value)} className={INPUT} />
            </Field>
            <Field label="Return plan / ending city">
              <input type="text" placeholder="e.g. Return to Bangalore" value={form.return_city} onChange={(e) => set("return_city", e.target.value)} className={INPUT} />
            </Field>
            <Field label="Transit mode (if known)" className="sm:col-span-2">
              <input type="text" placeholder="e.g. Private car, Flight + private car, Train" value={form.transit_mode_text} onChange={(e) => set("transit_mode_text", e.target.value)} className={INPUT} />
            </Field>
          </div>
        </Section>

        {/* ── 2. Trip Purpose ────────────────────────────────── */}
        <Section num={2} title="Trip Purpose *" subtitle="Defines what to include — and what NOT to include">
          <OptionGroup
            options={TRIP_PURPOSE_OPTIONS}
            selected={form.trip_purpose}
            onToggle={(v) => toggleMulti("trip_purpose", v)}
            multi
            showEmoji
          />
        </Section>

        {/* ── 3. Walking Capacity ────────────────────────────── */}
        <Section num={3} title="Walking Capacity (per stretch) *" subtitle="Drives 70% of all itinerary decisions — be honest">
          <OptionGroup
            options={WALKING_CAPACITY_OPTIONS}
            selected={form.walking_capacity}
            onToggle={(v) => setSingle("walking_capacity", v)}
          />
        </Section>

        {/* ── 4. Daily Energy ────────────────────────────────── */}
        <Section num={4} title="Daily Energy — Hours Outside Hotel *" subtitle="Controls day density and fatigue management">
          <OptionGroup
            options={DAILY_ENERGY_OPTIONS}
            selected={form.daily_energy_hours}
            onToggle={(v) => setSingle("daily_energy_hours", v)}
          />
        </Section>

        {/* ── 5. Preferred Start Time ────────────────────────── */}
        <Section num={5} title="Preferred Start Time Each Morning" subtitle="Impacts temples, markets, and crowd management">
          <OptionGroup
            options={START_TIME_OPTIONS}
            selected={form.preferred_start_time}
            onToggle={(v) => setSingle("preferred_start_time", v)}
          />
        </Section>

        {/* ── 6. Travel Time Tolerance ───────────────────────── */}
        <Section num={6} title="Travel Time Tolerance Per Day" subtitle="Decides whether multi-city routes and long-day trips are viable">
          <OptionGroup
            options={TRAVEL_TOLERANCE_OPTIONS}
            selected={form.travel_time_tolerance}
            onToggle={(v) => setSingle("travel_time_tolerance", v)}
          />
        </Section>

        {/* ── 7. Stay Preference ─────────────────────────────── */}
        <Section num={7} title="Stay Preference" subtitle="Affects comfort vs. cost tradeoff">
          <OptionGroup
            options={STAY_PREFERENCE_OPTIONS}
            selected={form.stay_preference}
            onToggle={(v) => toggleMulti("stay_preference", v)}
            multi
          />
        </Section>

        {/* ── 8. Non-Negotiables ─────────────────────────────── */}
        <Section num={8} title="Non-Negotiables & Avoidances" subtitle="Prevents fund-blocking experiences — skip all that sucks">
          <OptionGroup
            options={NON_NEGOTIABLE_OPTIONS}
            selected={form.non_negotiables}
            onToggle={(v) => toggleMulti("non_negotiables", v)}
            multi
          />
          <Field label="Any other avoidances or special requirements" className="mt-4">
            <textarea
              placeholder="e.g. No AC rooms, need ground floor, diabetic meal required, travelling with infant..."
              value={form.other_avoidances}
              onChange={(e) => set("other_avoidances", e.target.value)}
              className={TEXTAREA}
            />
          </Field>
        </Section>

        {/* ── 9. Destination ─────────────────────────────────── */}
        <Section num={9} title="Destination" subtitle="The places you want to visit">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Destination / Route *">
              <input type="text" required placeholder="e.g. Kerala, Bhutan, Dehradun-Dharamsala-Amritsar" value={form.destination_route} onChange={(e) => set("destination_route", e.target.value)} className={INPUT} />
            </Field>
            <Field label="Trip duration (nights)">
              <input type="text" placeholder="e.g. 7" value={form.trip_duration_nights} onChange={(e) => set("trip_duration_nights", e.target.value)} className={INPUT} />
            </Field>
          </div>
        </Section>

        {/* ── Submit ─────────────────────────────────────────── */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-full text-base transition-colors"
          >
            {status === "submitting" ? "Saving…" : "Generate Itinerary Input →"}
          </button>

          {status === "error" && errorMsg && (
            <p className="mt-3 text-sm text-red-600">{errorMsg}</p>
          )}
        </div>
      </form>
    </section>
  );
}

// ─── Layout components ──────────────────────────────────────────

function Section({
  num,
  title,
  subtitle,
  children,
}: {
  num: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
          {num}
        </span>
        <div>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function OptionGroup({
  options,
  selected,
  onToggle,
  multi = false,
  showEmoji,
}: {
  options: readonly { value: string; label: string; emoji?: string }[];
  selected: string | string[];
  onToggle: (value: string) => void;
  multi?: boolean;
  showEmoji?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = multi
          ? (selected as string[]).includes(opt.value)
          : selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? multi
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-primary bg-primary text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            {showEmoji && opt.emoji && <span>{opt.emoji}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
