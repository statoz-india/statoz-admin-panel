export interface CreateEventPayload {
  tournament: string;
  eventName: string;
  eventDescription: string;
  eventImage: string;
  eventDescriptionImage: string;
  haveThreeOptions: boolean;
  yesPlaceholder: string;
  noPlaceholder: string;
  maybePlaceholder: string;
  entryStartTime: string;
  entryCloseTime: string;
}

/** Shown on list responses; create may send `createdBy` instead. */
export interface EventCreatedByUserData {
  userName: string;
  email: string;
  userType: string;
}

export interface EventTournamentData {
  tournament: string;
  tournamentName: string;
  tournamentYear: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
}

export interface Event {
  _id: string;
  eventId: string;
  tournament: string;
  eventName: string;
  eventDescription?: string;
  eventImage?: string;
  eventDescriptionImage?: string;
  haveThreeOptions: boolean;
  yesPlaceholder: string;
  noPlaceholder: string;
  coinsOnYes: number;
  coinsOnNo: number;
  initialCoinsOnYes: number;
  initialCoinsOnNo: number;
  eventStatus: string;
  entryStartTime: string;
  entryCloseTime?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  createdByUserData?: EventCreatedByUserData;
  tournamentData?: EventTournamentData;
  __v?: number;
  maybePlaceholder?: string | null;
  coinsOnMaybe?: number | null;
  initialCoinsOnMaybe?: number | null;
  totalCoins?: number;
  oddsYes?: number;
  oddsNo?: number;
  oddsMaybe?: number | null;
  winningOption?: "Y" | "N" | "M" | null;
  yesPlaceholderColor?: string;
  noPlaceholderColor?: string;
  maybePlaceholderColor?: string;
  yesTextColor?: string;
  noTextColor?: string;
  maybeTextColor?: string;
}

export interface EditEventBody {
  eventName?: string;
  eventDescription?: string;
  eventImage?: string;
  eventDescriptionImage?: string;
  entryStartTime?: string;
  entryCloseTime?: string;
  yesPlaceholder?: string;
  noPlaceholder?: string;
  maybePlaceholder?: string;
  yesPlaceholderColor?: string;
  noPlaceholderColor?: string;
  maybePlaceholderColor?: string;
  yesTextColor?: string;
  noTextColor?: string;
  maybeTextColor?: string;
}

export type EventWinningOption = NonNullable<Event["winningOption"]>;

export interface EventSuccessResponse {
  statusCode: number;
  data: Event;
  message: string;
  success: boolean;
}

export interface EventsListSuccessResponse {
  statusCode: number;
  data: Event[];
  message: string;
  success: boolean;
}

export interface EventBetUserXP {
  totalXP: number;
  [tournament: string]: number;
}

export interface EventBetUserData {
  _id: string;
  userName: string;
  email: string;
  coins: number;
  xp: EventBetUserXP;
}

export interface OptionOddsAtBetTime {
  Y: number;
  N: number;
  M?: number;
}

export type EventChosenOption = "Y" | "N" | "M";

export interface EventBet {
  _id: string;
  userId: EventBetUserData;
  eventId: string;
  chosenOption: EventChosenOption;
  coinsBet: number;
  oddsChoice: number | null;
  coinsWon: number;
  totalCoinsReceived: number;
  optionOddsAtBetTime: OptionOddsAtBetTime;
  submissionTime: string;
  payoutStatus: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface EventBetsListSuccessResponse {
  statusCode: number;
  data: EventBet[];
  message: string;
  success: boolean;
}
