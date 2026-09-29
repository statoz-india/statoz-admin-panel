"use client";

import { useMemo, useState } from "react";
import type { Quiz, QuizQuestion } from "@/app/api/quiz/route";
import { lookupSofascoreMatch, withSofascoreFallback } from "@/app/api/utils/sofascore";
import type {
  MatchAnswerProposal,
  MatchAnswerSource,
  MatchAnswerSourceUrl,
  MatchAnswersResult,
} from "@/app/interface/match-answers.interface";
import {
  errorSourceUrls,
  MATCH_SOURCE_SITES,
  matchSourceSitesFor,
  matchUrlPlaceholder,
  MatchSourceSummary,
  resultsInSiteOrder,
  siteNames,
  SiteFetchButtons,
  sourceColumnsClass,
  SourceLinks,
  type MatchSourceResults,
  type MatchSourceSite,
} from "@/app/components/matches/MatchSourceSummary";

/** Where a quiz's answers can come from. */
export interface MatchAnswerSourceConfig extends MatchSourceSite {
  /** Route under `/api/quiz/:id/`; Sofascore has none — it's read from the browser. */
  endpoint?: string;
}

const MATCH_ANSWER_SOURCES: Record<MatchAnswerSource, MatchAnswerSourceConfig> = {
  cricbuzz: { ...MATCH_SOURCE_SITES.cricbuzz, endpoint: "cricbuzz-answers" },
  fotmob: { ...MATCH_SOURCE_SITES.fotmob, endpoint: "fotmob-answers" },
  sofascore: MATCH_SOURCE_SITES.sofascore,
};

/** Cricket → Cricbuzz or Sofascore, football → FotMob or Sofascore, basketball → Sofascore. */
export function matchAnswerSourcesFor(
  gameType: string | null,
): MatchAnswerSourceConfig[] {
  return matchSourceSitesFor(gameType).map((s) => MATCH_ANSWER_SOURCES[s.id]);
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

/** Works out a quiz's answers on `source` — Sofascore from this browser, the others on our server. */
async function requestAnswers(
  quiz: Quiz,
  gameType: string,
  source: MatchAnswerSourceConfig,
  matchUrl: string,
): Promise<MatchAnswersResult> {
  if (!source.endpoint) {
    const alternative = gameType.toLowerCase() === "cricket" ? MATCH_ANSWER_SOURCES.cricbuzz
      : gameType.toLowerCase() === "football" ? MATCH_ANSWER_SOURCES.fotmob : undefined;
    return withSofascoreFallback(() => lookupSofascoreMatch(
      {
        gameType,
        teamA: quiz.teamA,
        teamB: quiz.teamB,
        matchStartTime: quiz.matchStartTime,
        questions: quiz.questionsArray ?? [],
      },
      matchUrl,
    ), alternative ? () => requestAnswers(quiz, gameType, alternative, "") : undefined, matchUrl);
  }
  const res = await fetch(`/api/quiz/${quiz._id}/${source.endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(matchUrl ? { matchUrl } : {}),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok || !payload?.success) {
    throw Object.assign(
      new Error(payload?.message || `Failed to fetch answers from ${source.name}`),
      { sourceUrls: errorSourceUrls(payload) },
    );
  }
  return payload.data as MatchAnswersResult;
}

/** One site's answer to a question. */
export interface FetchedProposal {
  sourceName: string;
  proposal: MatchAnswerProposal;
}

/**
 * Fetches answers from the source site the admin picks. It doesn't save
 * anything: `onFetched` hands the proposals to the settle form, which the
 * admin reviews and saves with its own "Update Correct Answers" button.
 * Each site's answers are kept, so fetching from a second site shows both.
 */
export function useMatchAnswers(
  quiz: Quiz | null,
  gameType: string | null,
  onFetched: (result: MatchAnswersResult) => void,
) {
  const [resultsBySource, setResultsBySource] = useState<MatchSourceResults>({});
  /** The site whose answers are in the form — the last one fetched. */
  const [latestSource, setLatestSource] = useState<MatchAnswerSource | null>(null);
  const [fetchingSource, setFetchingSource] =
    useState<MatchAnswerSourceConfig | null>(null);
  const [error, setError] = useState("");
  const [errorSources, setErrorSources] = useState<MatchAnswerSourceUrl[]>([]);

  const results = useMemo(
    () => resultsInSiteOrder(matchAnswerSourcesFor(gameType), resultsBySource),
    [gameType, resultsBySource],
  );

  /** Question key → each site's answer, in the sites' order. */
  const proposals = useMemo(() => {
    const byQuestion = new Map<string, FetchedProposal[]>();
    for (const result of results) {
      const sourceName = MATCH_SOURCE_SITES[result.source].name;
      for (const proposal of result.proposals) {
        byQuestion.set(proposal.questionKey, [
          ...(byQuestion.get(proposal.questionKey) ?? []),
          { sourceName, proposal },
        ]);
      }
    }
    return byQuestion;
  }, [results]);

  const fetchAnswers = async (
    source: MatchAnswerSourceConfig,
    matchUrl: string,
  ) => {
    if (!quiz) return;
    setFetchingSource(source);
    setError("");
    setErrorSources([]);
    try {
      const data = await requestAnswers(quiz, gameType ?? "", source, matchUrl.trim());
      // Keyed by where it came from: a Sofascore fallback lands under Cricbuzz / FotMob.
      setResultsBySource((prev) => ({ ...prev, [data.source]: data }));
      setLatestSource(data.source);
      onFetched(data);
    } catch (err) {
      // Keep the earlier results: their answers are still in the form, and
      // their notes and Discard button go with them.
      setErrorSources(errorSourceUrls(err));
      setError(
        err instanceof Error
          ? err.message
          : `Failed to fetch answers from ${source.name}`,
      );
    } finally {
      setFetchingSource(null);
    }
  };

  const clear = () => {
    setResultsBySource({});
    setLatestSource(null);
    setError("");
    setErrorSources([]);
  };

  return {
    /** Every site fetched so far, in the sites' order. */
    results,
    /** The result whose answers are in the form. */
    latest: latestSource ? (resultsBySource[latestSource] ?? null) : null,
    proposals,
    fetchingSource,
    error,
    errorSources,
    fetchAnswers,
    clear,
  };
}

export type MatchAnswersState = ReturnType<typeof useMatchAnswers>;

export function MatchAnswersPanel({
  quiz,
  sources,
  state,
  onDiscard,
}: {
  quiz: Quiz;
  sources: MatchAnswerSourceConfig[];
  state: MatchAnswersState;
  /** Put the form back to the saved answers. */
  onDiscard: () => void;
}) {
  const [matchUrl, setMatchUrl] = useState("");
  const { results, latest, fetchingSource, error, errorSources } = state;

  const answered = latest?.proposals.filter((p) => p.answer !== null) ?? [];
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
            Fetch answers from {siteNames(sources)}
          </h3>
          <p className="text-sm text-gray-400">
            Finds this match on the site you pick, reads the answers off the
            match&apos;s scorecard and stats, and fills them in below. Review
            them, then click Update Correct Answers.
          </p>
        </div>
        <SiteFetchButtons
          sites={sources}
          fetchLabel={(source) => `Fetch answers from ${source.name}`}
          fetchingSite={fetchingSource}
          fetchedSources={results.map((r) => r.source)}
          onFetch={(source) => void state.fetchAnswers(source, matchUrl)}
        />
      </div>

      <input
        type="url"
        value={matchUrl}
        onChange={(e) => setMatchUrl(e.target.value)}
        placeholder={matchUrlPlaceholder(sources)}
        className="mt-4 w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-600"
      />

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
          <SourceLinks sources={errorSources} />
        </div>
      )}

      {latest && (
        <>
          <div className={`mt-4 ${sourceColumnsClass(results.length)}`}>
            {results.map((result) => (
              <div key={result.source} className="min-w-0 p-4 bg-zinc-900 rounded-lg">
                <MatchSourceSummary lookup={result} />
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-300">
              Filled in {answered.length} of {latest.proposals.length}{" "}
              questions below with {MATCH_SOURCE_SITES[latest.source].name}
              &apos;s answers
              {changed.length > 0 &&
                ` · ${changed.length} differ from the saved answers`}
              .
              {results.length > 1 &&
                " Each question shows every site's answer — pick by hand where they differ."}{" "}
              Nothing is saved until you click Update Correct Answers.
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
        </>
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
      <div className="p-3 rounded-lg border border-zinc-700 bg-zinc-800/60 text-sm">
        <p className="text-gray-300">
          <span className="font-medium text-gray-200">{sourceName}:</span> no
          answer — pick this one by hand.
        </p>
        <p className="text-gray-400 mt-1">{proposal.evidence}</p>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-lg border border-sky-800 bg-sky-950/40 text-sm">
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
