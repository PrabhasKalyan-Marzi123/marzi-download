"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { MessageCircle, Phone, Users } from "lucide-react";
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

const PHONE_RE = /^(?:\+\d{10,15}|\d{10})$/;

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  for (const value of Object.values(payload as Record<string, unknown>)) {
    if (typeof value === "string") return value;
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  }
  return fallback;
}

type TravelHeroProps = {
  headline?: string;
  headlineAccent?: string;
  description?: string;
  source?: InquirySource;
};

export default function TravelHero({
  headline = TRAVEL_HERO.headline,
  headlineAccent = TRAVEL_HERO.headlineAccent,
  description = TRAVEL_HERO.description,
  source = INQUIRY_SOURCE.LANDING,
}: TravelHeroProps = {}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<{ [K in keyof FormState]?: string }>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setStatus((prev) => (prev === "success" || prev === "error" ? "idle" : prev));
    setErrorMsg(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = form.name.trim().replace(/\s+/g, " ");
    const phoneCleaned = form.phone.replace(/[^\d+]/g, "");
    const ageNum = Number(form.age);

    const errors: { [K in keyof FormState]?: string } = {};

    if (name.length < 2) {
      errors.name = "Please enter your full name.";
    }
    if (!PHONE_RE.test(phoneCleaned)) {
      errors.phone = "Please enter a valid 10-digit mobile number.";
    }
    if (!form.age) {
       errors.age = "Please enter your age.";
    } else if (!Number.isInteger(ageNum) || ageNum < 18 || ageNum > 110) {
      errors.age = "Please enter a valid age (18–110).";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      setErrorMsg("Please correct the errors before submitting.");
      return;
    }

    setStatus("submitting");
    setFieldErrors({});
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
    <section className="relative isolate overflow-hidden pt-12 pb-24 sm:pt-20 sm:pb-32 px-6 sm:px-10 lg:px-20 min-h-[85vh] flex items-center">
      {/* Background with advanced gradient layering */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <img
          src="/travel-hero.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent lg:bg-gradient-to-r lg:from-white/95 lg:via-white/70 lg:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10 w-full">
        {/* Left Aspect: Value Proposition */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 space-y-8"
        >
          {/* Trust Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-emerald-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-emerald-700">
                  <Users size={10} />
                </div>
              ))}
            </div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Trusted by 500+ Indian Families
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-gray-950">
            {headline}<br />
            <span className="italic font-[family-name:var(--font-playfair)] text-primary">
              {headlineAccent}
            </span>
          </h1>

          <p className="max-w-xl text-lg sm:text-xl text-gray-600 leading-relaxed font-medium">
            {description}
          </p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="inline-block bg-white/60 backdrop-blur-md border border-gray-100 px-5 py-2.5 rounded-2xl text-[13px] font-bold text-gray-700 shadow-sm"
          >
            ✦ {TRAVEL_HERO_BADGE}
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href={TRAVEL_MITR_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold px-8 py-4.5 rounded-full transition-all shadow-lg shadow-emerald-200 hover:scale-[1.02] active:scale-95"
            >
              <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
              {TRAVEL_HERO.whatsappLabel}
            </a>
            <a
              href={TRAVEL_MITR_CALL_URL}
              className="group inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-100 text-lg font-bold px-8 py-4.5 rounded-full transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95"
            >
              <Phone size={22} className="text-primary group-hover:scale-110 transition-transform" />
              {TRAVEL_HERO.callLabel}
            </a>
          </div>
        </motion.div>

        {/* Right Aspect: Conversion Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-5 w-full flex justify-center lg:justify-end"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_80px_rgba(0,0,0,0.08)] border border-white/50 p-8 sm:p-10 w-full max-w-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold text-gray-950 mb-2 font-[family-name:var(--font-playfair)]">
                {TRAVEL_HERO.formTitle}
              </h2>
              <p className="text-gray-500 mb-8 font-medium">{TRAVEL_HERO.formSubtitle}</p>

              <form onSubmit={onSubmit} className="space-y-5" noValidate>
                <div className="space-y-1.5">
                  <label htmlFor="tm-name" className={`text-xs font-bold ml-1 uppercase tracking-wider transition-colors ${fieldErrors.name ? "text-red-500" : "text-gray-700"}`}>
                    {TRAVEL_HERO.fields.name.label}
                  </label>
                  <input
                    id="tm-name"
                    type="text"
                    value={form.name}
                    onChange={update("name")}
                    placeholder={TRAVEL_HERO.fields.name.placeholder}
                    className={`w-full bg-gray-50/50 border rounded-2xl px-5 py-4 text-[15px] focus:bg-white focus:outline-none focus:ring-4 transition-all font-medium ${
                      fieldErrors.name 
                        ? "border-red-200 focus:ring-red-100 focus:border-red-400" 
                        : "border-gray-100 focus:ring-primary/10 focus:border-primary"
                    }`}
                    required
                  />
                  {fieldErrors.name && (
                    <p className="text-[11px] font-bold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="tm-phone" className={`text-xs font-bold ml-1 uppercase tracking-wider transition-colors ${fieldErrors.phone ? "text-red-500" : "text-gray-700"}`}>
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
                    className={`w-full bg-gray-50/50 border rounded-2xl px-5 py-4 text-[15px] focus:bg-white focus:outline-none focus:ring-4 transition-all font-medium ${
                      fieldErrors.phone 
                        ? "border-red-200 focus:ring-red-100 focus:border-red-400" 
                        : "border-gray-100 focus:ring-primary/10 focus:border-primary"
                    }`}
                    required
                  />
                  {fieldErrors.phone && (
                    <p className="text-[11px] font-bold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.phone}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="tm-age" className={`text-xs font-bold ml-1 uppercase tracking-wider transition-colors ${fieldErrors.age ? "text-red-500" : "text-gray-700"}`}>
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
                    className={`w-full bg-gray-50/50 border rounded-2xl px-5 py-4 text-[15px] focus:bg-white focus:outline-none focus:ring-4 transition-all font-medium ${
                      fieldErrors.age 
                        ? "border-red-200 focus:ring-red-100 focus:border-red-400" 
                        : "border-gray-100 focus:ring-primary/10 focus:border-primary"
                    }`}
                    required
                  />
                  {fieldErrors.age && (
                    <p className="text-[11px] font-bold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.age}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-lg font-bold py-4.5 rounded-full transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-2px] active:translate-y-0 mt-2"
                >
                  {status === "submitting" ? "Sending Details…" : TRAVEL_HERO.formCtaLabel}
                </button>

                {status === "success" && (
                  <p className="text-sm font-bold text-emerald-600 text-center mt-4">
                    ✓ Success! We&apos;ll call you shortly.
                  </p>
                )}
                {status === "error" && errorMsg && !Object.keys(fieldErrors).length && (
                  <p className="text-sm font-medium text-red-500 text-center mt-4">{errorMsg}</p>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
