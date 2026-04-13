import Image from "next/image";
import {
  LABEL_MAP,
  TRAVEL_MODE_ACTIVITY_LABEL,
  TRIP_PLANNER_CONTACT,
  type TripItineraryResponse,
} from "@/data/tripPlanner";

type Props = { data: TripItineraryResponse };

const DATE_FMT: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
const LONG_DATE: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };

function fmtDate(iso: string, opts = DATE_FMT) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", opts);
}

function addDays(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d;
}

function diffDays(start: string, end: string) {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  return Math.round((e.getTime() - s.getTime()) / 86_400_000) + 1;
}

export default function ItineraryDocument({ data }: Props) {
  const totalDays = diffDays(data.start_date, data.end_date);
  const totalNights = Math.max(totalDays - 1, 0);
  const destination =
    [data.destination_cities, data.destination_country].filter(Boolean).join(", ") ||
    data.destination_country;
  const issuedDate = new Date(data.created).toLocaleDateString("en-IN", LONG_DATE);

  const hasNotes =
    data.needs_visa_assistance ||
    data.needs_travel_insurance ||
    data.needs_airport_transfers ||
    data.medical_conditions ||
    data.special_requests;

  return (
    <>
      <article className="itinerary-doc mx-auto my-6 max-w-[820px] bg-white text-gray-900 shadow-md print:my-0 print:shadow-none">
        {/* ─── Cover header ───────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-primary/95 to-primary text-white px-10 pt-10 pb-8">
          <div className="flex items-start justify-between gap-4">
            <Image
              src="/assets/marzi_crop.png"
              alt="Marzi"
              width={140}
              height={46}
              className="h-9 w-auto brightness-0 invert"
              priority
            />
            <div className="text-right text-[10px] leading-relaxed opacity-80">
              <div>Ref: TP-{data.id.toString().padStart(6, "0")}</div>
              <div>Issued: {issuedDate}</div>
            </div>
          </div>

          <h1 className="mt-6 text-2xl sm:text-3xl font-bold leading-snug">
            {destination}
          </h1>
          <p className="mt-1 text-sm opacity-90">
            {fmtDate(data.start_date)} — {fmtDate(data.end_date)} · {totalDays} day
            {totalDays > 1 ? "s" : ""} / {totalNights} night
            {totalNights !== 1 ? "s" : ""}
          </p>
          <p className="mt-1 text-sm opacity-90">
            Prepared for <strong>{data.traveler_name}</strong>
            {data.number_of_travelers > 1 &&
              ` + ${data.number_of_travelers - 1} traveller${data.number_of_travelers > 2 ? "s" : ""}`}
            {data.traveler_age ? ` · Age ${data.traveler_age}` : ""}
          </p>
        </div>

        <div className="px-10 py-6 space-y-6 text-[13px] leading-relaxed">
          {/* ─── Overview grid ────────────────────────────────── */}
          <section>
            <SectionTitle>Trip overview</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <InfoCard label="Trip type" value={LABEL_MAP[data.trip_type] ?? data.trip_type} />
              <InfoCard label="Budget" value={LABEL_MAP[data.budget_level] ?? data.budget_level} />
              <InfoCard label="Pace" value={LABEL_MAP[data.pace] ?? data.pace} />
              <InfoCard label="Food" value={LABEL_MAP[data.food_preference] ?? data.food_preference} />
              <InfoCard label="Stay" value={LABEL_MAP[data.accommodation_preference] ?? data.accommodation_preference} />
              <InfoCard label="Travel" value={LABEL_MAP[data.travel_mode] ?? data.travel_mode} />
              <InfoCard label="From" value={data.departure_city} />
              {data.interests && (
                <div className="sm:col-span-2">
                  <InfoCard label="Interests" value={data.interests} />
                </div>
              )}
            </div>
          </section>

          {/* ─── Day-by-day ───────────────────────────────────── */}
          <section>
            <SectionTitle>Day-by-day itinerary</SectionTitle>
            <div className="space-y-5">
              {data.days.map((day) => {
                const dayDate = addDays(data.start_date, day.day_number - 1);
                const dateStr = dayDate.toLocaleDateString("en-IN", DATE_FMT);
                const meals = [
                  day.breakfast_included ? "B" : null,
                  day.lunch_included ? "L" : null,
                  day.dinner_included ? "D" : null,
                ].filter(Boolean);

                return (
                  <div
                    key={day.id}
                    className="relative border border-gray-200 rounded-xl p-5 pl-16 print:break-inside-avoid"
                  >
                    {/* Day badge */}
                    <div className="absolute left-4 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                      {day.day_number}
                    </div>

                    {/* Header row */}
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 mb-2">
                      <h3 className="text-sm font-bold text-gray-900">{day.title}</h3>
                      <span className="text-[11px] text-gray-500">{dateStr}</span>
                      {day.location && (
                        <span className="text-[11px] text-primary font-medium">
                          {day.location}
                        </span>
                      )}
                    </div>

                    {/* Start / end points */}
                    {(day.start_point || day.end_point) && (
                      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-gray-600">
                        {day.start_point && (
                          <span>
                            <strong>Start:</strong> {day.start_point}
                          </span>
                        )}
                        {day.start_point && day.end_point && (
                          <span className="text-primary">→</span>
                        )}
                        {day.end_point && (
                          <span>
                            <strong>End:</strong> {day.end_point}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Activities timeline */}
                    {day.activities.length > 0 && (
                      <div className="relative ml-1 border-l-2 border-primary/20 pl-4 space-y-3 mb-3">
                        {day.activities.map((act) => (
                          <div key={act.id}>
                            {/* Travel segment */}
                            {act.travel_mode && (
                              <div className="relative flex items-center gap-1.5 -ml-[17px] mb-2 text-[10px] text-gray-500">
                                <div className="h-3 w-3 rounded-full border-2 border-primary/30 bg-white" />
                                <span className="bg-primary/10 text-primary font-semibold rounded px-1.5 py-0.5">
                                  {TRAVEL_MODE_ACTIVITY_LABEL[act.travel_mode] ?? act.travel_mode}
                                </span>
                                {act.travel_duration && (
                                  <span>· {act.travel_duration}</span>
                                )}
                              </div>
                            )}
                            {/* Activity */}
                            <div className="relative">
                              <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                {act.time && (
                                  <span className="text-[11px] font-semibold text-primary min-w-[60px]">
                                    {act.time}
                                  </span>
                                )}
                                {act.location_url ? (
                                  <a
                                    href={act.location_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[12.5px] font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                                  >
                                    {act.place_name}
                                  </a>
                                ) : (
                                  <span className="text-[12.5px] font-semibold text-gray-900">
                                    {act.place_name}
                                  </span>
                                )}
                                {act.duration && (
                                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                    {act.duration}
                                  </span>
                                )}
                              </div>
                              {act.activity && (
                                <p className="text-[12px] text-gray-600 mt-0.5">
                                  {act.activity}
                                </p>
                              )}
                              {act.notes && (
                                <p className="text-[10.5px] text-gray-500 italic mt-0.5">
                                  {act.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Day notes */}
                    {day.description && (
                      <p className="text-[12px] text-gray-600 italic mb-3 whitespace-pre-line">
                        {day.description}
                      </p>
                    )}

                    {/* Footer row: stay, transport, meals */}
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-gray-600 border-t border-gray-100 pt-2">
                      {day.accommodation && (
                        <span>
                          <strong>Stay:</strong>{" "}
                          {day.accommodation_url ? (
                            <a
                              href={day.accommodation_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline underline-offset-2 hover:text-primary/80"
                            >
                              {day.accommodation}
                            </a>
                          ) : (
                            day.accommodation
                          )}
                        </span>
                      )}
                      {day.transport && (
                        <span>
                          <strong>Transport:</strong> {day.transport}
                        </span>
                      )}
                      {meals.length > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <strong>Meals:</strong>
                          {["B", "L", "D"].map((m) => (
                            <span
                              key={m}
                              className={`inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${
                                meals.includes(m)
                                  ? "bg-primary text-white"
                                  : "bg-gray-200 text-gray-400"
                              }`}
                            >
                              {m}
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ─── Important notes ──────────────────────────────── */}
          {hasNotes && (
            <section>
              <SectionTitle>Important notes</SectionTitle>
              <ul className="list-disc pl-5 space-y-1 text-[12.5px]">
                {data.needs_visa_assistance && (
                  <li><strong>Visa assistance:</strong> Required — team will follow up.</li>
                )}
                {data.needs_travel_insurance && (
                  <li><strong>Travel insurance:</strong> Recommended — please arrange before departure.</li>
                )}
                {data.needs_airport_transfers && (
                  <li><strong>Airport transfers:</strong> Included in the plan.</li>
                )}
                {data.medical_conditions && (
                  <li><strong>Medical:</strong> {data.medical_conditions}</li>
                )}
                {data.special_requests && (
                  <li><strong>Special requests:</strong> {data.special_requests}</li>
                )}
              </ul>
            </section>
          )}

          {/* ─── Disclaimer ──────────────────────────────────── */}
          <p className="text-[10.5px] text-gray-500 leading-snug">
            This itinerary is a suggested plan prepared by Marzi Travel Mitr. Actual
            timings, availability, and pricing are subject to change. Please confirm
            bookings independently. Marzi is not a licensed travel agent and does not
            accept liability for third-party services.
          </p>
        </div>

        {/* ─── Footer ─────────────────────────────────────────── */}
        <footer className="border-t-2 border-primary/60 px-10 py-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-600">
          <div>
            <span className="font-semibold text-primary">Marzi Travel Mitr</span> ·
            Friendly travel guidance for travellers 50+
          </div>
          <div>
            {TRIP_PLANNER_CONTACT.name}: {TRIP_PLANNER_CONTACT.phone} ·{" "}
            {TRIP_PLANNER_CONTACT.website}
          </div>
        </footer>
      </article>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page { size: A4; margin: 12mm; }
              html, body { background: #fff !important; }
              .no-print { display: none !important; }
              .itinerary-doc { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; }
              .itinerary-doc section,
              .itinerary-doc footer { break-inside: avoid; page-break-inside: avoid; }
              .print\\:break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
            }
          `,
        }}
      />
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-3">
      {children}
    </h2>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">{label}</div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}
