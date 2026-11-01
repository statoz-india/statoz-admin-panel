"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  LEDGER_TYPES,
  XP_SOURCES,
  type TrackerMap,
  type XpLedgerEntry,
} from "@/app/interface/userActivity.interface";
import type { Paginated } from "@/app/interface/pagination.interface";
import ActivitySection from "@/app/users/[id]/ActivitySection";
import {
  AXIS_TICK,
  ChartTooltipBox,
  CREDIT_COLOR,
  DateRangeFilter,
  DEBIT_COLOR,
  EntryTitle,
  enumLabel,
  FilterSelect,
  GRID_STROKE,
  HISTORY_PAGE_SIZE,
  HistoryPager,
  SignedAmount,
  TruncatedNotice,
  type DateRange,
} from "@/app/users/[id]/trackerHistoryUi";
import { formatDate, useUserActivity, withQuery } from "@/app/users/[id]/useUserActivity";

type Props = { userId: string };

/** `YYYY-MM-DD` (an IST day) → "31 Oct 2026". */
function formatDay(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  if (!y || !m || !d) return day;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const formatXp = (xp: number) => `${xp > 0 ? "+" : xp < 0 ? "−" : ""}${Math.abs(xp).toLocaleString()} XP`;

/** The user's net XP per day and every XP change, as they see it in the app. */
export default function UserXpHistory({ userId }: Props) {
  const [range, setRange] = useState<DateRange>({ from: "", to: "" });
  const [page, setPage] = useState(1);
  const [xpType, setXpType] = useState("");
  const [xpSource, setXpSource] = useState("");

  const chart = useUserActivity<TrackerMap>(
    userId,
    withQuery("xp/map", range),
    "Failed to load the XP chart",
  );
  const history = useUserActivity<Paginated<XpLedgerEntry>>(
    userId,
    withQuery("xp", { page, limit: HISTORY_PAGE_SIZE, xpType, xpSource }),
    "Failed to load XP history",
  );

  const days = useMemo(
    () => (chart.data?.points ?? []).map((p) => ({ day: p.x, xp: p.y })),
    [chart.data],
  );
  const entries = history.data?.items ?? [];

  return (
    <div className="space-y-4">
      <ActivitySection
        title="XP per day"
        loading={chart.loading}
        error={chart.error}
        isEmpty={days.length === 0}
        emptyText="No XP changes in this range."
        onRefresh={() => void chart.load()}
        headerExtra={<DateRangeFilter range={range} onChange={setRange} />}
      >
        {chart.data?.truncated && <TruncatedNotice />}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={days} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={GRID_STROKE} vertical={false} />
              <XAxis
                dataKey="day"
                tick={AXIS_TICK}
                tickFormatter={(v) => formatDay(String(v))}
                minTickGap={16}
              />
              <YAxis
                tick={AXIS_TICK}
                width={56}
                allowDecimals={false}
                tickFormatter={(v) => Number(v).toLocaleString()}
              />
              <ReferenceLine y={0} stroke="#52525b" />
              <Tooltip
                cursor={{ fill: "#27272a" }}
                content={({ active, payload }) => {
                  const row = active ? payload?.[0]?.payload : undefined;
                  if (!row) return null;
                  return <ChartTooltipBox title={formatDay(row.day)} value={formatXp(Number(row.xp))} />;
                }}
              />
              <Bar dataKey="xp" maxBarSize={24} isAnimationActive={false}>
                {days.map((d) => (
                  <Cell key={d.day} fill={d.xp < 0 ? DEBIT_COLOR : CREDIT_COLOR} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ActivitySection>

      <ActivitySection
        title="XP history"
        loading={history.loading}
        error={history.error}
        isEmpty={entries.length === 0}
        emptyText={
          xpType || xpSource
            ? "No XP changes match these filters."
            : "This user has no XP history."
        }
        onRefresh={() => void history.load()}
        headerExtra={
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              label="Type"
              value={xpType}
              options={LEDGER_TYPES}
              allLabel="All types"
              onChange={(value) => {
                setXpType(value);
                setPage(1);
              }}
            />
            <FilterSelect
              label="Source"
              value={xpSource}
              options={XP_SOURCES}
              allLabel="All sources"
              onChange={(value) => {
                setXpSource(value);
                setPage(1);
              }}
            />
          </div>
        }
      >
        <div className="overflow-x-auto -mx-2">
          <table className="min-w-full text-left text-sm text-gray-300">
            <thead>
              <tr className="border-b border-zinc-700 text-xs uppercase tracking-wider text-gray-500">
                <th className="py-2 pr-4 font-medium">Date</th>
                <th className="py-2 pr-4 font-medium">Title</th>
                <th className="py-2 pr-4 font-medium">Source</th>
                <th className="py-2 pr-4 font-medium">Counts towards</th>
                <th className="py-2 pr-4 font-medium text-right">XP</th>
                <th className="py-2 pr-4 font-medium text-right">In that scope</th>
                <th className="py-2 pr-0 font-medium text-right">Total XP</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry._id} className="border-b border-zinc-800 align-top">
                  <td className="py-3 pr-4 whitespace-nowrap">{formatDate(entry.date)}</td>
                  <td className="py-3 pr-4">
                    <EntryTitle title={entry.title} description={entry.description} />
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">{enumLabel(entry.xpSource)}</td>
                  <td className="py-3 pr-4">{entry.scopeKey || "—"}</td>
                  <td className="py-3 pr-4 text-right whitespace-nowrap">
                    <SignedAmount type={entry.xpType} value={entry.xp} />
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums">
                    {entry.scopeXP?.toLocaleString() ?? "—"}
                  </td>
                  <td className="py-3 pr-0 text-right tabular-nums">
                    {entry.totalXP?.toLocaleString() ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {history.data && (
          <HistoryPager
            page={history.data.page}
            totalPages={history.data.totalPages}
            total={history.data.total}
            hasMore={history.data.hasMore}
            onPage={setPage}
          />
        )}
      </ActivitySection>
    </div>
  );
}
