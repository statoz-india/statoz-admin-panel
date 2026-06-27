/** Aggregated counts returned by `/admin-data/getDashboardData`. */
export interface DashboardData {
  totalUsers: number;
  totalTeams: number;
  totalTournaments: number;
  totalQuizzes: number;
  totalPredictions: number;
  totalEvents: number;
  totalFutures: number;
  totalQuizSubmissions: number;
  totalPredictionSubmissions: number;
  totalEventSubmissions: number;
  totalFutureSubmissions: number;
}

export interface DailyOnboarding {
  /** YYYY-MM-DD */
  date: string;
  count: number;
}

/** User onboarding stats from `/admin-data/getUserOnboardingStats`. */
export interface OnboardingStats {
  onboardedToday: number;
  dailyOnboarding: DailyOnboarding[];
}

/**
 * Shared wrapper for the "today" list endpoints
 * (`getTodayQuizzes`, `getTodayPredictions`, `getTodayEvents`).
 */
export interface TodayListResponse<T = Record<string, unknown>> {
  /** YYYY-MM-DD in IST */
  date: string;
  timezone: string;
  total: number;
  items: T[];
}

export interface DailySubmission {
  /** YYYY-MM-DD */
  date: string;
  count: number;
}

export interface WeeklySubmission {
  /** YYYY-MM-DD (week start, inclusive) */
  weekStart: string;
  /** YYYY-MM-DD (week end, inclusive) */
  weekEnd: string;
  count: number;
}

/**
 * Weekly submission stats from `/admin-data/getQuizSubmissionWeeklyStats`
 * (and the matching prediction/future/event endpoints, if used).
 */
export interface WeeklySubmissionStats {
  firstSubmissionAt: string | null;
  totalSubmissions: number;
  submittedThisWeek: number;
  timezone: string;
  /** One row per week, oldest first. */
  weeklySubmissions: WeeklySubmission[];
}

/**
 * Weekly new-user stats from `/admin-data/getUserOnboardingWeeklyStats`.
 * Same week shape as submissions, but onboarding-specific field names.
 */
export interface WeeklyOnboardingStats {
  firstOnboardedAt: string | null;
  totalOnboarded: number;
  onboardedThisWeek: number;
  timezone: string;
  /** One row per week, oldest first. */
  weeklyOnboarding: WeeklySubmission[];
}

/**
 * Shared wrapper for the submission stats endpoints
 * (`getQuizSubmissionStats`, `getPredictionSubmissionStats`,
 * `getFutureSubmissionStats`, `getEventSubmissionStats`).
 */
export interface SubmissionStats {
  submittedToday: number;
  timezone: string;
  /** One row per day for the last 7 days, oldest first. */
  dailySubmissions: DailySubmission[];
}

/** The user who made a submission, on the "today's submissions" endpoints. */
export interface SubmissionUser {
  userId: string;
  userName: string;
  email: string;
}

/**
 * One quiz answer merged with its question, on a today quiz submission.
 * `correctAnswer`/`correctAnswerOption` are only populated once settled.
 */
export interface TodayQuizAnswer {
  questionNumber: number;
  questionText: string;
  questionType: string;
  options: string[];
  userAnswer: { option: string | null; value: string | null } | null;
  correctAnswer: string | null;
  correctAnswerOption: string | null;
}

/** A team as embedded on quiz/prediction submissions. */
export interface SubmissionTeam {
  _id?: string;
  name?: string;
  abbreviation?: string;
  displayName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  tournament?: string;
}

/** Today's quiz submission from `/admin-data/getTodayQuizSubmissions`. */
export interface TodayQuizSubmission {
  submissionId: string;
  quizId: string;
  submissionTime: string;
  obtainedXP?: number;
  xpCredited: boolean;
  user: SubmissionUser;
  quiz: {
    quizId: string;
    quizStatus: string;
    tournament: string;
    teamA: SubmissionTeam;
    teamB: SubmissionTeam;
    matchId: string;
    matchStartTime: string;
  };
  questions: TodayQuizAnswer[];
}

/**
 * Today's prediction submission from
 * `/admin-data/getTodayPredictionSubmissions`. When settled, `isSettled` is
 * `true` and `netCoins` is `totalCoinsReceived - coinsBet`.
 */
export interface TodayPredictionSubmission {
  submissionId: string;
  predictionId: string;
  submissionTime: string;
  teamChosen: string;
  coinsBet: number;
  coinsWon: number;
  totalCoinsReceived: number;
  payoutStatus: string;
  optionOddsAtBetTime: Record<string, number>;
  isSettled: boolean;
  netCoins: number | null;
  user: SubmissionUser;
  prediction: {
    teamA: Record<string, unknown>;
    teamB: Record<string, unknown>;
    matchId: string;
    matchStartTime: string;
    gameType: string;
    tournament: string;
    predictionStatus: string;
    winningTeam: string | null;
    winningTeamId: string | null;
  };
}

/** Today's event submission from `/admin-data/getTodayEventSubmissions`. */
export interface TodayEventSubmission {
  submissionId: string;
  eventId: string;
  submissionTime: string;
  chosenOption: string;
  coinsBet: number;
  oddsChoice: number;
  coinsWon: number;
  totalCoinsReceived: number;
  payoutStatus: string;
  optionOddsAtBetTime: Record<string, number>;
  optionWon: string | null;
  isSettled: boolean;
  netCoins: number | null;
  user: SubmissionUser;
  event: {
    eventId: string;
    eventName: string;
    tournament: string;
    eventStatus: string;
    haveThreeOptions: boolean;
    yesPlaceholder: string;
    noPlaceholder: string;
    maybePlaceholder: string | null;
    winningOption: string | null;
    entryCloseTime: string;
  };
}

/** Today's future submission from `/admin-data/getTodayFutureSubmissions`. */
export interface TodayFutureSubmission {
  submissionId: string;
  futureId: string;
  futureChoiceId: string;
  submissionTime: string;
  coinsBet: number;
  oddsChoice: number;
  coinsWon: number;
  totalCoinsReceived: number;
  payoutStatus: string;
  choiceOddsAtBetTime: Record<string, number>;
  isSettled: boolean;
  netCoins: number | null;
  user: SubmissionUser;
  futureChoice: {
    _id: string;
    choiceId: string;
    choiceName: string;
    choiceImage: string;
  };
  future: {
    futureId: string;
    eventName: string;
    tournament: string;
    futureStatus: string;
    correctChoice: string | null;
    entryCloseTime: string;
  };
}
