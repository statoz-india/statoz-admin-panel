"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  HelpCircle,
  Target,
  TrendingUp,
  CalendarClock,
  UserPlus,
  Swords,
  Gamepad2,
  Grid3x3,
  Layers,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import type {
  WeeklyMatchStats,
  WeeklyOnboardingStats,
  WeeklyPaymentStats,
  WeeklySubmission,
  WeeklySubmissionStats,
  WeeklyUserAssetsStats,
  WeeklyUserCardsStats,
} from "@/app/interface/dashboard.interface";
import {
  buildWeeklyBars,
  fetchAdmin,
  StatValue,
  TrendChart,
} from "@/app/components/dashboard/dashboard-ui";

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type WeeklyPanel = {
  key: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  thisWeek: number | null;
  thisWeekLabel: string;
  total: number | null;
  totalLabel: string;
  firstAt: string | null;
  firstLabel: string;
  weekly: WeeklySubmission[];
};

function submissionPanel(
  key: string,
  title: string,
  icon: WeeklyPanel["icon"],
  stats: WeeklySubmissionStats | null,
): WeeklyPanel {
  return {
    key,
    title,
    icon,
    thisWeek: stats?.submittedThisWeek ?? null,
    thisWeekLabel: "This week",
    total: stats?.totalSubmissions ?? null,
    totalLabel: "Total submissions",
    firstAt: stats?.firstSubmissionAt ?? null,
    firstLabel: "First submission",
    weekly: stats?.weeklySubmissions ?? [],
  };
}

function matchPanel(
  key: string,
  title: string,
  icon: WeeklyPanel["icon"],
  stats: WeeklyMatchStats | null,
): WeeklyPanel {
  return {
    key,
    title,
    icon,
    thisWeek: stats?.playedThisWeek ?? null,
    thisWeekLabel: "This week",
    total: stats?.totalMatches ?? null,
    totalLabel: "Total matches",
    firstAt: stats?.firstMatchAt ?? null,
    firstLabel: "First match",
    weekly: stats?.weeklyMatches ?? [],
  };
}

function userCardsPanel(
  key: string,
  title: string,
  icon: WeeklyPanel["icon"],
  stats: WeeklyUserCardsStats | null,
): WeeklyPanel {
  return {
    key,
    title,
    icon,
    thisWeek: stats?.acquiredThisWeek ?? null,
    thisWeekLabel: "This week",
    total: stats?.totalAcquisitions ?? null,
    totalLabel: "Total acquisitions",
    firstAt: stats?.firstAcquisitionAt ?? null,
    firstLabel: "First acquisition",
    weekly: stats?.weeklyAcquisitions ?? [],
  };
}

function paymentPanel(
  key: string,
  title: string,
  icon: WeeklyPanel["icon"],
  stats: WeeklyPaymentStats | null,
): WeeklyPanel {
  return {
    key,
    title,
    icon,
    thisWeek: stats?.createdThisWeek ?? null,
    thisWeekLabel: "This week",
    total: stats?.totalPayments ?? null,
    totalLabel: "Total payments",
    firstAt: stats?.firstPaymentAt ?? null,
    firstLabel: "First payment",
    weekly: stats?.weeklyPayments ?? [],
  };
}

function userAssetsPanel(
  key: string,
  title: string,
  icon: WeeklyPanel["icon"],
  stats: WeeklyUserAssetsStats | null,
): WeeklyPanel {
  return {
    key,
    title,
    icon,
    thisWeek: stats?.purchasedThisWeek ?? null,
    thisWeekLabel: "This week",
    total: stats?.totalPurchases ?? null,
    totalLabel: "Total purchases",
    firstAt: stats?.firstPurchaseAt ?? null,
    firstLabel: "First purchase",
    weekly: stats?.weeklyPurchases ?? [],
  };
}

function PanelCard({
  panel,
  loading,
}: {
  panel: WeeklyPanel;
  loading: boolean;
}) {
  const bars = useMemo(() => buildWeeklyBars(panel.weekly), [panel.weekly]);
  const Icon = panel.icon;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center gap-2 text-gray-400">
        <Icon className="h-4 w-4 text-cyan-400" />
        <span className="text-sm">{panel.title}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-10 gap-y-4">
        <div>
          <StatValue loading={loading} value={panel.thisWeek} />
          <span className="mt-1 block text-sm text-gray-400">
            {panel.thisWeekLabel}
          </span>
        </div>
        <div>
          <StatValue loading={loading} value={panel.total} />
          <span className="mt-1 block text-sm text-gray-400">
            {panel.totalLabel}
          </span>
        </div>
        <div>
          {loading ? (
            <div className="h-7 w-28 animate-pulse rounded bg-zinc-700" />
          ) : (
            <span className="text-lg font-semibold text-white">
              {formatDate(panel.firstAt)}
            </span>
          )}
          <span className="mt-1 block text-sm text-gray-400">
            {panel.firstLabel}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
          Weekly trend
        </p>
        <TrendChart bars={bars} loading={loading} />
      </div>

      {/* Per-week breakdown (collapsible) */}
      <details className="group mt-6 overflow-hidden rounded-lg border border-zinc-800">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-zinc-800/50">
          <span>
            Weekly breakdown
            {!loading && panel.weekly.length > 0
              ? ` (${panel.weekly.length} weeks)`
              : ""}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 text-gray-400">
              <tr>
                <th className="px-4 py-2.5 font-medium">Week start</th>
                <th className="px-4 py-2.5 font-medium">Week end</th>
                <th className="px-4 py-2.5 text-right font-medium">Count</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-3 text-gray-500" colSpan={3}>
                    Loading…
                  </td>
                </tr>
              ) : panel.weekly.length === 0 ? (
                <tr>
                  <td className="px-4 py-3 text-gray-500" colSpan={3}>
                    No data
                  </td>
                </tr>
              ) : (
                panel.weekly.map((w) => (
                  <tr
                    key={w.weekStart}
                    className="border-b border-zinc-800/60 last:border-0"
                  >
                    <td className="px-4 py-2.5 text-gray-200">
                      {formatDate(w.weekStart)}
                    </td>
                    <td className="px-4 py-2.5 text-gray-200">
                      {formatDate(w.weekEnd)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-white">
                      {w.count.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

export default function WeeklyStatsView() {
  const router = useRouter();
  const [quiz, setQuiz] = useState<WeeklySubmissionStats | null>(null);
  const [prediction, setPrediction] = useState<WeeklySubmissionStats | null>(
    null,
  );
  const [future, setFuture] = useState<WeeklySubmissionStats | null>(null);
  const [event, setEvent] = useState<WeeklySubmissionStats | null>(null);
  const [onboarding, setOnboarding] = useState<WeeklyOnboardingStats | null>(
    null,
  );
  const [pitchDuel, setPitchDuel] = useState<WeeklyMatchStats | null>(null);
  const [penaltyShootout, setPenaltyShootout] =
    useState<WeeklyMatchStats | null>(null);
  const [footballChess, setFootballChess] = useState<WeeklyMatchStats | null>(
    null,
  );
  const [userCards, setUserCards] = useState<WeeklyUserCardsStats | null>(
    null,
  );
  const [payments, setPayments] = useState<WeeklyPaymentStats | null>(null);
  const [userAssets, setUserAssets] = useState<WeeklyUserAssetsStats | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [
        quizStats,
        predictionStats,
        futureStats,
        eventStats,
        onboardingStats,
        pitchDuelStats,
        penaltyShootoutStats,
        footballChessStats,
        userCardsStats,
        paymentStats,
        userAssetsStats,
      ] = await Promise.all([
        fetchAdmin<WeeklySubmissionStats>(
          "/api/admin-api/getquizsubmissionweeklystats",
        ),
        fetchAdmin<WeeklySubmissionStats>(
          "/api/admin-api/getpredictionsubmissionweeklystats",
        ),
        fetchAdmin<WeeklySubmissionStats>(
          "/api/admin-api/getfuturesubmissionweeklystats",
        ),
        fetchAdmin<WeeklySubmissionStats>(
          "/api/admin-api/geteventsubmissionweeklystats",
        ),
        fetchAdmin<WeeklyOnboardingStats>(
          "/api/admin-api/getuseronboardingweeklystats",
        ),
        fetchAdmin<WeeklyMatchStats>(
          "/api/admin-api/getpitchduelweeklystats",
        ),
        fetchAdmin<WeeklyMatchStats>(
          "/api/admin-api/getpenaltyshootoutweeklystats",
        ),
        fetchAdmin<WeeklyMatchStats>(
          "/api/admin-api/getfootballchessweeklystats",
        ),
        fetchAdmin<WeeklyUserCardsStats>(
          "/api/admin-api/getusercardsweeklystats",
        ),
        fetchAdmin<WeeklyPaymentStats>(
          "/api/admin-api/getpaymentweeklystats",
        ),
        fetchAdmin<WeeklyUserAssetsStats>(
          "/api/admin-api/getuserassetsweeklystats",
        ),
      ]);
      if (cancelled) return;
      setQuiz(quizStats);
      setPrediction(predictionStats);
      setFuture(futureStats);
      setEvent(eventStats);
      setOnboarding(onboardingStats);
      setPitchDuel(pitchDuelStats);
      setPenaltyShootout(penaltyShootoutStats);
      setFootballChess(footballChessStats);
      setUserCards(userCardsStats);
      setPayments(paymentStats);
      setUserAssets(userAssetsStats);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const timezone = quiz?.timezone ?? onboarding?.timezone ?? "Asia/Kolkata";

  const onboardingPanel: WeeklyPanel = {
    key: "onboarding",
    title: "User onboarding · weekly",
    icon: UserPlus,
    thisWeek: onboarding?.onboardedThisWeek ?? null,
    thisWeekLabel: "This week",
    total: onboarding?.totalOnboarded ?? null,
    totalLabel: "Total onboarded",
    firstAt: onboarding?.firstOnboardedAt ?? null,
    firstLabel: "First onboarded",
    weekly: onboarding?.weeklyOnboarding ?? [],
  };

  const panels: WeeklyPanel[] = [
    onboardingPanel,
    submissionPanel("quiz", "Quiz submissions · weekly", HelpCircle, quiz),
    submissionPanel(
      "prediction",
      "Prediction submissions · weekly",
      Target,
      prediction,
    ),
    submissionPanel(
      "event",
      "Event submissions · weekly",
      CalendarClock,
      event,
    ),

    submissionPanel(
      "future",
      "Future submissions · weekly",
      TrendingUp,
      future,
    ),
    matchPanel("pitchDuel", "Pitch duels · weekly", Swords, pitchDuel),
    matchPanel(
      "penaltyShootout",
      "Penalty shootouts · weekly",
      Gamepad2,
      penaltyShootout,
    ),
    matchPanel(
      "footballChess",
      "Football chess · weekly",
      Grid3x3,
      footballChess,
    ),
    userCardsPanel(
      "userCards",
      "Card acquisitions · weekly",
      Layers,
      userCards,
    ),
    paymentPanel("payments", "Payments · weekly", CreditCard, payments),
    userAssetsPanel(
      "userAssets",
      "Asset purchases · weekly",
      ShoppingBag,
      userAssets,
    ),
  ];

  return (
    <div className="p-6">
      <button
        type="button"
        onClick={() => router.push("/?section=dashboard")}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Weekly stats</h2>
        <p className="mt-1 text-sm text-gray-400">
          All-time weekly breakdown of submissions, onboarding, games, payments,
          and assets ({timezone}, Mon–Sun).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {panels.map((panel) => (
          <PanelCard key={panel.key} panel={panel} loading={loading} />
        ))}
      </div>
    </div>
  );
}
