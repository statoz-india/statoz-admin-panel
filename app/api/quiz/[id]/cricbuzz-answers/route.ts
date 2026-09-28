import { answerCricketQuiz } from "../../../utils/cricbuzz-answer-engine";
import { handleMatchAnswersRequest } from "../../../utils/match-answers-route";
import {
  cricbuzzAnswersWarning,
  lookupCricbuzzMatch,
} from "../../../utils/match-source-lookup";

/**
 * Work out a cricket quiz's answers from the match's Cricbuzz scorecard.
 * Body: `{ matchUrl?: string }` — a Cricbuzz match URL to use instead of
 * finding the match on the recent-matches page. Read-only: the admin saves
 * the proposals separately via `submit-correct-answer`.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  return handleMatchAnswersRequest(
    request,
    context,
    "cricket",
    async (quiz, matchUrl, sourceUrls) => {
      const { lookup, scorecard } = await lookupCricbuzzMatch(
        quiz,
        matchUrl,
        sourceUrls,
      );
      const stateWarning = cricbuzzAnswersWarning(scorecard.matchHeader);
      if (stateWarning) lookup.warnings.unshift(stateWarning);

      return {
        ...lookup,
        proposals: answerCricketQuiz(quiz.questionsArray, scorecard, quiz),
      };
    },
  );
}
