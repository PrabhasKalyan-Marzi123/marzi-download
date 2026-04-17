"use client";

import { motion, Variants } from "framer-motion";
import { Check } from "lucide-react";

export type ReasonsData = {
  header: string;
  heading: string;
  items: Array<{
    title: string;
    quote: string;
  }>;
  footer?: string;
};

type ReasonsProps = {
  data: ReasonsData;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export default function Reasons({ data }: ReasonsProps) {
  return (
    <section className="bg-[#FAFAFA] py-24 sm:py-32 px-6 sm:px-10 lg:px-20 relative overflow-hidden">
      {/* Decorative background element - softer transition */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white skew-y-1 translate-y-32" />

      <div className="max-w-6xl mx-auto relative z-10">
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
          {data.items.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
              className="group bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100/50 transition-all flex flex-col gap-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 transform group-hover:scale-110">
                <Check size={32} strokeWidth={2.5} />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-extrabold text-gray-950 font-[family-name:var(--font-playfair)]">
                   {item.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed font-bold group-hover:text-gray-900 transition-colors">
                  {item.quote}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {data.footer && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center mt-24"
          >
            <p className="inline-block px-8 py-3 rounded-full bg-emerald-50 text-emerald-800 text-xl font-extrabold italic font-[family-name:var(--font-playfair)] shadow-inner">
              "{data.footer}"
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
