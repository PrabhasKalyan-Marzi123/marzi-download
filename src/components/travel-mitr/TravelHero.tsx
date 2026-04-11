"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import {
  INQUIRY_SOURCE,
  TRAVEL_HERO,
  TRAVEL_HERO_BADGE,
  TRAVEL_MITR_WHATSAPP_URL,
  TRAVEL_MITR_CALL_URL,
  TRAVEL_INQUIRY_ENDPOINT,
  type InquirySource,
} from "@/data/travelMitr";

type FormState = {
  name: string;
  phone: string;
  age: string;
};

const EMPTY_FORM: FormState = { name: "", phone: "", age: "" };

// Accepts a 10-digit Indian mobile or a "+<country code><number>" of 10–15
// digits. Backend re-validates with libphonenumber; this just catches junk
// before we hit the network.
const PHONE_RE = /^(?:\+\d{10,15}|\d{10})$/;

// Pull the first human-readable error out of a DRF response body. DRF
// returns either `{ field: ["msg"] }`, `{ non_field_errors: ["msg"] }`, or
// `{ detail: "msg" }` — all three collapse to "first string we find".
function extractErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  for (const value of Object.values(payload as Record<string, unknown>)) {
    if (typeof value === "string") return value;
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  }
  return fallback;
}

type TravelHeroProps = {
  /** First line of the headline (rendered upright). */
  headline?: string;
  /** Second part of the headline (rendered italic in the brand colour). */
  headlineAccent?: string;
  /** Sub-copy below the headline. */
  description?: string;
  /** Tag sent to the backend so leads from each variant are distinguishable. */
  source?: InquirySource;
};

export default function TravelHero({
  headline = TRAVEL_HERO.headline,
  headlineAccent = TRAVEL_HERO.headlineAccent,
  description = TRAVEL_HERO.description,
  source = INQUIRY_SOURCE.LANDING,
}: TravelHeroProps = {}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    // Any edit after a terminal state should clear the banner — otherwise the
    // old success/error message lingers over a form the user is re-filling.
    setStatus((prev) => (prev === "success" || prev === "error" ? "idle" : prev));
    setErrorMsg(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = form.name.trim().replace(/\s+/g, " ");
    const phoneCleaned = form.phone.replace(/[^\d+]/g, "");
    const ageNum = Number(form.age);

    if (name.length < 2) {
      setStatus("error");
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!PHONE_RE.test(phoneCleaned)) {
      setStatus("error");
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!Number.isInteger(ageNum) || ageNum < 18 || ageNum > 110) {
      setStatus("error");
      setErrorMsg("Please enter a valid age (18–110).");
      return;
    }

    setStatus("submitting");
    setErrorMsg(null);

    try {
      const res = await fetch(TRAVEL_INQUIRY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          phone: phoneCleaned,
          age: ageNum,
          source,
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Too many requests. Please try again in a little while.");
        }
        let payload: unknown = null;
        try {
          payload = await res.json();
        } catch {
          // Non-JSON body (HTML error page, network blip) — fall through.
        }
        throw new Error(
          extractErrorMessage(payload, "Something went wrong. Please try again.")
        );
      }

      setStatus("success");
      setForm(EMPTY_FORM);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <section className="relative isolate overflow-hidden pt-20 pb-20 sm:pt-28 sm:pb-28 px-6 sm:px-10 lg:px-20">
      {/* Background image with soft white overlay so the form/text stay readable */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <img
          src="/travel-hero.png"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Even white wash for legibility */}
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]" />
        {/* Bottom fade so the hero blends into the next section instead of cutting off hard */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: copy + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-gray-900">
            {headline}{" "}
            <span className="italic font-[family-name:var(--font-playfair)] text-primary">
              {headlineAccent}
            </span>
          </h1>

          <p className="max-w-xl text-base sm:text-lg text-gray-600 leading-relaxed">
            {description}
          </p>

          <div className="inline-block bg-gray-200/80 backdrop-blur-sm px-4 py-1.5 rounded-lg text-sm font-bold text-gray-700 italic">
            {TRAVEL_HERO_BADGE}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={TRAVEL_MITR_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-base font-semibold px-6 py-3.5 rounded-full transition-colors"
            >
              <MessageCircle size={20} />
              {TRAVEL_HERO.whatsappLabel}
            </a>
            <a
              href={TRAVEL_MITR_CALL_URL}
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-base font-semibold px-6 py-3.5 rounded-full transition-colors"
            >
              <Phone size={20} />
              {TRAVEL_HERO.callLabel}
            </a>
          </div>
        </motion.div>

        {/* Right: form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 w-full max-w-md justify-self-center lg:justify-self-end"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {TRAVEL_HERO.formTitle}
          </h2>
          <p className="text-sm text-gray-500 mb-6">{TRAVEL_HERO.formSubtitle}</p>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="tm-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {TRAVEL_HERO.fields.name.label}
              </label>
              <input
                id="tm-name"
                type="text"
                value={form.name}
                onChange={update("name")}
                placeholder={TRAVEL_HERO.fields.name.placeholder}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                required
              />
            </div>

            <div>
              <label
                htmlFor="tm-phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {TRAVEL_HERO.fields.phone.label}
              </label>
              <input
                id="tm-phone"
                type="tel"
                inputMode="numeric"
                pattern="\d{10}"
                value={form.phone}
                onChange={update("phone")}
                placeholder={TRAVEL_HERO.fields.phone.placeholder}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                required
              />
            </div>

            <div>
              <label
                htmlFor="tm-age"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {TRAVEL_HERO.fields.age.label}
              </label>
              <input
                id="tm-age"
                type="number"
                inputMode="numeric"
                min={18}
                max={110}
                value={form.age}
                onChange={update("age")}
                placeholder={TRAVEL_HERO.fields.age.placeholder}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full inline-flex items-center justify-center bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white text-base font-semibold px-6 py-3.5 rounded-full transition-colors"
            >
              {status === "submitting" ? "Sending…" : TRAVEL_HERO.formCtaLabel}
            </button>

            {status === "success" && (
              <p className="text-sm text-emerald-600 text-center">
                Thanks! We&apos;ll be in touch shortly.
              </p>
            )}
            {status === "error" && errorMsg && (
              <p className="text-sm text-red-600 text-center">{errorMsg}</p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
