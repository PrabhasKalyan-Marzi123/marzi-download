"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Check, Plane, Bed, HeartPulse, Compass } from "lucide-react";

export type HelpCardData = {
  header: string;
  heading: string;
  subtitle: string;
  bulletMarker?: string;
  cards: ReadonlyArray<{
    title: string;
    subtitle?: string;
    iconType?: string;
    points: ReadonlyArray<string>;
  }>;
};

type HelpCardsProps = {
  data: HelpCardData;
};

const ICONS: Record<string, React.ReactNode> = {
  flights: <Plane size={24} strokeWidth={2.5} />,
  hotels: <Bed size={24} strokeWidth={2.5} />,
  health: <HeartPulse size={24} strokeWidth={2.5} />,
  transport: <Compass size={24} strokeWidth={2.5} />,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function HelpCards({ data }: HelpCardsProps) {
  return (
    <section className="bg-white py-16 sm:py-32 px-5 sm:px-10 lg:px-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-20 space-y-3 sm:space-y-4">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block text-primary font-bold tracking-[0.2em] text-[10px] sm:text-xs uppercase bg-primary/5 px-4 py-1.5 rounded-full"
          >
            {data.header}
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 leading-tight max-w-3xl mx-auto font-[family-name:var(--font-playfair)]"
          >
            {data.heading}
          </motion.h2>
        </div>
 
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 lg:gap-10"
        >
          {data.cards.map((card, idx) => (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: "0 40px 80px -20px rgba(0,0,0,0.08)" }}
              className="group relative bg-white border border-gray-100/80 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-14 transition-all duration-500 overflow-hidden"
            >
              <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                   {card.iconType && ICONS[card.iconType] ? (
                     <span className="scale-75 sm:scale-100">{ICONS[card.iconType]}</span>
                   ) : (
                     <Check size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                   )}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-gray-950 font-[family-name:var(--font-playfair)]">
                    {card.title}
                  </h3>
                  {card.subtitle && (
                    <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest">{card.subtitle}</p>
                  )}
                </div>
              </div>

              <ul className="space-y-3 sm:space-y-5">
                {card.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 sm:gap-4 text-[14px] sm:text-[17px] text-gray-700 leading-relaxed font-bold"
                  >
                    <span className="mt-1 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                      {data.bulletMarker ? (
                        <span className="text-[10px] sm:text-[12px] font-black">{data.bulletMarker}</span>
                      ) : (
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={4} />
                      )}
                    </span>
                    <span className="group-hover:text-gray-950 transition-colors">{point}</span>
                  </li>
                ))}
              </ul>

              {/* Decorative accent - hide on mobile to save visual weight */}
              <div className="hidden sm:block absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                <Compass size={120} className="text-primary rotate-12" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
