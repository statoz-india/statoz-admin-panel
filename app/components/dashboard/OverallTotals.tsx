"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Trophy,
  BrainCircuit,
  HelpCircle,
  Target,
  CalendarClock,
  TrendingUp,
} from "lucide-react";
import { Section } from "@/app/utils/enums/section.enum";
import type { DashboardData } from "@/app/interface/dashboard.interface";
import {
  fetchAdmin,
  StatValue,
} from "@/app/components/dashboard/dashboard-ui";

type CardDef = {
  key: string;
  label: string;
  section: Section;
  icon: React.ComponentType<{ className?: string }>;
  /** Field on the aggregated dashboard payload, when sourced from it. */
  dataKey?: keyof DashboardData;
  /** Optional second metric, rendered side by side in the same card. */
  label2?: string;
  dataKey2?: keyof DashboardData;
  /**
   * Render the users breakdown: the headline value is the sum of `dataKey`
   * and `dataKey2`, with each shown as a labelled row below it.
   */
  breakdown?: boolean;
};

const PRIMARY_CARDS: CardDef[] = [
  {
    key: "users",
    label: "Users",
    dataKey: "totalUsers",
    dataKey2: "deletedUsers",
    breakdown: true,
    section: Section.USERS,
    icon: Users,
  },
  {
    key: "quizzes",
    label: "Quizzes",
    dataKey: "totalQuizzes",
    label2: "Submissions",
    dataKey2: "totalQuizSubmissions",
    section: Section.QUIZZES,
    icon: HelpCircle,
  },
  {
    key: "predictions",
    label: "Predictions",
    dataKey: "totalPredictions",
    label2: "Submissions",
    dataKey2: "totalPredictionSubmissions",
    section: Section.PREDICTIONS,
    icon: Target,
  },

  {
    key: "events",
    label: "Events",
    dataKey: "totalEvents",
    label2: "Submissions",
    dataKey2: "totalEventSubmissions",
    section: Section.EVENTS,
    icon: CalendarClock,
  },
  {
    key: "futures",
    label: "Futures",
    dataKey: "totalFutures",
    label2: "Submissions",
    dataKey2: "totalFutureSubmissions",
    section: Section.FUTURES,
    icon: TrendingUp,
  },
  {
    key: "tournamentsTeams",
    label: "Tournaments",
    dataKey: "totalTournaments",
    label2: "Teams",
    dataKey2: "totalTeams",
    section: Section.TEAMSTOURNAMENTS,
    icon: Trophy,
  },
  {
    key: "knowledgeQuizzes",
    label: "Knowledge quizzes",
    dataKey: "totalKnowledgeQuizzes",
    label2: "Sets",
    dataKey2: "totalKnowledgeQuizSets",
    section: Section.KNOWLEDGE_QUIZ,
    icon: BrainCircuit,
  },
  {
    key: "knowledgeQuizQuestions",
    label: "KQ questions",
    dataKey: "totalKnowledgeQuizQuestions",
    section: Section.KNOWLEDGE_QUIZ,
    icon: BrainCircuit,
  },
];

type GameTotalDef = {
  key: string;
  label: string;
  playersKey: keyof DashboardData;
  matchesKey: keyof DashboardData;
  /** What `matchesKey` counts, for the tile label; defaults to "matches". */
  matchesNoun?: string;
};

/** The tile groups, top to bottom; `metric` is the suffix of the `counts` key. */
const GAME_TOTAL_GROUPS = [{ metric: "matches" }, { metric: "players" }] as const;

/** All-time players and matches per game, in the order the tiles show them. */
const GAME_TOTALS: GameTotalDef[] = [
  {
    key: "pitchDuel",
    label: "Pitch duel",
    playersKey: "totalPitchDuelPlayers",
    matchesKey: "totalPitchDuelMatches",
  },
  {
    key: "penaltyShootout",
    label: "Penalty shootout",
    playersKey: "totalPenaltyShootoutPlayers",
    matchesKey: "totalPenaltyShootoutMatches",
  },
  {
    key: "footballChess",
    label: "Football chess",
    playersKey: "totalFootballChessPlayers",
    matchesKey: "totalFootballChessMatches",
  },
  {
    key: "finalOver",
    label: "Final over",
    playersKey: "totalFinalOverPlayers",
    matchesKey: "totalFinalOverMatches",
  },
  {
    key: "grandPrixDash",
    label: "Grand prix dash",
    playersKey: "totalGrandPrixDashPlayers",
    matchesKey: "totalGrandPrixDashMatches",
  },
  {
    key: "hoopDuel",
    label: "Hoop duel",
    playersKey: "totalHoopDuelPlayers",
    matchesKey: "totalHoopDuelMatches",
  },
  {
    key: "tennisRally",
    label: "Tennis rally",
    playersKey: "totalTennisRallyPlayers",
    matchesKey: "totalTennisRallyMatches",
  },
  {
    key: "knowledgeQuiz",
    label: "Knowledge quiz",
    playersKey: "totalKnowledgeQuizPlayers",
    matchesKey: "totalKnowledgeQuizSubmissions",
    matchesNoun: "submissions",
  },
];

/**
 * All-time totals from the aggregated dashboard payload: the headline cards
 * and the user / game / card breakdown. Cards link to their admin section.
 */
export default function OverallTotals() {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const dashboard = await fetchAdmin<DashboardData>("/api/admin-api");
      if (cancelled) return;

      const nextCounts: Record<string, number | null> = {};
      for (const card of PRIMARY_CARDS) {
        if (card.dataKey) {
          nextCounts[card.key] = dashboard
            ? (dashboard[card.dataKey] ?? null)
            : null;
        }
        if (card.dataKey2) {
          nextCounts[`${card.key}-2`] = dashboard
            ? (dashboard[card.dataKey2] ?? null)
            : null;
        }
      }
      for (const game of GAME_TOTALS) {
        nextCounts[`${game.key}-players`] = dashboard
          ? (dashboard[game.playersKey] ?? null)
          : null;
        nextCounts[`${game.key}-matches`] = dashboard
          ? (dashboard[game.matchesKey] ?? null)
          : null;
      }
      nextCounts.usersWithCards = dashboard
        ? (dashboard.totalUsersWithCards ?? null)
        : null;
      setCounts(nextCounts);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // This lives on its own route, so jump back into the admin home instead of
  // switching sections in place.
  const onNavigate = (section: Section) =>
    router.push(`/?section=${section}`);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {PRIMARY_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => onNavigate(card.section)}
              className="group flex flex-col items-start rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-left transition-colors hover:border-cyan-500/60 hover:bg-zinc-800"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-cyan-400 group-hover:bg-zinc-700">
                <Icon className="h-5 w-5" />
              </div>
              {card.breakdown ? (
                <>
                  <StatValue
                    loading={loading}
                    value={
                      counts[card.key] === null &&
                      counts[`${card.key}-2`] === null
                        ? null
                        : (counts[card.key] ?? 0) +
                          (counts[`${card.key}-2`] ?? 0)
                    }
                  />
                  <span className="mt-1 text-sm text-gray-400">
                    {card.label}
                  </span>
                </>
              ) : card.dataKey2 ? (
                <div className="flex w-full items-start gap-6">
                  <div className="flex flex-col items-start">
                    <StatValue
                      loading={loading}
                      value={counts[card.key] ?? null}
                    />
                    <span className="mt-1 text-sm text-gray-400">
                      {card.label}
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <StatValue
                      loading={loading}
                      value={counts[`${card.key}-2`] ?? null}
                    />
                    <span className="mt-1 text-sm text-gray-400">
                      {card.label2}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <StatValue
                    loading={loading}
                    value={counts[card.key] ?? null}
                  />
                  <span className="mt-1 text-sm text-gray-400">
                    {card.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Active vs. deleted user breakdown */}
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
          <span className="text-sm text-gray-400">Active users</span>
          <StatValue loading={loading} value={counts.users ?? null} />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
          <span className="text-sm text-gray-400">Deleted users</span>
          <StatValue loading={loading} value={counts["users-2"] ?? null} />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
          <span className="text-sm text-gray-400">Users with cards</span>
          <StatValue loading={loading} value={counts.usersWithCards ?? null} />
        </div>
      </div>

      {/* Games, all time: every game's matches, a separator, then every
          game's players. */}
      {GAME_TOTAL_GROUPS.map((group) => (
        <div key={group.metric}>
          {group.metric === "players" && (
            <hr className="mt-6 border-t border-zinc-700" />
          )}
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {GAME_TOTALS.map((game) => (
              <div
                key={`${game.key}-${group.metric}`}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4"
              >
                <span className="text-sm text-gray-400">
                  {game.label}{" "}
                  {group.metric === "matches"
                    ? (game.matchesNoun ?? "matches")
                    : "players"}
                </span>
                <StatValue
                  loading={loading}
                  value={counts[`${game.key}-${group.metric}`] ?? null}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
