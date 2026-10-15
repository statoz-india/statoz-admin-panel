import type { PredictionGameType } from "./prediction.interface";

/** Team snapshot embedded on played-prediction admin responses. */
export interface PlayedPredictionTeam {
  _id: string;
  name: string;
  abbreviation: string;
  tournament: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  displayName: string;
}

/** Prediction pool / match summary on a user submission row. */
export interface PlayedPredictionSummary {
  teamA: PlayedPredictionTeam;
  teamB: PlayedPredictionTeam;
  matchId: string;
  gameType: PredictionGameType;
  tournament: string;
  predictionStatus: string;
  coinsOnTeamA: number;
  coinsOnTeamB: number;
  coinsOnDraw: number;
  initialCoinsOnTeamA: number;
  initialCoinsOnTeamB: number;
  initialCoinsOnDraw: number;
  totalCoins: number;
  oddsTeamA: number;
  oddsTeamB: number;
  oddsDraw: number;
}

/** Single user prediction bet as returned by playedPredictionsForAdmin. */
export interface PlayedPrediction {
  submissionId: string;
  predictionId: string;
  teamChosen: string;
  coinsBet: number;
  coinsWon: number;
  payoutStatus: string;
  submissionTime: string;
  isSettled: boolean;
  netCoins: number | null;
  prediction: PlayedPredictionSummary;
}
