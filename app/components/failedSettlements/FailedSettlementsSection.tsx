"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Atom } from "react-loading-indicators";
import type { Paginated } from "@/app/interface/pagination.interface";
import {
  isSettledManually,
  isSettlementFailureKind,
  isSettlementFailureStatus,
  SETTLEMENT_FAILURE_KIND_LABELS,
  SETTLEMENT_FAILURE_KINDS,
  SETTLEMENT_FAILURE_STATUS_LABELS,
  SETTLEMENT_FAILURE_STATUSES,
  settlementFailureItemHref,
  settlementFailureItemStatus,
  type SettlementFailure,
  type SettlementFailureKind,
  type SettlementFailureStatus,
} from "@/app/interface/settlement-failure.interface";
import { apiRequest } from "@/app/utils/apiRequest";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";
import { Section } from "@/app/utils/enums/section.enum";
import { statusBadgeClass } from "@/app/utils/statusBadge";

export const QUERY_SETTLEMENT_STATUS = "settlementStatus";
export const QUERY_SETTLEMENT_KIND = "settlementKind";

const PAGE_SIZE = 20;

/** Timeouts on this many rows of a page point at the settlement service, not the items. */
const SERVICE_TROUBLE_THRESHOLD = 3;

type Result = {
  /** The request this answers; anything else on screen is still loading. */
  key: string;
  data: Paginated<SettlementFailure> | null;
  error: string;
};

function formatIST(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** "HTTP 400" for a service answer, "Timeout / network" when there was none. */
const errorSource = (failure: SettlementFailure) =>
  failure.lastStatusCode === null
    ? "Timeout / network"
    : `HTTP ${failure.lastStatusCode}`;

/**
 * Quizzes, predictions and events the settlement service rejected or never
 * answered after their match ended. The backend retries on its own; this is
 * where an admin sees the ones that keep failing.
 */
export default function FailedSettlementsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get(QUERY_SETTLEMENT_STATUS);
  const kindParam = searchParams.get(QUERY_SETTLEMENT_KIND);
  const status: SettlementFailureStatus = isSettlementFailureStatus(statusParam)
    ? statusParam
    : "open";
  const kind: SettlementFailureKind | null = isSettlementFailureKind(kindParam)
    ? kindParam
    : null;

  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  const requestKey = `${status}|${kind ?? ""}|${page}|${attempt}`;
  const loading = result?.key !== requestKey;

  useEffect(() => {
    let cancelled = false;
    const query = new URLSearchParams({
      status,
      page: String(page),
      limit: String(PAGE_SIZE),
    });
    if (kind) query.set("kind", kind);
    apiRequest<Paginated<SettlementFailure>>(
      `/api/admin-api/getsettlementfailures?${query.toString()}`,
      { method: "GET" },
      "Failed to load settlement failures",
    )
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, data, error: "" });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setResult({
          key: requestKey,
          data: null,
          error:
            error instanceof Error
              ? error.message
              : "Failed to load settlement failures",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [requestKey, status, kind, page]);

  const replaceQuery = useCallback(
    (update: (sp: URLSearchParams) => void) => {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", Section.FAILED_SETTLEMENTS);
      update(sp);
      stripAdminHomeQueryNoise(Section.FAILED_SETTLEMENTS, sp);
      router.replace(`/?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const selectStatus = (next: SettlementFailureStatus) => {
    setPage(1);
    replaceQuery((sp) => {
      if (next === "open") sp.delete(QUERY_SETTLEMENT_STATUS);
      else sp.set(QUERY_SETTLEMENT_STATUS, next);
    });
  };

  const selectKind = (next: SettlementFailureKind | null) => {
    setPage(1);
    replaceQuery((sp) => {
      if (next) sp.set(QUERY_SETTLEMENT_KIND, next);
      else sp.delete(QUERY_SETTLEMENT_KIND);
    });
  };

  const openItem = (href: string) => {
    const sep = href.includes("?") ? "&" : "?";
    const filters = new URLSearchParams({ from: Section.FAILED_SETTLEMENTS });
    if (status !== "open") filters.set(QUERY_SETTLEMENT_STATUS, status);
    if (kind) filters.set(QUERY_SETTLEMENT_KIND, kind);
    // Carry the filters so the item page's Back lands on them again.
    router.push(`${href}${sep}${filters.toString()}`, { scroll: false });
  };

  const data = result?.data ?? null;
  const rows = data?.items ?? [];
  const timeouts = rows.filter(
    (row) => row.resolvedAt === null && row.lastStatusCode === null,
  ).length;

  return (
    <div className="p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Failed settlements</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-400">
              Quizzes, predictions and events the settlement service rejected
              or never answered after their match ended. Most recent failure
              first.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAttempt((n) => n + 1)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              aria-hidden
            />
            Refresh
          </button>
        </div>

        <ul className="mb-6 space-y-1 rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm text-gray-400">
          <li>
            The backend keeps retrying on its own, waiting 1, 2, 4… up to 30
            minutes between attempts. A row with a few attempts may still sort
            itself out.
          </li>
          <li>
            <span className="text-gray-200">Resolved</span> means the service
            accepted a later request, not that payouts are finished.
          </li>
          <li>
            Settling an item by hand leaves its row open: it shows as{" "}
            <span className="text-gray-200">Settled manually</span>.
          </li>
          <li>
            A 4xx from the service usually means something is wrong with that
            item or its ESPN game: check the ESPN event id against the match.
          </li>
        </ul>

        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div
            role="group"
            aria-label="Filter by status"
            className="inline-flex rounded-lg border border-zinc-700 bg-zinc-900 p-1"
          >
            {SETTLEMENT_FAILURE_STATUSES.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={status === value}
                onClick={() => selectStatus(value)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  status === value
                    ? "bg-white text-black"
                    : "text-gray-300 hover:bg-zinc-800"
                }`}
              >
                {SETTLEMENT_FAILURE_STATUS_LABELS[value]}
              </button>
            ))}
          </div>

          <div
            role="group"
            aria-label="Filter by kind"
            className="flex flex-wrap gap-2"
          >
            {[null, ...SETTLEMENT_FAILURE_KINDS].map((value) => (
              <button
                key={value ?? "all"}
                type="button"
                aria-pressed={kind === value}
                onClick={() => selectKind(value)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  kind === value
                    ? "border-cyan-600 bg-cyan-950/50 text-cyan-100"
                    : "border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {value ? SETTLEMENT_FAILURE_KIND_LABELS[value] : "All kinds"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Atom color="#5CDFFF" size="medium" text="" textColor="" />
          </div>
        ) : result?.error ? (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-red-800/60 bg-red-950/30 p-4">
            <p className="text-red-300">{result.error}</p>
            <button
              type="button"
              onClick={() => setAttempt((n) => n + 1)}
              className="rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Retry
            </button>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-10 text-center">
            <p className="text-lg font-medium text-white">
              {status !== "open"
                ? "No settlement failures match these filters."
                : kind
                  ? `No open ${SETTLEMENT_FAILURE_KIND_LABELS[kind].toLowerCase()} settlement failures 🎉`
                  : "No open settlement failures 🎉"}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Nothing here needs your attention right now.
            </p>
          </div>
        ) : (
          <>
            {timeouts >= SERVICE_TROUBLE_THRESHOLD && (
              <p className="mb-4 flex items-start gap-2 rounded-lg border border-amber-700/60 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {timeouts} open failures on this page got no answer from the
                settlement service (timeout or network error). When many fail
                at once, the service is probably down or overloaded, rather
                than something being wrong with the items.
              </p>
            )}

            <div className="overflow-x-auto rounded-lg border border-zinc-700 bg-zinc-900">
              <table className="min-w-full text-left text-sm text-gray-300">
                <thead>
                  <tr className="border-b border-zinc-700 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3 font-medium">Kind</th>
                    <th className="px-4 py-3 font-medium">Item</th>
                    <th className="px-4 py-3 font-medium">Current status</th>
                    <th className="px-4 py-3 font-medium">ESPN event</th>
                    <th className="px-4 py-3 font-medium text-right">Attempts</th>
                    <th className="px-4 py-3 font-medium">Last error</th>
                    <th className="px-4 py-3 font-medium">Last failed</th>
                    <th className="px-4 py-3 font-medium">Resolved</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((failure) => (
                    <FailureRow
                      key={failure._id}
                      failure={failure}
                      onOpen={openItem}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {data && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-400">
                <span>
                  Page {data.page} of {Math.max(data.totalPages, 1)} ·{" "}
                  {data.total.toLocaleString()}{" "}
                  {data.total === 1 ? "failure" : "failures"}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => p - 1)}
                    disabled={data.page <= 1}
                    className="rounded-md border border-zinc-600 px-3 py-1.5 text-white hover:bg-zinc-800 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!data.hasMore}
                    className="rounded-md border border-zinc-600 px-3 py-1.5 text-white hover:bg-zinc-800 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FailureRow({
  failure,
  onOpen,
}: {
  failure: SettlementFailure;
  onOpen: (href: string) => void;
}) {
  const href = settlementFailureItemHref(failure);
  const itemStatus = settlementFailureItemStatus(failure);
  const settledManually = isSettledManually(failure);

  return (
    <tr
      onClick={href ? () => onOpen(href) : undefined}
      className={`border-b border-zinc-800 align-top last:border-0 ${
        href ? "cursor-pointer hover:bg-indigo-500/10" : ""
      } ${settledManually ? "opacity-50" : ""}`}
    >
      <td className="px-4 py-3 whitespace-nowrap text-white">
        {SETTLEMENT_FAILURE_KIND_LABELS[failure.kind] ?? failure.kind}
      </td>
      <td className="px-4 py-3">
        {href ? (
          <a
            href={href}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpen(href);
            }}
            className="font-mono text-xs text-cyan-300 hover:underline"
          >
            {failure.itemId}
          </a>
        ) : (
          <span className="font-mono text-xs text-gray-400">{failure.itemId}</span>
        )}
        {failure.item?.tournament ? (
          <p className="mt-0.5 text-xs text-gray-500">{failure.item.tournament}</p>
        ) : null}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusBadgeClass(itemStatus)}`}
          >
            {itemStatus}
          </span>
          {settledManually && (
            <span className="rounded-md border border-zinc-600 px-2 py-0.5 text-xs text-gray-300">
              Settled manually
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 font-mono text-xs">{failure.espnEventId || "—"}</td>
      <td className="px-4 py-3 text-right tabular-nums">{failure.attempts}</td>
      <td className="max-w-xs px-4 py-3">
        <p className="text-xs text-gray-500">{errorSource(failure)}</p>
        <p className="truncate" title={failure.lastError}>
          {failure.lastError || "—"}
        </p>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {formatIST(failure.lastFailedAt)}
        <p className="mt-0.5 text-xs text-gray-500">
          First {formatIST(failure.firstFailedAt)}
        </p>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {failure.resolvedAt ? (
          formatIST(failure.resolvedAt)
        ) : (
          <span className="text-amber-300">Open</span>
        )}
      </td>
    </tr>
  );
}
