/** Chosen-option details embedded on a played-future submission row. */
export interface PlayedFutureChoice {
  _id: string;
  choiceName: string;
  choiceId: string;
  choiceImage: string;
  choiceCoins: number;
}

/** Future market summary on a user submission row. */
export interface PlayedFutureSummary {
  _id: string;
  futureId: string;
  eventName: string;
  tournament: string;
  futureStatus: string;
  eventImage: string;
  entryStartTime: string;
  entryCloseTime: string;
  correctChoice: string | null;
}

/** Single user future bet as returned by playedFuturesForAdmin. */
export interface PlayedFuture {
  submissionId: string;
  futureId: string;
  futureChoiceId: string;
  futureChoice: PlayedFutureChoice | null;
  coinsBet: number;
  coinsWon: number;
  totalCoinsReceived: number;
  payoutStatus: string;
  submissionTime: string;
  isSettled: boolean;
  netCoins: number | null;
  future: PlayedFutureSummary | null;
}
