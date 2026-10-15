"use client";

import { memo, useMemo, useState } from "react";

/** Rows rendered before the "show all" toggle appears on a long section. */
const ROWS_BEFORE_TRUNCATION = 10;

/** "playByPlay" → "Play by play". */
function humanizeKey(key: string): string {
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isPrimitive(value: unknown): boolean {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

/** A cell that fits on one line — nested shapes collapse to compact JSON. */
function stringifyCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value || "—";
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  try {
    const json = JSON.stringify(value);
    return json.length > 120 ? `${json.slice(0, 117)}…` : json;
  } catch {
    return "[unserialisable]";
  }
}

function CopyJsonButton({ value, label }: { value: unknown; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        try {
          void navigator.clipboard.writeText(JSON.stringify(value, null, 2));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard blocked — nothing useful to say */
        }
      }}
      className="rounded border border-zinc-600 px-2 py-0.5 text-[11px] font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="max-h-72 overflow-auto rounded bg-black/40 p-3 text-[11px] leading-relaxed text-zinc-300">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

/** Flat key/value grid for an object section such as `matchDetails`. */
function ObjectGrid({ value }: { value: Record<string, unknown> }) {
  const entries = Object.entries(value);
  if (entries.length === 0) {
    return <p className="text-sm text-zinc-500">Empty.</p>;
  }

  const flat = entries.filter(([, v]) => isPrimitive(v));
  const nested = entries.filter(([, v]) => !isPrimitive(v));

  return (
    <div className="space-y-3">
      {flat.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-3">
          {flat.map(([key, v]) => (
            <div key={key} className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                {humanizeKey(key)}
              </p>
              <p className="break-words text-sm text-white">
                {stringifyCell(v)}
              </p>
            </div>
          ))}
        </div>
      )}
      {nested.map(([key, v]) => (
        <details key={key} className="rounded border border-zinc-700">
          <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-zinc-300">
            {humanizeKey(key)}
            <span className="ml-2 text-zinc-500">
              {Array.isArray(v) ? `${v.length} items` : "object"}
            </span>
          </summary>
          <div className="px-3 pb-3">
            <JsonBlock value={v} />
          </div>
        </details>
      ))}
    </div>
  );
}

/** Table for an array of objects — timeline, commentary, play-by-play. */
function ObjectTable({ rows }: { rows: Record<string, unknown>[] }) {
  const [showAll, setShowAll] = useState(false);

  const columns = useMemo(() => {
    const seen: string[] = [];
    for (const row of rows.slice(0, 50)) {
      for (const key of Object.keys(row)) {
        if (!seen.includes(key)) seen.push(key);
      }
    }
    return seen;
  }, [rows]);

  const visible = showAll ? rows : rows.slice(0, ROWS_BEFORE_TRUNCATION);

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded border border-zinc-700">
        <table className="w-full min-w-max text-left text-xs">
          <thead className="bg-zinc-900/80 text-zinc-400">
            <tr>
              {columns.map((column) => (
                <th key={column} className="whitespace-nowrap px-3 py-2">
                  {humanizeKey(column)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, index) => (
              <tr key={index} className="border-t border-zinc-800">
                {columns.map((column) => (
                  <td
                    key={column}
                    className="max-w-xs truncate px-3 py-2 text-zinc-200"
                    title={stringifyCell(row[column])}
                  >
                    {stringifyCell(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > ROWS_BEFORE_TRUNCATION && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="text-xs font-medium text-sky-400 hover:text-sky-300"
        >
          {showAll
            ? `Show first ${ROWS_BEFORE_TRUNCATION}`
            : `Show all ${rows.length} rows`}
        </button>
      )}
    </div>
  );
}

function SectionBody({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <p className="text-sm text-zinc-500">Empty.</p>;
    }
    if (value.every(isPlainObject)) {
      return <ObjectTable rows={value as Record<string, unknown>[]} />;
    }
    return <JsonBlock value={value} />;
  }
  if (isPlainObject(value)) return <ObjectGrid value={value} />;
  return <p className="text-sm text-white">{stringifyCell(value)}</p>;
}

function sectionCount(value: unknown): string {
  if (Array.isArray(value)) return `${value.length}`;
  if (isPlainObject(value)) return `${Object.keys(value).length} fields`;
  return "";
}

/**
 * Renders a live summary without knowing its shape.
 *
 * Football, cricket and basketball each send a different set of sections and
 * the projections evolve on the backend, so nothing here is keyed to a
 * particular field — objects become key/value grids, arrays of rows become
 * tables, and anything else falls back to JSON.
 */
function MatchSummaryInspector({
  summary,
}: {
  summary: Record<string, unknown>;
}) {
  const sections = Object.entries(summary ?? {});
  const [openSection, setOpenSection] = useState<string | null>(
    sections[0]?.[0] ?? null,
  );

  if (sections.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        The tick carried an empty summary.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {sections.map(([key, value]) => {
          const count = sectionCount(value);
          const isOpen = openSection === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setOpenSection(isOpen ? null : key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                isOpen
                  ? "bg-white text-black"
                  : "border border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
              }`}
            >
              {humanizeKey(key)}
              {count && <span className="ml-2 opacity-70">{count}</span>}
            </button>
          );
        })}
        <CopyJsonButton value={summary} label="Copy summary JSON" />
      </div>

      {openSection !== null && (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900/60 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h5 className="text-sm font-semibold text-white">
              {humanizeKey(openSection)}
            </h5>
            <CopyJsonButton value={summary[openSection]} label="Copy JSON" />
          </div>
          <SectionBody value={summary[openSection]} />
        </div>
      )}
    </div>
  );
}

// The cards around this tick a relative timestamp every second; the summary
// itself only changes once a minute, so don't rebuild the tables for that.
export default memo(MatchSummaryInspector);
