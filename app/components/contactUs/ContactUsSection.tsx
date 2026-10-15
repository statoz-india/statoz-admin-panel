"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import {
  CONTACT_ISSUES,
  CONTACT_ISSUE_LABELS,
  CONTACT_US_PAGE_SIZE,
  isContactIssue,
  type ContactIssue,
  type ContactUsMessage,
  type ListContactUsParams,
  type PaginatedContactUs,
} from "@/app/interface/contact-us.interface";
import { apiRequest } from "@/app/utils/apiRequest";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";
import { Section } from "@/app/utils/enums/section.enum";

/** `null` is the "All" filter. */
type IssueFilter = ContactIssue | null;

const ISSUE_BADGE_CLASS: Record<ContactIssue, string> = {
  BUG: "border-red-700 bg-red-900/40 text-red-300",
  FEATURE_REQUEST: "border-sky-700 bg-sky-900/40 text-sky-300",
  DATA_MISMATCH: "border-amber-700 bg-amber-900/40 text-amber-300",
  SHOUTOUT: "border-emerald-700 bg-emerald-900/40 text-emerald-300",
};

/** Details longer than this start collapsed. */
const COLLAPSE_CHARS = 320;
const COLLAPSE_LINES = 5;

function listContactUs(params: ListContactUsParams) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) sp.set(key, String(value));
  }
  return apiRequest<PaginatedContactUs>(
    `/api/contact-us?${sp.toString()}`,
    { method: "GET" },
    "Failed to load Contact Us messages",
  );
}

function formatIst(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ContactUsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const issueParam = searchParams.get("contactIssue");
  const issue: IssueFilter = isContactIssue(issueParam) ? issueParam : null;

  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  // The latest response, tagged with the request it answers; loading until
  // the current request's response arrives.
  const requestKey = `${issue ?? "ALL"}|${page}|${reloadKey}`;
  const [result, setResult] = useState<{
    key: string;
    data: PaginatedContactUs | null;
    error: string;
  } | null>(null);
  const loading = result?.key !== requestKey;
  const data = loading ? null : result.data;
  const error = loading ? "" : result.error;
  // Total per filter; "ALL" is the unfiltered count.
  const [counts, setCounts] = useState<
    Partial<Record<ContactIssue | "ALL", number>>
  >({});

  useEffect(() => {
    let cancelled = false;
    listContactUs({
      page,
      limit: CONTACT_US_PAGE_SIZE,
      contactIssue: issue ?? undefined,
    })
      .then((list) => {
        if (!cancelled) setResult({ key: requestKey, data: list, error: "" });
      })
      .catch((err) => {
        if (cancelled) return;
        setResult({
          key: requestKey,
          data: null,
          error:
            err instanceof Error
              ? err.message
              : "Failed to load Contact Us messages",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [issue, page, requestKey]);

  // One `limit=1` request per filter; only `total` is read.
  useEffect(() => {
    let cancelled = false;
    const filters: IssueFilter[] = [null, ...CONTACT_ISSUES];
    Promise.allSettled(
      filters.map((f) =>
        listContactUs({ page: 1, limit: 1, contactIssue: f ?? undefined }),
      ),
    ).then((results) => {
      if (cancelled) return;
      const next: Partial<Record<ContactIssue | "ALL", number>> = {};
      results.forEach((result, i) => {
        if (result.status === "fulfilled") {
          next[filters[i] ?? "ALL"] = result.value.total;
        }
      });
      setCounts(next);
    });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const selectIssue = useCallback(
    (next: IssueFilter) => {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", Section.CONTACT_US);
      if (next) sp.set("contactIssue", next);
      else sp.delete("contactIssue");
      stripAdminHomeQueryNoise(Section.CONTACT_US, sp);
      setPage(1);
      router.replace(`/?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const firstShown = (page - 1) * CONTACT_US_PAGE_SIZE + 1;

  // Opening a sender keeps this filter, so the user page's Back returns here.
  const userHref = (userId: string) => {
    const q = new URLSearchParams({ fromSection: Section.CONTACT_US });
    if (issue) q.set("contactIssue", issue);
    return `/users/${encodeURIComponent(userId)}?${q.toString()}`;
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
            <MessageSquare className="h-6 w-6 text-cyan-400" />
            Contact Us
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Messages users sent from the app’s Contact Us form, newest first.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto border-b border-zinc-800">
        {([null, ...CONTACT_ISSUES] as IssueFilter[]).map((f) => {
          const active = f === issue;
          const count = counts[f ?? "ALL"];
          return (
            <button
              key={f ?? "ALL"}
              type="button"
              onClick={() => selectIssue(f)}
              aria-pressed={active}
              className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "border-cyan-500 text-white"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              {f ? CONTACT_ISSUE_LABELS[f] : "All"}
              {count !== undefined && (
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-gray-300">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
          Loading messages…
        </div>
      ) : items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              userHref={userHref}
            />
          ))}
        </ul>
      ) : (
        !error && (
          <div className="rounded-xl border border-zinc-800 py-16 text-center text-sm text-gray-500">
            {page > 1
              ? "No messages on this page."
              : issue
                ? `No ${CONTACT_ISSUE_LABELS[issue].toLowerCase()} messages yet.`
                : "No messages yet."}
          </div>
        )
      )}

      {!error && total > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm text-gray-500">
            {items.length > 0
              ? `Showing ${firstShown}–${firstShown + items.length - 1} of ${total}`
              : `${total} total`}
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="px-2 text-sm text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!data?.hasMore || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MessageCard({
  message,
  userHref,
}: {
  message: ContactUsMessage;
  userHref: (userId: string) => string;
}) {
  const [expanded, setExpanded] = useState(false);
  const sender = message.submittedBy;
  const collapsible =
    message.details.length > COLLAPSE_CHARS ||
    message.details.split("\n").length > COLLAPSE_LINES;

  return (
    <li className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
            ISSUE_BADGE_CLASS[message.contactIssue] ??
            "border-zinc-700 bg-zinc-800 text-gray-300"
          }`}
        >
          {CONTACT_ISSUE_LABELS[message.contactIssue] ?? message.contactIssue}
        </span>
        <span className="text-xs text-gray-500">
          {formatIst(message.createdAt)} IST
        </span>
      </div>

      <h3 className="mb-2 wrap-break-word font-semibold text-white">
        {message.summary}
      </h3>

      <p
        className={`whitespace-pre-wrap wrap-break-word text-sm text-gray-300 ${
          collapsible && !expanded ? "line-clamp-5" : ""
        }`}
      >
        {message.details}
      </p>
      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-1 text-xs font-medium text-cyan-400 hover:text-cyan-300"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}

      <div className="mt-3 border-t border-zinc-800 pt-3 text-sm">
        {sender ? (
          <span className="text-gray-400">
            From{" "}
            <Link
              href={userHref(sender._id)}
              className="font-medium text-white hover:text-cyan-300 hover:underline"
            >
              {sender.userName || sender._id}
            </Link>
            {sender.email && (
              <>
                {" · "}
                <a
                  href={`mailto:${sender.email}`}
                  className="hover:text-cyan-300 hover:underline"
                >
                  {sender.email}
                </a>
              </>
            )}
          </span>
        ) : (
          <span className="text-gray-500">
            From a user whose account has been removed
          </span>
        )}
      </div>
    </li>
  );
}
