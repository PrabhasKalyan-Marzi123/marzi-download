import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MomentsWithMarzi from "@/components/MomentsWithMarzi";
import PhotoFan from "@/components/PhotoFan";
import WhatIsMarzi from "@/components/WhatIsMarzi";
import Testimonials from "@/components/Testimonials";
import CtaBanner from "@/components/CtaBanner";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <MomentsWithMarzi />
      <PhotoFan />
      <WhatIsMarzi />
      <Testimonials />
      <CtaBanner />
    </div>
  );
}
