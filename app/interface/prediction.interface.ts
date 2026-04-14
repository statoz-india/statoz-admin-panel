import { Team } from "../api/tournament/teams/route";

export type PredictionGameType = "cricket" | "football" | "basketball";

export interface Prediction {
  _id: string;
  predictionId: string;
  coinsOnTeamA: number;
  coinsOnTeamB: number;
  coinsOnDraw: number;
  initialCoinsOnTeamA: number;
  initialCoinsOnTeamB: number;
  initialCoinsOnDraw: number;
  tournament: string;
  predictionStatus: string;
  isVisible: boolean;
  matchStartTime: string;
  gameType?: PredictionGameType;
  tag?: string;
  winningTeam?: string;
  winningTeamId?: string;
  createdAt: string;
  createdByUserData: {
    userName?: string;
    email?: string;
    userType?: string;
  };
  teamA: Team;
  teamB: Team;
  matchId: string;
  totalCoins: number;
  oddsTeamA: number;
  oddsTeamB: number;
  oddsDraw: number | null;
}
