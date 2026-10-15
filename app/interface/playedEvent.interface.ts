/** Event summary embedded on a played-event admin submission row. */
export interface PlayedEventSummary {
  _id: string;
  eventId: string;
  eventName: string;
  tournament: string;
  eventStatus: string;
  eventImage: string;
  entryStartTime: string;
  entryCloseTime: string;
  haveThreeOptions: boolean;
  yesPlaceholder: string;
  noPlaceholder: string;
  maybePlaceholder: string;
  winningOption: string;
}

/** Single user event bet as returned by playedEventsForAdmin. */
export interface PlayedEvent {
  submissionId: string;
  eventId: string;
  chosenOption: "Y" | "N" | "M";
  coinsBet: number;
  coinsWon: number;
  totalCoinsReceived: number;
  payoutStatus: string;
  submissionTime: string;
  isSettled: boolean;
  netCoins: number | null;
  event: PlayedEventSummary | null;
}
