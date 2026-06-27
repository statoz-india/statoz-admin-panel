import { Tournament } from "./tournament.model";

export interface CreateFutureChoicePayload {
  choiceName: string;
  choiceDescription?: string;
  choiceImage?: string;
  choiceCoins: number;
  initialCoinsOnChoice: number;
  teamDetails?: string;
  isVisible: boolean;
  placeholderColor?: string;
  textColor?: string;
}

export interface CreateFuturePayload {
  tournament: string;
  eventName: string;
  eventDescription?: string;
  eventImage?: string;
  eventDescriptionImage?: string;
  entryStartTime: string;
  entryCloseTime: string;
  futureStatus: string;
  choices: CreateFutureChoicePayload[];
}

export interface FutureChoiceTeamDetails {
  _id: string;
  name: string;
  displayName: string;
  abbreviation: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
}

export interface FutureChoice {
  _id: string;
  choiceId: string;
  choiceName: string;
  choiceDescription?: string;
  choiceImage?: string;
  choiceCoins: number;
  initialCoinsOnChoice: number;
  teamDetails?: FutureChoiceTeamDetails;
  isVisible: boolean;
  placeholderColor?: string;
  textColor?: string;
  odds: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface EditFutureChoiceBody {
  _id: string;
  choiceName?: string;
  choiceDescription?: string;
  choiceImage?: string;
  initialCoinsOnChoice?: number;
  teamDetails?: string | null;
  isVisible?: boolean;
  placeholderColor?: string;
  textColor?: string;
}

export interface EditFutureChoicesRequest {
  choices: EditFutureChoiceBody[];
}

export interface EditFutureBody {
  eventName?: string;
  eventDescription?: string;
  eventImage?: string;
  eventDescriptionImage?: string;
  entryStartTime?: string;
  entryCloseTime?: string;
}

export interface Future {
  _id: string;
  futureId: string;
  tournament: string;
  tournamentData?: Tournament;
  eventName: string;
  eventDescription?: string;
  eventImage?: string;
  eventDescriptionImage?: string;
  futureStatus: string;
  correctChoice?: FutureChoice | string | null;
  createdBy?: string;
  entryStartTime: string;
  entryCloseTime?: string;
  choices: FutureChoice[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface FutureSuccessResponse {
  statusCode: number;
  data: Future;
  message: string;
  success: boolean;
}

export interface FuturesListSuccessResponse {
  statusCode: number;
  data: Future[];
  message: string;
  success: boolean;
}

export interface FutureBetUserXP {
  totalXP: number;
  [tournament: string]: number;
}

export interface FutureBetUserData {
  _id: string;
  userName: string;
  email: string;
  coins: number;
  xp: FutureBetUserXP;
}

/** Populated choice snapshot on a future bet submission. */
export interface FutureBetChoiceSnapshot {
  _id: string;
  choiceId: string;
  choiceName: string;
  choiceCoins: number;
}

export type ChoiceOddsAtBetTime = Record<string, number>;

export interface FutureBet {
  _id: string;
  userId: FutureBetUserData;
  futureId: string;
  futureChoiceId: FutureBetChoiceSnapshot;
  coinsBet: number;
  oddsChoice: number | null;
  choiceOddsAtBetTime: ChoiceOddsAtBetTime;
  coinsWon: number;
  totalCoinsReceived: number;
  submissionTime: string;
  payoutStatus: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface FutureBetsListSuccessResponse {
  statusCode: number;
  data: FutureBet[];
  message: string;
  success: boolean;
}
