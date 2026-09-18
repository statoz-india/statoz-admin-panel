"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Swords,
  Target,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  Gamepad2,
  Pencil,
  Plus,
  CircleDot,
  Flag,
  Dribbble,
  Volleyball,
  Trophy,
} from "lucide-react";
import type {
  FinalOverListItem,
  FootballChessListItem,
  GrandPrixDashListItem,
  HoopDuelListItem,
  ListGameResultsParams,
  PenaltyShootoutListItem,
  PitchDuelListItem,
  TennisRallyListItem,
} from "@/app/interface/game.interface";
import { HOOP_DUEL_DIFFICULTIES } from "@/app/interface/game.interface";
import type {
  Game,
  GameSection,
} from "@/app/interface/game-catalog.interface";
import { gamesApi } from "./statoz-games-api";
import FinalOverDetailModal from "./FinalOverDetailModal";
import FootballChessDetailModal from "./FootballChessDetailModal";
import GrandPrixDashDetailModal from "./GrandPrixDashDetailModal";
import HoopDuelDetailModal from "./HoopDuelDetailModal";
import TennisRallyDetailModal from "./TennisRallyDetailModal";
import PenaltyShootoutDetailModal from "./PenaltyShootoutDetailModal";
import PitchDuelDetailModal from "./PitchDuelDetailModal";
import GameFormModal from "./GameFormModal";
import GameOrderPanel from "./GameOrderPanel";
import type { GameType } from "@/app/constants/game-type";
import { deltaClass, signed } from "./game-detail-ui";

type Tab =
  | "penalty"
  | "pitch"
  | "footballChess"
  | "finalOver"
  | "grandPrix"
  | "hoopDuel"
  | "tennisRally"
  | "games";
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

/** Username linked to the player's profile; deleted players have no name. */
function UserCell({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) {
  if (!username) return <span className="text-gray-500">—</span>;
  return (
    <Link
      href={`/users/${userId}`}
      // The row itself opens the detail modal, so don't trigger both.
      onClick={(e) => e.stopPropagation()}
      className="font-medium text-white hover:text-cyan-300 hover:underline"
    >
      {username}
    </Link>
  );
}

/** Mongo ObjectId shape, so a typo'd filter never reads as an empty result. */
function isObjectId(value: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

function formatDuration(seconds?: number): string {
  if (!seconds || seconds < 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function StatozGamesSection() {
  const [tab, setTab] = useState<Tab>("games");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
          <Swords className="h-6 w-6 text-cyan-400" />
          Games
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Every game played across all users.
        </p>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto border-b border-zinc-800">
        <TabButton active={tab === "games"} onClick={() => setTab("games")}>
          <Gamepad2 className="h-4 w-4" />
          Games
        </TabButton>
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
        <TabButton
          active={tab === "finalOver"}
          onClick={() => setTab("finalOver")}
        >
          <CircleDot className="h-4 w-4" />
          Final over
        </TabButton>
        <TabButton
          active={tab === "grandPrix"}
          onClick={() => setTab("grandPrix")}
        >
          <Flag className="h-4 w-4" />
          Grand prix dash
        </TabButton>
        <TabButton
          active={tab === "hoopDuel"}
          onClick={() => setTab("hoopDuel")}
        >
          <Dribbble className="h-4 w-4" />
          Hoop duel
        </TabButton>
        <TabButton
          active={tab === "tennisRally"}
          onClick={() => setTab("tennisRally")}
        >
          <Volleyball className="h-4 w-4" />
          Tennis rally
        </TabButton>
      </div>

      {tab === "penalty" ? (
        <PenaltyTab />
      ) : tab === "pitch" ? (
        <PitchTab />
      ) : tab === "footballChess" ? (
        <FootballChessTab />
      ) : tab === "finalOver" ? (
        <FinalOverTab />
      ) : tab === "grandPrix" ? (
        <GrandPrixDashTab />
      ) : tab === "hoopDuel" ? (
        <HoopDuelTab />
      ) : tab === "tennisRally" ? (
        <TennisRallyTab />
      ) : (
        <GamesTab />
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
      className={`-mb-px inline-flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
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
      setError(
        e instanceof Error ? e.message : "Failed to load football chess",
      );
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
/* Final over tab                                                      */
/* ------------------------------------------------------------------ */

function FinalOverTab() {
  const [items, setItems] = useState<FinalOverListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ListGameResultsParams>({});
  const [selected, setSelected] = useState<FinalOverListItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await gamesApi.listFinalOver({
        page,
        limit: LIMIT,
        ...filters,
      });
      setItems(res.items);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load final over");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      {/* Single-player game, so there is no opponent to filter on. */}
      <FilterBar
        total={total}
        loading={loading}
        showOpponent={false}
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
        <LoadingRow label="Loading final over results…" />
      ) : items && items.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">Chase</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Wickets</th>
                <th className="px-4 py-3">6s / 4s</th>
                <th className="px-4 py-3">Balls</th>
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
                  <td className="px-4 py-3 font-semibold text-cyan-300">
                    {r.scored} / {r.chasing}
                  </td>
                  <td className="px-4 py-3">
                    <ResultBadge win={r.isWin} />
                  </td>
                  <td className="px-4 py-3">{r.wicketLost}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {r.sixes} / {r.fours}
                  </td>
                  <td className="px-4 py-3">{r.ballsPlayed}</td>
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
        <EmptyRow label="No final over results found." />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />

      {selected && (
        <FinalOverDetailModal
          summary={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Grand prix dash tab                                                 */
/* ------------------------------------------------------------------ */

function GrandPrixDashTab() {
  const [items, setItems] = useState<GrandPrixDashListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ListGameResultsParams>({});
  const [selected, setSelected] = useState<GrandPrixDashListItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await gamesApi.listGrandPrixDash({
        page,
        limit: LIMIT,
        ...filters,
      });
      setItems(res.items);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to load grand prix dash",
      );
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
        showOpponent={false}
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
        <LoadingRow label="Loading grand prix dash results…" />
      ) : items && items.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Played</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Finish</th>
                <th className="px-4 py-3">Gained</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {items.map((r) => (
                <tr
                  key={r._id}
                  onClick={() => setSelected(r)}
                  className="cursor-pointer text-gray-300 hover:bg-zinc-900"
                >
                  <td className="px-4 py-3 text-gray-400">
                    {formatDate(r.playedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <UserCell userId={r.submittedUserId} username={r.username} />
                  </td>
                  <td className="px-4 py-3 font-semibold text-cyan-300">
                    P{r.finishingPosition}{" "}
                    <span className="text-gray-500">/ {r.totalCars}</span>
                  </td>
                  <td className={`px-4 py-3 font-medium ${deltaClass(r.positionsGained)}`}>
                    {signed(r.positionsGained)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">
                    {r.raceTime?.trim() || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 capitalize text-gray-300">
                      {r.isWin && <Trophy className="h-3.5 w-3.5 text-amber-400" />}
                      {r.finalStatus?.trim() || "—"}
                    </span>
                  </td>
                  <td className={`px-4 py-3 ${deltaClass(r.xpDelta)}`}>
                    {signed(r.xpDelta)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyRow label="No grand prix dash results found." />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />

      {selected && (
        <GrandPrixDashDetailModal
          summary={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hoop duel tab                                                       */
/* ------------------------------------------------------------------ */

function HoopDuelTab() {
  const [items, setItems] = useState<HoopDuelListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ListGameResultsParams>({});
  const [selected, setSelected] = useState<HoopDuelListItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await gamesApi.listHoopDuel({
        page,
        limit: LIMIT,
        ...filters,
      });
      setItems(res.items);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load hoop duel");
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
        showOpponent={false}
        difficulties={HOOP_DUEL_DIFFICULTIES}
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
        <LoadingRow label="Loading hoop duel results…" />
      ) : items && items.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Played</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {items.map((r) => (
                <tr
                  key={r._id}
                  onClick={() => setSelected(r)}
                  className="cursor-pointer text-gray-300 hover:bg-zinc-900"
                >
                  <td className="px-4 py-3 text-gray-400">
                    {formatDate(r.playedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <UserCell userId={r.submittedUserId} username={r.username} />
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-400">
                    {r.difficulty?.trim() || "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-cyan-300">
                    {r.finalYourScore} – {r.finalOpponentScore}
                  </td>
                  <td className="px-4 py-3">
                    {/* `status` is the app's own wording for the same outcome. */}
                    <span title={r.status || undefined}>
                      <ResultBadge win={r.isWin} />
                    </span>
                  </td>
                  <td className={`px-4 py-3 ${deltaClass(r.xpDelta)}`}>
                    {signed(r.xpDelta)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyRow label="No hoop duel results found." />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />

      {selected && (
        <HoopDuelDetailModal
          summary={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tennis rally tab                                                    */
/* ------------------------------------------------------------------ */

function TennisRallyTab() {
  const [items, setItems] = useState<TennisRallyListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ListGameResultsParams>({});
  const [selected, setSelected] = useState<TennisRallyListItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await gamesApi.listTennisRally({
        page,
        limit: LIMIT,
        ...filters,
      });
      setItems(res.items);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tennis rally");
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
        showOpponent={false}
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
        <LoadingRow label="Loading tennis rally results…" />
      ) : items && items.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Played</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {items.map((r) => (
                <tr
                  key={r._id}
                  onClick={() => setSelected(r)}
                  className="cursor-pointer text-gray-300 hover:bg-zinc-900"
                >
                  <td className="px-4 py-3 text-gray-400">
                    {formatDate(r.playedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <UserCell userId={r.submittedUserId} username={r.username} />
                  </td>
                  <td className="px-4 py-3 font-semibold text-cyan-300">
                    {r.finalYourScore} – {r.finalOpponentScore}
                  </td>
                  <td className="px-4 py-3">
                    {/* `status` is the app's own wording for the same outcome. */}
                    <span title={r.status || undefined}>
                      <ResultBadge win={r.isWin} />
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {r.grade?.trim() || "—"}
                  </td>
                  <td className={`px-4 py-3 ${deltaClass(r.xpDelta)}`}>
                    {signed(r.xpDelta)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyRow label="No tennis rally results found." />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />

      {selected && (
        <TennisRallyDetailModal
          summary={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Games catalog tab                                                   */
/* ------------------------------------------------------------------ */

function GamesTab() {
  /** One section per sport, games already in display order. */
  const [sections, setSections] = useState<GameSection[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  /** "all" shows the table; a game type shows that type's order editor. */
  const [typeFilter, setTypeFilter] = useState<"all" | GameType>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await gamesApi.listGames();
      setSections(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load games");
    } finally {
      setLoading(false);
    }
  }, []);

  /** Every game, sport by sport, each sport in its display order. */
  const items = useMemo(
    () => sections?.flatMap((s) => s.games ?? []) ?? null,
    [sections],
  );

  // The section's own array, so the order editor only resets when the data
  // really changes.
  const gamesOfType = useMemo(
    () =>
      typeFilter === "all"
        ? []
        : (sections?.find((s) => s.gameType === typeFilter)?.games ?? []),
    [sections, typeFilter],
  );

  const handleOrderSaved = useCallback(
    (updated: Game[]) => {
      // An order always has at least one game; an empty reply means no data.
      if (updated.length === 0) return;
      setSections(
        (current) =>
          current?.map((s) =>
            s.gameType === typeFilter ? { ...s, games: updated } : s,
          ) ?? null,
      );
    },
    [typeFilter],
  );

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
        >
          <Plus className="h-4 w-4" />
          Create game
        </button>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {items?.length ?? 0} total
          </span>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {(
          ["all", ...(sections ?? []).map((s) => s.gameType)] as (
            | "all"
            | GameType
          )[]
        ).map((type) => {
          const count =
            type === "all"
              ? (items?.length ?? 0)
              : (sections?.find((s) => s.gameType === type)?.games.length ??
                0);
          return (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={`rounded-full px-3 py-1 text-sm capitalize transition-colors ${
                typeFilter === type
                  ? "bg-cyan-600 text-white"
                  : "border border-zinc-700 text-gray-300 hover:bg-zinc-800"
              }`}
            >
              {type} <span className="text-xs opacity-70">{count}</span>
            </button>
          );
        })}
        {typeFilter === "all" && (
          <span className="ml-2 text-xs text-gray-500">
            Pick a game type to set its order.
          </span>
        )}
      </div>

      {loading ? (
        <LoadingRow label="Loading games…" />
      ) : typeFilter !== "all" && sections ? (
        <GameOrderPanel
          key={typeFilter}
          gameType={typeFilter}
          games={gamesOfType}
          onSaved={handleOrderSaved}
          onEdit={setEditingGame}
        />
      ) : items && items.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Key</th>
                <th className="px-4 py-3">Game type</th>
                <th className="px-4 py-3">Quick play</th>
                <th className="px-4 py-3">Live</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {items.map((g) => (
                <tr key={g._id} className="text-gray-300 hover:bg-zinc-900">
                  <td className="px-4 py-3 text-gray-500">
                    {g.displayOrder ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{g.title}</div>
                    <div className="text-xs text-gray-500">{g.subtitle}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">
                    {g.key}
                  </td>
                  <td className="px-4 py-3 capitalize">{g.gameType}</td>
                  <td className="px-4 py-3">
                    <FlagBadge on={g.isQuickPlay} />
                  </td>
                  <td className="px-4 py-3">
                    <FlagBadge on={g.isLive} />
                  </td>
                  <td className="px-4 py-3">{g.message || "—"}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {formatDate(g.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setEditingGame(g)}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-gray-300 hover:bg-zinc-800"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && <EmptyRow label="No games yet." />
      )}

      <GameFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={load}
      />

      {/* Mounted per game so the form always starts from that game's values.
          A reload follows, since a new game type moves it to another section. */}
      {editingGame && (
        <GameFormModal
          key={editingGame._id}
          isOpen
          game={editingGame}
          onClose={() => setEditingGame(null)}
          onSuccess={load}
        />
      )}
    </div>
  );
}

function FlagBadge({ on }: { on: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        on ? "bg-emerald-600/20 text-emerald-300" : "bg-zinc-800 text-gray-400"
      }`}
    >
      {on ? "Yes" : "No"}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function FilterBar({
  total,
  loading,
  showOpponent = true,
  difficulties,
  onApply,
  onRefresh,
}: {
  total: number;
  loading: boolean;
  /** Single-player games have no opponent to filter on. */
  showOpponent?: boolean;
  /** When set, renders a difficulty dropdown with these options. */
  difficulties?: readonly string[];
  onApply: (filters: ListGameResultsParams) => void;
  onRefresh: () => void;
}) {
  const [submittedUserId, setSubmittedUserId] = useState("");
  const [opponentId, setOpponentId] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [invalid, setInvalid] = useState<string | null>(null);

  const apply = (difficultyOverride?: string) => {
    const nextDifficulty = difficultyOverride ?? difficulty;
    const user = submittedUserId.trim();
    const opponent = showOpponent ? opponentId.trim() : "";
    // The backend silently ignores a malformed id and returns the unfiltered
    // list, which reads as "this user played everything". Catch it here.
    const bad = [
      user && !isObjectId(user) ? "user ID" : null,
      opponent && !isObjectId(opponent) ? "opponent ID" : null,
    ].filter(Boolean);
    if (bad.length > 0) {
      setInvalid(`Enter a valid 24-character ${bad.join(" and ")}.`);
      return;
    }
    setInvalid(null);
    onApply({
      submittedUserId: user || undefined,
      opponentId: opponent || undefined,
      difficulty: nextDifficulty || undefined,
    });
  };

  const clear = () => {
    setSubmittedUserId("");
    setOpponentId("");
    setDifficulty("");
    setInvalid(null);
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
      {showOpponent && (
        <input
          type="text"
          value={opponentId}
          onChange={(e) => setOpponentId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          placeholder="Filter by opponent ID"
          className={filterClass}
        />
      )}
      {difficulties && (
        <select
          value={difficulty}
          onChange={(e) => {
            const next = e.target.value;
            setDifficulty(next);
            // Picking an option applies at once, but still through `apply`, so
            // a malformed user id in the box is caught rather than sent.
            apply(next);
          }}
          className={filterClass}
        >
          <option value="">All difficulties</option>
          {difficulties.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      )}
      <button
        type="button"
        onClick={() => apply()}
        className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
      >
        Apply
      </button>
      {(submittedUserId || opponentId || difficulty) && (
        <button
          type="button"
          onClick={clear}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800"
        >
          Clear
        </button>
      )}
      {invalid && (
        <span className="text-sm text-red-400" role="alert">
          {invalid}
        </span>
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
