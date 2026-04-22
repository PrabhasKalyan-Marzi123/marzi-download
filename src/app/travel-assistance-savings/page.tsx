import type { Metadata } from "next";
import Script from "next/script";
import MitrNavbar from "@/components/travel-mitr/MitrNavbar";
import TravelHero from "@/components/travel-mitr/TravelHero";
import Intro from "@/components/travel-mitr/Intro";
import HelpCards from "@/components/travel-mitr/HelpCards";
import Reasons from "@/components/travel-mitr/Reasons";
import HowItWorks from "@/components/travel-mitr/HowItWorks";
import StillUnsure from "@/components/travel-mitr/StillUnsure";
import MitrFooter from "@/components/travel-mitr/MitrFooter";
import { INQUIRY_SOURCE, SAVINGS_CONTENT } from "@/data/travelMitr";

export const metadata: Metadata = {
  title: "Marzi Mitr — Say goodbye to overpaying for travel",
  description:
    "Marzi Travel Mitr helps you get the best value — without compromising on quality. Exclusively for travellers above 50.",
  openGraph: {
    title: "Marzi Mitr — Say goodbye to overpaying for travel",
    description:
      "Marzi Travel Mitr helps you get the best value — without compromising on quality. Exclusively for travellers above 50.",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export default function TravelMitrSavingsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Script id="meta-pixel-tas" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1972374793664843');fbq('track','PageView');`}
      </Script>
      <noscript>
        <img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=1972374793664843&ev=PageView&noscript=1" alt="" />
      </noscript>
      <MitrNavbar />
      <TravelHero
        headline={SAVINGS_CONTENT.hero.headline}
        headlineAccent={SAVINGS_CONTENT.hero.headlineAccent}
        description={SAVINGS_CONTENT.hero.description}
        source={INQUIRY_SOURCE.SAVINGS}
      />
      <Intro data={SAVINGS_CONTENT.intro} layout="split" />
      <Reasons data={SAVINGS_CONTENT.reasons} />
      <HowItWorks data={SAVINGS_CONTENT.how} />
      <StillUnsure data={SAVINGS_CONTENT.unsure} />
      <MitrFooter />
    </div>
  );
}
