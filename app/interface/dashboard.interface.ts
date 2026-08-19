/** Aggregated counts returned by `/admin-data/getDashboardData`. */
export interface DashboardData {
  totalUsers: number;
  deletedUsers: number;
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
  totalKnowledgeQuizzes: number;
  totalKnowledgeQuizSets: number;
  totalKnowledgeQuizQuestions: number;
  totalKnowledgeQuizSubmissions: number;
  totalPitchDuelMatches: number;
  totalPenaltyShootoutMatches: number;
  totalFootballChessMatches: number;
  /** Distinct submitters, not matches — 50 matches by one user counts as 1. */
  totalFootballChessPlayers: number;
  totalUsersWithCards: number;
  totalPayments: number;
  paymentsAfterReduction: number;
  totalUserAssets: number;
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

/** Daily pitch duel / penalty shootout stats (last 7 IST days). */
export interface DailyMatchStats {
  playedToday: number;
  timezone: string;
  dailyMatches: DailySubmission[];
}

/** Daily user card acquisition stats (last 7 IST days). */
export interface DailyUserCardsStats {
  acquiredToday: number;
  timezone: string;
  dailyAcquisitions: DailySubmission[];
}

/** Daily payment stats (last 7 IST days). */
export interface DailyPaymentStats {
  createdToday: number;
  timezone: string;
  dailyPayments: DailySubmission[];
}

/** Daily user asset purchase stats (last 7 IST days). */
export interface DailyUserAssetsStats {
  purchasedToday: number;
  timezone: string;
  dailyPurchases: DailySubmission[];
}

/** Weekly pitch duel / penalty shootout stats. */
export interface WeeklyMatchStats {
  firstMatchAt: string | null;
  totalMatches: number;
  playedThisWeek: number;
  timezone: string;
  weeklyMatches: WeeklySubmission[];
}

/** Weekly user card acquisition stats. */
export interface WeeklyUserCardsStats {
  firstAcquisitionAt: string | null;
  totalAcquisitions: number;
  acquiredThisWeek: number;
  timezone: string;
  weeklyAcquisitions: WeeklySubmission[];
}

/** Weekly payment stats. */
export interface WeeklyPaymentStats {
  firstPaymentAt: string | null;
  totalPayments: number;
  createdThisWeek: number;
  timezone: string;
  weeklyPayments: WeeklySubmission[];
}

/** Weekly user asset purchase stats. */
export interface WeeklyUserAssetsStats {
  firstPurchaseAt: string | null;
  totalPurchases: number;
  purchasedThisWeek: number;
  timezone: string;
  weeklyPurchases: WeeklySubmission[];
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

/**
 * One answered question on a today knowledge-quiz submission. Everything the
 * question owns is nullable: the row is driven by what the user answered, so a
 * question deleted since the attempt still lists its answer with no text.
 */
export interface TodayKnowledgeQuizAnswer {
  questionId: string;
  kqQuestionId: string | null;
  questionText: string | null;
  answerType: string | null;
  options?: string[];
  /** What the user picked — `kqAnswers[].userSelectedAnswer`. */
  userAnswer: string[];
  correctAnswer: string[] | null;
  correctAnswerIndex: number[] | null;
  isCorrect: boolean;
  xpCredited: number;
  /** The xp configured on the question, which may differ from `xpCredited`. */
  questionXp: number | null;
}

/**
 * The played set, flattened with its parent sport quiz. Present but empty when
 * the set has since been deleted, so treat every field as optional.
 */
export interface TodayKnowledgeQuizSet {
  _id?: string;
  category?: string;
  chapter?: number;
  chapterName?: string;
  threeStarScore?: number;
  twoStarScore?: number;
  oneStarScore?: number;
  reward?: number;
  entryCoins?: number;
  /** From the parent `KnowledgeQuiz`. */
  sportsType?: string;
  gameHeading?: string;
  gameSubHeading?: string;
}

/**
 * Today's knowledge quiz attempt from
 * `/admin-data/getTodayKnowledgeQuizSubmissions`. `knowledgeQuizId` is the
 * played *set*, matching the field name on `KnowledgeQuizResponse`.
 */
export interface TodayKnowledgeQuizSubmission {
  submissionId: string;
  knowledgeQuizId: string;
  submissionTime: string;
  submissionEditedTime: string | null;
  totalXp: number;
  totalQuestion: number;
  /** Derived from `kqAnswers[].isCorrect`. */
  correctAnswers: number;
  obtainedStars: number;
  isReplay: boolean;
  user: SubmissionUser;
  knowledgeQuiz: TodayKnowledgeQuizSet | null;
  questions: TodayKnowledgeQuizAnswer[];
}
