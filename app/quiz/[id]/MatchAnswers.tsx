"use client";

import { useMemo, useState } from "react";
import type { Quiz, QuizQuestion } from "@/app/api/quiz/route";
import type {
  MatchAnswerProposal,
  MatchAnswerSourceUrl,
  MatchAnswersResult,
} from "@/app/interface/match-answers.interface";
import {
  MATCH_SOURCE_SITES,
  MatchSourceSummary,
  SourceLinks,
  type MatchSourceSite,
} from "@/app/components/matches/MatchSourceSummary";

/** Where each sport's answers come from. */
export interface MatchAnswerSourceConfig extends MatchSourceSite {
  /** Route under `/api/quiz/:id/`. */
  endpoint: string;
  /** What the answers are read off, for the panel's description. */
  pageName: string;
}

const MATCH_ANSWER_SOURCES: Record<string, MatchAnswerSourceConfig> = {
  cricket: {
    ...MATCH_SOURCE_SITES.cricket,
    endpoint: "cricbuzz-answers",
    pageName: "scorecard",
  },
  football: {
    ...MATCH_SOURCE_SITES.football,
    endpoint: "fotmob-answers",
    pageName: "match page (score, goals, cards and stats)",
  },
};

export function matchAnswerSourceFor(
  gameType: string | null,
): MatchAnswerSourceConfig | null {
  return (gameType && MATCH_ANSWER_SOURCES[gameType.toLowerCase()]) || null;
}

/** Same key the settle page uses for a question. */
const questionKey = (question: QuizQuestion, idx: number) =>
  question._id || question.questionNumber?.toString() || idx.toString();

const normalizeOptionValue = (val: string): string => {
  if (val.toLowerCase() === "true") return "Yes";
  if (val.toLowerCase() === "false") return "No";
  return val;
};

const savedAnswer = (question: QuizQuestion) =>
  question.correctAnswer != null && question.correctAnswer !== ""
    ? String(question.correctAnswer)
    : "";

/**
 * Fetches answers from the quiz's source site. It doesn't save anything:
 * `onFetched` hands the proposals to the settle form, which the admin
 * reviews and saves with its own "Update Correct Answers" button.
 */
export function useMatchAnswers(
  quiz: Quiz | null,
  source: MatchAnswerSourceConfig | null,
  onFetched: (result: MatchAnswersResult) => void,
) {
  const [result, setResult] = useState<MatchAnswersResult | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [errorSources, setErrorSources] = useState<MatchAnswerSourceUrl[]>([]);

  const proposals = useMemo(
    () =>
      new Map<string, MatchAnswerProposal>(
        (result?.proposals ?? []).map((p) => [p.questionKey, p]),
      ),
    [result],
  );

  const fetchAnswers = async (matchUrl: string) => {
    if (!quiz || !source) return;
    const failure = `Failed to fetch answers from ${source.name}`;
    setFetching(true);
    setError("");
    setErrorSources([]);
    try {
      const res = await fetch(`/api/quiz/${quiz._id}/${source.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(matchUrl ? { matchUrl } : {}),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload?.success) {
        setResult(null);
        setErrorSources(
          Array.isArray(payload?.sourceUrls) ? payload.sourceUrls : [],
        );
        throw new Error(payload?.message || failure);
      }
      const data = payload.data as MatchAnswersResult;
      setResult(data);
      onFetched(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : failure);
    } finally {
      setFetching(false);
    }
  };

  const clear = () => {
    setResult(null);
    setError("");
    setErrorSources([]);
  };

  return {
    source,
    result,
    proposals,
    fetching,
    error,
    errorSources,
    fetchAnswers,
    clear,
  };
}

export type MatchAnswersState = ReturnType<typeof useMatchAnswers>;

export function MatchAnswersPanel({
  quiz,
  source,
  state,
  onDiscard,
}: {
  quiz: Quiz;
  source: MatchAnswerSourceConfig;
  state: MatchAnswersState;
  /** Put the form back to the saved answers. */
  onDiscard: () => void;
}) {
  const [matchUrl, setMatchUrl] = useState("");
  const { result, fetching, error, errorSources } = state;

  const answered = result?.proposals.filter((p) => p.answer !== null) ?? [];
  const changed = answered.filter((p) => {
    const question = quiz.questionsArray.find(
      (q, idx) => questionKey(q, idx) === p.questionKey,
    );
    return (
      !question ||
      normalizeOptionValue(savedAnswer(question)) !==
        normalizeOptionValue(p.answer ?? "")
    );
  });

  return (
    <div className="mb-6 p-4 rounded-lg border border-sky-900 bg-zinc-800/50">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Fetch answers from {source.name}
          </h3>
          <p className="text-sm text-gray-400">
            Finds this match on {source.name}, reads the answers off its{" "}
            {source.pageName} and fills them in below. Review them, then click
            Update Correct Answers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void state.fetchAnswers(matchUrl)}
          disabled={fetching}
          className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {fetching
            ? `Fetching from ${source.name}…`
            : result
              ? "Fetch again"
              : `Fetch answers from ${source.name}`}
        </button>
      </div>

      <input
        type="url"
        value={matchUrl}
        onChange={(e) => setMatchUrl(e.target.value)}
        placeholder={`Optional: paste a ${source.name} match URL (e.g. ${source.urlExample}) to use that match instead of auto-matching`}
        className="mt-4 w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
      />

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
          <SourceLinks sources={errorSources} />
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-zinc-900 rounded-lg">
          <MatchSourceSummary lookup={result} />

          <div className="mt-4 pt-4 border-t border-zinc-700 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-300">
              Filled in {answered.length} of {result.proposals.length}{" "}
              questions below
              {changed.length > 0 &&
                ` · ${changed.length} differ from the saved answers`}
              . Nothing is saved until you click Update Correct Answers.
            </p>
            <button
              type="button"
              onClick={() => {
                state.clear();
                onDiscard();
              }}
              className="px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-700"
            >
              Discard fetched answers
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** What the source said for one question, shown under it in the settle form. */
export function MatchAnswerNote({
  question,
  proposal,
  sourceName,
}: {
  question: QuizQuestion;
  proposal: MatchAnswerProposal;
  sourceName: string;
}) {
  const saved = savedAnswer(question);
  const differs =
    proposal.answer !== null &&
    saved !== "" &&
    normalizeOptionValue(saved) !== normalizeOptionValue(proposal.answer);

  if (proposal.answer === null) {
    return (
      <div className="mt-3 p-3 rounded-lg border border-zinc-700 bg-zinc-800/60 text-sm">
        <p className="text-gray-300">
          <span className="font-medium text-gray-200">{sourceName}:</span> no
          answer — pick this one by hand.
        </p>
        <p className="text-gray-400 mt-1">{proposal.evidence}</p>
      </div>
    );
  }

  return (
    <div className="mt-3 p-3 rounded-lg border border-sky-800 bg-sky-950/40 text-sm">
      <p className="text-sky-200">
        <span className="font-medium">{sourceName} answer:</span>{" "}
        {normalizeOptionValue(proposal.answer)}
        {differs && (
          <span className="ml-2 text-amber-300">
            (saved: {normalizeOptionValue(saved)})
          </span>
        )}
      </p>
      <p className="text-gray-400 mt-1">{proposal.evidence}</p>
    </div>
  );
}
