import { useSyncExternalStore } from "react";
import {
  APP_USER_TOKEN_HEADER,
  type AppUserLogin,
  type AppUserSession,
} from "@/app/interface/app-user.interface";
import { ApiRequestError } from "@/app/utils/apiRequest";

/**
 * The app users an admin has signed in as on Make Predictions, kept in this
 * browser's localStorage with their tokens. They last as long as localStorage
 * does; logging out of the panel clears it.
 */

export const APP_USERS_STORAGE_KEY = "statoz.makePredictions.users";

/** Must match `APP_USER_SIGNED_OUT` in the server proxy. */
const SIGNED_OUT_FLAG = "appUserSignedOut";

const EMPTY: AppUserSession[] = [];
const listeners = new Set<() => void>();
let cache: { raw: string | null; users: AppUserSession[] } = { raw: null, users: EMPTY };

function parse(raw: string | null): AppUserSession[] {
  if (!raw) return EMPTY;
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter(
          (u): u is AppUserSession =>
            u && typeof u._id === "string" && typeof u.accessToken === "string",
        )
      : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function readAppUsers(): AppUserSession[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(APP_USERS_STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== cache.raw) cache = { raw, users: parse(raw) };
  return cache.users;
}

function writeAppUsers(users: AppUserSession[]) {
  try {
    localStorage.setItem(APP_USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Storage full or blocked: the list just doesn't persist.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab adding or removing a user.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** The stored app users, re-rendering when the list changes (in any tab). */
export function useAppUsers(): AppUserSession[] {
  return useSyncExternalStore(subscribe, readAppUsers, () => EMPTY);
}

export function findAppUser(id: string): AppUserSession | undefined {
  return readAppUsers().find((u) => u._id === id);
}

/** Adds a freshly signed-in user, or replaces their tokens if already listed. */
export function saveAppUserLogin(login: AppUserLogin): AppUserSession {
  const existing = findAppUser(login.user._id);
  const session: AppUserSession = {
    _id: login.user._id,
    email: login.user.email,
    userName: login.user.userName,
    avatarUrl: login.user.avatarUrl,
    coins: login.user.coins,
    accessToken: login.accessToken,
    refreshToken: login.refreshToken,
    addedAt: existing?.addedAt ?? new Date().toISOString(),
  };
  writeAppUsers(
    existing
      ? readAppUsers().map((u) => (u._id === session._id ? session : u))
      : [...readAppUsers(), session],
  );
  return session;
}

export function updateAppUser(id: string, patch: Partial<AppUserSession>) {
  writeAppUsers(readAppUsers().map((u) => (u._id === id ? { ...u, ...patch } : u)));
}

export function removeAppUser(id: string) {
  writeAppUsers(readAppUsers().filter((u) => u._id !== id));
}

type Envelope = {
  success?: boolean;
  data?: unknown;
  message?: string;
  [SIGNED_OUT_FLAG]?: boolean;
};

async function postJson(url: string, body: unknown): Promise<{ res: Response; body: Envelope }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return { res, body: await res.json().catch(() => ({})) };
}

/** Emails the user a login code. */
export async function sendAppUserCode(email: string): Promise<void> {
  const { res, body } = await postJson("/api/app-user/send-otp", { email });
  if (!res.ok || !body.success) {
    throw new ApiRequestError(body.message || "Couldn't send the code", [], res.status);
  }
}

/** Signs the user in with their code and stores them. */
export async function signInAppUser(
  email: string,
  otp: string,
  deviceId: string,
): Promise<AppUserSession> {
  const { res, body } = await postJson("/api/app-user/login", { email, otp, deviceId });
  const login = body.data as AppUserLogin | undefined;
  if (!res.ok || !body.success || !login?.user?._id || !login.accessToken) {
    throw new ApiRequestError(body.message || "Couldn't sign in", [], res.status);
  }
  return saveAppUserLogin(login);
}

function signedOutError(id: string, message = "This user's session has ended. Sign them in again.") {
  updateAppUser(id, { signedOut: true });
  return new ApiRequestError(message, [], 401);
}

/** Renewals in flight, by user: parallel calls that all hit 498 share one. */
const renewals = new Map<string, Promise<AppUserSession>>();

function renew(user: AppUserSession): Promise<AppUserSession> {
  let pending = renewals.get(user._id);
  if (!pending) {
    pending = (async () => {
      const { res, body } = await postJson("/api/app-user/refresh", {
        refreshToken: user.refreshToken,
      });
      const tokens = body.data as { accessToken?: string; refreshToken?: string } | undefined;
      if (res.ok && body.success && tokens?.accessToken) {
        const patch = {
          accessToken: tokens.accessToken,
          // Without rotation the backend hands back the same token, or none.
          refreshToken: tokens.refreshToken || user.refreshToken,
        };
        updateAppUser(user._id, patch);
        return { ...user, ...patch };
      }
      if (body[SIGNED_OUT_FLAG]) throw signedOutError(user._id);
      throw new ApiRequestError(body.message || "Couldn't renew this user's session", [], res.status);
    })().finally(() => renewals.delete(user._id));
    renewals.set(user._id, pending);
  }
  return pending;
}

/**
 * One player action as the stored user (`path` is the backend path, e.g.
 * `prediction/submitPrediction/<id>`). Renews an expired token once and
 * retries; marks the user signed out when the backend ends their session.
 */
export async function appUserRequest<T>(
  userId: string,
  method: "GET" | "POST" | "PUT",
  path: string,
  payload?: unknown,
): Promise<T> {
  let user = findAppUser(userId);
  if (!user) throw new ApiRequestError("This user isn't added on this browser.", [], 404);
  if (user.signedOut) throw new ApiRequestError("Sign this user in again.", [], 401);

  const send = (session: AppUserSession) =>
    fetch(`/api/app-user/act/${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        [APP_USER_TOKEN_HEADER]: session.accessToken,
      },
      credentials: "include",
      ...(payload !== undefined ? { body: JSON.stringify(payload) } : {}),
    });

  let res = await send(user);
  if (res.status === 498) {
    user = await renew(user);
    res = await send(user);
  }

  const body: Envelope = await res.json().catch(() => ({}));
  if (body[SIGNED_OUT_FLAG]) throw signedOutError(userId);
  if (!res.ok || !body.success) {
    throw new ApiRequestError(body.message || "The request failed", [], res.status);
  }
  return body.data as T;
}
