/**
 * Make Predictions: app users an admin has signed in as, and the player-side
 * shapes of the quizzes, predictions, events and futures they can join.
 */

/** Carries the app user's access token from the browser to the panel's proxy. */
export const APP_USER_TOKEN_HEADER = "X-Statoz-User-Token";

/** One signed-in app user, as kept in this browser's localStorage. */
export interface AppUserSession {
  _id: string;
  email: string;
  userName?: string;
  avatarUrl?: string;
  /** Last balance seen; refreshed from `/user/current-user`. */
  coins?: number;
  accessToken: string;
  refreshToken: string;
  addedAt: string;
  /** Set once the backend refuses the session: the user must log in again. */
  signedOut?: boolean;
}

export interface AppUserLogin {
  user: { _id: string; email: string; userName?: string; avatarUrl?: string; coins?: number };
  accessToken: string;
  refreshToken: string;
}

export interface PlayTeam {
  _id?: string;
  name?: string;
  displayName?: string;
  abbreviation?: string;
  logo?: string;
}

export type QuizQuestionType = "MCQ" | "BOOLEAN" | "NUMERIC" | "ALPHABETICAL";

export interface PlayQuizQuestion {
  questionNumber: number;
  questionText: string;
  questionType: QuizQuestionType;
  options?: string[];
  xp?: number;
}

export interface PlayQuizAnswer {
  questionNumber: number;
  selectedAnswerOption: string;
  selectedAnswer: string;
}

export interface PlayQuiz {
  _id: string;
  quizId?: string;
  quizStatus?: string;
  tournament?: string;
  teamA?: PlayTeam | null;
  teamB?: PlayTeam | null;
  matchStartTime?: string;
  entryStopTime?: string | null;
  /** The admin lists include quizzes hidden from players. */
  isVisible?: boolean;
  /** Only meaningful on `quiz/:id` as the user; on the admin list it's the admin's own attempt. */
  isAttempted?: boolean;
  questionsArray?: PlayQuizQuestion[];
  userAnswers?: { answers?: PlayQuizAnswer[]; submissionTime?: string };
}

export interface PlayPrediction {
  _id: string;
  predictionId?: string;
  predictionStatus?: string;
  tournament?: string;
  gameType?: string;
  teamA?: PlayTeam | null;
  teamB?: PlayTeam | null;
  matchStartTime?: string;
  totalCoins?: number;
  oddsTeamA?: number;
  oddsTeamB?: number;
  /** `null` outside football: no draw. */
  oddsDraw?: number | null;
  isVisible?: boolean;
}

export interface PlayEvent {
  _id: string;
  eventId?: string;
  eventName: string;
  eventDescription?: string;
  eventStatus?: string;
  tournamentData?: { tournamentName?: string } | null;
  entryStartTime?: string;
  entryCloseTime?: string;
  haveThreeOptions?: boolean;
  yesPlaceholder?: string;
  noPlaceholder?: string;
  maybePlaceholder?: string | null;
  totalCoins?: number;
  oddsYes?: number;
  oddsNo?: number;
  oddsMaybe?: number | null;
}

export interface PlayFutureChoice {
  _id: string;
  choiceId?: string;
  choiceName: string;
  isVisible?: boolean;
  odds?: number;
}

export interface PlayFuture {
  _id: string;
  futureId?: string;
  eventName?: string;
  eventDescription?: string;
  futureStatus?: string;
  tournamentData?: { tournamentName?: string } | null;
  entryStartTime?: string;
  entryCloseTime?: string;
  choices?: PlayFutureChoice[];
  totalCoinsPlaced?: number;
}

/** One of the user's own bets, from the `user…Bet(s)` endpoints. */
export interface PlayBet {
  _id: string;
  coinsBet: number;
  submissionTime?: string;
  createdAt?: string;
  teamChosen?: string;
  chosenOption?: string;
  futureChoiceId?: string | { _id?: string; choiceName?: string };
  payoutStatus?: string;
}

/** Quiz statuses that take no new or edited answers (the backend's closed set). */
const CLOSED_QUIZ_STATUSES = new Set([
  "ENTRYCLOSED",
  "FINISHED",
  "ANSWER_UPDATED",
  "SETTLEMENT_DONE",
  "NO_RESULT",
  "NOT_ENOUGH_DATA",
  "POSTPONED",
  "UNRESOLVED",
  "CANCELLED",
]);

const OPEN_PREDICTION_STATUSES = new Set(["UPCOMING", "ACTIVE", "LIVE"]);
const OPEN_EVENT_STATUSES = new Set(["UPCOMING", "ACTIVE"]);

const upper = (status: string | undefined) => status?.trim().toUpperCase() ?? "";

/** Inside `[start, close]`; a missing bound doesn't limit. */
function insideWindow(now: number, start?: string | null, close?: string | null): boolean {
  const startMs = start ? Date.parse(start) : NaN;
  const closeMs = close ? Date.parse(close) : NaN;
  if (Number.isFinite(startMs) && now < startMs) return false;
  if (Number.isFinite(closeMs) && now > closeMs) return false;
  return true;
}

/** Takes answers: not closed, and before `entryStopTime` (entry start isn't checked by the backend). */
export function isQuizOpen(quiz: PlayQuiz, now = Date.now()): boolean {
  if (CLOSED_QUIZ_STATUSES.has(upper(quiz.quizStatus))) return false;
  return insideWindow(now, null, quiz.entryStopTime);
}

export function isPredictionOpen(prediction: PlayPrediction): boolean {
  return OPEN_PREDICTION_STATUSES.has(upper(prediction.predictionStatus));
}

export function isEventOpen(event: PlayEvent, now = Date.now()): boolean {
  return (
    OPEN_EVENT_STATUSES.has(upper(event.eventStatus)) &&
    insideWindow(now, event.entryStartTime, event.entryCloseTime)
  );
}

/** Futures take bets only while `ACTIVE`, inside the entry window. */
export function isFutureOpen(future: PlayFuture, now = Date.now()): boolean {
  return (
    upper(future.futureStatus) === "ACTIVE" &&
    insideWindow(now, future.entryStartTime, future.entryCloseTime)
  );
}

export function teamName(team: PlayTeam | null | undefined, fallback: string): string {
  return team?.displayName || team?.name || team?.abbreviation || fallback;
}
