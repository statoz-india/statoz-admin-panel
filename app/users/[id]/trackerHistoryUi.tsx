"use client";

import type { LedgerType } from "@/app/interface/userActivity.interface";

/** Pieces shared by the user page's Coins and XP tabs. */

export const HISTORY_PAGE_SIZE = 20;

export const IST = "Asia/Kolkata";
export const AXIS_TICK = { fill: "#a1a1aa", fontSize: 11 };
export const GRID_STROKE = "#27272a";
export const CREDIT_COLOR = "#199e70";
export const DEBIT_COLOR = "#e66767";

/** "ADMIN_GIFT" → "Admin gift". */
export function enumLabel(value: string): string {
  const words = value.toLowerCase().replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function formatDayIST(ms: number): string {
  return new Date(ms).toLocaleDateString("en-IN", {
    timeZone: IST,
    day: "numeric",
    month: "short",
  });
}

export function formatDateTimeIST(ms: number): string {
  return new Date(ms).toLocaleString("en-IN", {
    timeZone: IST,
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const CONTROL_CLASS =
  "rounded-md border border-zinc-600 bg-zinc-950 px-2 py-1.5 text-sm text-white focus:border-cyan-600 focus:outline-none";

export function FilterSelect({
  label,
  value,
  options,
  allLabel,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  allLabel: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-gray-400">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={CONTROL_CLASS}
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {enumLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

export type DateRange = { from: string; to: string };

/** Optional `from` / `to` days for a chart; both empty means all time. */
export function DateRangeFilter({
  range,
  onChange,
}: {
  range: DateRange;
  onChange: (range: DateRange) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
      <label className="flex items-center gap-2">
        From
        <input
          type="date"
          value={range.from}
          max={range.to || undefined}
          onChange={(e) => onChange({ ...range, from: e.target.value })}
          className={CONTROL_CLASS}
        />
      </label>
      <label className="flex items-center gap-2">
        To
        <input
          type="date"
          value={range.to}
          min={range.from || undefined}
          onChange={(e) => onChange({ ...range, to: e.target.value })}
          className={CONTROL_CLASS}
        />
      </label>
      {(range.from || range.to) && (
        <button
          type="button"
          onClick={() => onChange({ from: "", to: "" })}
          className="rounded-md border border-zinc-600 px-2 py-1.5 text-white hover:bg-zinc-800"
        >
          All time
        </button>
      )}
    </div>
  );
}

export function TruncatedNotice() {
  return (
    <p className="mb-3 rounded-md border border-amber-700/60 bg-amber-950/30 px-3 py-2 text-xs text-amber-200">
      This range has more than 1,000 changes, so only the latest 1,000 are
      shown. Pick a shorter range to see all of them.
    </p>
  );
}

/** `+250` in green or `−250` in red; the backend sends the size, the type gives the sign. */
export function SignedAmount({ type, value }: { type: LedgerType; value: number }) {
  const credited = type === "CREDITED";
  return (
    <span
      className={`font-medium tabular-nums ${credited ? "text-green-400" : "text-red-400"}`}
    >
      {credited ? "+" : "−"}
      {Math.abs(value).toLocaleString()}
    </span>
  );
}

export function HistoryPager({
  page,
  totalPages,
  total,
  hasMore,
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  hasMore: boolean;
  onPage: (page: number) => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-400">
      <span>
        Page {page} of {Math.max(totalPages, 1)} · {total.toLocaleString()}{" "}
        {total === 1 ? "entry" : "entries"}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="rounded-md border border-zinc-600 px-3 py-1.5 text-white hover:bg-zinc-800 disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={!hasMore}
          className="rounded-md border border-zinc-600 px-3 py-1.5 text-white hover:bg-zinc-800 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function ChartTooltipBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-lg">
      <p className="text-gray-400">{title}</p>
      <p className="mt-0.5 font-mono text-white">{value}</p>
    </div>
  );
}

/** Title and the backend's description under it. */
export function EntryTitle({ title, description }: { title?: string; description?: string }) {
  return (
    <>
      <p className="text-white">{title || "—"}</p>
      {description ? <p className="mt-0.5 text-xs text-gray-500">{description}</p> : null}
    </>
  );
}
