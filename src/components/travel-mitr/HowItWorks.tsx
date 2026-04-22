"use client";

import { motion } from "framer-motion";
import { MessageCircle, MapPin, CheckCircle, ArrowRight } from "lucide-react";

export type HowItWorksData = {
  heading: string;
  steps: ReadonlyArray<{
    number: string;
    title: string;
    description: string;
  }>;
};

type HowItWorksProps = {
  data: HowItWorksData;
};

const STEP_ICONS = [
  <MessageCircle size={36} strokeWidth={2.5} />,
  <MapPin size={36} strokeWidth={2.5} />,
  <CheckCircle size={36} strokeWidth={2.5} />,
];

export default function HowItWorks({ data }: HowItWorksProps) {
  return (
    <section className="bg-[#FDFCFB] py-16 sm:py-32 px-5 sm:px-10 lg:px-20 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-24 space-y-3 sm:space-y-4">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block text-primary font-bold tracking-[0.2em] text-[10px] sm:text-xs uppercase bg-primary/5 px-4 py-1.5 rounded-full"
          >
            Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 leading-tight font-[family-name:var(--font-playfair)]"
          >
            {data.heading}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 relative">
          {/* Visual connectors (Desktop only) */}
          <div className="hidden md:block absolute top-[40px] left-[20%] right-[20%] h-px border-t-2 border-dashed border-gray-200 z-0" />

          {data.steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2, ease: "easeOut" }}
              className="group flex md:flex-col items-center md:text-center px-4 relative z-10 gap-5 md:gap-0"
            >
              {/* Step indicator */}
              <div className="relative flex-shrink-0 mb-0 md:mb-10 w-14 h-14 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-white shadow-xl shadow-gray-200/50 flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-110 md:group-hover:rotate-6">
                <div className="absolute -top-1.5 -right-1.5 md:-top-3 md:-right-3 w-6 h-6 md:w-10 md:h-10 bg-yellow-400 text-gray-950 rounded-lg md:rounded-2xl flex items-center justify-center text-[10px] md:text-lg font-black shadow-lg ring-2 md:ring-4 ring-[#FDFCFB]">
                  {step.number}
                </div>
                <div className="text-primary group-hover:text-white transition-colors duration-500 scale-75 md:scale-100">
                  {STEP_ICONS[idx]}
                </div>
              </div>

              {/* Text content */}
              <div className="space-y-1 md:space-y-4 text-left md:text-center flex-1">
                <h3 className="text-lg sm:text-2xl font-extrabold text-gray-950 font-[family-name:var(--font-playfair)]">
                  {step.title}
                </h3>
                <p className="text-[14px] sm:text-[16px] text-gray-600 leading-relaxed font-semibold md:max-w-[240px] md:mx-auto">
                  {step.description}
                </p>
              </div>

              {/* Connector for mobile only */}
              {idx < data.steps.length - 1 && (
                <div className="md:hidden absolute left-[31px] top-[56px] w-[2px] h-[24px] bg-gradient-to-b from-gray-200 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
