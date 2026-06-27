"use client";

import { useId } from "react";

/** Generic GET against an admin proxy route; returns the unwrapped `data`. */
export async function fetchAdmin<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.data;
    if (!data || typeof data !== "object") return null;
    return data as T;
  } catch {
    return null;
  }
}

/** YYYY-MM-DD for today in IST (matches the app's display timezone). */
export function istTodayKey(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

export function shortLabel(dayKey: string): string {
  const d = new Date(`${dayKey}T00:00:00`);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export type Bar = { key: string; label: string; count: number };

/** Turn a daily {date,count}[] series into chart bars, labelling today. */
export function buildBars(
  daily: { date: string; count: number }[],
  todayKey: string,
): Bar[] {
  return daily.map((d) => ({
    key: d.date,
    label: d.date === todayKey ? "Today" : shortLabel(d.date),
    count: Number(d.count) || 0,
  }));
}

/** Turn a weekly {weekStart,weekEnd,count}[] series into chart bars. */
export function buildWeeklyBars(
  weekly: { weekStart: string; weekEnd: string; count: number }[],
): Bar[] {
  return weekly.map((w) => ({
    key: w.weekStart,
    label: shortLabel(w.weekStart),
    count: Number(w.count) || 0,
  }));
}

export function StatValue({
  loading,
  value,
}: {
  loading: boolean;
  value: number | null;
}) {
  if (loading) {
    return <div className="h-7 w-12 animate-pulse rounded bg-zinc-700" />;
  }
  return (
    <span className="text-3xl font-bold text-white">
      {value === null ? "—" : value.toLocaleString("en-IN")}
    </span>
  );
}

/** Build a smooth (Catmull-Rom → bezier) SVG path through the given points. */
function smoothLine(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const p = points[0];
    // A flat little segment so a single point still draws something.
    return `M ${p.x - 1} ${p.y} L ${p.x + 1} ${p.y}`;
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/**
 * Gradient area + line chart shared by the onboarding and submission widgets.
 * Renders on a 0–100 viewBox (preserveAspectRatio="none") with the dots and
 * labels overlaid as HTML so they stay crisp and perfectly round.
 */
export function TrendChart({
  bars,
  loading,
}: {
  bars: Bar[];
  loading: boolean;
}) {
  const gid = useId().replace(/[^a-zA-Z0-9]/g, "");

  if (loading) {
    return <div className="h-44 w-full animate-pulse rounded-lg bg-zinc-800" />;
  }
  if (bars.length === 0) {
    return (
      <div className="flex h-44 items-center justify-center text-sm text-gray-500">
        No data
      </div>
    );
  }

  const max = Math.max(1, ...bars.map((b) => b.count));
  const padX = 7; // % inset so edge points/labels aren't clipped
  const topY = 16; // headroom for value labels
  const botY = 90; // baseline

  const points = bars.map((bar, i) => {
    const x =
      bars.length === 1
        ? 50
        : padX + (i / (bars.length - 1)) * (100 - 2 * padX);
    const y = botY - (bar.count / max) * (botY - topY);
    return { x, y, bar };
  });

  const lineD = smoothLine(points);
  const areaD = `${lineD} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`;

  return (
    <div className="select-none">
      <div className="relative h-44">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`fill-${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`line-${gid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>

          {/* faint baseline grid */}
          {[topY, (topY + botY) / 2, botY].map((gy) => (
            <line
              key={gy}
              x1="0"
              x2="100"
              y1={gy}
              y2={gy}
              stroke="#3f3f46"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <path d={areaD} fill={`url(#fill-${gid})`} />
          <path
            d={lineD}
            fill="none"
            stroke={`url(#line-${gid})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* dots + value labels, overlaid as HTML for crisp rendering */}
        {points.map(({ x, y, bar }) => (
          <div
            key={bar.key}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-semibold text-white">
              {bar.count}
            </span>
            <span className="block h-2.5 w-2.5 rounded-full border-2 border-zinc-900 bg-cyan-400 ring-0 ring-cyan-400/40 transition-all group-hover:ring-4" />
          </div>
        ))}
      </div>

      {/* x-axis labels, aligned with the points above */}
      <div className="relative mt-2 h-4">
        {points.map(({ x, bar }) => (
          <span
            key={bar.key}
            className="absolute -translate-x-1/2 text-xs text-gray-400"
            style={{ left: `${x}%` }}
          >
            {bar.label}
          </span>
        ))}
      </div>
    </div>
  );
}
