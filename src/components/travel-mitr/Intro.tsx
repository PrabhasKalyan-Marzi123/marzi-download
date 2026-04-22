"use client";

import { motion } from "framer-motion";
import { Check, MessageCircle, Phone, AlertCircle, Heart, Sparkles, Zap } from "lucide-react";
import { TRAVEL_MITR_WHATSAPP_URL, TRAVEL_MITR_CALL_URL, TRAVEL_HERO } from "@/data/travelMitr";

export type IntroData = {
  heading: React.ReactNode | {
    type: "masterpiece";
    headline: string;
    accent: string;
    pitfalls: Array<{ text: string; highlight: string; type: "spend" | "compromise" }>;
  };
  cardTitle: string;
  cardSubtitle: string;
  checkpoints: string[];
};

type IntroProps = {
  data: IntroData;
  layout?: "centered" | "split";
};

export default function Intro({ data, layout = "centered" }: IntroProps) {
  const isMasterpiece = typeof data.heading === 'object' && data.heading !== null && 'type' in data.heading && data.heading.type === 'masterpiece';

  const renderHeading = () => {
    if (isMasterpiece) {
      const h = data.heading as any;
      return (
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start lg:items-center justify-between text-left">
          {/* Left Column: Authoritative Editorial Heading */}
          <div className="lg:w-[45%]">
            <div className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-950 leading-[1.05] font-[family-name:var(--font-playfair)]">
              {h.headline.split(h.accent)[0]} <br /> <span className="text-primary italic">{h.accent}</span>
            </div>
          </div>

          {/* Right Column: High-Density Expert Panel */}
          <div className="lg:w-[55%] relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-emerald-50/20 rounded-full blur-[80px] pointer-events-none -z-10" />
            
            <div className="flex flex-col gap-4 sm:gap-6 relative">
              {h.pitfalls.map((pitfall: any, i: number) => (
                <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                   className="relative group bg-white border border-gray-100 p-6 sm:p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] overflow-hidden flex items-center gap-6 sm:gap-10 hover:shadow-[0_32px_80px_rgba(0,0,0,0.06)] transition-all duration-500"
                >
                   {/* Compact Typographic Anchor */}
                   <span className="absolute -bottom-4 right-0 text-[6rem] sm:text-[8rem] font-black text-gray-50/50 font-[family-name:var(--font-playfair)] select-none pointer-events-none group-hover:text-primary/5 transition-colors duration-500 leading-none">
                      0{i + 1}
                   </span>

                   <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${pitfall.type === 'spend' ? 'bg-yellow-50 text-yellow-500' : 'bg-emerald-50 text-emerald-500'} flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                      {pitfall.type === 'spend' ? <AlertCircle size={24} strokeWidth={2.5} /> : <Zap size={24} strokeWidth={2.5} />}
                   </div>
                   
                   <div className="relative z-10 space-y-1">
                     <p className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] ${pitfall.type === 'spend' ? 'text-yellow-500/60' : 'text-emerald-500/60'}`}>
                       {pitfall.type === 'spend' ? 'Value Upgrade' : 'Cost Advantage'}
                     </p>
                     <p className="text-xl sm:text-2xl text-gray-950 font-extrabold leading-tight [text-wrap:balance]">
                       {pitfall.text.split(pitfall.highlight)[0]} <span className={`${pitfall.type === 'spend' ? 'text-yellow-500' : 'text-emerald-500'} italic`}>{pitfall.highlight}</span>
                     </p>
                   </div>
                </motion.div>
              ))}

              {/* Centered Desktop Bridge Badge */}
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 z-30 hidden lg:block">
                 <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
                    className="bg-emerald-500 text-white p-3 rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.3)] border-2 border-white"
                 >
                    <Sparkles size={20} fill="white" />
                 </motion.div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={`text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 leading-tight mx-auto font-[family-name:var(--font-playfair)] [text-wrap:balance] ${layout === "centered" ? "max-w-2xl" : "max-w-none text-left"}`}>
        {data.heading}
      </div>
    );
  };

  return (
    <section className="bg-[#F9FAF9] py-12 sm:py-20 px-5 sm:px-10 lg:px-20 relative overflow-hidden">
      {/* Tightened Mesh Backgrounds */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[30rem] h-[30rem] bg-emerald-100/10 rounded-full blur-[80px] opacity-40" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[25rem] h-[25rem] bg-primary/5 rounded-full blur-[80px] opacity-30" />

      <div className={`${layout === "centered" ? "max-w-4xl" : "max-w-6xl"} mx-auto text-center relative z-10 overflow-visible`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-10 sm:space-y-16"
        >
          <div className="space-y-4 sm:space-y-6">
            {renderHeading()}
          </div>

          {data.cardTitle && (
            <div className="relative mt-12 sm:mt-16">
              <div className="absolute inset-0 bg-emerald-100/10 rounded-[2rem] sm:rounded-[3rem] rotate-1 scale-[1.02] shadow-inner" />

              <div className="relative bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.02)] border border-white/80 space-y-6 sm:space-y-10">
                <div className="space-y-2 sm:space-y-4">
                  <p className="text-lg sm:text-xl text-gray-900 font-bold leading-tight italic font-[family-name:var(--font-playfair)] [text-wrap:balance]">
                    {data.cardTitle}
                  </p>
                  <p className="text-[14px] sm:text-lg text-gray-600 font-medium leading-relaxed [text-wrap:balance]">
                    {data.cardSubtitle}
                  </p>
                </div>
                
                <div className="w-10 h-px bg-emerald-100 mx-auto" />

                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-left">
                  {data.checkpoints.map((item, i) => (
                    <li key={i} className="flex sm:flex-col items-center sm:text-center text-left gap-4 sm:gap-4">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-100">
                        <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={3} />
                      </div>
                      <span className="block text-[14px] sm:text-[16px] text-gray-800 font-bold leading-tight">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center pt-2 sm:pt-6">
            <a
              href={TRAVEL_MITR_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 sm:gap-3 bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg font-bold px-8 py-4 sm:px-10 sm:py-5 rounded-full transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-100"
            >
              <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
              Chat on WhatsApp
            </a>
            <a
              href={TRAVEL_MITR_CALL_URL}
              className="group inline-flex items-center justify-center gap-2 sm:gap-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-base sm:text-lg font-bold px-8 py-4 sm:px-10 sm:py-5 rounded-full transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-100"
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
