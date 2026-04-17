"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Check, Plane, Bed, HeartPulse, Compass } from "lucide-react";

export type HelpCardData = {
  header: string;
  heading: string;
  subtitle: string;
  bulletMarker?: string;
  cards: Array<{
    title: string;
    subtitle?: string;
    iconType?: string;
    points: string[];
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
    <section className="bg-white py-24 sm:py-32 px-6 sm:px-10 lg:px-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 space-y-4">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block text-primary font-bold tracking-[0.2em] text-xs uppercase bg-primary/5 px-4 py-1.5 rounded-full"
          >
            {data.header}
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 leading-tight max-w-3xl mx-auto font-[family-name:var(--font-playfair)]"
          >
            {data.heading}
          </motion.h2>
        </div>
 
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          {data.cards.map((card, idx) => (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative bg-[#F9F7F5] border border-[#EDE8E4] rounded-[2.5rem] p-10 sm:p-12 transition-all hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:bg-white"
            >
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                   {card.iconType && ICONS[card.iconType] ? (
                     ICONS[card.iconType]
                   ) : (
                     <Check size={24} strokeWidth={2.5} />
                   )}
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-950 font-[family-name:var(--font-playfair)]">
                    {card.title}
                  </h3>
                  {card.subtitle && (
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{card.subtitle}</p>
                  )}
                </div>
              </div>

              <ul className="space-y-5">
                {card.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-4 text-[15px] sm:text-[17px] text-gray-700 leading-relaxed font-bold"
                  >
                    <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      {data.bulletMarker ? (
                        <span className="text-sm font-black">{data.bulletMarker}</span>
                      ) : (
                        <Check size={14} strokeWidth={4} />
                      )}
                    </span>
                    <span className="group-hover:text-gray-950 transition-colors uppercase first-letter:uppercase">{point}</span>
                  </li>
                ))}
              </ul>

              {/* Decorative accent */}
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                <Compass size={120} className="text-primary rotate-12" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
