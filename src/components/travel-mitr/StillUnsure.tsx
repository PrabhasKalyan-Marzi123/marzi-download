"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import {
  TRAVEL_HERO,
  TRAVEL_MITR_WHATSAPP_URL,
  TRAVEL_MITR_CALL_URL,
} from "@/data/travelMitr";

export type StillUnsureData = {
  heading: string;
  subtitle: string;
};

type StillUnsureProps = {
  data: StillUnsureData;
};

export default function StillUnsure({ data }: StillUnsureProps) {
  return (
    <section className="bg-white py-24 sm:py-32 px-6 sm:px-10 lg:px-20 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="relative bg-gradient-to-br from-emerald-50 to-white rounded-[3rem] p-12 sm:p-20 text-center border border-emerald-100/50 shadow-[0_40px_100px_rgba(0,0,0,0.04)] overflow-hidden group"
        >
          {/* Decorative accents */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-100/40 rounded-full -ml-16 -mt-16 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-yellow-100/40 rounded-full -mr-24 -mb-24 blur-3xl animate-pulse" />

          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 leading-tight font-[family-name:var(--font-playfair)] tracking-tight">
                {data.heading}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 font-bold max-w-2xl mx-auto leading-relaxed">
                {data.subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
              <a
                href={TRAVEL_MITR_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold px-10 py-5 rounded-full transition-all shadow-lg shadow-emerald-200 hover:scale-[1.05] active:scale-95"
              >
                <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
                Chat on WhatsApp
              </a>
              <a
                href={TRAVEL_MITR_CALL_URL}
                className="group inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-100 text-lg font-bold px-10 py-5 rounded-full transition-all shadow-sm hover:shadow-md hover:scale-[1.05] active:scale-95"
              >
                <Phone size={22} className="text-primary group-hover:scale-110 transition-transform" />
                {TRAVEL_HERO.callLabel}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
