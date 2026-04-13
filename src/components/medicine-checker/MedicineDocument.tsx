import Image from "next/image";
import {
  CARRY_STATUS_COLOR,
  CARRY_STATUS_LABEL,
  MEDICINE_CHECKER_CONTACT,
  MEDICINE_FORM_LABEL,
  type MedicineAssessmentResponse,
} from "@/data/medicineChecker";

type Props = { data: MedicineAssessmentResponse };

const ISSUED_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "long",
  year: "numeric",
};

export default function MedicineDocument({ data }: Props) {
  const issued = new Date(data.created).toLocaleDateString("en-IN", ISSUED_DATE_FORMAT);
  const destination = [data.destination_city, data.destination_country]
    .filter(Boolean)
    .join(", ") || data.destination_country;

  const hasTeamAssessment =
    data.overall_recommendation ||
    data.additional_documents_needed ||
    data.important_warnings;

  return (
    <>
      <article className="medicine-doc mx-auto my-6 max-w-[820px] bg-white text-gray-900 shadow-md print:my-0 print:shadow-none">
        {/* ─── Header ───────────────────────────────────────────── */}
        <header className="flex items-center justify-between gap-4 border-b-2 border-primary/60 px-10 pt-10 pb-6">
          <div className="flex items-center gap-4">
            <Image
              src="/assets/marzi_crop.png"
              alt="Marzi"
              width={160}
              height={52}
              className="h-10 w-auto"
              priority
            />
            <div>
              <div className="text-lg font-bold leading-tight">
                medicine <span className="text-primary">checker</span>
              </div>
              <div className="text-[11px] uppercase tracking-wider text-gray-500">
                Travel Mitr guidance note
              </div>
            </div>
          </div>
          <div className="text-right text-[11px] text-gray-500 leading-relaxed">
            <div>Issued: {issued}</div>
            <div>Ref: MC-{data.id.toString().padStart(6, "0")}</div>
          </div>
        </header>

        {/* ─── Body ─────────────────────────────────────────────── */}
        <div className="px-10 py-6 space-y-6 text-[13px] leading-relaxed">
          {/* Traveller + trip details */}
          <section>
            <SectionTitle>Trip &amp; traveller details</SectionTitle>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-1">
              {data.traveler_name && (
                <DRow label="Traveller" value={data.traveler_name} />
              )}
              {data.traveler_phone && (
                <DRow label="Phone" value={data.traveler_phone} />
              )}
              <DRow label="Destination" value={destination} />
              <DRow
                label="Duration"
                value={`${data.trip_duration_days} day${data.trip_duration_days === 1 ? "" : "s"}`}
              />
              <DRow label="Transit" value={data.transit_countries || "—"} />
              <DRow
                label="Age"
                value={data.traveler_age ? `${data.traveler_age} years` : "—"}
              />
            </dl>
          </section>

          {/* Medicines — card per item with user input + team assessment */}
          <section>
            <SectionTitle>Medicines reviewed ({data.items.length})</SectionTitle>
            <div className="space-y-4">
              {data.items.map((item, i) => {
                const statusLabel = CARRY_STATUS_LABEL[item.carry_status] ?? item.carry_status;
                const statusColor = CARRY_STATUS_COLOR[item.carry_status] ?? "text-gray-600 bg-gray-50 border-gray-200";
                const userNotes = [
                  item.condition,
                  item.has_prescription ? "Has Rx" : null,
                  item.is_otc_in_india ? "OTC (IN)" : null,
                  item.is_emergency_use ? "Emergency" : null,
                ].filter(Boolean).join(" · ");

                const hasTeamFields =
                  item.carry_status !== "check_required" ||
                  item.prescription_required_for_destination ||
                  item.quantity_limit ||
                  item.special_instructions ||
                  item.customs_declaration_needed ||
                  item.team_notes ||
                  item.active_ingredient ||
                  item.import_status ||
                  item.documents_to_carry ||
                  item.quantity_guidance ||
                  item.if_run_out_at_destination;

                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-gray-200 overflow-hidden print:break-inside-avoid"
                  >
                    {/* User input row */}
                    <div className="px-4 py-3 bg-white">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[11px] font-bold text-gray-400">
                            {i + 1}.
                          </span>
                          <div>
                            <span className="font-semibold">{item.brand_name}</span>
                            {item.generic_name && (
                              <span className="text-[11px] text-gray-500 ml-1.5">
                                ({item.generic_name})
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${statusColor}`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-gray-600">
                        <span>{MEDICINE_FORM_LABEL[item.form] ?? item.form}</span>
                        {item.strength && <span>{item.strength}</span>}
                        {item.quantity && <span>Qty: {item.quantity}</span>}
                        {item.frequency && <span>{item.frequency}</span>}
                      </div>
                      {userNotes && (
                        <div className="mt-1 text-[11px] text-gray-500">{userNotes}</div>
                      )}
                    </div>

                    {/* Team assessment row */}
                    {hasTeamFields && (
                      <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200 space-y-1">
                        {item.active_ingredient && (
                          <TeamLine label="Active ingredient" value={item.active_ingredient} />
                        )}
                        {item.import_status && (
                          <TeamLine label="Import status" value={item.import_status} />
                        )}
                        {item.documents_to_carry && (
                          <TeamLine label="Documents to carry" value={item.documents_to_carry} />
                        )}
                        {item.quantity_guidance && (
                          <TeamLine label="Quantity guidance" value={item.quantity_guidance} />
                        )}
                        {item.if_run_out_at_destination && (
                          <TeamLine label="If you run out at destination" value={item.if_run_out_at_destination} />
                        )}
                        {item.prescription_required_for_destination && (
                          <TeamLine
                            label="Rx required at destination"
                            value="Yes — carry prescription copy"
                          />
                        )}
                        {item.quantity_limit && (
                          <TeamLine label="Quantity limit" value={item.quantity_limit} />
                        )}
                        {item.customs_declaration_needed && (
                          <TeamLine
                            label="Customs declaration"
                            value="Required — declare at arrival"
                          />
                        )}
                        {item.special_instructions && (
                          <TeamLine
                            label="Instructions"
                            value={item.special_instructions}
                          />
                        )}
                        {item.team_notes && (
                          <TeamLine label="Notes" value={item.team_notes} />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Supporting documents */}
          <section>
            <SectionTitle>Supporting documents on hand</SectionTitle>
            <ul className="grid grid-cols-2 gap-y-1">
              <DocLine ok={data.has_valid_prescription} label="Valid doctor prescription(s)" />
              <DocLine ok={data.has_travel_letter} label="Doctor's travel letter" />
              <DocLine ok={data.has_original_packaging} label="Original medicine packaging" />
              <DocLine ok={data.has_pharmacy_bill} label="Pharmacy bill / invoice" />
            </ul>
          </section>

          {/* Team assessment — overall */}
          {hasTeamAssessment && (
            <section>
              <SectionTitle>Team assessment</SectionTitle>
              <div className="space-y-2">
                {data.overall_recommendation && (
                  <AssessmentBlock
                    label="Overall recommendation"
                    value={data.overall_recommendation}
                  />
                )}
                {data.additional_documents_needed && (
                  <AssessmentBlock
                    label="Additional documents needed"
                    value={data.additional_documents_needed}
                  />
                )}
                {data.important_warnings && (
                  <AssessmentBlock
                    label="Important warnings"
                    value={data.important_warnings}
                    warn
                  />
                )}
              </div>
            </section>
          )}

          {/* General guidance */}
          <section>
            <SectionTitle>General travel guidance</SectionTitle>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Carry medicines in your <strong>cabin baggage</strong>, in their original
                packaging wherever possible.
              </li>
              <li>
                Keep prescriptions and the doctor&apos;s travel letter accessible at
                airport security and at destination customs.
              </li>
              <li>
                For liquids, injections and controlled substances, check the destination
                country&apos;s specific import rules before you fly.
              </li>
              <li>
                Carry enough medicine for the full trip plus a{" "}
                <strong>3–5 day buffer</strong> in case of delays.
              </li>
              <li>
                Note the local pharmacy equivalent of each medicine and the nearest 24×7
                pharmacy at your destination.
              </li>
            </ul>
            <p className="mt-3 text-[10.5px] text-gray-500 leading-snug">
              This note is a travel companion summary prepared by Marzi Travel Mitr. It is
              not a medical prescription. Please consult your doctor before making any
              changes to your medication or travel plans.
            </p>
          </section>
        </div>

        {/* ─── Footer ───────────────────────────────────────────── */}
        <footer className="mt-2 border-t-2 border-primary/60 px-10 py-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-600">
          <div>
            <span className="font-semibold text-primary">Marzi Travel Mitr</span> · Friendly
            travel guidance for travellers 50+
          </div>
          <div>
            {MEDICINE_CHECKER_CONTACT.name}: {MEDICINE_CHECKER_CONTACT.phone} ·{" "}
            {MEDICINE_CHECKER_CONTACT.website}
          </div>
        </footer>
      </article>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page { size: A4; margin: 12mm; }
              html, body { background: #ffffff !important; }
              .no-print { display: none !important; }
              .medicine-doc { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; }
              .medicine-doc header,
              .medicine-doc footer,
              .medicine-doc section { break-inside: avoid; page-break-inside: avoid; }
              .print\\:break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
            }
          `,
        }}
      />
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-2">
      {children}
    </h2>
  );
}

function DRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="min-w-[100px] text-gray-500">{label}</dt>
      <dd className="flex-1 font-medium">{value}</dd>
    </div>
  );
}

function DocLine({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span
        aria-hidden
        className={`inline-block h-3 w-3 rounded-sm border ${
          ok ? "bg-primary border-primary" : "border-gray-400 bg-white"
        }`}
      />
      <span className={ok ? "text-gray-900" : "text-gray-500"}>{label}</span>
    </li>
  );
}

function TeamLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-[11px]">
      <span className="font-semibold text-gray-700">{label}:</span>{" "}
      <span className="text-gray-600">{value}</span>
    </div>
  );
}

function AssessmentBlock({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 ${
        warn
          ? "border-red-200 bg-red-50"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <div
        className={`text-[10px] font-semibold uppercase tracking-wider mb-0.5 ${
          warn ? "text-red-600" : "text-gray-500"
        }`}
      >
        {label}
      </div>
      <div className="text-[12.5px] text-gray-800 whitespace-pre-line">{value}</div>
    </div>
  );
}
