/**
 * Types for the five "Home Page APIs" — `homePageMatches`, `homePageQuizzes`,
 * `homePagePredictions`, `homePageEvents`, `homePageFutures`. Each returns a
 * slimmed-down list of whatever currently qualifies for the app's home
 * screen: visible/active items whose relevant date falls on "yesterday or
 * later" (Asia/Kolkata by default). See `app/components/trending/imp.md`
 * for the full contract.
 */

/** The lean team shape these list responses embed — not the full admin `Team`. */
export interface HomePageTeamRef {
  _id: string;
  name?: string;
  displayName?: string;
  primaryColor?: string;
}

type TeamRef = HomePageTeamRef | string;

export interface HomePageMatch {
  _id: string;
  matchId: string;
  matchStartTime: string;
  matchStatus: string;
  matchBanner?: string;
  tournament: string;
  gameType?: string;
  tag?: string;
  teamA: HomePageTeamRef;
  teamB: HomePageTeamRef;
  quizIds?: string[];
  predictionIds?: string[];
  createdAt: string;
}

export interface HomePageQuiz {
  _id: string;
  quizId: string;
  quizStatus: string;
  tournament: string;
  gameType?: string;
  teamA: TeamRef;
  teamB: TeamRef;
  matchId: string;
  matchStartTime: string;
  entryStartTime?: string;
  entryStopTime?: string;
  matchBanner?: string;
  createdAt: string;
}

export interface HomePagePrediction {
  _id: string;
  predictionId: string;
  predictionStatus: string;
  tournament: string;
  matchId: string;
  teamA: TeamRef;
  teamB: TeamRef;
  matchStartTime: string;
  coinsOnTeamA: number;
  coinsOnTeamB: number;
  coinsOnDraw: number;
  totalCoins: number;
  oddsTeamA: number;
  oddsTeamB: number;
  oddsDraw?: number | null;
  winningTeam?: string | null;
  createdAt: string;
}

export interface HomePageEvent {
  _id: string;
  eventId: string;
  eventName: string;
  eventStatus: string;
  tournament?: string;
  haveThreeOptions: boolean;
  yesPlaceholder: string;
  noPlaceholder: string;
  maybePlaceholder?: string | null;
  coinsOnYes: number;
  coinsOnNo: number;
  coinsOnMaybe?: number | null;
  entryStartTime: string;
  entryCloseTime: string;
  winningOption: "Y" | "N" | "M" | null;
  createdAt: string;
}

export interface HomePageFutureChoice {
  _id: string;
  choiceName: string;
  choiceCoins: number;
  odds: number;
  teamDetails?: HomePageTeamRef | null;
}

export interface HomePageFuture {
  _id: string;
  futureId: string;
  eventName: string;
  futureStatus: string;
  tournament?: string;
  entryStartTime: string;
  entryCloseTime: string;
  choices: HomePageFutureChoice[];
  correctChoice?: string | null;
  createdAt: string;
}

/** The `{ statusCode, data, message, success }` envelope every backend route uses. */
export interface HomePageBackendResponse<T> {
  statusCode: number;
  data: T[];
  message: string;
  success: boolean;
}
