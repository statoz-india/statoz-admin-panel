"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  F1ClassificationEntry,
  F1Driver,
  F1GapToLeaderChart,
  F1GridVsFinishEntry,
  F1PaceEvolutionChart,
  F1QualifyingEliminationChart,
  F1RaceSummary,
  F1WeekendPositionTrackChart,
} from "@/app/models/f1-race-stats.model";

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const AXIS_TICK = { fill: "#a1a1aa", fontSize: 11 };
const GRID_STROKE = "#3f3f46";
const FALLBACK_COLOR = "#a1a1aa";
// Stable fallbacks so memoised chart data isn't rebuilt every render.
const NO_STAGES: string[] = [];
const QUAL_SEGMENTS = ["Q1", "Q2", "Q3"];
const NO_ROWS: F1ClassificationEntry[] = [];
const GAIN_COLOR = "#4ade80";
const LOSS_COLOR = "#f87171";

const driverKey = (d: Pick<F1Driver, "id" | "code" | "name">) =>
  `d_${d.id ?? d.code ?? d.name ?? "unknown"}`;
const driverLabel = (d: Pick<F1Driver, "code" | "name">) =>
  d.code ?? d.name ?? "—";
const colorOf = (d: Pick<F1Driver, "teamColor">) =>
  d.teamColor || FALLBACK_COLOR;

/** 82.093 -> `1:22.093` */
function formatLapSeconds(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds)) return "—";
  const minutes = Math.floor(seconds / 60);
  const rest = (seconds - minutes * 60).toFixed(3).padStart(6, "0");
  return minutes > 0 ? `${minutes}:${rest}` : rest;
}

function formatGained(value: number | null | undefined): string {
  if (value == null) return "—";
  return value > 0 ? `+${value}` : String(value);
}

function gainedClass(value: number | null | undefined): string {
  if (value == null || value === 0) return "text-gray-400";
  return value > 0 ? "text-green-400" : "text-red-400";
}

/**
 * Teammates share a team colour, so the second driver of each team in the
 * list is drawn dashed to keep the two lines apart.
 */
function dashedDrivers(drivers: F1Driver[]): Set<string> {
  const seenTeams = new Set<string>();
  const dashed = new Set<string>();
  for (const d of drivers) {
    const team = d.team ?? d.teamColor ?? "";
    if (!team) continue;
    if (seenTeams.has(team)) dashed.add(driverKey(d));
    else seenTeams.add(team);
  }
  return dashed;
}

function ChartCard({
  title,
  meta,
  note,
  children,
}: {
  title: string;
  meta?: React.ReactNode;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-950/60 p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-sky-300">
          {title}
        </h3>
        {meta && (
          <span className="text-xs uppercase tracking-wide text-gray-400">
            {meta}
          </span>
        )}
      </div>
      {children}
      {note && <p className="mt-3 text-xs text-gray-500">{note}</p>}
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return <p className="py-8 text-center text-sm text-gray-500">{message}</p>;
}

type TooltipRow = {
  key: string;
  label: string;
  color: string;
  value: string;
};

function TooltipBox({ title, rows }: { title: string; rows: TooltipRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-white">{title}</p>
      {rows.map((row) => (
        <p key={row.key} className="flex items-center gap-2 text-gray-300">
          <span
            className="inline-block h-2 w-3 rounded-sm"
            style={{ backgroundColor: row.color }}
          />
          <span className="font-medium text-white">{row.label}</span>
          <span className="ml-auto pl-3 font-mono">{row.value}</span>
        </p>
      ))}
    </div>
  );
}

/**
 * Legend that doubles as a filter: click a driver to show or hide their
 * line. Colours follow the driver (their team), never the selection order.
 */
function DriverPicker<D extends F1Driver>({
  drivers,
  selected,
  onToggle,
  onReset,
  valueOf,
  dashed,
}: {
  drivers: D[];
  selected: Set<string>;
  onToggle: (key: string) => void;
  onReset: () => void;
  valueOf?: (d: D) => string | null;
  dashed: Set<string>;
}) {
  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-1.5">
        {drivers.map((d) => {
          const key = driverKey(d);
          const on = selected.has(key);
          const value = valueOf?.(d);
          return (
            <button
              key={key}
              type="button"
              onClick={() => onToggle(key)}
              aria-pressed={on}
              title={`${d.name ?? driverLabel(d)}${d.team ? ` · ${d.team}` : ""}`}
              className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 text-xs transition-colors ${
                on
                  ? "border-zinc-500 bg-zinc-800 text-white"
                  : "border-zinc-800 text-gray-500 hover:text-gray-300"
              }`}
            >
              <svg width="14" height="4" aria-hidden>
                <line
                  x1="0"
                  y1="2"
                  x2="14"
                  y2="2"
                  stroke={on ? colorOf(d) : "#52525b"}
                  strokeWidth="3"
                  strokeDasharray={dashed.has(key) ? "3 2" : undefined}
                />
              </svg>
              <span className="font-semibold">{driverLabel(d)}</span>
              {on && value && <span className="font-mono">{value}</span>}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-2 text-xs text-gray-500 underline hover:text-gray-300"
      >
        Reset selection
      </button>
    </div>
  );
}

function useDriverSelection(defaultKeys: string[]) {
  const [override, setOverride] = useState<Set<string> | null>(null);
  const selected = useMemo(
    () => override ?? new Set(defaultKeys),
    [override, defaultKeys],
  );
  const toggle = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setOverride(next);
  };
  return { selected, toggle, reset: () => setOverride(null) };
}

/** Finishing order, used to pick the default drivers on the line charts. */
function finishRank(classification: F1ClassificationEntry[]) {
  const rank = new Map<string, number>();
  classification.forEach((c, i) => rank.set(driverKey(c), c.position ?? i + 1));
  return (d: F1Driver) => rank.get(driverKey(d)) ?? Number.MAX_SAFE_INTEGER;
}

/* ------------------------------------------------------------------ */
/* Classification                                                      */
/* ------------------------------------------------------------------ */

function Classification({ rows }: { rows: F1ClassificationEntry[] }) {
  if (rows.length === 0) {
    return (
      <ChartCard title="Classification">
        <EmptyChart message="No race result yet." />
      </ChartCard>
    );
  }
  return (
    <ChartCard title="Classification" meta={`${rows.length} classified`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-zinc-700 text-left text-xs uppercase tracking-wide text-gray-400">
              <th className="py-2 pr-2">Pos</th>
              <th className="py-2 pr-2">Driver</th>
              <th className="py-2 pr-2 text-right">Grid</th>
              <th className="py-2 pr-2 text-right">+/-</th>
              <th className="py-2 pr-2 text-right">Time / Gap</th>
              <th className="py-2 pr-2 text-right">Laps</th>
              <th className="py-2 pr-2 text-right">Pits</th>
              <th className="py-2 pr-2 text-right">Fastest</th>
              <th className="py-2 text-right">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={driverKey(r)}
                className={`border-b border-zinc-800 ${
                  i === 0 ? "bg-amber-500/5" : ""
                }`}
              >
                <td
                  className={`py-2 pr-2 font-mono font-semibold ${
                    i === 0
                      ? "text-amber-300"
                      : i < 3
                        ? "text-sky-300"
                        : "text-gray-400"
                  }`}
                >
                  P{r.position ?? i + 1}
                </td>
                <td className="py-2 pr-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-8 w-1 shrink-0 rounded-sm"
                      style={{ backgroundColor: colorOf(r) }}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-white">
                        {r.name ?? driverLabel(r)}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        {r.team ?? "—"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-2 pr-2 text-right font-mono text-gray-300">
                  {r.gridPosition != null ? `P${r.gridPosition}` : "—"}
                </td>
                <td
                  className={`py-2 pr-2 text-right font-mono ${gainedClass(
                    r.positionsGained,
                  )}`}
                >
                  {r.positionsGained ? formatGained(r.positionsGained) : ""}
                </td>
                <td
                  className={`py-2 pr-2 text-right font-mono ${
                    i === 0 ? "text-amber-300" : "text-gray-300"
                  }`}
                >
                  {r.time ?? "—"}
                </td>
                <td className="py-2 pr-2 text-right font-mono text-gray-300">
                  {r.lapsCompleted ?? "—"}
                </td>
                <td className="py-2 pr-2 text-right font-mono text-gray-300">
                  {r.pitStops ?? "—"}
                </td>
                <td className="py-2 pr-2 text-right font-mono text-gray-300">
                  {r.fastestLap ?? "—"}
                </td>
                <td className="py-2 text-right font-mono text-white">
                  {r.points ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* Gap to leader                                                       */
/* ------------------------------------------------------------------ */

function GapToLeader({
  chart,
}: {
  chart: F1GapToLeaderChart | null | undefined;
}) {
  const points = (chart?.points ?? []).filter((p) => p.gapSeconds != null);
  const last = points[points.length - 1];
  const data = points.map((p) => ({ ...p, label: driverLabel(p) }));

  return (
    <ChartCard
      title="Gap to leader"
      meta={
        chart
          ? `${chart.onLeadLap} on the lead lap${
              chart.lapped ? ` · ${chart.lapped} lapped` : ""
            }`
          : undefined
      }
      note="Lead-lap drivers only; lapped cars have no time gap."
    >
      {data.length < 2 ? (
        <EmptyChart message="No race gaps yet." />
      ) : (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="f1GapFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7dd3fc" stopOpacity={0.25} />
                    <stop
                      offset="100%"
                      stopColor="#7dd3fc"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke={GRID_STROKE}
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={AXIS_TICK}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={AXIS_TICK}
                  width={52}
                  tickFormatter={(v: number) => `+${Math.round(v)}s`}
                />
                <Tooltip
                  cursor={{ stroke: "#e4e4e7", strokeDasharray: "4 4" }}
                  content={({ active, payload }) => {
                    const p = active
                      ? (payload?.[0]?.payload as
                          (typeof data)[number] | undefined)
                      : undefined;
                    if (!p) return null;
                    return (
                      <TooltipBox
                        title={`P${p.position ?? "?"} · ${p.name ?? p.label}`}
                        rows={[
                          {
                            key: "gap",
                            label: p.team ?? "",
                            color: colorOf(p),
                            value: p.gap ?? `+${p.gapSeconds}s`,
                          },
                        ]}
                      />
                    );
                  }}
                />
                <Area
                  type="linear"
                  dataKey="gapSeconds"
                  stroke="#7dd3fc"
                  strokeWidth={2}
                  fill="url(#f1GapFill)"
                  dot={false}
                  activeDot={{ r: 5, stroke: "#18181b", strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {last && (
            <p className="mt-2 text-xs text-gray-400">
              Last on the lead lap:{" "}
              <span className="font-semibold text-white">
                {driverLabel(last)}
              </span>{" "}
              <span className="font-mono">{last.gap}</span>
            </p>
          )}
        </>
      )}
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* Multi-driver line chart (position track, pace, qualifying)          */
/* ------------------------------------------------------------------ */

type StageRow = { stage: string } & Record<string, number | string | null>;

function MultiDriverLines<D extends F1Driver>({
  drivers,
  rows,
  defaultKeys,
  yReversed,
  yDomain,
  yTicks,
  formatY,
  formatValue,
  legendValue,
}: {
  drivers: D[];
  rows: StageRow[];
  defaultKeys: string[];
  yReversed?: boolean;
  yDomain: [number | "auto" | "dataMin", number | "auto" | "dataMax"];
  yTicks?: number[];
  formatY: (v: number) => string;
  formatValue: (v: number) => string;
  legendValue?: (d: D) => string | null;
}) {
  const { selected, toggle, reset } = useDriverSelection(defaultKeys);
  const dashed = useMemo(() => dashedDrivers(drivers), [drivers]);
  const byKey = useMemo(
    () => new Map(drivers.map((d) => [driverKey(d), d])),
    [drivers],
  );
  const shown = drivers.filter((d) => selected.has(driverKey(d)));

  return (
    <>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={rows}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              stroke={GRID_STROKE}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis dataKey="stage" tick={AXIS_TICK} />
            <YAxis
              tick={AXIS_TICK}
              width={64}
              reversed={yReversed}
              domain={yDomain}
              ticks={yTicks}
              allowDecimals={!yTicks}
              tickFormatter={formatY}
            />
            <Tooltip
              cursor={{ stroke: "#e4e4e7", strokeDasharray: "4 4" }}
              content={({ active, payload, label }) => {
                if (!active || !payload) return null;
                const tooltipRows = payload
                  .filter((p) => typeof p.value === "number")
                  // Best first: P1 / the fastest lap.
                  .sort((a, b) => Number(a.value) - Number(b.value))
                  .map((p) => {
                    const d = byKey.get(String(p.dataKey));
                    return {
                      key: String(p.dataKey),
                      label: d ? driverLabel(d) : String(p.name),
                      color: d ? colorOf(d) : FALLBACK_COLOR,
                      value: formatValue(Number(p.value)),
                    };
                  });
                return <TooltipBox title={String(label)} rows={tooltipRows} />;
              }}
            />
            {shown.map((d) => {
              const key = driverKey(d);
              return (
                <Line
                  key={key}
                  type="linear"
                  dataKey={key}
                  name={driverLabel(d)}
                  stroke={colorOf(d)}
                  strokeWidth={2}
                  strokeDasharray={dashed.has(key) ? "6 4" : undefined}
                  dot={{ r: 3, strokeWidth: 0, fill: colorOf(d) }}
                  activeDot={{ r: 5, stroke: "#18181b", strokeWidth: 2 }}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <DriverPicker
        drivers={drivers}
        selected={selected}
        onToggle={toggle}
        onReset={reset}
        valueOf={legendValue}
        dashed={dashed}
      />
    </>
  );
}

function WeekendPositionTrack({
  chart,
  rankOf,
}: {
  chart: F1WeekendPositionTrackChart | null | undefined;
  rankOf: (d: F1Driver) => number;
}) {
  const stages = chart?.stages ?? NO_STAGES;
  const drivers = useMemo(
    () => [...(chart?.series ?? [])].sort((a, b) => rankOf(a) - rankOf(b)),
    [chart, rankOf],
  );
  const rows = useMemo<StageRow[]>(
    () =>
      stages.map((stage) => {
        const row: StageRow = { stage };
        for (const d of drivers) {
          row[driverKey(d)] =
            d.positions.find((p) => p.stage === stage)?.position ?? null;
        }
        return row;
      }),
    [stages, drivers],
  );
  const defaultKeys = useMemo(
    () => drivers.slice(0, 5).map(driverKey),
    [drivers],
  );
  const lastStage = stages[stages.length - 1];
  const fieldSize = Math.max(drivers.length, 1);
  const ticks = [1, 5, 10, 15, 20, 25].filter(
    (t) => t <= Math.max(fieldSize, 20),
  );

  const top = drivers[0];
  const topGrid = top?.positions.find((p) => p.stage === "GRID")?.position;
  const topFin = top?.positions.find((p) => p.stage === "FIN")?.position;
  const meta =
    top && topGrid != null && topFin != null && topGrid !== topFin
      ? `${driverLabel(top)} ${formatGained(topGrid - topFin)} from the grid`
      : undefined;

  return (
    <ChartCard
      title="Weekend position track"
      meta={meta}
      note="Position at each stage of the weekend. ESPN publishes no lap-by-lap data for F1, so this tracks the sessions themselves."
    >
      {drivers.length === 0 || stages.length === 0 ? (
        <EmptyChart message="No session results yet." />
      ) : (
        <MultiDriverLines
          drivers={drivers}
          rows={rows}
          defaultKeys={defaultKeys}
          yReversed
          yDomain={[1, Math.max(fieldSize, 20)]}
          yTicks={ticks}
          formatY={(v) => `P${v}`}
          formatValue={(v) => `P${v}`}
          legendValue={(d) => {
            const pos = d.positions.find(
              (p) => p.stage === lastStage,
            )?.position;
            return pos != null ? `P${pos}` : null;
          }}
        />
      )}
    </ChartCard>
  );
}

function PaceEvolution({
  chart,
  rankOf,
}: {
  chart: F1PaceEvolutionChart | null | undefined;
  rankOf: (d: F1Driver) => number;
}) {
  const stages = chart?.stages ?? NO_STAGES;
  const drivers = useMemo(
    () => [...(chart?.series ?? [])].sort((a, b) => rankOf(a) - rankOf(b)),
    [chart, rankOf],
  );
  const rows = useMemo<StageRow[]>(
    () =>
      stages.map((stage) => {
        const row: StageRow = { stage };
        for (const d of drivers) {
          row[driverKey(d)] =
            d.laps.find((l) => l.stage === stage)?.seconds ?? null;
        }
        return row;
      }),
    [stages, drivers],
  );
  const defaultKeys = useMemo(
    () => drivers.slice(0, 4).map(driverKey),
    [drivers],
  );
  const lastStage = stages[stages.length - 1];

  return (
    <ChartCard
      title="Pace evolution"
      meta="Best lap per session"
      note="Each driver's best lap in practice and qualifying. Lower is faster."
    >
      {drivers.length === 0 || stages.length === 0 ? (
        <EmptyChart message="No practice or qualifying laps yet." />
      ) : (
        <MultiDriverLines
          drivers={drivers}
          rows={rows}
          defaultKeys={defaultKeys}
          yDomain={["dataMin", "dataMax"]}
          formatY={formatLapSeconds}
          formatValue={formatLapSeconds}
          legendValue={(d) =>
            d.laps.find((l) => l.stage === lastStage)?.bestLap ?? null
          }
        />
      )}
    </ChartCard>
  );
}

function QualifyingElimination({
  chart,
}: {
  chart: F1QualifyingEliminationChart | null | undefined;
}) {
  const segments = chart?.segments ?? QUAL_SEGMENTS;
  const drivers = useMemo(
    () =>
      [...(chart?.series ?? [])].sort(
        (a, b) =>
          (a.position ?? Number.MAX_SAFE_INTEGER) -
          (b.position ?? Number.MAX_SAFE_INTEGER),
      ),
    [chart],
  );
  const rows = useMemo<StageRow[]>(
    () =>
      segments.map((segment) => {
        const row: StageRow = { stage: segment };
        const field = segment.toLowerCase() as "q1" | "q2" | "q3";
        for (const d of drivers) {
          row[driverKey(d)] = d[field]?.seconds ?? null;
        }
        return row;
      }),
    [segments, drivers],
  );
  const defaultKeys = useMemo(
    () => drivers.slice(0, 6).map(driverKey),
    [drivers],
  );

  const bestTime = (d: (typeof drivers)[number]) =>
    d.q3?.time ?? d.q2?.time ?? d.q1?.time ?? null;

  return (
    <ChartCard
      title="Qualifying elimination"
      meta={
        chart
          ? `${chart.eliminatedInQ1} out in Q1 · ${chart.eliminatedInQ2} in Q2`
          : undefined
      }
      note="A line stops at the segment its driver was knocked out in; the feed records no time beyond the cut."
    >
      {drivers.length === 0 ? (
        <EmptyChart message="No qualifying yet." />
      ) : (
        <MultiDriverLines
          drivers={drivers}
          rows={rows}
          defaultKeys={defaultKeys}
          yDomain={["dataMin", "dataMax"]}
          formatY={formatLapSeconds}
          formatValue={formatLapSeconds}
          legendValue={(d) => {
            const q = drivers.find((x) => driverKey(x) === driverKey(d));
            if (!q) return null;
            const time = bestTime(q);
            return q.eliminatedIn
              ? `${time ?? ""} (out ${q.eliminatedIn})`.trim()
              : time;
          }}
        />
      )}
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* Grid vs finish                                                      */
/* ------------------------------------------------------------------ */

function GridVsFinish({
  entries,
}: {
  entries: F1GridVsFinishEntry[] | null | undefined;
}) {
  const rows = [...(entries ?? [])]
    .filter((e) => e.positionsGained != null)
    .sort(
      (a, b) =>
        (b.positionsGained ?? 0) - (a.positionsGained ?? 0) ||
        (a.finishPosition ?? 99) - (b.finishPosition ?? 99),
    );
  const maxAbs = Math.max(
    1,
    ...rows.map((r) => Math.abs(r.positionsGained ?? 0)),
  );

  return (
    <ChartCard title="Grid vs finish" meta="Positions gained">
      {rows.length === 0 ? (
        <EmptyChart message="No race result yet." />
      ) : (
        <div className="space-y-1">
          {rows.map((r) => {
            const gained = r.positionsGained ?? 0;
            const width = `${(Math.abs(gained) / maxAbs) * 50}%`;
            return (
              <div
                key={driverKey(r)}
                className="group grid grid-cols-[3rem_1fr_2.5rem] items-center gap-2 rounded px-1 text-sm hover:bg-zinc-800/60"
                title={`${r.name ?? driverLabel(r)} · Grid P${r.gridPosition ?? "?"} → Finish P${
                  r.finishPosition ?? "?"
                } (${formatGained(gained)})`}
              >
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <span
                    className="h-4 w-1 rounded-sm"
                    style={{ backgroundColor: colorOf(r) }}
                  />
                  {driverLabel(r)}
                </span>
                <div className="relative h-4">
                  <span className="absolute inset-y-0 left-1/2 w-px bg-zinc-600" />
                  {gained !== 0 && (
                    <span
                      className="absolute inset-y-0.5 rounded-sm"
                      style={{
                        width,
                        backgroundColor: gained > 0 ? GAIN_COLOR : LOSS_COLOR,
                        ...(gained > 0
                          ? {
                              left: "50%",
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                            }
                          : {
                              right: "50%",
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0,
                            }),
                      }}
                    />
                  )}
                </div>
                <span className={`text-right font-mono ${gainedClass(gained)}`}>
                  {formatGained(gained)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* Track                                                               */
/* ------------------------------------------------------------------ */

function TrackDetails({ track }: { track: F1RaceSummary["track"] }) {
  if (!track) return null;
  const facts: [string, React.ReactNode][] = [
    ["Laps", track.laps],
    [
      "Lap length",
      track.lapLengthKm != null ? `${track.lapLengthKm} km` : null,
    ],
    [
      "Race distance",
      track.raceDistanceKm != null ? `${track.raceDistanceKm} km` : null,
    ],
    ["Turns", track.turns],
    ["Direction", track.direction],
    ["Established", track.established],
    [
      "Lap record",
      track.lapRecord?.time
        ? `${track.lapRecord.time} · ${track.lapRecord.driver ?? "?"}${
            track.lapRecord.year ? ` (${track.lapRecord.year})` : ""
          }`
        : null,
    ],
  ];
  const shown = facts.filter(([, v]) => v != null && v !== "");
  if (shown.length === 0) return null;

  return (
    <ChartCard title="Track" meta={track.name ?? undefined}>
      <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        {shown.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-gray-400">{label}</dt>
            <dd className="font-mono text-white">{value}</dd>
          </div>
        ))}
      </dl>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Every chart in the stored race payload. Before and during the weekend most
 * of them are partial or empty, and each says so instead of disappearing.
 */
export default function F1StatsCharts({ summary }: { summary: F1RaceSummary }) {
  const classification = summary.classification ?? NO_ROWS;
  const charts = summary.charts ?? {};
  const rankOf = useMemo(() => finishRank(classification), [classification]);

  return (
    <div className="mt-6 grid gap-4">
      <TrackDetails track={summary.track} />
      <Classification rows={classification} />
      <div className="grid gap-4 lg:grid-cols-2">
        <GapToLeader chart={charts.gapToLeader} />
        <GridVsFinish entries={charts.gridVsFinish} />
      </div>
      <WeekendPositionTrack
        chart={charts.weekendPositionTrack}
        rankOf={rankOf}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <PaceEvolution chart={charts.paceEvolution} rankOf={rankOf} />
        <QualifyingElimination chart={charts.qualifyingElimination} />
      </div>
    </div>
  );
}
