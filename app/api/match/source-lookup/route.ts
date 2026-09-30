import { NextResponse } from "next/server";
import { requireAuth, successResponse } from "../../utils/api-helper";
import { answerCricketQuiz } from "../../utils/cricbuzz-answer-engine";
import { answerFootballQuiz } from "../../utils/fotmob-answer-engine";
import { MatchAnswersError } from "../../utils/match-answers-route";
import {
  cricbuzzAnswersWarning,
  fotmobAnswersWarning,
  lookupCricbuzzMatch,
  lookupEspnMatch,
  lookupFotmobMatch,
  type MatchLookupTarget,
} from "../../utils/match-source-lookup";
import type { QuizTeamLike } from "../../utils/quiz-answer-core";
import type { QuizQuestion } from "../../quiz/route";
import type {
  MatchAnswerSourceUrl,
  MatchAnswersResult,
} from "@/app/interface/match-answers.interface";

const teamFromBody = (value: unknown): QuizTeamLike | null => {
  if (!value || typeof value !== "object") return null;
  const { name, displayName, abbreviation } = value as Record<string, unknown>;
  if (typeof name !== "string" || !name.trim()) return null;
  return {
    name,
    displayName: typeof displayName === "string" ? displayName : undefined,
    abbreviation: typeof abbreviation === "string" ? abbreviation : undefined,
  };
};

/** `{ questionText, options }` entries, shaped like quiz questions for the engines. */
const questionsFromBody = (value: unknown): QuizQuestion[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, idx) => {
    const { questionText, options } = (item ?? {}) as Record<string, unknown>;
    if (typeof questionText !== "string" || !questionText.trim()) return [];
    return [
      {
        _id: String(idx),
        questionNumber: idx + 1,
        questionText,
        questionType: "MCQ",
        options: Array.isArray(options)
          ? options.filter((o): o is string => typeof o === "string")
          : [],
        xp: 0,
        correctAnswer: "",
      },
    ];
  });
};

/**
 * A match on its source site (Cricbuzz for cricket, FotMob for football):
 * its state and result, and answers to any `questions` sent — a
 * prediction's "who wins", an event's question. Read-only.
 *
 * Body: `{ gameType, teamA, teamB, matchStartTime?, matchUrl?, questions?,
 * site?, espnLeagueName?, espnEventId? }`. `matchUrl` is a site match URL to
 * use instead of finding the match by teams and start; `questions` is
 * `{ questionText, options }[]`, answered in `proposals` with `questionKey`
 * = the question's index. `site: "espn"` looks the match up on ESPN instead
 * — by its own saved `espnLeagueName` / `espnEventId` rather than a
 * team-name search — and never returns `proposals` (status only).
 */
export async function POST(request: Request) {
  const sourceUrls: MatchAnswerSourceUrl[] = [];
  try {
    await requireAuth();

    const body = await request.json().catch(() => ({}));
    const gameType =
      typeof body?.gameType === "string" ? body.gameType.toLowerCase() : "";
    const site = typeof body?.site === "string" ? body.site : "";
    const matchUrl =
      typeof body?.matchUrl === "string" ? body.matchUrl.trim() : "";
    const teamA = teamFromBody(body?.teamA);
    const teamB = teamFromBody(body?.teamB);
    if (!teamA || !teamB) {
      throw new MatchAnswersError("Both teams' names are required.");
    }
    const target: MatchLookupTarget = {
      teamA,
      teamB,
      matchStartTime:
        typeof body?.matchStartTime === "string"
          ? body.matchStartTime
          : undefined,
    };
    const questions = questionsFromBody(body?.questions);

    let result: MatchAnswersResult;
    if (site === "espn") {
      const lookup = await lookupEspnMatch(
        {
          gameType,
          espnLeagueName:
            typeof body?.espnLeagueName === "string"
              ? body.espnLeagueName
              : undefined,
          espnEventId:
            typeof body?.espnEventId === "string"
              ? body.espnEventId
              : undefined,
        },
        matchUrl,
        sourceUrls,
      );
      // No question-answering engine for ESPN yet — status/result only.
      result = { ...lookup, proposals: [] };
    } else if (gameType === "cricket") {
      const { lookup, scorecard } = await lookupCricbuzzMatch(
        target,
        matchUrl,
        sourceUrls,
      );
      const stateWarning = questions.length
        ? cricbuzzAnswersWarning(scorecard.matchHeader)
        : null;
      if (stateWarning) lookup.warnings.unshift(stateWarning);
      result = {
        ...lookup,
        proposals: questions.length
          ? answerCricketQuiz(questions, scorecard, target)
          : [],
      };
    } else if (gameType === "football") {
      const { lookup, details } = await lookupFotmobMatch(
        target,
        matchUrl,
        sourceUrls,
      );
      const stateWarning = questions.length
        ? fotmobAnswersWarning(details.header.status)
        : null;
      if (stateWarning) lookup.warnings.unshift(stateWarning);
      result = {
        ...lookup,
        proposals: questions.length
          ? answerFootballQuiz(questions, details, target)
          : [],
      };
    } else {
      throw new MatchAnswersError(
        `Match lookup is only available for cricket and football (this is ${gameType || "missing a game type"}).`,
      );
    }
    return successResponse(result, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    if (error instanceof MatchAnswersError) {
      return NextResponse.json(
        { success: false, message: error.message, sourceUrls },
        { status: error.status },
      );
    }
    console.error("Error looking up match on source site:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to look up the match",
        sourceUrls,
      },
      { status: 502 },
    );
  }
}
