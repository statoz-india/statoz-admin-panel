"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  Users,
  Trophy,
  Shield,
  Swords,
  HelpCircle,
  Target,
  CalendarClock,
  TrendingUp,
  Radio,
  UserPlus,
} from "lucide-react";
import { Section } from "@/app/utils/enums/section.enum";
import type {
  DashboardData,
  OnboardingStats,
  SubmissionStats,
  TodayListResponse,
} from "@/app/interface/dashboard.interface";

interface DashboardSectionProps {
  /** Jump to another admin section (same handler the sidebar uses). */
  onNavigate: (section: string) => void;
}

/** Generic GET against an admin proxy route; returns the unwrapped `data`. */
async function fetchAdmin<T>(endpoint: string): Promise<T | null> {
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
function istTodayKey(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

function shortLabel(dayKey: string): string {
  const d = new Date(`${dayKey}T00:00:00`);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

type Bar = { key: string; label: string; count: number };

/** Turn a daily {date,count}[] series into chart bars, labelling today. */
function buildBars(
  daily: { date: string; count: number }[],
  todayKey: string,
): Bar[] {
  return daily.map((d) => ({
    key: d.date,
    label: d.date === todayKey ? "Today" : shortLabel(d.date),
    count: Number(d.count) || 0,
  }));
}

type CardDef = {
  key: string;
  label: string;
  section: Section;
  icon: React.ComponentType<{ className?: string }>;
  /** Field on the aggregated dashboard payload, when sourced from it. */
  dataKey?: keyof DashboardData;
};

const PRIMARY_CARDS: CardDef[] = [
  {
    key: "users",
    label: "Users",
    dataKey: "totalUsers",
    section: Section.USERS,
    icon: Users,
  },
  {
    key: "tournaments",
    label: "Tournaments",
    dataKey: "totalTournaments",
    section: Section.TOURNAMENTS,
    icon: Trophy,
  },
  {
    key: "teams",
    label: "Teams",
    dataKey: "totalTeams",
    section: Section.TEAMS,
    icon: Shield,
  },
  {
    key: "predictions",
    label: "Predictions",
    dataKey: "totalPredictions",
    section: Section.PREDICTIONS,
    icon: Target,
  },
  {
    key: "quizzes",
    label: "Quizzes",
    dataKey: "totalQuizzes",
    section: Section.QUIZZES,
    icon: HelpCircle,
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

function StatValue({
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
function TrendChart({ bars, loading }: { bars: Bar[]; loading: boolean }) {
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
              <StatValue loading={loading} value={counts[card.key] ?? null} />
              <span className="mt-1 text-sm text-gray-400">{card.label}</span>
            </button>
          );
        })}
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
                    onClick={() => onNavigate(widget.section)}
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
