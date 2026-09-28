"use client";

import { useState } from "react";
import type { MatchStatus } from "@/app/constants/match-status";
import type { MatchAnswersResult } from "@/app/interface/match-answers.interface";
import { statusBadgeClass } from "@/app/utils/statusBadge";
import {
  lookupTeam,
  matchSourceSiteFor,
  MatchSourceLookupCard,
  useMatchSourceLookup,
  type MatchSourceLookupRequest,
  type MatchSourceSite,
} from "./MatchSourceSummary";

/**
 * The prediction / event status for a match that ended without a result —
 * both use these values.
 */
const NO_WINNER_STATUSES: Partial<Record<MatchStatus, NoWinnerStatus>> = {
  canceled: "CANCELLED",
  abandoned: "ABANDONED",
  no_result: "NO_RESULT",
};
export type NoWinnerStatus = "CANCELLED" | "ABANDONED" | "NO_RESULT";

export interface PickQuestion {
  questionText: string;
  options: string[];
}

type PickMatch = Pick<
  MatchSourceLookupRequest,
  "teamA" | "teamB" | "matchStartTime"
>;

type FetchSourceAnswerPanelProps = {
  gameType: string | null | undefined;
  /** What this is called in the copy. */
  pickName: "prediction" | "event";
  /** The teams and start time to find the match by; may fetch them. */
  resolveMatch: () => PickMatch | Promise<PickMatch>;
  /**
   * Tried in order, all with the same options — the first one the site can
   * answer is used (an event's name, then its description).
   */
  questions: PickQuestion[];
  /** Index into the options of the answer already saved, if any. */
  savedOptionIndex: number | null;
  /** False once settled: answers are still shown, but can't be used. */
  canUpdate: boolean;
  /** Opens the settle dialog with this option pre-selected; nothing is saved yet. */
  onUseAnswer: (optionIndex: number) => void;
  currentStatus: string;
  /** Saves the status; throws with a message on failure. */
  onSetStatus: (status: NoWinnerStatus) => Promise<void>;
};

/**
 * Finds a prediction's or event's match on Cricbuzz (cricket) or FotMob
 * (football), shows its status and result, and works out the answer to the
 * pick's question. When the match was abandoned, cancelled or ended with no
 * result, it offers that status instead of an answer.
 */
export default function FetchSourceAnswerPanel(
  props: FetchSourceAnswerPanelProps,
) {
  const site = matchSourceSiteFor(props.gameType);
  if (!site || !props.questions.length) return null;
  return <FetchSourceAnswerPanelInner {...props} site={site} />;
}

function FetchSourceAnswerPanelInner(
  props: FetchSourceAnswerPanelProps & { site: MatchSourceSite },
) {
  const { site, gameType, pickName, resolveMatch, questions } = props;
  const state = useMatchSourceLookup(site);

  return (
    <MatchSourceLookupCard
      site={site}
      title={`Fetch result from ${site.name}`}
      description={`Finds this ${pickName}'s match on ${site.name}, checks the question and picks the winning option, along with the match status. Nothing is saved until you submit it.`}
      fetchLabel={`Fetch result from ${site.name}`}
      state={state}
      onFetch={(matchUrl) =>
        void state.fetchLookup(async () => {
          const match = await resolveMatch();
          return {
            gameType: gameType ?? "",
            teamA: lookupTeam(match.teamA),
            teamB: lookupTeam(match.teamB),
            matchStartTime: match.matchStartTime,
            questions,
          };
        }, matchUrl)
      }
    >
      {state.result && <PickAnswer {...props} result={state.result} />}
    </MatchSourceLookupCard>
  );
}

function PickAnswer({
  site,
  result,
  pickName,
  questions,
  savedOptionIndex,
  canUpdate,
  onUseAnswer,
  currentStatus,
  onSetStatus,
}: FetchSourceAnswerPanelProps & {
  site: MatchSourceSite;
  result: MatchAnswersResult;
}) {
  const noWinnerStatus = result.suggestedStatus
    ? NO_WINNER_STATUSES[result.suggestedStatus]
    : undefined;
  if (noWinnerStatus) {
    return (
      <NoWinnerRow
        status={noWinnerStatus}
        siteState={result.match.state}
        siteName={site.name}
        pickName={pickName}
        currentStatus={currentStatus}
        canUpdate={canUpdate}
        onSetStatus={onSetStatus}
      />
    );
  }

  const answered = result.proposals.find(
    (p) => p.answer !== null && p.optionIndex !== null,
  );
  const shown = answered ?? result.proposals[0];
  const question = shown ? questions[Number(shown.questionKey)] : undefined;
  if (!shown || !question) return null;

  const options = questions[0].options;
  const sameAsSaved =
    answered !== undefined && savedOptionIndex === answered.optionIndex;

  return (
    <div className="mt-4 border-t border-zinc-700 pt-4">
      <p className="text-sm text-gray-400">Question checked</p>
      <p className="mt-1 text-white">{question.questionText}</p>

      {answered ? (
        <div className="mt-3 rounded-lg border border-sky-800 bg-sky-950/40 p-3 text-sm">
          <p className="text-sky-200">
            <span className="font-medium">{site.name} answer:</span>{" "}
            {answered.answer}
            {savedOptionIndex !== null &&
              (sameAsSaved ? (
                <span className="ml-2 text-emerald-300">
                  (same as the saved answer)
                </span>
              ) : (
                <span className="ml-2 text-amber-300">
                  (saved: {options[savedOptionIndex]})
                </span>
              ))}
          </p>
          <p className="mt-1 text-gray-400">{answered.evidence}</p>
        </div>
      ) : (
        <div className="mt-3 rounded-lg border border-zinc-700 bg-zinc-900/60 p-3 text-sm">
          <p className="text-gray-300">
            <span className="font-medium text-gray-200">{site.name}:</span> no
            answer — pick this one by hand.
          </p>
          <p className="mt-1 text-gray-400">{shown.evidence}</p>
        </div>
      )}

      {answered && answered.optionIndex !== null && canUpdate && !sameAsSaved && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-300">
            {result.match.isComplete
              ? "Nothing is saved until you submit it."
              : `The match isn't finished on ${site.name}, so this can still change — wait for the result before saving it.`}
          </p>
          {result.match.isComplete && (
            <button
              type="button"
              onClick={() => onUseAnswer(answered.optionIndex as number)}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
            >
              Use this answer
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function NoWinnerRow({
  status,
  siteState,
  siteName,
  pickName,
  currentStatus,
  canUpdate,
  onSetStatus,
}: {
  status: NoWinnerStatus;
  siteState: string;
  siteName: string;
  pickName: string;
  currentStatus: string;
  canUpdate: boolean;
  onSetStatus: (status: NoWinnerStatus) => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const same = currentStatus.toUpperCase() === status;

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await onSetStatus(status);
      setConfirming(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 border-t border-zinc-700 pt-4">
      <p className="flex flex-wrap items-center gap-2 text-sm text-gray-300">
        {siteName} shows this match as &ldquo;{siteState}&rdquo;, so there&apos;s
        no winner to pick. The {pickName} status should be
        <span
          className={`rounded-md px-3 py-0.5 text-xs font-medium ${statusBadgeClass(
            status,
          )}`}
        >
          {status}
        </span>
        <span className="text-gray-400">
          {same ? "— it already is." : `— it's ${currentStatus}.`}
        </span>
      </p>
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
      {!same && canUpdate && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {confirming ? (
            <>
              <span className="text-sm text-gray-300">
                Set this {pickName} to {status}?
              </span>
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200 disabled:opacity-50"
              >
                {saving ? "Updating…" : "Yes, update status"}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={saving}
                className="rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
            >
              Set {pickName} status to {status}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
