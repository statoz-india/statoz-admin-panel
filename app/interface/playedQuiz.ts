/** Question types used in quiz definitions (matches edit/create quiz flows). */
export type PlayedQuizQuestionType =
  | "MCQ"
  | "BOOLEAN"
  | "NUMERIC"
  | "ALPHABETICAL";

export interface PlayedQuizTeam {
  _id: string;
  name: string;
  abbreviation: string;
  tournament: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  displayName: string;
}

/** Embedded quiz summary on a submission response. */
export interface PlayedQuizSummary {
  quizId: string;
  quizStatus: string;
  tournament: string;
  teamA: PlayedQuizTeam;
  teamB: PlayedQuizTeam;
  matchId: string;
  matchStartTime: string;
}

export interface PlayedQuizUserAnswer {
  option: string;
  value: string;
}

export interface PlayedQuizQuestion {
  questionNumber: number;
  questionText: string;
  questionType: PlayedQuizQuestionType | string;
  options: string[];
  userAnswer: PlayedQuizUserAnswer;
  correctAnswer: boolean;
  correctAnswerOption: string | number | null;
}

/** Single user quiz submission as returned with full question breakdown. */
export interface PlayedQuiz {
  submissionId: string;
  quizId: string;
  submissionTime: string;
  obtainedXP: number;
  xpCredited: boolean;
  quiz: PlayedQuizSummary;
  questions: PlayedQuizQuestion[];
}
