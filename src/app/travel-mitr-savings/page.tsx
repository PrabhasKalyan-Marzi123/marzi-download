import type { Metadata } from "next";
import MitrNavbar from "@/components/travel-mitr/MitrNavbar";
import TravelHero from "@/components/travel-mitr/TravelHero";
import HelpCards from "@/components/travel-mitr/HelpCards";
import HowItWorks from "@/components/travel-mitr/HowItWorks";
import Reasons from "@/components/travel-mitr/Reasons";
import StillUnsure from "@/components/travel-mitr/StillUnsure";
import MitrFooter from "@/components/travel-mitr/MitrFooter";
import { INQUIRY_SOURCE, TRAVEL_SAVINGS_HERO } from "@/data/travelMitr";

export const metadata: Metadata = {
  title: "Marzi Mitr — Save more on every trip",
  description:
    "Marzi Mitr is a real person who helps you find the best deals on flights, hotels and transport — so you travel well and spend less.",
  robots: { index: false, follow: false },
};

export default function TravelMitrSavingsPage() {
  return (
    <div className="min-h-screen bg-white">
      <MitrNavbar />
      <TravelHero
        headline={TRAVEL_SAVINGS_HERO.headline}
        headlineAccent={TRAVEL_SAVINGS_HERO.headlineAccent}
        description={TRAVEL_SAVINGS_HERO.description}
        source={INQUIRY_SOURCE.SAVINGS}
      />
      <HelpCards />
      <HowItWorks />
      <Reasons />
      <StillUnsure />
      <MitrFooter />
    </div>
  );
}
