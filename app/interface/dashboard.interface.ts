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
