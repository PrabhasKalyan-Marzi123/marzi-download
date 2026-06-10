"use client";

import Link from "next/link";
import Image from "next/image";
import { LOGO, NAVBAR, PLAY_STORE_URL } from "@/data/content";

export default function MitrNavbar({ showCta = true }: { showCta?: boolean }) {
  return (
    <header className="sticky top-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between h-20">
        <Link href="/travel-assistance" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <Image
            src={LOGO.src}
            alt={LOGO.alt}
            width={85}
            height={34}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {showCta && (
          <nav className="flex items-center">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-bold text-primary hover:bg-primary hover:text-white border border-primary px-4 py-2 rounded-full transition-colors"
            >
              {NAVBAR.ctaText}
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
