import Image from "next/image";
import {
  CARRY_STATUS_COLOR,
  CARRY_STATUS_LABEL,
  type MedicineAssessmentResponse,
} from "@/data/medicineChecker";

type Props = { data: MedicineAssessmentResponse };

type AIItem = {
  brand_name: string;
  active_ingredient?: string;
  import_status?: string;
  carry_status?: string;
  documents_to_carry?: string;
  quantity_guidance?: string;
  if_run_out_at_destination?: string;
  special_notes?: string;
};

export default function MedicineAIDocument({ data }: Props) {
  const ai = (data.ai_output ?? {}) as {
    overall_recommendation?: string;
    important_warnings?: string;
    items?: AIItem[];
  };
  const aiItems = ai.items ?? [];
  const issued = new Date(data.created).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const destination = [data.destination_city, data.destination_country].filter(Boolean).join(", ") || data.destination_country;

  return (
    <>
      <article className="medicine-ai-doc mx-auto my-6 max-w-[820px] bg-white text-gray-900 shadow-md print:my-0 print:shadow-none">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 border-b-2 border-primary/60 px-10 pt-10 pb-6">
          <div className="flex items-center gap-4">
            <Image src="/assets/marzi_crop.png" alt="Marzi" width={160} height={52} className="h-10 w-auto" priority />
            <div>
              <div className="text-lg font-bold leading-tight">medicine <span className="text-primary">checker</span></div>
              <div className="text-[11px] uppercase tracking-wider text-gray-500">AI-generated assessment</div>
            </div>
          </div>
          <div className="text-right text-[11px] text-gray-500 leading-relaxed">
            <div>Issued: {issued}</div>
            <div>Ref: MC-{data.id.toString().padStart(6, "0")}</div>
          </div>
        </header>

        <div className="px-10 py-6 space-y-6 text-[13px] leading-relaxed">
          {/* Trip details */}
          <section>
            <SectionTitle>Trip &amp; Traveller</SectionTitle>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[12.5px]">
              {data.traveler_name && <DRow label="Traveller" value={data.traveler_name} />}
              <DRow label="Destination" value={destination} />
              <DRow label="Duration" value={`${data.trip_duration_days} day${data.trip_duration_days === 1 ? "" : "s"}`} />
              {data.traveler_age && <DRow label="Age" value={`${data.traveler_age} years`} />}
            </div>
          </section>

          {/* Overall recommendation */}
          {ai.overall_recommendation && (
            <section>
              <SectionTitle>Overall Assessment</SectionTitle>
              <p className="text-[12.5px] text-gray-700">{ai.overall_recommendation}</p>
            </section>
          )}

          {/* Important warnings */}
          {ai.important_warnings && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-red-600 mb-1">Important Warnings</div>
              <p className="text-[12.5px] text-red-800">{ai.important_warnings}</p>
            </div>
          )}

          {/* Medicines */}
          {aiItems.length > 0 && (
            <section>
              <SectionTitle>Medicines Assessed ({aiItems.length})</SectionTitle>
              <div className="space-y-4">
                {aiItems.map((item, i) => {
                  const status = item.carry_status || "check_required";
                  const statusLabel = CARRY_STATUS_LABEL[status] ?? status;
                  const statusColor = CARRY_STATUS_COLOR[status] ?? "text-gray-600 bg-gray-50 border-gray-200";

                  return (
                    <div key={i} className="rounded-lg border border-gray-200 overflow-hidden print:break-inside-avoid">
                      <div className="flex items-start justify-between gap-3 px-4 py-3 bg-white">
                        <div>
                          <span className="text-[11px] font-bold text-gray-400 mr-1.5">{i + 1}.</span>
                          <span className="font-semibold">{item.brand_name}</span>
                        </div>
                        <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 space-y-2 text-[12px]">
                        {item.active_ingredient && <DetailRow label="Active ingredient" value={item.active_ingredient} />}
                        {item.import_status && <DetailRow label="Import status" value={item.import_status} />}
                        {item.documents_to_carry && <DetailRow label="Documents to carry" value={item.documents_to_carry} />}
                        {item.quantity_guidance && <DetailRow label="Quantity guidance" value={item.quantity_guidance} />}
                        {item.if_run_out_at_destination && <DetailRow label="If you run out" value={item.if_run_out_at_destination} />}
                        {item.special_notes && <DetailRow label="Notes" value={item.special_notes} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Disclaimer */}
          <p className="text-[10.5px] text-gray-500 leading-snug">
            This assessment was generated by Marzi AI and is advisory only. Verify import rules with the destination
            country&apos;s customs authority or embassy before travel. Consult your doctor before making changes to medication.
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-2 border-t-2 border-primary/60 px-10 py-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-600">
          <div><span className="font-semibold text-primary">Marzi Travel Mitr</span> · Medicine Checker</div>
          <div>Darshan: 8792237778 · www.marzi.life</div>
        </footer>
      </article>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: A4; margin: 12mm; }
          html, body { background: #fff !important; }
          .no-print { display: none !important; }
          .medicine-ai-doc { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; }
          .medicine-ai-doc section { break-inside: avoid; page-break-inside: avoid; }
          .print\\:break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
        }
      ` }} />
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-2 border-b border-primary/20 pb-1">{children}</h2>;
}

function DRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="min-w-[100px] text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-semibold text-gray-700">{label}: </span>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}
