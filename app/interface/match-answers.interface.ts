/**
 * Response of the auto-answer routes — `POST /api/quiz/:id/cricbuzz-answers`
 * (cricket) and `POST /api/quiz/:id/fotmob-answers` (football) for quizzes,
 * and `POST /api/match/source-lookup` for a match's status or a prediction's
 * / event's question. Answers are worked out from the match's page on that
 * site; nothing is saved by the call. The admin reviews the proposals and
 * saves them through the quiz, prediction or event's own settle flow.
 */

import type { MatchStatus } from "@/app/constants/match-status";

export type MatchAnswerSource = "cricbuzz" | "fotmob";

export interface MatchAnswerSourceMatch {
  /** The site's own match id. */
  externalMatchId: number;
  /** e.g. "West Indies vs India", "Leeds United vs Newcastle United" */
  title: string;
  /** e.g. "1st ODI · West Indies tour of India, 2026", "Premier League · Round 4" */
  subtitle: string;
  /** The site's match state: "Complete", "Full-Time", "In Progress", … */
  state: string;
  /** Result line, e.g. "India won by 8 wkts", "Leeds United 4 - 1 Newcastle United". */
  status: string;
  /** ISO timestamp of the scheduled start. */
  startTime: string;
  isComplete: boolean;
}

export interface MatchAnswerSourceUrl {
  label: string;
  url: string;
}

export interface MatchAnswerProposal {
  /**
   * `question._id`, falling back to the question number (settle-page key);
   * the question's index for `/api/match/source-lookup`.
   */
  questionKey: string;
  questionNumber: number;
  /**
   * The value to save — the stored option string for MCQ/BOOLEAN, free text
   * for NUMERIC/ALPHABETICAL. `null` when the match data couldn't answer it.
   */
  answer: string | null;
  /** Index into `question.options` when `answer` is one of them. */
  optionIndex: number | null;
  /** What was read off the match page, or why no answer was picked. */
  evidence: string;
}

/** A match found on its source site. */
export interface MatchSourceLookup {
  source: MatchAnswerSource;
  match: MatchAnswerSourceMatch;
  /** The pages that were read, in order. */
  sourceUrls: MatchAnswerSourceUrl[];
  /** `auto`: found on the site's match list; `url`: admin-supplied URL. */
  matchedBy: "auto" | "url";
  /** The site's state as our `matchStatus`; null when it doesn't map cleanly. */
  suggestedStatus: MatchStatus | null;
  warnings: string[];
}

export interface MatchAnswersResult extends MatchSourceLookup {
  proposals: MatchAnswerProposal[];
}
