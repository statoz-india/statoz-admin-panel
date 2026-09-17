"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Trophy,
  BrainCircuit,
  Swords,
  HelpCircle,
  Target,
  CalendarClock,
  TrendingUp,
  Radio,
  UserPlus,
  BarChart3,
  CreditCard,
  ShoppingBag,
  Gamepad2,
  Grid3x3,
  Layers,
} from "lucide-react";
import { Section } from "@/app/utils/enums/section.enum";
import type {
  DailyMatchStats,
  DashboardData,
  DailyPaymentStats,
  DailyUserAssetsStats,
  DailyUserCardsStats,
  OnboardingStats,
  SubmissionStats,
} from "@/app/interface/dashboard.interface";
import {
  buildBars,
  CurrencyStatValue,
  fetchAdmin,
  istTodayKey,
  StatValue,
  TrendChart,
} from "@/app/components/dashboard/dashboard-ui";

interface DashboardSectionProps {
  /** Jump to another admin section (same handler the sidebar uses). */
  onNavigate: (section: string) => void;
}

type SubmissionWidgetKey = "quiz" | "prediction" | "future" | "event";

/** Submission-activity widgets (today + 7-day chart), keyed by `submissions`. */
const SUBMISSION_WIDGETS: {
  key: SubmissionWidgetKey;
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

type ActivityWidgetKey =
  | "knowledgeQuiz"
  | "pitchDuel"
  | "penaltyShootout"
  | "footballChess"
  | "userCards"
  | "payments"
  | "userAssets";

/** Game, quiz, payment, and asset activity widgets (today + 7-day chart). */
const ACTIVITY_WIDGETS: {
  key: ActivityWidgetKey;
  label: string;
  section: Section;
  icon: React.ComponentType<{ className?: string }>;
  /** Page "View" opens instead of `section`, when set. */
  href?: string;
}[] = [
  {
    key: "knowledgeQuiz",
    label: "Knowledge quiz submissions",
    section: Section.KNOWLEDGE_QUIZ,
    icon: BrainCircuit,
    href: "/today-submissions?tab=knowledgeQuiz",
  },
  {
    key: "pitchDuel",
    label: "Pitch duels played",
    section: Section.TEAMSTOURNAMENTS,
    icon: Swords,
  },
  {
    key: "penaltyShootout",
    label: "Penalty shootouts played",
    section: Section.TEAMSTOURNAMENTS,
    icon: Gamepad2,
  },
  {
    key: "footballChess",
    label: "Football chess played",
    section: Section.TEAMSTOURNAMENTS,
    icon: Grid3x3,
  },
  {
    key: "userCards",
    label: "Card acquisitions",
    section: Section.USER_CARDS,
    icon: Layers,
  },
  {
    key: "payments",
    label: "Payments created",
    section: Section.PAYMENTS,
    icon: CreditCard,
  },
  {
    key: "userAssets",
    label: "Asset purchases",
    section: Section.PAYMENTS,
    icon: ShoppingBag,
  },
];

function activityTodayCount(
  key: ActivityWidgetKey,
  activity: Record<ActivityWidgetKey, ActivitySeries | null>,
): number {
  const stat = activity[key];
  return stat?.todayCount ?? 0;
}

function activityBars(
  key: ActivityWidgetKey,
  activity: Record<ActivityWidgetKey, ActivitySeries | null>,
  todayKey: string,
) {
  const stat = activity[key];
  return buildBars(stat?.daily ?? [], todayKey);
}

type ActivitySeries = {
  todayCount: number;
  daily: { date: string; count: number }[];
};

function toMatchSeries(stat: DailyMatchStats | null): ActivitySeries | null {
  if (!stat) return null;
  return {
    todayCount: stat.playedToday ?? 0,
    daily: stat.dailyMatches ?? [],
  };
}

function toUserCardsSeries(
  stat: DailyUserCardsStats | null,
): ActivitySeries | null {
  if (!stat) return null;
  return {
    todayCount: stat.acquiredToday ?? 0,
    daily: stat.dailyAcquisitions ?? [],
  };
}

function toPaymentSeries(
  stat: DailyPaymentStats | null,
): ActivitySeries | null {
  if (!stat) return null;
  return {
    todayCount: stat.createdToday ?? 0,
    daily: stat.dailyPayments ?? [],
  };
}

function toUserAssetsSeries(
  stat: DailyUserAssetsStats | null,
): ActivitySeries | null {
  if (!stat) return null;
  return {
    todayCount: stat.purchasedToday ?? 0,
    daily: stat.dailyPurchases ?? [],
  };
}

function toSubmissionSeries(
  stat: SubmissionStats | null,
): ActivitySeries | null {
  if (!stat) return null;
  return {
    todayCount: stat.submittedToday ?? 0,
    daily: stat.dailySubmissions ?? [],
  };
}

export default function DashboardSection({
  onNavigate,
}: DashboardSectionProps) {
  const [stats, setStats] = useState<OnboardingStats | null>(null);
  const [totals, setTotals] = useState<DashboardData | null>(null);
  const [submissions, setSubmissions] = useState<
    Record<SubmissionWidgetKey, SubmissionStats | null>
  >({
    quiz: null,
    prediction: null,
    future: null,
    event: null,
  });
  const [activity, setActivity] = useState<
    Record<ActivityWidgetKey, ActivitySeries | null>
  >({
    knowledgeQuiz: null,
    pitchDuel: null,
    penaltyShootout: null,
    footballChess: null,
    userCards: null,
    payments: null,
    userAssets: null,
  });
  /** Requests that have returned, by widget key; the rest show skeletons. */
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const isLoading = (key: string) => !loaded[key];
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    // Every request fills in its own widget as soon as it returns, so fast
    // endpoints don't wait on slow ones. The rest of the all-time totals live
    // on the weekly stats page (OverallTotals).
    const load = <T,>(
      key: string,
      endpoint: string,
      apply: (data: T | null) => void,
    ) => {
      fetchAdmin<T>(endpoint).then((data) => {
        if (cancelled) return;
        apply(data);
        setLoaded((prev) => ({ ...prev, [key]: true }));
      });
    };

    const setSubmission =
      (key: SubmissionWidgetKey) =>
      (data: SubmissionStats | null) =>
        setSubmissions((prev) => ({ ...prev, [key]: data }));
    const setSeries =
      <T,>(
        key: ActivityWidgetKey,
        toSeries: (data: T | null) => ActivitySeries | null,
      ) =>
      (data: T | null) =>
        setActivity((prev) => ({ ...prev, [key]: toSeries(data) }));

    load<OnboardingStats>(
      "onboarding",
      "/api/admin-api/getonboardingstats",
      setStats,
    );

    load<DashboardData>("totals", "/api/admin-api", setTotals);

    load(
      "submission-quiz",
      "/api/admin-api/getquizsubmissionstats",
      setSubmission("quiz"),
    );
    load(
      "submission-prediction",
      "/api/admin-api/getpredictionsubmissionstats",
      setSubmission("prediction"),
    );
    load(
      "submission-future",
      "/api/admin-api/getfuturesubmissionstats",
      setSubmission("future"),
    );
    load(
      "submission-event",
      "/api/admin-api/geteventsubmissionstats",
      setSubmission("event"),
    );

    load(
      "activity-knowledgeQuiz",
      "/api/admin-api/getknowledgequizsubmissionstats",
      setSeries<SubmissionStats>("knowledgeQuiz", toSubmissionSeries),
    );
    load(
      "activity-pitchDuel",
      "/api/admin-api/getpitchduelstats",
      setSeries<DailyMatchStats>("pitchDuel", toMatchSeries),
    );
    load(
      "activity-penaltyShootout",
      "/api/admin-api/getpenaltyshootoutstats",
      setSeries<DailyMatchStats>("penaltyShootout", toMatchSeries),
    );
    load(
      "activity-footballChess",
      "/api/admin-api/getfootballchessstats",
      setSeries<DailyMatchStats>("footballChess", toMatchSeries),
    );
    load(
      "activity-userCards",
      "/api/admin-api/getusercardsstats",
      setSeries<DailyUserCardsStats>("userCards", toUserCardsSeries),
    );
    load(
      "activity-payments",
      "/api/admin-api/getpaymentstats",
      setSeries<DailyPaymentStats>("payments", toPaymentSeries),
    );
    load(
      "activity-userAssets",
      "/api/admin-api/getuserassetsstats",
      setSeries<DailyUserAssetsStats>("userAssets", toUserAssetsSeries),
    );

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

      {/* All-time totals and weekly stats (separate route) */}
      <button
        type="button"
        onClick={() => router.push("/weekly-stats")}
        className="group mb-10 flex w-full items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-left transition-colors hover:border-cyan-500/60 hover:bg-zinc-800"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-cyan-400 group-hover:bg-zinc-700">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <span className="block font-semibold text-white">
              Overall stats
            </span>
            <span className="mt-1 block text-sm text-gray-400">
              Today&apos;s activity, all-time totals, and weekly breakdown of
              submissions, games, payments, and assets.
            </span>
          </div>
        </div>
        <span className="text-sm font-medium text-cyan-400 group-hover:text-cyan-300">
          Open →
        </span>
      </button>

      {/* Payments & user assets totals */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onNavigate(Section.PAYMENTS)}
          className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-left transition-colors hover:border-cyan-500/60 hover:bg-zinc-800"
        >
          <span className="text-sm text-gray-400">Total payments</span>
          <CurrencyStatValue
            loading={isLoading("totals")}
            value={totals?.totalPayments ?? null}
          />
        </button>
        <button
          type="button"
          onClick={() => onNavigate(Section.PAYMENTS)}
          className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-left transition-colors hover:border-cyan-500/60 hover:bg-zinc-800"
        >
          <span className="text-sm text-gray-400">After 15% reduction</span>
          <CurrencyStatValue
            loading={isLoading("totals")}
            value={totals?.paymentsAfterReduction ?? null}
          />
        </button>
        <button
          type="button"
          onClick={() => onNavigate(Section.PAYMENTS)}
          className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-left transition-colors hover:border-cyan-500/60 hover:bg-zinc-800"
        >
          <span className="text-sm text-gray-400">
            Users with asset purchases
          </span>
          <StatValue
            loading={isLoading("totals")}
            value={totals?.totalUserAssets ?? null}
          />
        </button>
      </div>

      {/* New user onboarding */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-gray-400">
              <UserPlus className="h-4 w-4 text-cyan-400" />
              <span className="text-sm">Users onboarded today</span>
            </div>
            <div className="mt-2">
              {isLoading("onboarding") ? (
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
          <TrendChart
            bars={onboarding.bars}
            loading={isLoading("onboarding")}
          />
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
            const loading = isLoading(`submission-${widget.key}`);
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

      {/* Games, payments, and asset activity (last 7 days) */}
      <div className="mt-10">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Engagement activity
        </h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {ACTIVITY_WIDGETS.map((widget) => {
            const Icon = widget.icon;
            const bars = activityBars(widget.key, activity, todayKey);
            const loading = isLoading(`activity-${widget.key}`);
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
                      widget.href
                        ? router.push(widget.href)
                        : onNavigate(widget.section)
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
                      {activityTodayCount(widget.key, activity).toLocaleString(
                        "en-IN",
                      )}
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
