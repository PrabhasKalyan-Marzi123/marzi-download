"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import {
  STILL_UNSURE,
  TRAVEL_HERO,
  TRAVEL_MITR_WHATSAPP_URL,
  TRAVEL_MITR_CALL_URL,
} from "@/data/travelMitr";

export default function StillUnsure() {
  return (
    <section className="bg-[#FFF1F3] text-gray-900 py-16 sm:py-24 px-6 sm:px-10 lg:px-20 text-center">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 font-[family-name:var(--font-playfair)] text-[#332D27]">
            Still unsure?
          </h2>
          <div className="text-gray-600 space-y-1 text-sm sm:text-base font-medium">
            <p>That&apos;s exactly why we built this.</p>
            <p>Before you finalise your trip, just have a quick conversation.</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        >
          <a
            href={TRAVEL_MITR_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#5B8D76] text-white hover:bg-[#4a7360] text-base font-bold px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95"
          >
            <MessageCircle size={20} />
            Chat on WhatsApp
          </a>
          <a
            href={TRAVEL_MITR_CALL_URL}
            className="inline-flex items-center justify-center gap-2 bg-[#E69C41] text-white hover:bg-[#cc8b3a] text-base font-bold px-8 py-3.5 rounded-xl transition-all shadow-md active:scale-95"
          >
            <Phone size={20} />
            Call Travel Mitr
          </a>
        </motion.div>
      </div>
    </section>
  );
}
