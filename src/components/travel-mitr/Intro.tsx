"use client";

import { motion } from "framer-motion";
import { Check, MessageCircle, Phone } from "lucide-react";
import { TRAVEL_MITR_WHATSAPP_URL, TRAVEL_MITR_CALL_URL, TRAVEL_HERO } from "@/data/travelMitr";

export type IntroData = {
  heading: React.ReactNode;
  cardTitle: string;
  cardSubtitle: string;
  checkpoints: string[];
};

type IntroProps = {
  data: IntroData;
};

export default function Intro({ data }: IntroProps) {
  return (
    <section className="bg-[#F9FAF9] py-20 sm:py-28 px-6 sm:px-10 lg:px-20 relative overflow-hidden">
      {/* Subtle organic background shape */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl opacity-50" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-12"
        >
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 leading-[1.3] max-w-2xl mx-auto font-[family-name:var(--font-playfair)]">
              {data.heading}
            </h2>
          </div>

          <div className="relative">
            {/* Soft decorative background */}
            <div className="absolute inset-0 bg-emerald-100/20 rounded-[3rem] rotate-1 scale-[1.03] shadow-inner" />
            
            <div className="relative bg-white rounded-[2.5rem] p-10 sm:p-14 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white/80 space-y-10">
              <div className="space-y-4">
                <p className="text-xl sm:text-2xl text-gray-900 font-bold leading-tight italic font-[family-name:var(--font-playfair)]">
                  {data.cardTitle}
                </p>
                <p className="text-lg text-gray-600 font-medium">
                  {data.cardSubtitle}
                </p>
              </div>

              <div className="w-16 h-px bg-emerald-200 mx-auto" />

              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
                {data.checkpoints.map((item, i) => (
                  <li key={i} className="space-y-4 text-center sm:text-left">
                    <div className="mx-auto sm:mx-0 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-100">
                      <Check size={18} strokeWidth={3} />
                    </div>
                    <span className="block text-[15px] sm:text-[16px] text-gray-800 font-bold leading-tight px-4 sm:px-0">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
            <a
              href={TRAVEL_MITR_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold px-10 py-5 rounded-full transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-100 font-medium"
            >
              <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
              Chat on WhatsApp
            </a>
            <a
              href={TRAVEL_MITR_CALL_URL}
              className="group inline-flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-lg font-bold px-10 py-5 rounded-full transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-100"
            >
              <Phone size={20} className="group-hover:scale-110 transition-transform" />
              {TRAVEL_HERO.callLabel}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
