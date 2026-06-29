"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Trophy,
  Swords,
  HelpCircle,
  Target,
  CalendarClock,
  TrendingUp,
  Radio,
  UserPlus,
  BarChart3,
} from "lucide-react";
import { Section } from "@/app/utils/enums/section.enum";
import type {
  DashboardData,
  OnboardingStats,
  SubmissionStats,
  TodayListResponse,
} from "@/app/interface/dashboard.interface";
import {
  buildBars,
  fetchAdmin,
  istTodayKey,
  StatValue,
  TrendChart,
} from "@/app/components/dashboard/dashboard-ui";

interface DashboardSectionProps {
  /** Jump to another admin section (same handler the sidebar uses). */
  onNavigate: (section: string) => void;
}

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
    section: Section.QUIZZES,
    icon: HelpCircle,
  },
  {
    key: "predictions",
    label: "Predictions",
    dataKey: "totalPredictions",
    section: Section.PREDICTIONS,
    icon: Target,
  },

  {
    key: "events",
    label: "Events",
    dataKey: "totalEvents",
    section: Section.EVENTS,
    icon: CalendarClock,
  },
  {
    key: "futures",
    label: "Futures",
    dataKey: "totalFutures",
    section: Section.FUTURES,
    icon: TrendingUp,
  },
  {
    key: "tournamentsTeams",
    label: "Tournaments",
    dataKey: "totalTournaments",
    label2: "Teams",
    dataKey2: "totalTeams",
    section: Section.TOURNAMENTS,
    icon: Trophy,
  },
  {
    key: "quizSubmissions",
    label: "Quiz submissions",
    dataKey: "totalQuizSubmissions",
    section: Section.QUIZZES,
    icon: HelpCircle,
  },
  {
    key: "predictionSubmissions",
    label: "Prediction submissions",
    dataKey: "totalPredictionSubmissions",
    section: Section.PREDICTIONS,
    icon: Target,
  },
  {
    key: "eventSubmissions",
    label: "Event submissions",
    dataKey: "totalEventSubmissions",
    section: Section.EVENTS,
    icon: CalendarClock,
  },
  {
    key: "futureSubmissions",
    label: "Future submissions",
    dataKey: "totalFutureSubmissions",
    section: Section.FUTURES,
    icon: TrendingUp,
  },
];

/** Cards showing today's scheduled activity (IST), keyed by `today` state. */
const TODAY_CARDS: {
  key: "quizzes" | "predictions" | "events";
  label: string;
  section: Section;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    key: "quizzes",
    label: "Quizzes today",
    section: Section.QUIZZES,
    icon: HelpCircle,
  },
  {
    key: "predictions",
    label: "Predictions today",
    section: Section.PREDICTIONS,
    icon: Target,
  },
  {
    key: "events",
    label: "Events closing today",
    section: Section.EVENTS,
    icon: CalendarClock,
  },
];

/** Submission-activity widgets (today + 7-day chart), keyed by `submissions`. */
const SUBMISSION_WIDGETS: {
  key: "quiz" | "prediction" | "future" | "event";
  label: string;
  section: Section;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    key: "quiz",
    label: "Quiz submissions",
    section: Section.QUIZZES,
    icon: HelpCircle,
  },
  {
    key: "prediction",
    label: "Prediction submissions",
    section: Section.PREDICTIONS,
    icon: Target,
  },
  {
    key: "future",
    label: "Future submissions",
    section: Section.FUTURES,
    icon: TrendingUp,
  },
  {
    key: "event",
    label: "Event submissions",
    section: Section.EVENTS,
    icon: CalendarClock,
  },
];

export default function DashboardSection({
  onNavigate,
}: DashboardSectionProps) {
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [stats, setStats] = useState<OnboardingStats | null>(null);
  const [today, setToday] = useState<
    Record<"quizzes" | "predictions" | "events", number | null>
  >({ quizzes: null, predictions: null, events: null });
  const [submissions, setSubmissions] = useState<
    Record<"quiz" | "prediction" | "future" | "event", SubmissionStats | null>
  >({ quiz: null, prediction: null, future: null, event: null });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      // All dashboard data in parallel: aggregated counts, onboarding stats,
      // today's scheduled lists, and the four submission-activity series.
      const [
        dashboard,
        onboardingStats,
        todayQuizzes,
        todayPredictions,
        todayEvents,
        quizSubmissions,
        predictionSubmissions,
        futureSubmissions,
        eventSubmissions,
      ] = await Promise.all([
        fetchAdmin<DashboardData>("/api/admin-api"),
        fetchAdmin<OnboardingStats>("/api/admin-api/getonboardingstats"),
        fetchAdmin<TodayListResponse>("/api/admin-api/gettodayquizzes"),
        fetchAdmin<TodayListResponse>("/api/admin-api/gettodaypredictions"),
        fetchAdmin<TodayListResponse>("/api/admin-api/gettodayevents"),
        fetchAdmin<SubmissionStats>("/api/admin-api/getquizsubmissionstats"),
        fetchAdmin<SubmissionStats>(
          "/api/admin-api/getpredictionsubmissionstats",
        ),
        fetchAdmin<SubmissionStats>("/api/admin-api/getfuturesubmissionstats"),
        fetchAdmin<SubmissionStats>("/api/admin-api/geteventsubmissionstats"),
      ]);
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
      setCounts(nextCounts);
      setStats(onboardingStats);
      setToday({
        quizzes: todayQuizzes ? todayQuizzes.total : null,
        predictions: todayPredictions ? todayPredictions.total : null,
        events: todayEvents ? todayEvents.total : null,
      });
      setSubmissions({
        quiz: quizSubmissions,
        prediction: predictionSubmissions,
        future: futureSubmissions,
        event: eventSubmissions,
      });
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const todayKey = istTodayKey();

  // Users onboarded per day, straight from the onboarding stats endpoint.
  const onboarding = useMemo(() => {
    const bars = buildBars(stats?.dailyOnboarding ?? [], todayKey);
    const todayCount = stats?.onboardedToday ?? 0;
    return { bars, todayCount };
  }, [stats, todayKey]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-400">
          Overview of StatOz at a glance.
        </p>
      </div>

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
      <div className="mt-4 grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
          <span className="text-sm text-gray-400">Active users</span>
          <StatValue loading={loading} value={counts.users ?? null} />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
          <span className="text-sm text-gray-400">Deleted users</span>
          <StatValue loading={loading} value={counts["users-2"] ?? null} />
        </div>
      </div>

      {/* Today's scheduled activity (IST) */}
      <div className="mt-10">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Today&apos;s activity
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TODAY_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.key}
                type="button"
                onClick={() => onNavigate(card.section)}
                className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-left transition-colors hover:border-cyan-500/60 hover:bg-zinc-800"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-cyan-400 group-hover:bg-zinc-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <StatValue loading={loading} value={today[card.key]} />
                  <span className="mt-1 block text-sm text-gray-400">
                    {card.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* New user onboarding */}
      <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-gray-400">
              <UserPlus className="h-4 w-4 text-cyan-400" />
              <span className="text-sm">Users onboarded today</span>
            </div>
            <div className="mt-2">
              {loading ? (
                <div className="h-10 w-20 animate-pulse rounded bg-zinc-700" />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {onboarding.todayCount.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
            Last 3 days
          </p>
          <TrendChart bars={onboarding.bars} loading={loading} />
        </div>
      </div>

      {/* Submission activity (last 7 days) */}
      <div className="mt-10">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Submission activity
        </h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {SUBMISSION_WIDGETS.map((widget) => {
            const Icon = widget.icon;
            const stat = submissions[widget.key];
            const bars = buildBars(stat?.dailySubmissions ?? [], todayKey);
            return (
              <div
                key={widget.key}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Icon className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm">{widget.label}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/today-submissions?tab=${widget.key}`)
                    }
                    className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    View
                  </button>
                </div>
                <div className="mt-2">
                  {loading ? (
                    <div className="h-9 w-16 animate-pulse rounded bg-zinc-700" />
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {(stat?.submittedToday ?? 0).toLocaleString("en-IN")}
                    </span>
                  )}
                  <span className="ml-2 text-xs text-gray-500">today</span>
                </div>
                <div className="mt-6">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                    Last 7 days
                  </p>
                  <TrendChart bars={bars} loading={loading} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail pages (separate routes) */}
      <button
        type="button"
        onClick={() => router.push("/weekly-stats")}
        className="group flex w-full items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-left transition-colors hover:border-cyan-500/60 hover:bg-zinc-800 mt-8"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-cyan-400 group-hover:bg-zinc-700">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <span className="block font-semibold text-white">
              Weekly submission stats
            </span>
            <span className="mt-1 block text-sm text-gray-400">
              All-time weekly breakdown of submissions and onboarding.
            </span>
          </div>
        </div>
        <span className="text-sm font-medium text-cyan-400 group-hover:text-cyan-300">
          Open →
        </span>
      </button>

      {/* Quick actions */}
      <div className="mt-10">
        <h3 className="mb-4 text-lg font-semibold text-white">Quick actions</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Manage Users", section: Section.USERS, icon: Users },
            { label: "Matches", section: Section.MATCHES, icon: Swords },
            {
              label: "Send Notification",
              section: Section.NOTIFICATION,
              icon: Radio,
            },
            {
              label: "Leaderboard",
              section: Section.LEADERBOARD,
              icon: Trophy,
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.section}
                type="button"
                onClick={() => onNavigate(action.section)}
                className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-gray-200 transition-colors hover:border-cyan-500/60 hover:bg-zinc-800"
              >
                <Icon className="h-4 w-4 text-cyan-400" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
