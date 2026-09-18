"use client";

import { X } from "lucide-react";

/** `+35` / `-10` / `0`, so a signed XP or position delta reads unambiguously. */
export function signed(value: number): string {
  return `${value > 0 ? "+" : ""}${value}`;
}

/** Tailwind text colour for a signed delta: gain green, loss red, zero muted. */
export function deltaClass(value: number): string {
  if (value > 0) return "text-emerald-400";
  if (value < 0) return "text-red-400";
  return "text-gray-400";
}

/** Doubles arrive with arbitrary precision; trim to 2 dp without trailing zeros. */
export function formatDecimal(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

/** Free text straight from the app, which may be empty. */
export function orDash(value?: string | null): string {
  const t = value?.trim();
  return t ? t : "—";
}

export function formatDateTime(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

/** The scrolling overlay + sticky header every game detail modal shares. */
export function DetailModalShell({
  title,
  icon,
  error,
  onClose,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  error?: string | null;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950">
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 p-5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            {icon}
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          {error && (
            <div className="rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function WinBadge({ win }: { win: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
        win
          ? "bg-emerald-600/20 text-emerald-300"
          : "bg-red-900/40 text-red-300"
      }`}
    >
      {win ? "Win" : "Loss"}
    </span>
  );
}

export function Meta({
  label,
  value,
  valueClass = "text-gray-200",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className={`truncate text-sm font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

/** A labelled group of `Meta` tiles. */
export function StatGrid({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {label && (
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        {children}
      </div>
    </div>
  );
}

/** Free-text copy the app sent, rendered as a titled block. */
export function TextBlock({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
        <p className="text-sm text-gray-300">{value}</p>
      </div>
    </div>
  );
}
