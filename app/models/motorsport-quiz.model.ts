import type { MotorsportMatch } from "./motorsport-match.model";

export const MOTORSPORT_QUESTION_TYPES = [
  "MCQ",
  "BOOLEAN",
  "NUMERIC",
  "ALPHABETICAL",
] as const;

export type MotorsportQuestionType = (typeof MOTORSPORT_QUESTION_TYPES)[number];

export interface MotorsportQuizQuestion {
  _id?: string;
  /** Assigned by the server in array order when left out. */
  questionNumber?: number;
  questionText: string;
  questionType: MotorsportQuestionType;
  /** Only for MCQ. */
  options?: string[];
  xp: number;
  questionKey?: string;
  /** Only present once the quiz is settled. */
  correctAnswer?: string;
}

/** A document from the backend `MotorsportQuiz` collection. */
export interface MotorsportQuiz {
  _id: string;
  /** Server-generated, e.g. `F1-R3-Q1`. */
  quizId: string;
  /** The race's Mongo `_id`; the readable id is `match.matchId`. */
  matchId: string;
  quizStatus: string;
  /** Tournament Mongo id, taken from the race. */
  tournament: string;
  entryStartTime: string;
  entryStopTime?: string | null;
  questionsArray: MotorsportQuizQuestion[];
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  match?: MotorsportMatch;
  /** From `GET /quiz/motorsport/:id`: the logged-in caller's own attempt. */
  hasUserAttemptedQuiz?: boolean;
  userAnswers?: MotorsportQuizUserAnswers;
}

/** One answer of the caller's submission. */
export interface MotorsportQuizUserAnswer {
  questionNumber: number;
  selectedAnswerOption?: string;
  selectedAnswer?: string;
  /** Only after settlement. */
  correctAnswer?: string;
  correctAnswerOption?: string;
}

/** `answers` is `[]` and the rest absent when the caller hasn't submitted. */
export interface MotorsportQuizUserAnswers {
  answers: MotorsportQuizUserAnswer[];
  submissionTime?: string;
  obtainedXP?: number | null;
  hasViewedResults?: boolean;
}

/**
 * An item of `GET /quiz/motorsport/race/:matchId`: no questions, just a count,
 * plus the caller's own attempt state (always "not attempted" for an admin who
 * doesn't play).
 */
export interface MotorsportQuizListItem
  extends Omit<MotorsportQuiz, "questionsArray"> {
  questionCount: number;
  isAttempted?: boolean;
  hasViewedResults?: boolean;
  obtainedXP?: number;
  quizSubmissionTime?: string | null;
}

/** Body for `POST /quiz/createMotorsportQuiz`. */
export interface CreateMotorsportQuizPayload {
  /** The race's `_id` or `matchId` (e.g. `F1-R3`). */
  matchId: string;
  entryStartTime: string;
  entryStopTime?: string;
  questionsArray: MotorsportQuizQuestion[];
}
