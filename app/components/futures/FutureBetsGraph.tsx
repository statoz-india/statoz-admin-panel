"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Atom } from "react-loading-indicators";
import type { FutureBet, FutureChoice } from "@/app/models/futures.model";

type FutureBetsGraphProps = {
  futureId: string;
  choices: FutureChoice[];
};

type XMode = "time" | "sequence";

type Series = {
  /** Row key the line reads from (`s0`, `s1`, …). */
  key: string;
  choiceId: string;
  name: string;
  color: string;
  /** Past the 8th choice colors repeat, so the line is dashed to stay distinct. */
  dashed: boolean;
};

type OddsRow = {
  t: number;
  n: number;
  user: string;
  choiceName: string;
  coins: number;
  [seriesKey: string]: number | string | null;
};

const IST = "Asia/Kolkata";
const DAY_MS = 24 * 60 * 60 * 1000;

// Validated categorical palette (dark steps), assigned in fixed choice order.
const CHOICE_COLORS = [
  "#3987e5",
  "#d95926",
  "#199e70",
  "#c98500",
  "#d55181",
  "#008300",
  "#9085e9",
  "#e66767",
];
const MAX_DEFAULT_SERIES = CHOICE_COLORS.length;

const AXIS_TICK = { fill: "#a1a1aa", fontSize: 11 };
const GRID_STROKE = "#27272a";

function formatInIST(ms: number) {
  return new Date(ms).toLocaleString("en-IN", {
    timeZone: IST,
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatTimeTick(ms: number, spanMs: number) {
  return new Date(ms).toLocaleString(
    "en-IN",
    spanMs > 2 * DAY_MS
      ? { timeZone: IST, day: "numeric", month: "short" }
      : { timeZone: IST, hour: "2-digit", minute: "2-digit", hour12: false },
  );
}

function formatOdds(value: number) {
  return `${value.toFixed(2)}%`;
}

function TooltipBox({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle?: string;
  rows: { key: string; label: string; color: string; value: string }[];
}) {
  return (
    <div className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-white">{title}</p>
      {subtitle ? <p className="mt-0.5 text-gray-400">{subtitle}</p> : null}
      <ul className="mt-2 space-y-1">
        {rows.map((r) => (
          <li key={r.key} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-gray-300">
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: r.color }}
              />
              {r.label}
            </span>
            <span className="font-mono text-white">{r.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FutureBetsGraph({
  futureId,
  choices,
}: FutureBetsGraphProps) {
  const [bets, setBets] = useState<FutureBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [xMode, setXMode] = useState<XMode>("time");
  const [hiddenOverride, setHiddenOverride] = useState<Set<string> | null>(
    null,
  );

  const load = useCallback(async () => {
    if (!futureId) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `/api/futures/${encodeURIComponent(futureId)}/future-bets`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      const response = await res.json();

      if (!res.ok || !response?.success) {
        setError(
          (typeof response?.message === "string" && response.message) ||
            (typeof response?.error === "string" && response.error) ||
            "Failed to load future bets",
        );
        setBets([]);
        return;
      }

      setBets(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load future bets");
      setBets([]);
    } finally {
      setLoading(false);
    }
  }, [futureId]);

  useEffect(() => {
    void load();
  }, [load]);

  const sortedBets = useMemo(
    () =>
      bets
        .filter((b) => Number.isFinite(Date.parse(b.submissionTime)))
        .sort(
          (a, b) => Date.parse(a.submissionTime) - Date.parse(b.submissionTime),
        ),
    [bets],
  );

  // One series per choice, in the future's choice order so a choice keeps its
  // color across refreshes. Odds keys missing from `choices` are appended.
  const series = useMemo<Series[]>(() => {
    const ids: string[] = choices.map((c) => c.choiceId);
    const names = new Map(choices.map((c) => [c.choiceId, c.choiceName]));
    for (const bet of sortedBets) {
      if (bet.futureChoiceId?.choiceId && !names.has(bet.futureChoiceId.choiceId)) {
        names.set(bet.futureChoiceId.choiceId, bet.futureChoiceId.choiceName);
      }
      for (const id of Object.keys(bet.choiceOddsAtBetTime ?? {})) {
        if (!ids.includes(id)) ids.push(id);
      }
    }
    return ids.map((choiceId, i) => ({
      key: `s${i}`,
      choiceId,
      name: names.get(choiceId) ?? choiceId,
      color: CHOICE_COLORS[i % CHOICE_COLORS.length],
      dashed: i >= CHOICE_COLORS.length,
    }));
  }, [choices, sortedBets]);

  const rows = useMemo<OddsRow[]>(
    () =>
      sortedBets.map((bet, i) => {
        const row: OddsRow = {
          t: Date.parse(bet.submissionTime),
          n: i + 1,
          user: bet.userId?.userName ?? "—",
          choiceName: bet.futureChoiceId?.choiceName ?? "—",
          coins: bet.coinsBet,
        };
        for (const s of series) {
          const v = bet.choiceOddsAtBetTime?.[s.choiceId];
          row[s.key] = typeof v === "number" && Number.isFinite(v) ? v : null;
        }
        return row;
      }),
    [sortedBets, series],
  );

  const latestOdds = useMemo(() => {
    const last = rows[rows.length - 1];
    return new Map(
      series.map((s) => [
        s.key,
        typeof last?.[s.key] === "number" ? (last[s.key] as number) : null,
      ]),
    );
  }, [rows, series]);

  // With more choices than palette slots, start with the top choices visible.
  const defaultHidden = useMemo(() => {
    if (series.length <= MAX_DEFAULT_SERIES) return new Set<string>();
    const ranked = [...series].sort(
      (a, b) => (latestOdds.get(b.key) ?? -1) - (latestOdds.get(a.key) ?? -1),
    );
    return new Set(ranked.slice(MAX_DEFAULT_SERIES).map((s) => s.key));
  }, [series, latestOdds]);

  const hidden = hiddenOverride ?? defaultHidden;
  const shownSeries = series.filter((s) => !hidden.has(s.key));

  const toggleSeries = (key: string) => {
    const next = new Set(hidden);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setHiddenOverride(next);
  };

  const volume = useMemo(() => {
    const byChoice = new Map<string, { coins: number; bets: number }>();
    for (const bet of sortedBets) {
      const id = bet.futureChoiceId?.choiceId;
      if (!id) continue;
      const entry = byChoice.get(id) ?? { coins: 0, bets: 0 };
      entry.coins += Number.isFinite(bet.coinsBet) ? bet.coinsBet : 0;
      entry.bets += 1;
      byChoice.set(id, entry);
    }
    const totalCoins = [...byChoice.values()].reduce((sum, v) => sum + v.coins, 0);
    const data = series
      .map((s) => ({
        key: s.key,
        name: s.name,
        color: s.color,
        coins: byChoice.get(s.choiceId)?.coins ?? 0,
        bets: byChoice.get(s.choiceId)?.bets ?? 0,
      }))
      .sort((a, b) => b.coins - a.coins);
    return { data, totalCoins };
  }, [sortedBets, series]);

  const uniqueBettors = useMemo(
    () => new Set(sortedBets.map((b) => b.userId?._id).filter(Boolean)).size,
    [sortedBets],
  );

  const firstT = rows[0]?.t ?? 0;
  const lastT = rows[rows.length - 1]?.t ?? 0;
  const spanMs = lastT - firstT;

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Odds movement
          </h2>
          {!loading && !error && rows.length > 0 ? (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {rows.length.toLocaleString()} bet{rows.length !== 1 ? "s" : ""}
              {" · "}
              {volume.totalCoins.toLocaleString()} coins
              {" · "}
              {uniqueBettors.toLocaleString()} bettor
              {uniqueBettors !== 1 ? "s" : ""}
              {" · "}
              {formatInIST(firstT)} → {formatInIST(lastT)}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-md border border-gray-300 p-0.5 dark:border-zinc-600">
            {(
              [
                ["time", "Time"],
                ["sequence", "Bet #"],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setXMode(mode)}
                aria-pressed={xMode === mode}
                className={`rounded px-2.5 py-1 text-xs font-medium ${
                  xMode === mode
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-black hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-black hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Atom color="#5CDFFF" size="small" text="" textColor="" />
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No bets on this future yet.
        </p>
      )}

      {!loading && !error && rows.length > 0 && (
        <>
          <p className="mb-3 text-xs text-gray-500">
            Each choice&apos;s odds right after every bet. Hover for the full
            board at that moment; click a choice below to hide or show it.
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={rows}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                {xMode === "time" ? (
                  <XAxis
                    dataKey="t"
                    type="number"
                    scale="time"
                    domain={["dataMin", "dataMax"]}
                    tick={AXIS_TICK}
                    tickCount={6}
                    minTickGap={24}
                    tickFormatter={(v) => formatTimeTick(Number(v), spanMs)}
                  />
                ) : (
                  <XAxis
                    dataKey="n"
                    type="number"
                    domain={[1, rows.length]}
                    allowDecimals={false}
                    tick={AXIS_TICK}
                    minTickGap={24}
                    tickFormatter={(v) => `#${v}`}
                  />
                )}
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tick={AXIS_TICK}
                  width={48}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  cursor={{ stroke: "#71717a", strokeWidth: 1 }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as OddsRow | undefined;
                    if (!row) return null;
                    const byKey = new Map(series.map((s) => [s.key, s]));
                    const tooltipRows = payload
                      .filter((p) => typeof p.value === "number")
                      .sort((a, b) => Number(b.value) - Number(a.value))
                      .map((p) => {
                        const s = byKey.get(String(p.dataKey));
                        return {
                          key: String(p.dataKey),
                          label: s?.name ?? String(p.name),
                          color: s?.color ?? "#a1a1aa",
                          value: formatOdds(Number(p.value)),
                        };
                      });
                    return (
                      <TooltipBox
                        title={`Bet #${row.n} · ${formatInIST(row.t)}`}
                        subtitle={`${row.user} bet ${row.coins.toLocaleString()} on ${row.choiceName}`}
                        rows={tooltipRows}
                      />
                    );
                  }}
                />
                {shownSeries.map((s) => (
                  <Line
                    key={s.key}
                    type="stepAfter"
                    dataKey={s.key}
                    name={s.name}
                    stroke={s.color}
                    strokeWidth={2}
                    strokeDasharray={s.dashed ? "6 4" : undefined}
                    dot={rows.length === 1 ? { r: 4, strokeWidth: 0, fill: s.color } : false}
                    activeDot={{ r: 4, stroke: "#18181b", strokeWidth: 2 }}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {series.map((s) => {
              const on = !hidden.has(s.key);
              const latest = latestOdds.get(s.key);
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => toggleSeries(s.key)}
                  aria-pressed={on}
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
                      stroke={on ? s.color : "#52525b"}
                      strokeWidth="3"
                      strokeDasharray={s.dashed ? "3 2" : undefined}
                    />
                  </svg>
                  <span className="font-semibold">{s.name}</span>
                  {on && latest != null ? (
                    <span className="font-mono">{formatOdds(latest)}</span>
                  ) : null}
                </button>
              );
            })}
          </div>
          {hiddenOverride ? (
            <button
              type="button"
              onClick={() => setHiddenOverride(null)}
              className="mt-2 text-xs text-gray-500 underline hover:text-gray-300"
            >
              Reset selection
            </button>
          ) : null}

          <h3 className="mb-1 mt-8 text-base font-semibold text-black dark:text-white">
            Coins wagered per choice
          </h3>
          <p className="mb-3 text-xs text-gray-500">
            Total coins bet on each choice across all bets.
          </p>
          <div style={{ height: Math.max(160, volume.data.length * 32 + 24) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={volume.data}
                layout="vertical"
                margin={{ top: 0, right: 64, left: 0, bottom: 0 }}
                barCategoryGap={8}
              >
                <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
                <XAxis
                  type="number"
                  tick={AXIS_TICK}
                  allowDecimals={false}
                  tickFormatter={(v) => Number(v).toLocaleString()}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={AXIS_TICK}
                  width={128}
                  interval={0}
                />
                <Tooltip
                  cursor={{ fill: "#27272a" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload as
                      | (typeof volume.data)[number]
                      | undefined;
                    if (!d) return null;
                    const share =
                      volume.totalCoins > 0
                        ? (d.coins / volume.totalCoins) * 100
                        : 0;
                    return (
                      <TooltipBox
                        title={d.name}
                        rows={[
                          {
                            key: "coins",
                            label: "Coins",
                            color: d.color,
                            value: d.coins.toLocaleString(),
                          },
                          {
                            key: "share",
                            label: "Share",
                            color: d.color,
                            value: formatOdds(share),
                          },
                          {
                            key: "bets",
                            label: "Bets",
                            color: d.color,
                            value: d.bets.toLocaleString(),
                          },
                        ]}
                      />
                    );
                  }}
                />
                <Bar
                  dataKey="coins"
                  barSize={16}
                  radius={[0, 4, 4, 0]}
                  isAnimationActive={false}
                >
                  {volume.data.map((d) => (
                    <Cell key={d.key} fill={d.color} />
                  ))}
                  <LabelList
                    dataKey="coins"
                    position="right"
                    fill="#a1a1aa"
                    fontSize={11}
                    formatter={(v) => Number(v).toLocaleString()}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  );
}
