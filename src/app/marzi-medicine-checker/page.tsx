import type { Metadata } from "next";
import MedicineCheckerForm from "@/components/medicine-checker/MedicineCheckerForm";

export const metadata: Metadata = {
  title: "Marzi Medicine Checker",
  description:
    "Internal tool — check medicines a traveller plans to carry and generate a branded guidance document.",
  robots: { index: false, follow: false },
};

export default function MarziMedicineCheckerPage() {
  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <MedicineCheckerForm />
    </div>
  );
}
