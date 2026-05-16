export interface UpdateTournamentPayload {
  tournamentName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
}

export interface Tournament {
  _id: string;
  tournament: string;
  tournamentName: string;
  tournamentYear: string;
  primaryColor: string | null;
  secondaryColor: string | null;
  textColor: string | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
