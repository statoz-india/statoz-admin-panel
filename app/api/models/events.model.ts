export interface CreateEventPayload {
  tournament: string;
  eventName: string;
  eventDescription: string;
  eventImage: string;
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

export interface Event {
  _id: string;
  eventId: string;
  tournament: string;
  eventName: string;
  eventDescription?: string;
  eventImage?: string;
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
  __v?: number;
  maybePlaceholder?: string | null;
  coinsOnMaybe?: number | null;
  initialCoinsOnMaybe?: number | null;
  totalCoins?: number;
  oddsYes?: number;
  oddsNo?: number;
  oddsMaybe?: number | null;
}

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
