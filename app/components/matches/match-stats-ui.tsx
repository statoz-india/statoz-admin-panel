"use client";

import { useMemo, useState, type ReactNode } from "react";

/** Render null / empty as an em dash — never invent zeros. */
export function dash(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value.trim() ? value : "—";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return "—";
}

export function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function formatFetchedAt(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function formatLocation(location: unknown): string {
  const loc = asRecord(location);
  if (!loc) return "—";
  const parts = [loc.venue, loc.city, loc.state, loc.country]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "—";
}

export function teamLabel(
  scoreSide: unknown,
  fallback: string,
): { name: string; abbr: string } {
  const side = asRecord(scoreSide);
  const name =
    (typeof side?.team === "string" && side.team) ||
    (typeof side?.name === "string" && side.name) ||
    fallback;
  const abbr =
    (typeof side?.abbreviation === "string" && side.abbreviation) || "";
  return { name, abbr };
}

export function Field({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-0.5 break-words text-sm text-white">{value}</p>
    </div>
  );
}

export function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4">
      <h4 className="mb-3 text-sm font-semibold text-white">{title}</h4>
      {children}
    </div>
  );
}

export function EmptyNote({ text = "Nothing published yet." }: { text?: string }) {
  return <p className="text-sm text-zinc-500">{text}</p>;
}

export function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; hidden?: boolean }[];
  active: string;
  onChange: (id: string) => void;
}) {
  const visible = tabs.filter((tab) => !tab.hidden);
  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? "bg-white text-black"
                : "border border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/** Football `topStats` / cricket & basketball team stats. */
export function ComparisonStatsTable({
  rows,
  homeName,
  awayName,
  mode,
}: {
  rows: unknown[];
  homeName: string;
  awayName: string;
  mode: "share" | "plain";
}) {
  if (rows.length === 0) return <EmptyNote />;

  return (
    <div className="overflow-x-auto rounded border border-zinc-700">
      <table className="w-full min-w-max text-left text-xs">
        <thead className="bg-zinc-900 text-zinc-400">
          <tr>
            <th className="px-3 py-2">Stat</th>
            <th className="px-3 py-2">{homeName}</th>
            <th className="px-3 py-2">{awayName}</th>
            {mode === "share" && <th className="px-3 py-2">Share</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const item = asRecord(row);
            if (!item) return null;
            const available = item.available !== false;
            const label =
              (typeof item.label === "string" && item.label) ||
              (typeof item.name === "string" && item.name) ||
              `Stat ${index + 1}`;

            if (!available) {
              return (
                <tr key={index} className="border-t border-zinc-800">
                  <td className="px-3 py-2 text-zinc-300">{label}</td>
                  <td className="px-3 py-2 text-zinc-500" colSpan={mode === "share" ? 3 : 2}>
                    n/a
                  </td>
                </tr>
              );
            }

            if (mode === "share") {
              const home = asRecord(item.home);
              const away = asRecord(item.away);
              const homeDisplay =
                home?.display ?? home?.value ?? item.home;
              const awayDisplay =
                away?.display ?? away?.value ?? item.away;
              const homeShare =
                typeof home?.share === "number" ? home.share : null;
              const awayShare =
                typeof away?.share === "number" ? away.share : null;
              const higher = item.higher;

              return (
                <tr key={index} className="border-t border-zinc-800">
                  <td className="px-3 py-2 text-zinc-200">{label}</td>
                  <td
                    className={`px-3 py-2 ${
                      higher === "home" ? "font-semibold text-emerald-300" : "text-zinc-300"
                    }`}
                  >
                    {dash(homeDisplay)}
                  </td>
                  <td
                    className={`px-3 py-2 ${
                      higher === "away" ? "font-semibold text-emerald-300" : "text-zinc-300"
                    }`}
                  >
                    {dash(awayDisplay)}
                  </td>
                  <td className="px-3 py-2">
                    {homeShare !== null && awayShare !== null ? (
                      <div className="flex h-2 w-28 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="bg-sky-500"
                          style={{ width: `${homeShare}%` }}
                        />
                        <div
                          className="bg-amber-500"
                          style={{ width: `${awayShare}%` }}
                        />
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            }

            return (
              <tr key={index} className="border-t border-zinc-800">
                <td className="px-3 py-2 text-zinc-200">{label}</td>
                <td
                  className={`px-3 py-2 ${
                    item.higher === "home"
                      ? "font-semibold text-emerald-300"
                      : "text-zinc-300"
                  }`}
                >
                  {dash(item.home)}
                </td>
                <td
                  className={`px-3 py-2 ${
                    item.higher === "away"
                      ? "font-semibold text-emerald-300"
                      : "text-zinc-300"
                  }`}
                >
                  {dash(item.away)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function CappedList({
  total,
  shown,
  onToggle,
  expanded,
  cap,
}: {
  total: number;
  shown: number;
  expanded: boolean;
  cap: number;
  onToggle: () => void;
}) {
  if (total <= cap) return null;
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mt-2 text-xs font-medium text-sky-400 hover:text-sky-300"
    >
      {expanded ? `Show first ${cap}` : `Show all ${total} (showing ${shown})`}
    </button>
  );
}

export function useCappedRows<T>(rows: T[], cap = 40) {
  const [expanded, setExpanded] = useState(false);
  const visible = useMemo(
    () => (expanded ? rows : rows.slice(0, cap)),
    [expanded, rows, cap],
  );
  return {
    visible,
    expanded,
    toggle: () => setExpanded((value) => !value),
    cap,
  };
}

export function JsonDump({ value }: { value: unknown }) {
  const [copied, setCopied] = useState(false);
  return (
    <details className="rounded-lg border border-zinc-700 bg-black/30">
      <summary className="cursor-pointer px-4 py-3 text-xs font-medium text-zinc-400">
        Raw JSON (support)
      </summary>
      <div className="space-y-2 border-t border-zinc-800 px-4 py-3">
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(JSON.stringify(value, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="rounded border border-zinc-600 px-2 py-1 text-[11px] text-zinc-300 hover:bg-zinc-800"
        >
          {copied ? "Copied" : "Copy JSON"}
        </button>
        <pre className="max-h-80 overflow-auto text-[11px] leading-relaxed text-zinc-400">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    </details>
  );
}
