"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  COIN_LEDGER_SOURCES,
  LEDGER_TYPES,
  type CoinLedgerEntry,
  type TrackerMap,
} from "@/app/interface/userActivity.interface";
import type { Paginated } from "@/app/interface/pagination.interface";
import ActivitySection from "@/app/users/[id]/ActivitySection";
import {
  AXIS_TICK,
  ChartTooltipBox,
  CREDIT_COLOR,
  DateRangeFilter,
  EntryTitle,
  enumLabel,
  FilterSelect,
  formatDateTimeIST,
  formatDayIST,
  GRID_STROKE,
  HISTORY_PAGE_SIZE,
  HistoryPager,
  SignedAmount,
  TruncatedNotice,
  type DateRange,
} from "@/app/users/[id]/trackerHistoryUi";
import { formatDate, useUserActivity, withQuery } from "@/app/users/[id]/useUserActivity";

type Props = { userId: string };

/** The user's coin balance over time and every coin change, as they see it in the app. */
export default function UserCoinHistory({ userId }: Props) {
  const [range, setRange] = useState<DateRange>({ from: "", to: "" });
  const [page, setPage] = useState(1);
  const [ledgerType, setLedgerType] = useState("");
  const [ledgerSource, setLedgerSource] = useState("");

  const chart = useUserActivity<TrackerMap>(
    userId,
    withQuery("coins/map", range),
    "Failed to load the coin balance chart",
  );
  const history = useUserActivity<Paginated<CoinLedgerEntry>>(
    userId,
    withQuery("coins", { page, limit: HISTORY_PAGE_SIZE, ledgerType, ledgerSource }),
    "Failed to load coin history",
  );

  const points = useMemo(
    () =>
      (chart.data?.points ?? [])
        .map((p) => ({ t: Date.parse(p.x), balance: p.y }))
        .filter((p) => Number.isFinite(p.t)),
    [chart.data],
  );
  const entries = history.data?.items ?? [];

  return (
    <div className="space-y-4">
      <ActivitySection
        title="Coin balance"
        loading={chart.loading}
        error={chart.error}
        isEmpty={points.length === 0}
        emptyText="No coin changes in this range."
        onRefresh={() => void chart.load()}
        headerExtra={<DateRangeFilter range={range} onChange={setRange} />}
      >
        {chart.data?.truncated && <TruncatedNotice />}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={GRID_STROKE} vertical={false} />
              <XAxis
                dataKey="t"
                type="number"
                scale="time"
                domain={["dataMin", "dataMax"]}
                tick={AXIS_TICK}
                tickFormatter={(v) => formatDayIST(Number(v))}
              />
              <YAxis
                tick={AXIS_TICK}
                width={64}
                allowDecimals={false}
                tickFormatter={(v) => Number(v).toLocaleString()}
              />
              <Tooltip
                cursor={{ stroke: "#71717a", strokeWidth: 1 }}
                content={({ active, payload }) => {
                  const row = active ? payload?.[0]?.payload : undefined;
                  if (!row) return null;
                  return (
                    <ChartTooltipBox
                      title={formatDateTimeIST(row.t)}
                      value={`${Number(row.balance).toLocaleString()} coins`}
                    />
                  );
                }}
              />
              <Line
                type="stepAfter"
                dataKey="balance"
                stroke={CREDIT_COLOR}
                strokeWidth={2}
                dot={points.length <= 30}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ActivitySection>

      <ActivitySection
        title="Coin history"
        loading={history.loading}
        error={history.error}
        isEmpty={entries.length === 0}
        emptyText={
          ledgerType || ledgerSource
            ? "No coin changes match these filters."
            : "This user has no coin history."
        }
        onRefresh={() => void history.load()}
        headerExtra={
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              label="Type"
              value={ledgerType}
              options={LEDGER_TYPES}
              allLabel="All types"
              onChange={(value) => {
                setLedgerType(value);
                setPage(1);
              }}
            />
            <FilterSelect
              label="Source"
              value={ledgerSource}
              options={COIN_LEDGER_SOURCES}
              allLabel="All sources"
              onChange={(value) => {
                setLedgerSource(value);
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
                <th className="py-2 pr-4 font-medium text-right">Amount</th>
                <th className="py-2 pr-0 font-medium text-right">Balance after</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry._id} className="border-b border-zinc-800 align-top">
                  <td className="py-3 pr-4 whitespace-nowrap">{formatDate(entry.date)}</td>
                  <td className="py-3 pr-4">
                    <EntryTitle title={entry.title} description={entry.description} />
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">{enumLabel(entry.ledgerSource)}</td>
                  <td className="py-3 pr-4 text-right whitespace-nowrap">
                    <SignedAmount type={entry.ledgerType} value={entry.coins} />
                  </td>
                  <td className="py-3 pr-0 text-right tabular-nums">
                    {entry.totalCoins.toLocaleString()}
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
