import type { GameType } from "@/app/constants/game-type";

export interface UpdateTournamentPayload {
  tournament?: string;
  tournamentName?: string;
  tournamentYear?: string;
  gameType?: GameType;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  isIccTournament?: boolean;
}

export interface Tournament {
  _id: string;
  tournament: string;
  tournamentName: string;
  tournamentYear: string;
  gameType?: string;
  isIccTournament?: boolean;
  primaryColor: string | null;
  secondaryColor: string | null;
  textColor: string | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
