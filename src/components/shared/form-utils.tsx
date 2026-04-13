"use client";

// ─── Shared form utilities ──────────────────────────────────────
//
// Extracted from MedicineCheckerForm and TripPlannerForm so both
// tools share a single source of truth for styling, error handling,
// and presentational helpers.

// ─── Input class constants ──────────────────────────────────────

export const INPUT =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary";

export const TEXTAREA = `${INPUT} min-h-[80px] resize-y`;

export const INPUT_SM =
  "w-full rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary";

// ─── DRF response helpers ───────────────────────────────────────

/**
 * The backend wraps every response in `{ data, status, status_code }`.
 * Unwrap once at the edge so consuming code gets plain data.
 */
export function unwrap<T = unknown>(body: unknown): T {
  if (body && typeof body === "object" && "data" in (body as Record<string, unknown>)) {
    return (body as { data: T }).data;
  }
  return body as T;
}

/**
 * Pull the first human-readable error out of a DRF error payload.
 * Recurses into nested objects/arrays so errors like
 * `{ items: [{ brand_name: ["msg"] }] }` still surface something useful.
 */
export function extractError(payload: unknown, fallback: string): string {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (Array.isArray(payload)) {
    for (const entry of payload) {
      const msg = extractError(entry, "");
      if (msg) return msg;
    }
    return fallback;
  }
  if (typeof payload === "object") {
    for (const value of Object.values(payload as Record<string, unknown>)) {
      const msg = extractError(value, "");
      if (msg) return msg;
    }
  }
  return fallback;
}

// ─── Presentational components ──────────────────────────────────

export function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </section>
  );
}

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

export function FieldSm({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-0.5 block text-[11px] font-medium text-gray-500">{label}</span>
      {children}
    </label>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 accent-[var(--color-primary)]"
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={INPUT}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
