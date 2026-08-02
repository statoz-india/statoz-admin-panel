import { Team } from "../api/tournament/teams/route";

/**
 * Shapes returned by the match-scoped list endpoints:
 * `/quiz/matchQuizzes/:matchId`, `/prediction/matchPredictions/:matchId`,
 * `/events/matchEvents/:matchId`.
 *
 * `matchId` on these objects is the external match id string, not a Mongo id —
 * it can be fed straight back into the same endpoints.
 * All timestamps are ISO-8601 UTC strings.
 */

export interface MatchTournamentData {
  tournament: string;
  tournamentName: string;
  tournamentYear: string;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  textColor?: string | null;
}

export type MatchQuizStatus =
  | "UPCOMING"
  | "LIVE"
  | "FINISHED"
  | "ENTRYNOTSTARTED"
  | "ENTRYCLOSED"
  | "SETTLEMENT_DONE"
  | "NOT_VISIBLE"
  | "ADMIN_VISIBLE"
  | "ANSWER_UPDATED";

export type MatchPredictionStatus =
  | "UPCOMING"
  | "ACTIVE"
  | "LIVE"
  | "FINISHED"
  | "CANCELLED"
  | "SETTLEMENT_DONE"
  | "NOT_VISIBLE"
  | "ADMIN_VISIBLE"
  | "WINNING_TEAM_UPDATED";

export type MatchEventStatus =
  | "UPCOMING"
  | "ACTIVE"
  | "FINISHED"
  | "CANCELLED"
  | "DELETED"
  | "SETTLEMENT_DONE"
  | "WINNING_OPTION_UPDATED";

/** `questionsArray` is omitted by the list endpoint — fetch `/api/quiz/:id` for questions. */
export interface MatchQuiz {
  _id: string;
  quizId: string;
  teamA: Team;
  teamB: Team;
  matchId: string;
  tag?: string;
  matchEvent?: Record<string, unknown> | null;
  gameType?: string;
  matchBanner?: string;
  quizStatus: MatchQuizStatus | string;
  tournament: string;
  entryStartTime: string;
  entryStopTime?: string;
  matchStartTime: string;
  isVisible: boolean;
  createdAt: string;
  createdByUserData?: {
    userName?: string;
    email?: string;
    userType?: string;
  };
  // Per-user fields, derived from the caller's token.
  isAttempted?: boolean;
  hasViewedResults?: boolean;
  obtainedXP?: number;
  quizSubmissionTime?: string | null;
}

export interface MatchPrediction {
  _id: string;
  predictionId: string;
  teamA: Team;
  teamB: Team;
  matchId: string;
  tag?: string;
  gameType?: string;
  matchEvent?: Record<string, unknown> | null;
  predictionStatus: MatchPredictionStatus | string;
  winningTeam?: string | null;
  winningTeamId?: string | null;
  isVisible: boolean;
  tournament: string;
  tournamentData?: MatchTournamentData;
  entryStartTime: string;
  matchStartTime: string;
  createdAt: string;
  createdByUserData?: {
    userName?: string;
    email?: string;
    userType?: string;
  };
  coinsOnTeamA: number;
  coinsOnTeamB: number;
  coinsOnDraw: number;
  initialCoinsOnTeamA: number;
  initialCoinsOnTeamB: number;
  initialCoinsOnDraw: number;
  totalCoins: number;
  /** Implied probability percentages, already rounded to 2dp. */
  oddsTeamA: number;
  oddsTeamB: number;
  /** `null` outside football — use this, not `coinsOnDraw`, to decide on a third option. */
  oddsDraw: number | null;
}

export interface MatchEvent {
  _id: string;
  eventId: string;
  eventName: string;
  eventDescription?: string;
  eventImage?: string;
  eventDescriptionImage?: string;
  pickType?: "EVENT";
  eventStatus: MatchEventStatus | string;
  winningOption?: "Y" | "N" | "M" | null;
  /** When false, every `*Maybe*` field is explicitly null. */
  haveThreeOptions: boolean;
  yesPlaceholder: string;
  noPlaceholder: string;
  maybePlaceholder?: string | null;
  yesPlaceholderColor?: string;
  noPlaceholderColor?: string;
  maybePlaceholderColor?: string | null;
  yesTextColor?: string;
  noTextColor?: string;
  maybeTextColor?: string | null;
  coinsOnYes: number;
  coinsOnNo: number;
  coinsOnMaybe?: number | null;
  initialCoinsOnYes: number;
  initialCoinsOnNo: number;
  initialCoinsOnMaybe?: number | null;
  totalCoins: number;
  oddsYes: number;
  oddsNo: number;
  oddsMaybe?: number | null;
  entryStartTime: string;
  entryCloseTime: string;
  tournament: string;
  tournamentData?: MatchTournamentData;
  matchId?: string;
  matchStartTime?: string;
  teamA?: Team;
  teamB?: Team;
  createdAt: string;
  updatedAt?: string;
  createdByUserData?: {
    userName?: string;
    email?: string;
    userType?: string;
  };
}

export interface MatchPicks {
  quizzes: MatchQuiz[];
  predictions: MatchPrediction[];
  events: MatchEvent[];
}
