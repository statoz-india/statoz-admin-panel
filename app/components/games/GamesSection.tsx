"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Swords,
  Target,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
} from "lucide-react";
import type {
  FootballChessListItem,
  ListGameResultsParams,
  PenaltyShootoutListItem,
  PitchDuelListItem,
} from "@/app/interface/game.interface";
import { gamesApi } from "./games-api";
import FootballChessDetailModal from "./FootballChessDetailModal";
import PenaltyShootoutDetailModal from "./PenaltyShootoutDetailModal";
import PitchDuelDetailModal from "./PitchDuelDetailModal";

type Tab = "penalty" | "pitch" | "footballChess";
const LIMIT = 50;

function formatDate(iso?: string): string {
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

function formatDuration(seconds?: number): string {
  if (!seconds || seconds < 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function GamesSection() {
  const [tab, setTab] = useState<Tab>("penalty");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
          <Swords className="h-6 w-6 text-cyan-400" />
          Games
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Penalty shootouts, pitch duels and football chess played across all
          users.
        </p>
      </div>

      <div className="mb-6 flex gap-2 border-b border-zinc-800">
        <TabButton active={tab === "penalty"} onClick={() => setTab("penalty")}>
          <Target className="h-4 w-4" />
          Penalty shootouts
        </TabButton>
        <TabButton active={tab === "pitch"} onClick={() => setTab("pitch")}>
          <Swords className="h-4 w-4" />
          Pitch duels
        </TabButton>
        <TabButton
          active={tab === "footballChess"}
          onClick={() => setTab("footballChess")}
        >
          <Grid3x3 className="h-4 w-4" />
          Football chess
        </TabButton>
      </div>

      {tab === "penalty" ? (
        <PenaltyTab />
      ) : tab === "pitch" ? (
        <PitchTab />
      ) : (
        <FootballChessTab />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "border-cyan-500 text-white"
          : "border-transparent text-gray-400 hover:text-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Penalty shootouts tab                                               */
/* ------------------------------------------------------------------ */

function PenaltyTab() {
  const [items, setItems] = useState<PenaltyShootoutListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ListGameResultsParams>({});
  const [selected, setSelected] = useState<PenaltyShootoutListItem | null>(
    null,
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await gamesApi.listPenaltyShootouts({
        page,
        limit: LIMIT,
        ...filters,
      });
      setItems(res.items);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load shootouts");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <FilterBar
        total={total}
        loading={loading}
        onApply={(f) => {
          setFilters(f);
          setPage(1);
        }}
        onRefresh={load}
      />

      {error && (
        <div className="mb-6 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingRow label="Loading penalty shootouts…" />
      ) : items && items.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">Opponent</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Rounds</th>
                <th className="px-4 py-3">XP</th>
                <th className="px-4 py-3">Played</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {items.map((r) => (
                <tr
                  key={r._id}
                  onClick={() => setSelected(r)}
                  className="cursor-pointer text-gray-300 hover:bg-zinc-900"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {r.username}
                  </td>
                  <td className="px-4 py-3">{r.opponentUsername}</td>
                  <td className="px-4 py-3 font-semibold text-cyan-300">
                    {r.finalScore}
                  </td>
                  <td className="px-4 py-3">
                    <ResultBadge win={r.isWin} />
                  </td>
                  <td className="px-4 py-3">{r.totalRounds}</td>
                  <td className="px-4 py-3">{r.obtainedXp}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {formatDate(r.playedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyRow label="No penalty shootouts found." />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />

      {selected && (
        <PenaltyShootoutDetailModal
          summary={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pitch duels tab                                                     */
/* ------------------------------------------------------------------ */

function PitchTab() {
  const [items, setItems] = useState<PitchDuelListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ListGameResultsParams>({});
  const [selected, setSelected] = useState<PitchDuelListItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await gamesApi.listPitchDuels({
        page,
        limit: LIMIT,
        ...filters,
      });
      setItems(res.items);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load pitch duels");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <FilterBar
        total={total}
        loading={loading}
        onApply={(f) => {
          setFilters(f);
          setPage(1);
        }}
        onRefresh={load}
      />

      {error && (
        <div className="mb-6 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingRow label="Loading pitch duels…" />
      ) : items && items.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">Opponent</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">XP Δ</th>
                <th className="px-4 py-3">Played</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {items.map((r) => (
                <tr
                  key={r._id}
                  onClick={() => setSelected(r)}
                  className="cursor-pointer text-gray-300 hover:bg-zinc-900"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {r.username}
                  </td>
                  <td className="px-4 py-3">{r.opponentUsername}</td>
                  <td className="px-4 py-3 font-semibold text-cyan-300">
                    {r.userScore} - {r.opponentScore}
                  </td>
                  <td className="px-4 py-3">
                    <ResultBadge win={r.isWin} />
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-400">
                    {r.status}
                  </td>
                  <td className="px-4 py-3">
                    {r.xpDelta > 0 ? "+" : ""}
                    {r.xpDelta}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {formatDate(r.playedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyRow label="No pitch duels found." />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />

      {selected && (
        <PitchDuelDetailModal
          summary={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Football chess tab                                                  */
/* ------------------------------------------------------------------ */

function FootballChessTab() {
  const [items, setItems] = useState<FootballChessListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ListGameResultsParams>({});
  const [selected, setSelected] = useState<FootballChessListItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await gamesApi.listFootballChess({
        page,
        limit: LIMIT,
        ...filters,
      });
      setItems(res.items);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load football chess");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <FilterBar
        total={total}
        loading={loading}
        onApply={(f) => {
          setFilters(f);
          setPage(1);
        }}
        onRefresh={load}
      />

      {error && (
        <div className="mb-6 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingRow label="Loading football chess results…" />
      ) : items && items.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">Opponent</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Formation</th>
                <th className="px-4 py-3">Turns</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">XP Δ</th>
                <th className="px-4 py-3">Played</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {items.map((r) => (
                <tr
                  key={r._id}
                  onClick={() => setSelected(r)}
                  className="cursor-pointer text-gray-300 hover:bg-zinc-900"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {r.username || "—"}
                  </td>
                  <td className="px-4 py-3">{r.opponentUsername || "—"}</td>
                  <td className="px-4 py-3 font-semibold text-cyan-300">
                    {r.userScore} - {r.opponentScore}
                  </td>
                  <td className="px-4 py-3">
                    {r.abandoned ? (
                      <span className="rounded-full bg-amber-900/40 px-2 py-0.5 text-xs font-medium text-amber-300">
                        Abandoned
                      </span>
                    ) : (
                      <ResultBadge win={r.isWin} />
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">
                    {r.formation?.user ?? "—"} v {r.formation?.opponent ?? "—"}
                  </td>
                  <td className="px-4 py-3">{r.totalTurns}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {formatDuration(r.durationSeconds)}
                  </td>
                  <td className="px-4 py-3">
                    {r.xpDelta > 0 ? "+" : ""}
                    {r.xpDelta}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {formatDate(r.playedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyRow label="No football chess results found." />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />

      {selected && (
        <FootballChessDetailModal
          summary={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function FilterBar({
  total,
  loading,
  onApply,
  onRefresh,
}: {
  total: number;
  loading: boolean;
  onApply: (filters: ListGameResultsParams) => void;
  onRefresh: () => void;
}) {
  const [submittedUserId, setSubmittedUserId] = useState("");
  const [opponentId, setOpponentId] = useState("");

  const apply = () =>
    onApply({
      submittedUserId: submittedUserId.trim() || undefined,
      opponentId: opponentId.trim() || undefined,
    });

  const clear = () => {
    setSubmittedUserId("");
    setOpponentId("");
    onApply({});
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <input
        type="text"
        value={submittedUserId}
        onChange={(e) => setSubmittedUserId(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && apply()}
        placeholder="Filter by user ID"
        className={filterClass}
      />
      <input
        type="text"
        value={opponentId}
        onChange={(e) => setOpponentId(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && apply()}
        placeholder="Filter by opponent ID"
        className={filterClass}
      />
      <button
        type="button"
        onClick={apply}
        className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
      >
        Apply
      </button>
      {(submittedUserId || opponentId) && (
        <button
          type="button"
          onClick={clear}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800"
        >
          Clear
        </button>
      )}

      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-gray-500">{total} total</span>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  loading,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={onPrev}
        disabled={page <= 1 || loading}
        className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </button>
      <span className="text-sm text-gray-400">
        Page {page} / {totalPages}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages || loading}
        className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-40"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function ResultBadge({ win }: { win: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        win
          ? "bg-emerald-600/20 text-emerald-300"
          : "bg-red-900/40 text-red-300"
      }`}
    >
      {win ? "Win" : "Loss"}
    </span>
  );
}

function LoadingRow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-20 text-gray-400">
      <Loader2 className="h-5 w-5 animate-spin" />
      {label}
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-800 py-20 text-center">
      <Swords className="mx-auto h-10 w-10 text-zinc-600" />
      <p className="mt-3 text-sm text-gray-400">{label}</p>
    </div>
  );
}

const filterClass =
  "w-52 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none";
