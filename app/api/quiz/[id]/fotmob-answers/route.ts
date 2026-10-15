import { answerFootballQuiz } from "../../../utils/fotmob-answer-engine";
import { handleMatchAnswersRequest } from "../../../utils/match-answers-route";
import {
  fotmobAnswersWarning,
  lookupFotmobMatch,
} from "../../../utils/match-source-lookup";

/**
 * Work out a football quiz's answers from the match's FotMob page.
 * Body: `{ matchUrl?: string }` — a FotMob match URL to use instead of
 * finding the match on FotMob's list for the quiz's match date. Read-only:
 * the admin saves the proposals separately via `submit-correct-answer`.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  return handleMatchAnswersRequest(
    request,
    context,
    "football",
    async (quiz, matchUrl, sourceUrls) => {
      const { lookup, details } = await lookupFotmobMatch(
        quiz,
        matchUrl,
        sourceUrls,
      );
      const stateWarning = fotmobAnswersWarning(details.header.status);
      if (stateWarning) lookup.warnings.unshift(stateWarning);

      return {
        ...lookup,
        proposals: answerFootballQuiz(quiz.questionsArray, details, quiz),
      };
    },
  );
}
