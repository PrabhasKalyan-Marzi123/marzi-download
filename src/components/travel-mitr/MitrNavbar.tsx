"use client";

import Link from "next/link";
import Image from "next/image";
import { LOGO, NAVBAR, PLAY_STORE_URL } from "@/data/content";

export default function MitrNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/travel-assistance" className="flex items-center gap-2">
          <Image
            src={LOGO.src}
            alt={LOGO.alt}
            width={80}
            height={32}
            className="h-10 w-auto"
            priority
          />
        </Link>

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
      </div>
    </header>
  );
}
