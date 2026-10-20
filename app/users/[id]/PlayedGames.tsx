"use client";

import { useState } from "react";
import type { UserGames } from "@/app/interface/userActivity.interface";
import ActivitySection from "@/app/users/[id]/ActivitySection";
import { formatDate, useUserActivity } from "@/app/users/[id]/useUserActivity";

type GameKey = keyof UserGames;

type GameRow = {
  score: string;
  outcome?: string;
  xp?: number;
  details: Array<[string, unknown]>;
};

const dash = (v: unknown) =>
  v === undefined || v === null || v === "" ? "—" : String(v);

/** Per game: display name and how to read the columns from one result. */
const GAMES: {
  [K in GameKey]: {
    label: string;
    row: (r: UserGames[K]["results"][number]) => GameRow;
  };
} = {
  pitchDuel: {
    label: "Pitch Duel",
    row: (r) => ({
      score: `${dash(r.finalScore?.user)} – ${dash(r.finalScore?.opponent)}`,
      outcome: r.finalScore?.status,
      xp: r.finalScore?.xpDelta,
      details: [
        ["Won toss", r.hasUserWonToss === undefined ? undefined : r.hasUserWonToss ? "Yes" : "No"],
        ["Opponent", r.opponentId],
      ],
    }),
  },
  penaltyShootout: {
    label: "Penalty Shootout",
    row: (r) => ({
      score: dash(r.finalScore),
      outcome: r.finalMessage,
      xp: r.obtainedXp,
      details: [
        ["Message", r.finalScoreMessage],
        ["Opponent", r.opponentId],
      ],
    }),
  },
  footballChess: {
    label: "Football Chess",
    row: (r) => ({
      score: `${dash(r.finalScore?.user)} – ${dash(r.finalScore?.opponent)}`,
      outcome: r.finalScore?.status,
      xp: r.finalScore?.xpDelta,
      details: [
        ["Mode", r.gameMode],
        ["Turns", r.totalTurns],
        ["Duration", r.durationSeconds === undefined ? undefined : `${r.durationSeconds}s`],
        ["Abandoned", r.abandoned ? "Yes" : undefined],
      ],
    }),
  },
  finalOver: {
    label: "Final Over",
    row: (r) => ({
      score: `${dash(r.scored)} / ${dash(r.chasing)} (${dash(r.wicketLost)} wkts)`,
      outcome: r.message,
      xp: r.xpDelta,
      details: [
        ["Tier", r.chaseTier],
        ["6s", r.sixes],
        ["4s", r.fours],
      ],
    }),
  },
  grandPrixDash: {
    label: "Grand Prix Dash",
    row: (r) => ({
      score: `P${dash(r.startingPosition)} → P${dash(r.finishingPosition)}`,
      outcome: r.finalStatus,
      xp: r.xpDelta,
      details: [
        ["Race time", r.raceTime],
        ["Cars", r.totalCars],
        ["Laps", r.totalLap],
      ],
    }),
  },
  hoopDuel: {
    label: "Hoop Duel",
    row: (r) => ({
      score: `${dash(r.finalYourScore)} – ${dash(r.finalOpponentScore)}`,
      outcome: r.status,
      xp: r.xpDelta,
      details: [
        ["Difficulty", r.difficulty],
        ["Dunks", r.dunks],
        ["Blocks", r.blocks],
        ["Steals", r.steals],
        ["Best run", r.bestRun],
      ],
    }),
  },
  tennisRally: {
    label: "Tennis Rally",
    row: (r) => ({
      score: `${dash(r.finalYourScore)} – ${dash(r.finalOpponentScore)}`,
      outcome: r.status,
      xp: r.xpDelta,
      details: [
        ["Grade", r.grade],
        ["Longest rally", r.longestRally],
        ["Winners", r.playingWinners],
        ["Errors", r.playingErrors],
      ],
    }),
  },
};

const GAME_KEYS = Object.keys(GAMES) as GameKey[];

type Props = { userId: string };

export default function PlayedGames({ userId }: Props) {
  const { data, loading, error, load } = useUserActivity<UserGames>(
    userId,
    "playedGamesForAdmin",
    "Failed to load played games",
  );
  const [selected, setSelected] = useState<GameKey>("pitchDuel");

  const totalPlayed = GAME_KEYS.reduce(
    (sum, key) => sum + (data?.[key]?.matchesPlayed ?? 0),
    0,
  );
  const block = data?.[selected];
  const results = (block?.results ?? []) as UserGames[GameKey]["results"];
  const rowOf = GAMES[selected].row as (r: (typeof results)[number]) => GameRow;

  return (
    <ActivitySection
      title="Games"
      loading={loading}
      error={error}
      isEmpty={!data}
      emptyText="No game data."
      onRefresh={() => void load()}
      headerExtra={
        data ? (
          <span className="text-sm text-gray-400">
            {totalPlayed} played
          </span>
        ) : null
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
        {GAME_KEYS.map((key) => {
          const played = data?.[key]?.matchesPlayed ?? 0;
          const active = key === selected;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className={`rounded-lg border p-3 text-left transition-colors ${
                active
                  ? "border-white bg-zinc-800"
                  : "border-zinc-700 bg-zinc-950/60 hover:bg-zinc-800/60"
              }`}
            >
              <p className="text-xs text-gray-400">{GAMES[key].label}</p>
              <p
                className={`text-2xl font-semibold ${
                  played > 0 ? "text-white" : "text-gray-600"
                }`}
              >
                {played}
              </p>
            </button>
          );
        })}
      </div>

      <h3 className="text-sm font-semibold text-gray-300 mb-2">
        {GAMES[selected].label}
      </h3>
      {results.length === 0 ? (
        <p className="text-gray-400 text-sm">
          The user hasn&apos;t played {GAMES[selected].label} yet.
        </p>
      ) : (
        <div className="overflow-x-auto -mx-2">
          <table className="min-w-full text-left text-sm text-gray-300">
            <thead>
              <tr className="border-b border-zinc-700 text-xs uppercase tracking-wider text-gray-500">
                <th className="py-2 pr-4 font-medium">Played</th>
                <th className="py-2 pr-4 font-medium">Score</th>
                <th className="py-2 pr-4 font-medium">Outcome</th>
                <th className="py-2 pr-4 font-medium">XP</th>
                <th className="py-2 pr-0 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => {
                const row = rowOf(r);
                const details = row.details.filter(
                  ([, v]) => v !== undefined && v !== null && v !== "",
                );
                return (
                  <tr
                    key={r._id}
                    className="border-b border-zinc-800 align-top"
                  >
                    <td className="py-3 pr-4 whitespace-nowrap">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap text-white">
                      {row.score}
                    </td>
                    <td className="py-3 pr-4">{dash(row.outcome)}</td>
                    <td
                      className={`py-3 pr-4 whitespace-nowrap ${
                        (row.xp ?? 0) > 0
                          ? "text-green-400"
                          : (row.xp ?? 0) < 0
                            ? "text-red-400"
                            : ""
                      }`}
                    >
                      {row.xp === undefined || row.xp === null
                        ? "—"
                        : row.xp > 0
                          ? `+${row.xp}`
                          : row.xp}
                    </td>
                    <td className="py-3 pr-0 text-xs text-gray-400">
                      {details.length === 0
                        ? "—"
                        : details.map(([k, v]) => `${k}: ${v}`).join(" · ")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </ActivitySection>
  );
}
