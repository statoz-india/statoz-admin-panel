/** One signed-in device, as the backend's `GET /authorization/sessions` lists it. */
export interface DeviceSession {
  _id: string;
  deviceName?: string;
  /** "web", "ios" or "android". */
  platform?: string;
  appVersion?: string;
  ip?: string;
  lastUsedAt?: string;
  createdAt?: string;
  /** The browser making the call. */
  isCurrent?: boolean;
}
