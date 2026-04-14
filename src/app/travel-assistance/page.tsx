import type { Metadata } from "next";
import MitrNavbar from "@/components/travel-mitr/MitrNavbar";
import TravelHero from "@/components/travel-mitr/TravelHero";
import HelpCards from "@/components/travel-mitr/HelpCards";
import HowItWorks from "@/components/travel-mitr/HowItWorks";
import Reasons from "@/components/travel-mitr/Reasons";
import StillUnsure from "@/components/travel-mitr/StillUnsure";
import MitrFooter from "@/components/travel-mitr/MitrFooter";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function TravelMitrPage() {
  return (
    <div className="min-h-screen bg-white">
      <MitrNavbar />
      <TravelHero />
      <HelpCards />
      <HowItWorks />
      <Reasons />
      <StillUnsure />
      <MitrFooter />
    </div>
  );
}
