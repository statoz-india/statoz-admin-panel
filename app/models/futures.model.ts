export interface CreateFutureChoicePayload {
  choiceName: string;
  choiceDescription?: string;
  choiceImage?: string;
  choiceCoins: number;
  initialCoinsOnChoice: number;
  teamDetails?: string;
  isVisible: boolean;
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

export interface FutureChoice {
  _id: string;
  choiceId: string;
  choiceName: string;
  choiceDescription?: string;
  choiceImage?: string;
  choiceCoins: number;
  initialCoinsOnChoice: number;
  teamDetails?: string;
  isVisible: boolean;
  odds: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface Future {
  _id: string;
  futureId: string;
  tournament: string;
  eventName: string;
  eventDescription?: string;
  eventImage?: string;
  eventDescriptionImage?: string;
  futureStatus: string;
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
