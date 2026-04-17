import type { Metadata } from "next";
import Script from "next/script";
import MitrNavbar from "@/components/travel-mitr/MitrNavbar";
import TravelHero from "@/components/travel-mitr/TravelHero";
import Intro from "@/components/travel-mitr/Intro";
import HelpCards from "@/components/travel-mitr/HelpCards";
import HowItWorks from "@/components/travel-mitr/HowItWorks";
import Reasons from "@/components/travel-mitr/Reasons";
import StillUnsure from "@/components/travel-mitr/StillUnsure";
import MitrFooter from "@/components/travel-mitr/MitrFooter";
import { INQUIRY_SOURCE, LANDING_CONTENT } from "@/data/travelMitr";

export const metadata: Metadata = {
  title: "Marzi Travel Mitr — Friendly travel guidance for 50+",
  description:
    "Talk to Marzi Travel Mitr — friendly travel guidance for travellers 50+. Get clear answers on bookings, health, safety, and what to expect on the way.",
  openGraph: {
    title: "Marzi Travel Mitr — Friendly travel guidance for 50+",
    description:
      "Talk to Marzi Travel Mitr — friendly travel guidance for travellers 50+. Get clear answers on bookings, health, safety, and what to expect on the way.",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export default function TravelMitrPage() {
  return (
    <div className="min-h-screen bg-white">
      <Script id="meta-pixel-ta" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1972374793664843');fbq('track','PageView');`}
      </Script>
      <noscript>
        <img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=1972374793664843&ev=PageView&noscript=1" alt="" />
      </noscript>
      <MitrNavbar />
      <TravelHero
        headline={LANDING_CONTENT.hero.headline}
        headlineAccent={LANDING_CONTENT.hero.headlineAccent}
        description={LANDING_CONTENT.hero.description}
        source={INQUIRY_SOURCE.LANDING}
      />
      <Intro data={LANDING_CONTENT.intro} />
      <HelpCards data={LANDING_CONTENT.help} />
      <Reasons data={LANDING_CONTENT.reasons} />
      <HowItWorks data={LANDING_CONTENT.how} />
      <StillUnsure data={LANDING_CONTENT.unsure} />
      <MitrFooter />
    </div>
  );
}
