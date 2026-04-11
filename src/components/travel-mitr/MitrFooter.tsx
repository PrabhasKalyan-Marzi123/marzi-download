"use client";

import Link from "next/link";
import { Instagram, Linkedin, MessageCircle, Phone } from "lucide-react";
import { SOCIAL_LINKS, LEGAL_LINKS, LOGO } from "@/data/content";
import { TRAVEL_MITR_WHATSAPP_URL, TRAVEL_MITR_CALL_URL } from "@/data/travelMitr";

const ICON_MAP = { instagram: Instagram, linkedin: Linkedin } as const;

export default function MitrFooter() {
  return (
    <footer className="bg-marzi-primary text-white pt-16 pb-12 px-6 sm:px-10 lg:px-20 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6 max-w-sm">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <img
                src={LOGO.src}
                alt={LOGO.alt}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-white/90 leading-tight">
              Travel with clarity. Travel with confidence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-12 w-full md:w-auto">
            {/* Contact Section */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">Contact Us</h4>
              <div className="flex flex-col gap-3">
                <a
                  href={TRAVEL_MITR_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm font-medium hover:text-white/80 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <MessageCircle size={16} />
                  </div>
                  Chat on WhatsApp
                </a>
                <a
                  href={TRAVEL_MITR_CALL_URL}
                  className="flex items-center gap-3 text-sm font-medium hover:text-white/80 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                    <Phone size={16} />
                  </div>
                  Call Travel Mitr
                </a>
              </div>
            </div>

            {/* Social and Legal Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">Follow Us</h4>
              <div className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  {SOCIAL_LINKS.map(({ platform, href, label }) => {
                    const Icon = ICON_MAP[platform as keyof typeof ICON_MAP];
                    return (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all"
                        aria-label={label}
                      >
                        <Icon size={16} />
                      </a>
                    );
                  })}
                </div>
                <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                  {LEGAL_LINKS.map(({ label, href }) => (
                    <Link key={label} href={href} target="_blank" className="hover:text-white transition-colors">
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-white/10 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] text-white/30 font-bold uppercase tracking-widest">
          <p>© 2026 Marzi Travel Mitr. A service by Marzi by Primus.</p>
          <div className="flex items-center gap-1 opacity-80">
            <span>Powered by</span>
            <span className="text-white/50">Primus Senior Services Pvt Ltd</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
