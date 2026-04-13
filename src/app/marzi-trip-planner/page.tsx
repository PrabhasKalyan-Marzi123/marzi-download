import type { Metadata } from "next";
import TripPlannerForm from "@/components/trip-planner/TripPlannerForm";

export const metadata: Metadata = {
  title: "Marzi Trip Planner",
  description:
    "Internal tool — plan a day-wise travel itinerary and generate a branded document for the traveller.",
  robots: { index: false, follow: false },
};

export default function MarziTripPlannerPage() {
  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <TripPlannerForm />
    </div>
  );
}
