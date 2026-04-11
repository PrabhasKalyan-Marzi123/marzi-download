"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { REASONS } from "@/data/travelMitr";

export default function Reasons() {
  return (
    <section className="bg-white py-16 sm:py-24 px-6 sm:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-3xl sm:text-4xl font-bold text-gray-900 mb-16 font-[family-name:var(--font-playfair)]"
        >
          {REASONS.heading}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REASONS.items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#F8F9F8] p-10 rounded-[2rem] border border-[#F0F2F0] flex items-center gap-6"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                 {/* Icon placeholder */}
                 <Check size={24} />
              </div>
              <p className="text-base sm:text-lg font-bold text-[#2D2D2D] leading-tight">
                {item.quote}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
