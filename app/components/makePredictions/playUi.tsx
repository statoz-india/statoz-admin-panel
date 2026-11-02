"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Atom } from "react-loading-indicators";
import type { PlayBet } from "@/app/interface/app-user.interface";
import { ApiRequestError, apiRequest } from "@/app/utils/apiRequest";
import { appUserRequest } from "@/app/utils/appUsers";
import { statusBadgeClass } from "@/app/utils/statusBadge";

/** Pieces shared by the Make Predictions play tabs. */

export const messageOf = (error: unknown, fallback = "Something went wrong") =>
  error instanceof Error && error.message ? error.message : fallback;

export function formatIST(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export const formatOdds = (odds: number | null | undefined) =>
  typeof odds === "number" && Number.isFinite(odds) ? `${odds.toFixed(1)}%` : "—";

/**
 * One admin list (`/api/quiz/upcoming`, …), split into open rows and, when
 * `isAwaitingResult` is given, rows whose entries closed. It's the same for
 * every user, so it's loaded with the admin's session; bets still go as the
 * user. While a reload runs the previous rows stay on screen.
 */
export function usePlayList<T>(
  route: string,
  isOpen: (item: T) => boolean,
  isAwaitingResult?: (item: T) => boolean,
) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; items: T[]; error: string } | null>(null);
  const key = `${route}|${attempt}`;

  useEffect(() => {
    let cancelled = false;
    apiRequest<T[]>(route, { method: "GET" }, "Couldn't load the list")
      .then((data) => {
        if (!cancelled) setResult({ key, items: Array.isArray(data) ? data : [], error: "" });
      })
      .catch((error: unknown) => {
        if (!cancelled) setResult({ key, items: [], error: messageOf(error, "Couldn't load the list") });
      });
    return () => {
      cancelled = true;
    };
  }, [route, key]);

  const items = useMemo(() => (result?.items ?? []).filter(isOpen), [result, isOpen]);
  const awaiting = useMemo(
    () => (isAwaitingResult ? (result?.items ?? []).filter((item) => !isOpen(item) && isAwaitingResult(item)) : []),
    [result, isOpen, isAwaitingResult],
  );

  return {
    items,
    awaiting,
    /** Every row the endpoint returned, open or not. */
    total: result?.items.length ?? 0,
    loaded: result !== null,
    refreshing: result !== null && result.key !== key,
    error: result?.key === key ? result.error : "",
    reload: () => setAttempt((n) => n + 1),
  };
}

/** Loading, error and empty states around a play list, with its awaiting-result rows below. */
export function PlayList({
  list,
  noun,
  children,
  awaitingRows,
}: {
  list: {
    loaded: boolean;
    refreshing: boolean;
    error: string;
    items: unknown[];
    awaiting: unknown[];
    total: number;
    reload: () => void;
  };
  noun: string;
  children: ReactNode;
  awaitingRows?: ReactNode;
}) {
  const notTaking = list.total - list.items.length - list.awaiting.length;
  if (!list.loaded) {
    return (
      <div className="flex justify-center py-12">
        <Atom color="#5CDFFF" size="small" text="" textColor="" />
      </div>
    );
  }
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3 text-sm text-gray-400">
        <span>
          {list.items.length} open {noun}
          {list.awaiting.length > 0 ? ` · ${list.awaiting.length} closed, awaiting result` : ""}
          {notTaking > 0 ? ` · ${notTaking} not taking entries, hidden` : ""}
        </span>
        <button
          type="button"
          onClick={list.reload}
          disabled={list.refreshing}
          className="rounded-md border border-zinc-600 px-3 py-1.5 text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {list.refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      {list.error ? (
        <p className="rounded-lg border border-red-800/60 bg-red-950/30 p-4 text-sm text-red-300">
          {list.error}
        </p>
      ) : (
        <>
          {list.items.length === 0 ? (
            <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-10 text-center">
              <p className="text-white">No open {noun} right now.</p>
            </div>
          ) : (
            <ul className="space-y-3">{children}</ul>
          )}
          {list.awaiting.length > 0 ? (
            <div className="mt-8">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Closed, awaiting result
              </p>
              <ul className="space-y-3 opacity-80">{awaitingRows}</ul>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export const isPast = (iso?: string | null) => {
  const ms = iso ? Date.parse(iso) : NaN;
  return Number.isFinite(ms) && ms < Date.now();
};

/** The admin lists include items players can't see in the app. */
export function HiddenBadge({ hidden }: { hidden?: boolean }) {
  return hidden ? (
    <span className="rounded-md bg-zinc-700 px-2 py-0.5 text-xs font-medium text-zinc-200">Hidden</span>
  ) : null;
}

/** A row that expands to its play form. */
export function PlayCard({
  title,
  subtitle,
  status,
  meta,
  badge,
  warning,
  actionLabel,
  children,
}: {
  title: string;
  subtitle?: string;
  status?: string;
  meta: { label: string; value: string }[];
  badge?: ReactNode;
  warning?: string;
  actionLabel: string;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li className="rounded-lg border border-zinc-700 bg-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-3 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-white">{title}</h3>
            {status ? (
              <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusBadgeClass(status)}`}>
                {status}
              </span>
            ) : null}
            {badge}
          </div>
          {subtitle ? <p className="mt-0.5 text-xs text-zinc-400">{subtitle}</p> : null}
          <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs">
            {meta.map((m) => (
              <div key={m.label} className="flex gap-1.5">
                <dt className="text-zinc-500">{m.label}</dt>
                <dd className="text-zinc-200">{m.value}</dd>
              </div>
            ))}
          </dl>
          {warning ? <p className="mt-2 text-xs text-amber-300">{warning}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            open ? "border border-zinc-600 text-white hover:bg-zinc-800" : "bg-white text-black hover:bg-zinc-200"
          }`}
        >
          {open ? "Close" : actionLabel}
        </button>
      </div>
      {open && <div className="border-t border-zinc-800 p-4">{children(() => setOpen(false))}</div>}
    </li>
  );
}

/** `disabled` options are shown greyed out, e.g. a hidden future choice. */
export type BetOption = { value: string; label: string; odds?: number | null; disabled?: boolean };

const RANDOM_COINS_MIN = 10;
const RANDOM_COINS_MAX = 50;

/** Pick an outcome and a stake, then place the bet. */
export function BetForm({
  options,
  onPlace,
  allowRandom = false,
}: {
  options: BetOption[];
  /** Places the bet; resolves to the message to show. */
  onPlace: (option: string, coins: number) => Promise<string>;
  /** Shows "Select random", which fills an option and a 10–50 coin stake. */
  allowRandom?: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [coins, setCoins] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectRandom = () => {
    const pickable = options.filter((o) => !o.disabled);
    if (pickable.length === 0) return;
    setSelected(pickable[Math.floor(Math.random() * pickable.length)].value);
    setCoins(
      String(RANDOM_COINS_MIN + Math.floor(Math.random() * (RANDOM_COINS_MAX - RANDOM_COINS_MIN + 1))),
    );
    setError("");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const amount = Number(coins);
    if (!selected) {
      setError("Pick an option.");
      return;
    }
    if (!Number.isFinite(amount) || amount < 1) {
      setError("Bet at least 1 coin.");
      return;
    }
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      setSuccess(await onPlace(selected, amount));
      setCoins("");
    } catch (err) {
      setError(messageOf(err, "The bet wasn't placed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div role="radiogroup" className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected === option.value}
            disabled={option.disabled}
            onClick={() => setSelected(option.value)}
            className={`rounded-md border px-4 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              selected === option.value
                ? "border-cyan-500 bg-cyan-950/50 text-cyan-100"
                : "border-zinc-600 text-zinc-200 hover:bg-zinc-800"
            }`}
          >
            <span className="font-medium">{option.label}</span>
            {option.disabled ? <span className="ml-2 text-xs text-zinc-500">hidden</span> : null}
            {option.odds !== undefined && (
              <span className="ml-2 text-xs text-zinc-400">{formatOdds(option.odds)}</span>
            )}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="number"
          min={1}
          step="any"
          inputMode="numeric"
          value={coins}
          onChange={(e) => setCoins(e.target.value)}
          placeholder="Coins"
          aria-label="Coins to bet"
          className="w-32 rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200 disabled:opacity-50"
        >
          {busy ? "Placing…" : "Place bet"}
        </button>
        {allowRandom ? (
          <button
            type="button"
            onClick={selectRandom}
            disabled={busy}
            className="rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            Select random
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-300">{success}</p> : null}
    </form>
  );
}

/** The user's bets on one item; `version` reloads them after a new bet. */
export function YourBets({
  userId,
  path,
  version,
  describe,
}: {
  userId: string;
  path: string;
  version: number;
  describe: (bet: PlayBet) => string;
}) {
  const key = `${path}|${version}`;
  const [result, setResult] = useState<{ key: string; bets: PlayBet[]; error: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    appUserRequest<PlayBet[]>(userId, "GET", path)
      .then((data) => {
        if (!cancelled) setResult({ key, bets: Array.isArray(data) ? data : [], error: "" });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        // No bets yet can come back as a 404.
        const none = error instanceof ApiRequestError && error.status === 404;
        setResult({ key, bets: [], error: none ? "" : messageOf(error, "Couldn't load the bets") });
      });
    return () => {
      cancelled = true;
    };
  }, [userId, path, key]);

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">Your bets</p>
      {!result ? (
        <p className="text-sm text-zinc-500">Loading…</p>
      ) : result.error ? (
        <p className="text-sm text-red-300">{result.error}</p>
      ) : result.bets.length === 0 ? (
        <p className="text-sm text-zinc-500">No bets yet.</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {result.bets.map((bet) => (
            <li key={bet._id} className="flex flex-wrap gap-x-4 text-zinc-300">
              <span className="text-white">{describe(bet)}</span>
              <span className="tabular-nums">{bet.coinsBet.toLocaleString()} coins</span>
              <span className="text-zinc-500">{formatIST(bet.submissionTime ?? bet.createdAt)}</span>
              {bet.payoutStatus ? <span className="text-zinc-500">{bet.payoutStatus}</span> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
