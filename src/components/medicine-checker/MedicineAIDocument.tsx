import Image from "next/image";
import { CARRY_STATUS_LABEL, type MedicineAssessmentResponse } from "@/data/medicineChecker";

type Props = { data: MedicineAssessmentResponse };
type AIItem = { brand_name: string; generic_name?: string; form?: string; frequency?: string; trip_supply?: string; active_ingredient?: string; import_status?: string; carry_status?: string; documents_to_carry?: string; quantity_guidance?: string; if_run_out_at_destination?: string; special_notes?: string };
type StatusSummary = { clear?: number; conditional?: number; not_allowed?: number; check_required?: number };
type DestGuidance = { country?: string; import_rules?: string; future_tip?: string };

const STATUS_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  allowed: { bg: "#ecfdf5", text: "#065f46", border: "#6ee7b7" },
  allowed_with_conditions: { bg: "#fffbeb", text: "#92400e", border: "#fcd34d" },
  restricted: { bg: "#fff7ed", text: "#9a3412", border: "#fdba74" },
  not_allowed: { bg: "#fef2f2", text: "#991b1b", border: "#fca5a5" },
  check_required: { bg: "#f9fafb", text: "#4b5563", border: "#d1d5db" },
};

export default function MedicineAIDocument({ data }: Props) {
  const ai = (data.ai_output ?? {}) as { overall_recommendation?: string; important_warnings?: string; status_summary?: StatusSummary; items?: AIItem[]; destination_guidance?: DestGuidance; action_plan?: string[] };
  const aiItems = ai.items ?? [];
  const summary = ai.status_summary ?? {};
  const guidance = ai.destination_guidance ?? {};
  const actions = ai.action_plan ?? [];
  const destination = [data.destination_city, data.destination_country].filter(Boolean).join(", ") || data.destination_country;
  const issued = new Date(data.created).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <>
      <article className="med-report mx-auto my-6 max-w-[820px] bg-white text-gray-900 shadow-md print:my-0 print:shadow-none">

        {/* Header */}
        <div className="px-8 pt-6 pb-4" style={{ borderBottom: "3px solid #821A52" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Medicine Advisory Report</h1>
              <p className="text-[11px] text-gray-500">{issued} · Ref MC-{data.id.toString().padStart(6, "0")}</p>
            </div>
            <Image src="/assets/marzi_crop.png" alt="Marzi" width={100} height={33} className="h-7 w-auto" priority />
          </div>
          <div className="grid grid-cols-[90px_1fr] gap-y-1 gap-x-3 text-[11.5px]">
            <span className="text-gray-400">Destination</span><span className="font-medium">{destination}</span>
            {data.transit_countries && <><span className="text-gray-400">Transit</span><span>{data.transit_countries}</span></>}
            <span className="text-gray-400">Duration</span><span>{data.trip_duration_days} days</span>
            <span className="text-gray-400">Traveller</span><span>{[data.traveler_name, data.traveler_age ? `Age ${data.traveler_age}` : null, "departing from India"].filter(Boolean).join(", ")}</span>
            <span className="text-gray-400">Documents</span><span>{[data.has_valid_prescription && "Prescription", data.has_original_packaging && "Original packaging", data.has_travel_letter && "Travel letter", data.has_pharmacy_bill && "Pharmacy bill"].filter(Boolean).join(", ") || "None"}</span>
          </div>
        </div>

        <div className="px-8 py-5 space-y-5">

          {/* Status badges — inline with color-adjust */}
          <div className="flex gap-5">
            <SBadge n={summary.clear ?? 0} label="Clear to carry" color="#10b981" />
            <SBadge n={summary.conditional ?? 0} label="Conditional" color="#f59e0b" />
            <SBadge n={summary.not_allowed ?? 0} label="Not allowed" color="#ef4444" />
            <SBadge n={summary.check_required ?? 0} label="Needs check" color="#9ca3af" />
          </div>

          {/* Overall */}
          {ai.overall_recommendation && (
            <div className="text-[12px] text-gray-700 leading-relaxed" style={{ borderLeft: "3px solid #821A52", paddingLeft: 12 }}>
              {ai.overall_recommendation}
            </div>
          )}

          {/* Warnings */}
          {ai.important_warnings && (
            <div className="text-[12px] text-red-800 leading-relaxed" style={{ borderLeft: "3px solid #ef4444", paddingLeft: 12, background: "#fef2f2", padding: "8px 12px", borderRadius: 6 }}>
              <strong>⚠ Warning:</strong> {ai.important_warnings}
            </div>
          )}

          {/* Medicines */}
          {aiItems.length > 0 && (
            <div>
              <h2 className="text-sm font-bold mb-3 pb-1" style={{ borderBottom: "2px solid #821A52", color: "#821A52" }}>Medicine Results</h2>
              <div className="space-y-4">
                {aiItems.map((item, i) => {
                  const st = item.carry_status || "check_required";
                  const sc = STATUS_COLOR[st] ?? STATUS_COLOR.check_required;
                  const tags = [item.generic_name, item.form, item.frequency, item.trip_supply].filter(Boolean);
                  return (
                    <div key={i} style={{ pageBreakInside: "avoid" }}>
                      {/* Name bar */}
                      <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-t" style={{ background: "#f3f4f6" }}>
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full text-white text-[10px] font-bold" style={{ background: "#821A52" }}>{i + 1}</span>
                          <span className="text-[14px] font-bold">{item.brand_name}</span>
                        </div>
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border" style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}>
                          {CARRY_STATUS_LABEL[st] ?? st}
                        </span>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex gap-1 px-3 pb-1.5 pt-0.5" style={{ background: "#f3f4f6" }}>
                          {tags.map((t, ti) => <span key={ti} className="text-[9px] text-gray-500 border border-gray-300 rounded-full px-2 py-px bg-white">{t}</span>)}
                        </div>
                      )}
                      {/* Details — compact, no card per field */}
                      <div className="border border-t-0 border-gray-200 rounded-b px-3 py-2.5 space-y-2 text-[11.5px]">
                        {item.active_ingredient && <MF label="Active Ingredient" text={item.active_ingredient} />}
                        {item.import_status && <MF label={`Import status in ${data.destination_country}`} text={item.import_status} />}
                        {item.documents_to_carry && <MF label="Documents to carry" text={item.documents_to_carry} />}
                        {item.quantity_guidance && <MF label="Quantity guidance" text={item.quantity_guidance} />}
                        {item.if_run_out_at_destination && <MF label="If you run out at destination" text={item.if_run_out_at_destination} />}
                        {item.special_notes && <p className="text-[10px] text-gray-500 italic pt-1 border-t border-dashed border-gray-200">{item.special_notes}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Destination guidance */}
          {guidance.import_rules && (
            <div style={{ pageBreakInside: "avoid" }}>
              <h2 className="text-sm font-bold mb-2 pb-1" style={{ borderBottom: "2px solid #821A52", color: "#821A52" }}>
                Destination Guidance — {guidance.country || data.destination_country}
              </h2>
              <p className="text-[11.5px] text-gray-700 leading-relaxed whitespace-pre-line">{guidance.import_rules}</p>
              {guidance.future_tip && <p className="text-[11px] text-gray-500 italic mt-2">{guidance.future_tip}</p>}
            </div>
          )}

          {/* Action plan */}
          {actions.length > 0 && (
            <div style={{ pageBreakInside: "avoid" }}>
              <h2 className="text-sm font-bold mb-2 pb-1" style={{ borderBottom: "2px solid #821A52", color: "#821A52" }}>Before You Travel — Action Plan</h2>
              <ol className="list-decimal pl-4 space-y-1 text-[11.5px] text-gray-700">
                {actions.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
          )}

          {/* Disclaimer */}
          <div className="rounded border-2 p-3 text-[10px] text-gray-600 leading-relaxed" style={{ borderColor: "#821A52", pageBreakInside: "avoid" }}>
            <strong style={{ color: "#821A52" }}>Important — please read</strong><br />
            This document is a travel preparedness advisory only. It is not a legal or medical guarantee.
            Medicine import rules can change without notice. For medicines beyond those assessed — particularly
            controlled substances, sleeping pills, strong pain relief, or cardiac medicines — verify with the
            destination country&apos;s official customs authority or nearest embassy before travel.
            Always consult your doctor before making any changes to your medication.
          </div>
        </div>

        {/* Footer — on screen */}
        <div className="med-footer-screen px-8 py-4" style={{ background: "#821A52", color: "white", borderTop: "2px solid #6b1545" }}>
          <div className="flex justify-between items-start text-[10px]">
            <div>
              <div className="text-[12px] font-bold">MARZI TRAVEL MITR</div>
              <div style={{ opacity: 0.75 }}>Senior-First Journeys for Generation Evergreen</div>
              <div style={{ opacity: 0.9 }}>Travel Assistance Desk — Darshan: 8792237778</div>
              <div style={{ opacity: 0.5 }}>Mon – Sat | 9:00 AM – 6:00 PM</div>
            </div>
            <div className="text-right">
              <div style={{ opacity: 0.5 }}>Advisory use only — not a medical or legal document</div>
              <div className="text-[11px] font-bold mt-1">www.marzi.life</div>
            </div>
          </div>
        </div>
      </article>

      {/* Footer — repeated on every printed page via position:fixed */}
      <div className="med-footer-print" style={{ background: "#821A52", color: "white" }}>
        <div className="flex justify-between items-start text-[10px] px-8 py-3">
          <div>
            <div className="text-[11px] font-bold">MARZI TRAVEL MITR</div>
            <div style={{ opacity: 0.8 }}>Travel Assistance Desk — Darshan: 8792237778 · www.marzi.life</div>
          </div>
          <div className="text-[9px] text-right" style={{ opacity: 0.5 }}>Advisory use only</div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .med-report { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
        .med-footer-print { display: none; }
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { background: #fff !important; }
          .no-print { display: none !important; }
          .med-report { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; padding: 12mm 12mm 60px 12mm !important; }
          .med-footer-screen { display: none !important; }
          .med-footer-print {
            display: block !important;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      ` }} />
    </>
  );
}

function SBadge({ n, label, color }: { n: number; label: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold" style={{ background: color }}>{n}</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  );
}

function MF({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <span className="font-bold text-[10.5px]" style={{ color: "#821A52" }}>{label}</span>
      <p className="text-gray-700 mt-0.5">{text}</p>
    </div>
  );
}
