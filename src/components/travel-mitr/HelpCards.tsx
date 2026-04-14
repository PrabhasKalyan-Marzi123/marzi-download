"use client";
 
import { motion } from "framer-motion";
import { Check, Plane, Bed, HeartPulse, Compass } from "lucide-react";
import { HELP_CARDS } from "@/data/travelMitr";

type HelpCardData = {
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
  data?: HelpCardData;
};

const ICONS: Record<string, React.ReactNode> = {
  flights: <Plane size={20} strokeWidth={2.5} />,
  hotels: <Bed size={20} strokeWidth={2.5} />,
  health: <HeartPulse size={20} strokeWidth={2.5} />,
  transport: <Compass size={20} strokeWidth={2.5} />,
};

export default function HelpCards({ data = HELP_CARDS }: HelpCardsProps) {
  return (
    <section className="bg-white py-16 sm:py-24 px-6 sm:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-3xl sm:text-4xl font-bold text-gray-900 mb-2 font-[family-name:var(--font-playfair)]"
        >
          {data.heading}
        </motion.h2>
        <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto font-medium">
          {data.subtitle}
        </p>
 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.cards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="bg-[#F8F5F2] border border-[#EDE8E4] rounded-[2rem] p-8 sm:p-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-primary">
                   {card.iconType && ICONS[card.iconType] ? (
                     ICONS[card.iconType]
                   ) : (
                     <Check size={20} strokeWidth={2.5} />
                   )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
                    {card.title}
                  </h3>
                  {card.subtitle && (
                    <p className="text-xs text-gray-500 font-medium">{card.subtitle}</p>
                  )}
                </div>
              </div>
              <ul className="space-y-4">
                {card.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm sm:text-base text-gray-700 leading-relaxed font-medium"
                  >
                    <span className="mt-1 flex-shrink-0 text-orange-400">
                      {data.bulletMarker ? (
                        <span className="text-lg leading-none">{data.bulletMarker}</span>
                      ) : (
                        <Check size={16} strokeWidth={3} />
                      )}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
