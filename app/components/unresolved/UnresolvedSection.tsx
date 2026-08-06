"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import { Atom } from "react-loading-indicators";
import { RefreshCw } from "lucide-react";
import type { Team } from "@/app/api/tournament/teams/route";
import type {
  PendingEvent,
  PendingPrediction,
  PendingQuiz,
} from "@/app/interface/pending-settlement.interface";
import type { EventWinningOption } from "@/app/models/events.model";
import { QUIZ_STATUS_ANSWER_UPDATED } from "@/app/constants/quiz-status";
import {
  PREDICTION_STATUS_CANCELLED,
  PREDICTION_STATUS_WINNING_TEAM_UPDATED,
} from "@/app/constants/prediction-status";
import { EventStatus } from "@/app/utils/enums/event.enum";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";
import { Section } from "@/app/utils/enums/section.enum";
import { unresolvedApi, type PredictionWinningTeam } from "./unresolved-api";
import {
  ConfirmSettleDialog,
  DeclareResultDialog,
  type OutcomeChoice,
} from "./UnresolvedDialogs";

type UnresolvedTab = "quizzes" | "predictions" | "events";

const UNRESOLVED_TABS: readonly UnresolvedTab[] = [
  "quizzes",
  "predictions",
  "events",
];

const TAB_LABELS: Record<UnresolvedTab, string> = {
  quizzes: "Quizzes",
  predictions: "Predictions",
  events: "Events",
};

export const QUERY_UNRESOLVED_TAB = "unresolvedTab";

function isUnresolvedTab(value: string | null): value is UnresolvedTab {
  return UNRESOLVED_TABS.includes(value as UnresolvedTab);
}

type Lists = {
  quizzes: PendingQuiz[];
  predictions: PendingPrediction[];
  events: PendingEvent[];
};

const EMPTY_LISTS: Lists = { quizzes: [], predictions: [], events: [] };

type TabErrors = Record<UnresolvedTab, string>;

const NO_ERRORS: TabErrors = { quizzes: "", predictions: "", events: "" };

type SettleTarget =
  | { kind: "quizzes"; quiz: PendingQuiz }
  | { kind: "predictions"; prediction: PendingPrediction }
  | { kind: "events"; event: PendingEvent };

type DeclareTarget =
  | { kind: "predictions"; prediction: PendingPrediction }
  | { kind: "events"; event: PendingEvent };

const messageOf = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong";

const formatCoins = (value: number | null | undefined) =>
  typeof value === "number" ? value.toLocaleString("en-IN") : "—";

function formatDateIST(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** How long ago the entry window opened — the API already sorts on this. */
function overdueLabel(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  if (date.getTime() > Date.now()) {
    return `Opens in ${formatDistanceToNowStrict(date)}`;
  }
  return `Overdue by ${formatDistanceToNowStrict(date)}`;
}

function teamLabel(team: Team | null | undefined): string | null {
  return team?.displayName || team?.name || team?.abbreviation || null;
}

function fixtureLabel(
  teamA: Team | null | undefined,
  teamB: Team | null | undefined,
): string | null {
  const left = teamLabel(teamA);
  const right = teamLabel(teamB);
  return left && right ? `${left} v ${right}` : null;
}

function statusBadgeClass(status: string): string {
  switch (status.toUpperCase()) {
    case "LIVE":
      return "bg-emerald-900 text-emerald-200";
    case "ACTIVE":
      return "bg-teal-900 text-teal-200";
    case "UPCOMING":
      return "bg-violet-900 text-violet-200";
    case "FINISHED":
      return "bg-zinc-700 text-zinc-200";
    case "ENTRYNOTSTARTED":
      return "bg-slate-700 text-slate-200";
    case "ENTRYCLOSED":
      return "bg-amber-900 text-amber-200";
    case QUIZ_STATUS_ANSWER_UPDATED:
    case PREDICTION_STATUS_WINNING_TEAM_UPDATED:
    case EventStatus.WINNING_OPTION_UPDATED:
      return "bg-blue-900 text-blue-200";
    case PREDICTION_STATUS_CANCELLED:
    case "DELETED":
      return "bg-red-900 text-red-200";
    case "NOT_VISIBLE":
      return "bg-rose-900 text-rose-200";
    case "ADMIN_VISIBLE":
      return "bg-cyan-900 text-cyan-200";
    default:
      return "bg-zinc-800 text-zinc-200";
  }
}

/** True once step 1 is done and only the payout / XP step remains. */
const quizResultDeclared = (quiz: PendingQuiz) =>
  quiz.quizStatus?.toUpperCase() === QUIZ_STATUS_ANSWER_UPDATED;

const predictionResultDeclared = (prediction: PendingPrediction) =>
  prediction.predictionStatus?.toUpperCase() ===
  PREDICTION_STATUS_WINNING_TEAM_UPDATED;

const eventResultDeclared = (event: PendingEvent) =>
  event.eventStatus?.toUpperCase() === EventStatus.WINNING_OPTION_UPDATED;

const predictionCancelled = (prediction: PendingPrediction) =>
  prediction.predictionStatus?.toUpperCase() === PREDICTION_STATUS_CANCELLED;

/**
 * Seed coins (`initialCoinsOn*`) exist to make early odds look sane and are
 * subtracted from the pot before distribution, so the user-attributed total is
 * what the admin should see as exposure.
 */
function predictionNetCoins(prediction: PendingPrediction): number {
  const drawIsLive =
    prediction.oddsDraw !== null && prediction.oddsDraw !== undefined;
  return (
    (prediction.coinsOnTeamA ?? 0) -
    (prediction.initialCoinsOnTeamA ?? 0) +
    ((prediction.coinsOnTeamB ?? 0) - (prediction.initialCoinsOnTeamB ?? 0)) +
    (drawIsLive
      ? (prediction.coinsOnDraw ?? 0) - (prediction.initialCoinsOnDraw ?? 0)
      : 0)
  );
}

function eventNetCoins(event: PendingEvent): number {
  return (
    (event.coinsOnYes ?? 0) -
    (event.initialCoinsOnYes ?? 0) +
    ((event.coinsOnNo ?? 0) - (event.initialCoinsOnNo ?? 0)) +
    (event.haveThreeOptions
      ? (event.coinsOnMaybe ?? 0) - (event.initialCoinsOnMaybe ?? 0)
      : 0)
  );
}

/** Draw is only a legal outcome for football. */
function predictionOutcomeOptions(
  prediction: PendingPrediction,
): OutcomeChoice[] {
  const options: OutcomeChoice[] = [
    {
      value: "A",
      label: teamLabel(prediction.teamA) ?? "Team A",
      hint: "A",
    },
    {
      value: "B",
      label: teamLabel(prediction.teamB) ?? "Team B",
      hint: "B",
    },
  ];
  if (prediction.gameType?.toLowerCase() === "football") {
    options.push({ value: "D", label: "Draw", hint: "D" });
  }
  return options;
}

/** `M` is rejected by the backend unless the event has three options. */
function eventOutcomeOptions(event: PendingEvent): OutcomeChoice[] {
  const options: OutcomeChoice[] = [
    {
      value: "Y",
      label: event.yesPlaceholder || "Yes",
      hint: "Y",
      labelClass: "text-emerald-400",
    },
    {
      value: "N",
      label: event.noPlaceholder || "No",
      hint: "N",
      labelClass: "text-rose-400",
    },
  ];
  if (event.haveThreeOptions) {
    options.push({
      value: "M",
      label: event.maybePlaceholder || "Maybe",
      hint: "M",
      labelClass: "text-amber-400",
    });
  }
  return options;
}

export default function UnresolvedSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState<UnresolvedTab>(() => {
    const fromUrl = searchParams.get(QUERY_UNRESOLVED_TAB);
    return isUnresolvedTab(fromUrl) ? fromUrl : "quizzes";
  });
  const [lists, setLists] = useState<Lists>(EMPTY_LISTS);
  const [errors, setErrors] = useState<TabErrors>(NO_ERRORS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState("");
  const [showCancelledPredictions, setShowCancelledPredictions] =
    useState(false);

  const [settleTarget, setSettleTarget] = useState<SettleTarget | null>(null);
  const [declareTarget, setDeclareTarget] = useState<DeclareTarget | null>(
    null,
  );
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [dialogBusy, setDialogBusy] = useState(false);
  const [dialogError, setDialogError] = useState("");

  const loadAll = useCallback(async (options?: { silent?: boolean }) => {
    if (options?.silent) setRefreshing(true);
    else setLoading(true);
    const [quizzes, predictions, events] = await Promise.allSettled([
      unresolvedApi.listQuizzes(),
      unresolvedApi.listPredictions(),
      unresolvedApi.listEvents(),
    ]);
    setLists({
      quizzes: quizzes.status === "fulfilled" ? quizzes.value : [],
      predictions: predictions.status === "fulfilled" ? predictions.value : [],
      events: events.status === "fulfilled" ? events.value : [],
    });
    setErrors({
      quizzes: quizzes.status === "rejected" ? messageOf(quizzes.reason) : "",
      predictions:
        predictions.status === "rejected" ? messageOf(predictions.reason) : "",
      events: events.status === "rejected" ? messageOf(events.reason) : "",
    });
    setLoading(false);
    setRefreshing(false);
  }, []);

  /** Settled rows leave the list on their own — refetch instead of splicing. */
  const reloadTab = useCallback(async (target: UnresolvedTab) => {
    try {
      if (target === "quizzes") {
        const data = await unresolvedApi.listQuizzes();
        setLists((prev) => ({ ...prev, quizzes: data }));
      } else if (target === "predictions") {
        const data = await unresolvedApi.listPredictions();
        setLists((prev) => ({ ...prev, predictions: data }));
      } else {
        const data = await unresolvedApi.listEvents();
        setLists((prev) => ({ ...prev, events: data }));
      }
      setErrors((prev) => ({ ...prev, [target]: "" }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [target]: messageOf(error) }));
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    const fromUrl = searchParams.get(QUERY_UNRESOLVED_TAB);
    if (isUnresolvedTab(fromUrl)) setTab(fromUrl);
  }, [searchParams]);

  const selectTab = useCallback(
    (next: UnresolvedTab) => {
      setTab(next);
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", Section.UNRESOLVED);
      sp.set(QUERY_UNRESOLVED_TAB, next);
      stripAdminHomeQueryNoise(Section.UNRESOLVED, sp);
      router.replace(`/?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const openDetail = useCallback(
    (href: string) => {
      const sep = href.includes("?") ? "&" : "?";
      router.push(`${href}${sep}from=${Section.UNRESOLVED}`, { scroll: false });
    },
    [router],
  );

  const cancelledPredictions = useMemo(
    () => lists.predictions.filter(predictionCancelled),
    [lists.predictions],
  );

  // The backend excludes CANCELLED for events but not for predictions, so a
  // cancelled prediction nobody should settle still arrives in the worklist.
  const visiblePredictions = useMemo(
    () =>
      showCancelledPredictions
        ? lists.predictions
        : lists.predictions.filter((p) => !predictionCancelled(p)),
    [lists.predictions, showCancelledPredictions],
  );

  const counts: Record<UnresolvedTab, number> = {
    quizzes: lists.quizzes.length,
    predictions: lists.predictions.length - cancelledPredictions.length,
    events: lists.events.length,
  };

  const closeDialogs = () => {
    setSettleTarget(null);
    setDeclareTarget(null);
    setSelectedOutcome(null);
    setDialogError("");
  };

  const openDeclareDialog = (target: DeclareTarget) => {
    setDialogError("");
    setSelectedOutcome(null);
    setDeclareTarget(target);
  };

  const openSettleDialog = (target: SettleTarget) => {
    setDialogError("");
    setSettleTarget(target);
  };

  const handleDeclareSubmit = async () => {
    if (!declareTarget || !selectedOutcome) return;
    setDialogBusy(true);
    setDialogError("");
    try {
      if (declareTarget.kind === "predictions") {
        const prediction = declareTarget.prediction;
        const winningTeam = selectedOutcome as PredictionWinningTeam;
        const winningTeamId =
          winningTeam === "A"
            ? prediction.teamA?._id
            : winningTeam === "B"
              ? prediction.teamB?._id
              : undefined;
        if (winningTeam !== "D" && !winningTeamId) {
          throw new Error(
            "This prediction has no team id for the selected side.",
          );
        }
        await unresolvedApi.declarePredictionResult(
          prediction._id,
          winningTeam,
          winningTeamId,
        );
        setNotice(
          `Result declared for ${prediction.predictionId}. Settle it to pay out.`,
        );
        await reloadTab("predictions");
      } else {
        const event = declareTarget.event;
        await unresolvedApi.declareEventResult(
          event._id,
          selectedOutcome as EventWinningOption,
        );
        setNotice(
          `Result declared for "${event.eventName}". Settle it to pay out.`,
        );
        await reloadTab("events");
      }
      closeDialogs();
    } catch (error) {
      setDialogError(messageOf(error));
    } finally {
      setDialogBusy(false);
    }
  };

  const handleSettleConfirm = async () => {
    if (!settleTarget) return;
    setDialogBusy(true);
    setDialogError("");
    try {
      let message: string | null = null;
      if (settleTarget.kind === "quizzes") {
        message = await unresolvedApi.settleQuiz(settleTarget.quiz._id);
        setNotice(message || `Settled ${settleTarget.quiz.quizId}.`);
        await reloadTab("quizzes");
      } else if (settleTarget.kind === "predictions") {
        message = await unresolvedApi.settlePrediction(
          settleTarget.prediction._id,
        );
        setNotice(
          message || `Settled ${settleTarget.prediction.predictionId}.`,
        );
        await reloadTab("predictions");
      } else {
        message = await unresolvedApi.settleEvent(settleTarget.event._id);
        setNotice(message || `Settled "${settleTarget.event.eventName}".`);
        await reloadTab("events");
      }
      closeDialogs();
    } catch (error) {
      setDialogError(messageOf(error));
    } finally {
      setDialogBusy(false);
    }
  };

  const settleDialogProps = useMemo(() => {
    if (!settleTarget) return null;
    if (settleTarget.kind === "quizzes") {
      const quiz = settleTarget.quiz;
      return {
        title: "Settle quiz",
        description:
          "This credits XP to every submission, creates reward popups and sends notifications.",
        facts: [
          { label: "Quiz", value: quiz.quizId },
          {
            label: "Fixture",
            value: fixtureLabel(quiz.teamA, quiz.teamB) ?? "—",
          },
          {
            label: "Submissions affected",
            value: formatCoins(quiz.totalSubmission ?? 0),
          },
        ],
      };
    }
    if (settleTarget.kind === "predictions") {
      const prediction = settleTarget.prediction;
      const declared =
        prediction.winningTeam === "A"
          ? (teamLabel(prediction.teamA) ?? "Team A")
          : prediction.winningTeam === "B"
            ? (teamLabel(prediction.teamB) ?? "Team B")
            : prediction.winningTeam === "D"
              ? "Draw"
              : "—";
      return {
        title: "Distribute prediction payouts",
        description:
          "This pays every winning bet and closes the prediction. Bets with no winners are marked LOST.",
        facts: [
          { label: "Prediction", value: prediction.predictionId },
          { label: "Declared winner", value: declared },
          {
            label: "Pot (excl. seed coins)",
            value: formatCoins(predictionNetCoins(prediction)),
          },
        ],
      };
    }
    const event = settleTarget.event;
    const declared =
      event.winningOption === "Y"
        ? event.yesPlaceholder
        : event.winningOption === "N"
          ? event.noPlaceholder
          : event.winningOption === "M"
            ? (event.maybePlaceholder ?? "Maybe")
            : "—";
    return {
      title: "Distribute event payouts",
      description:
        "This pays every winning bet and closes the event. Bets with no winners are marked LOST.",
      facts: [
        { label: "Event", value: event.eventName },
        { label: "Declared winner", value: declared ?? "—" },
        {
          label: "Pot (excl. seed coins)",
          value: formatCoins(eventNetCoins(event)),
        },
      ],
    };
  }, [settleTarget]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center md:min-h-screen">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
      </div>
    );
  }

  const activeError = errors[tab];

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Unresolved</h2>
          <p className="mt-1 text-sm text-gray-400">
            Everything whose entry window has opened but that is still awaiting
            settlement. Most overdue first.
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadAll({ silent: true })}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-gray-200 transition-colors hover:bg-zinc-800 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            aria-hidden
          />
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {notice ? (
        <div className="mb-6 flex items-start justify-between gap-4 rounded-md border border-emerald-800 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200">
          <p>{notice}</p>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="shrink-0 text-emerald-400 hover:text-emerald-200"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="mb-6 flex flex-wrap gap-2 border-b border-zinc-800">
        {UNRESOLVED_TABS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => selectTab(value)}
            className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === value
                ? "border-cyan-500 text-white"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            {TAB_LABELS[value]}
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                counts[value] > 0
                  ? "bg-amber-900 text-amber-200"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {counts[value]}
            </span>
          </button>
        ))}
      </div>

      {activeError ? (
        <div className="flex flex-col items-start gap-3 rounded-md border border-red-900 bg-red-950/30 p-4">
          <p className="text-red-300">{activeError}</p>
          <button
            type="button"
            onClick={() => reloadTab(tab)}
            className="rounded-md bg-white px-4 py-2 text-sm text-black hover:bg-zinc-200"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {tab === "quizzes" && (
            <WorklistList
              isEmpty={lists.quizzes.length === 0}
              emptyMessage="No quizzes pending settlement 🎉"
            >
              {lists.quizzes.map((quiz) => {
                const declared = quizResultDeclared(quiz);
                return (
                  <WorklistRow
                    key={quiz._id}
                    title={fixtureLabel(quiz.teamA, quiz.teamB) ?? quiz.quizId}
                    subtitle={quiz.quizId}
                    status={quiz.quizStatus}
                    overdue={overdueLabel(quiz.entryStartTime)}
                    facts={[
                      { label: "Tournament", value: quiz.tournament ?? "—" },

                      {
                        label: "Match start",
                        value: formatDateIST(quiz.matchStartTime),
                      },
                      {
                        label: "Questions",
                        value: String(quiz.totalQuestions ?? 0),
                      },
                      {
                        label: "Submissions",
                        value: formatCoins(quiz.totalSubmission ?? 0),
                      },
                    ]}
                    onOpen={() => openDetail(`/quiz/${quiz._id}`)}
                    action={
                      declared ? (
                        <PrimaryAction
                          tone="settle"
                          onClick={() =>
                            openSettleDialog({ kind: "quizzes", quiz })
                          }
                        >
                          Settle now
                        </PrimaryAction>
                      ) : (
                        <PrimaryAction
                          tone="declare"
                          onClick={() =>
                            openDetail(`/quiz/${quiz._id}/settleQuiz`)
                          }
                        >
                          Declare answers
                        </PrimaryAction>
                      )
                    }
                  />
                );
              })}
            </WorklistList>
          )}

          {tab === "predictions" && (
            <>
              {cancelledPredictions.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-400">
                  <p>
                    {cancelledPredictions.length} cancelled prediction
                    {cancelledPredictions.length === 1 ? "" : "s"} returned by
                    the API — nobody should settle these.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCancelledPredictions((prev) => !prev)}
                    className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-gray-200 hover:bg-zinc-800"
                  >
                    {showCancelledPredictions ? "Hide" : "Show"} cancelled
                  </button>
                </div>
              )}
              <WorklistList
                isEmpty={visiblePredictions.length === 0}
                emptyMessage="No predictions pending settlement 🎉"
              >
                {visiblePredictions.map((prediction) => {
                  const declared = predictionResultDeclared(prediction);
                  const cancelled = predictionCancelled(prediction);
                  return (
                    <WorklistRow
                      key={prediction._id}
                      title={
                        fixtureLabel(prediction.teamA, prediction.teamB) ??
                        prediction.predictionId
                      }
                      subtitle={prediction.predictionId}
                      status={prediction.predictionStatus}
                      // entryStartTime is never written by the backend, so the
                      // match start is the only real time signal here.
                      overdue={overdueLabel(
                        prediction.entryStartTime ?? prediction.matchStartTime,
                      )}
                      facts={[
                        {
                          label: "Tournament",
                          value:
                            prediction.tournamentData?.tournamentName ??
                            prediction.tournament ??
                            "—",
                        },
                        {
                          label: "Match start",
                          value: formatDateIST(prediction.matchStartTime),
                        },
                        {
                          label: "Coins (excl. seed)",
                          value: formatCoins(predictionNetCoins(prediction)),
                        },
                        {
                          label: "Game type",
                          value: prediction.gameType ?? "—",
                        },
                      ]}
                      onOpen={() => openDetail(`/prediction/${prediction._id}`)}
                      action={
                        cancelled ? null : declared ? (
                          <PrimaryAction
                            tone="settle"
                            onClick={() =>
                              openSettleDialog({
                                kind: "predictions",
                                prediction,
                              })
                            }
                          >
                            Settle now
                          </PrimaryAction>
                        ) : (
                          <PrimaryAction
                            tone="declare"
                            onClick={() =>
                              openDeclareDialog({
                                kind: "predictions",
                                prediction,
                              })
                            }
                          >
                            Declare result
                          </PrimaryAction>
                        )
                      }
                    />
                  );
                })}
              </WorklistList>
            </>
          )}

          {tab === "events" && (
            <WorklistList
              isEmpty={lists.events.length === 0}
              emptyMessage="No events pending settlement 🎉"
            >
              {lists.events.map((event) => {
                const declared = eventResultDeclared(event);
                return (
                  <WorklistRow
                    key={event._id}
                    title={event.eventName}
                    subtitle={
                      fixtureLabel(event.teamA, event.teamB) ??
                      "Standalone event"
                    }
                    status={event.eventStatus}
                    overdue={overdueLabel(event.entryStartTime)}
                    facts={[
                      {
                        label: "Tournament",
                        value:
                          event.tournamentData?.tournamentName ??
                          event.tournament ??
                          "—",
                      },
                      {
                        label: "Entry closes",
                        value: formatDateIST(event.entryCloseTime),
                      },
                      {
                        label: "Coins (excl. seed)",
                        value: formatCoins(eventNetCoins(event)),
                      },
                      {
                        label: "Options",
                        value: event.haveThreeOptions ? "3-way" : "Yes / No",
                      },
                    ]}
                    onOpen={() => openDetail(`/events?id=${event._id}`)}
                    action={
                      declared ? (
                        <PrimaryAction
                          tone="settle"
                          onClick={() =>
                            openSettleDialog({ kind: "events", event })
                          }
                        >
                          Settle now
                        </PrimaryAction>
                      ) : (
                        <PrimaryAction
                          tone="declare"
                          onClick={() =>
                            openDeclareDialog({ kind: "events", event })
                          }
                        >
                          Declare result
                        </PrimaryAction>
                      )
                    }
                  />
                );
              })}
            </WorklistList>
          )}
        </>
      )}

      {declareTarget ? (
        <DeclareResultDialog
          title={
            declareTarget.kind === "predictions"
              ? "Declare winning team"
              : "Declare winning option"
          }
          description={
            declareTarget.kind === "predictions"
              ? "Participants are notified as soon as the result is declared. Payouts run as a separate step."
              : "Payouts run as a separate step once the winning option is set."
          }
          options={
            declareTarget.kind === "predictions"
              ? predictionOutcomeOptions(declareTarget.prediction)
              : eventOutcomeOptions(declareTarget.event)
          }
          selected={selectedOutcome}
          onSelect={setSelectedOutcome}
          error={dialogError}
          busy={dialogBusy}
          onCancel={closeDialogs}
          onSubmit={handleDeclareSubmit}
        />
      ) : null}

      {settleTarget && settleDialogProps ? (
        <ConfirmSettleDialog
          title={settleDialogProps.title}
          description={settleDialogProps.description}
          facts={settleDialogProps.facts}
          error={dialogError}
          busy={dialogBusy}
          onCancel={closeDialogs}
          onConfirm={handleSettleConfirm}
        />
      ) : null}
    </div>
  );
}

/** An empty worklist is the good state, not an error. */
function WorklistList({
  isEmpty,
  emptyMessage,
  children,
}: {
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
}) {
  if (isEmpty) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-10 text-center">
        <p className="text-lg font-medium text-zinc-200">{emptyMessage}</p>
        <p className="mt-1 text-sm text-zinc-500">
          Nothing here needs your attention right now.
        </p>
      </div>
    );
  }
  return <ul className="grid gap-4">{children}</ul>;
}

function WorklistRow({
  title,
  subtitle,
  status,
  overdue,
  facts,
  action,
  onOpen,
}: {
  title: string;
  subtitle: string;
  status: string;
  overdue: string;
  facts: { label: string; value: string }[];
  action: ReactNode;
  onOpen: () => void;
}) {
  return (
    <li>
      <article
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
        className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 transition-colors hover:border-zinc-700 hover:bg-zinc-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold leading-snug text-white">
                {title}
              </h3>
              <span
                className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${statusBadgeClass(status)}`}
              >
                {status}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
          </div>
          <span className="shrink-0 rounded-md bg-amber-950/60 px-2.5 py-1 text-xs font-medium text-amber-300">
            {overdue}
          </span>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-zinc-500">{fact.label}</dt>
              <dd className="mt-0.5 truncate font-medium text-zinc-200">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        {action ? (
          <div
            className="mt-5 flex justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            {action}
          </div>
        ) : null}
      </article>
    </li>
  );
}

function PrimaryAction({
  tone,
  onClick,
  children,
}: {
  tone: "declare" | "settle";
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
        tone === "settle"
          ? "bg-amber-600 hover:bg-amber-700"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {children}
    </button>
  );
}
