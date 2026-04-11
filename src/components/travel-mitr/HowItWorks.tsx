"use client";

import { motion } from "framer-motion";
import { HOW_IT_WORKS } from "@/data/travelMitr";
import { MessageCircle, MapPin, CheckCircle } from "lucide-react";

const STEP_ICONS = [<MessageCircle />, <MapPin />, <CheckCircle />];

export default function HowItWorks() {
  return (
    <section className="bg-[#F9F7F4] py-16 sm:py-24 px-6 sm:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-3xl sm:text-4xl font-bold text-gray-900 mb-20 font-[family-name:var(--font-playfair)]"
        >
          {HOW_IT_WORKS.heading}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {HOW_IT_WORKS.steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center px-4 relative"
            >
              <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-pink-50 text-primary flex items-center justify-center relative">
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-[#F9F7F4]">
                   {step.number}
                </div>
                {idx === 0 && <MessageCircle size={32} />}
                {idx === 1 && <MapPin size={32} />}
                {idx === 2 && <CheckCircle size={32} />}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 font-[family-name:var(--font-playfair)]">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[200px] mx-auto font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
