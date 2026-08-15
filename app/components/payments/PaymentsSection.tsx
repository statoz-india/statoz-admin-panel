"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  CreditCard,
  ImageIcon,
  Loader2,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import type {
  ListPaymentsParams,
  Payment,
  UserAssetsRecord,
} from "@/app/interface/payment.interface";
import { PAYMENTS_PAGE_SIZE } from "@/app/interface/payment.interface";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";
import { paymentsApi } from "./payments-api";

type PaymentsTab = "transactions" | "userAssets";

const PAYMENTS_TABS: readonly PaymentsTab[] = ["transactions", "userAssets"];

function isPaymentsTab(value: string | null): value is PaymentsTab {
  return PAYMENTS_TABS.includes(value as PaymentsTab);
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

const filterClass =
  "rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none";

export default function PaymentsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("paymentsTab");
  const tab: PaymentsTab = isPaymentsTab(tabParam) ? tabParam : "transactions";

  const setPaymentsTab = useCallback(
    (next: PaymentsTab) => {
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", "payments");
      sp.set("paymentsTab", next);
      stripAdminHomeQueryNoise("payments", sp);
      router.replace(`/?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
          <CreditCard className="h-6 w-6 text-cyan-400" />
          Payments
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          In-app purchases and coin-spent user assets across all users.
        </p>
      </div>

      <div className="mb-6 flex gap-2 border-b border-zinc-800">
        <TabButton
          active={tab === "transactions"}
          onClick={() => setPaymentsTab("transactions")}
        >
          <CreditCard className="h-4 w-4" />
          Transactions
        </TabButton>
        <TabButton
          active={tab === "userAssets"}
          onClick={() => setPaymentsTab("userAssets")}
        >
          <ShoppingBag className="h-4 w-4" />
          User assets
        </TabButton>
      </div>

      {tab === "transactions" ? <TransactionsTab /> : <UserAssetsTab />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "border-cyan-500 text-white"
          : "border-transparent text-gray-400 hover:text-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Transactions tab                                                    */
/* ------------------------------------------------------------------ */

function TransactionsTab() {
  const [items, setItems] = useState<Payment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ListPaymentsParams>({});
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await paymentsApi.listPayments({ page, ...filters });
      setItems(res.items);
      setTotalPages(res.totalPages);
      setTotal(res.total);
      setExpandedIds(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <PaymentsFilterBar
        total={total}
        loading={loading}
        onApply={(f) => {
          setFilters(f);
          setPage(1);
        }}
        onRefresh={load}
      />

      {error && (
        <div className="mb-6 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingRow label="Loading payments…" />
      ) : items && items.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Platform</th>
                <th className="px-4 py-3">Coins credited</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {items.map((payment) => {
                const expanded = expandedIds.has(payment._id);
                return (
                  <Fragment key={payment._id}>
                    <tr className="text-gray-300">
                      <td className="px-4 py-3">
                        <UserCell
                          user={payment.user}
                          fallbackId={payment.userId}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-cyan-300">
                        {payment.productId}
                      </td>
                      <td className="px-4 py-3 font-medium text-white">
                        {formatAmount(payment.amount, payment.currency)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="px-4 py-3">
                        <PlatformBadge platform={payment.platform} />
                      </td>
                      <td className="px-4 py-3 font-medium text-amber-300">
                        {payment.coinsCredited ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {formatDate(payment.transactionDate)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => toggleExpanded(payment._id)}
                          aria-expanded={expanded}
                          className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-gray-300 hover:bg-zinc-800"
                        >
                          {expanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expanded && (
                      <tr className="bg-zinc-900/40">
                        <td colSpan={8} className="px-4 py-4">
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <DetailField
                              label="Purchase ID"
                              value={payment._id}
                            />
                            <DetailField
                              label="Purchase Token"
                              value={payment.verificationData?.purchaseToken}
                            />
                            <DetailField
                              label="Order ID"
                              value={payment.verificationData?.orderId}
                            />
                            <DetailField
                              label="Product ID"
                              value={payment.productId}
                            />
                            <DetailField
                              label="Platform"
                              value={payment.platform}
                            />
                            <DetailField
                              label="Coins credited"
                              value={
                                payment.coinsCredited !== undefined
                                  ? String(payment.coinsCredited)
                                  : undefined
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyRow label="No payments found." />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={PAYMENTS_PAGE_SIZE}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* User assets tab                                                     */
/* ------------------------------------------------------------------ */

function UserAssetsTab() {
  const [items, setItems] = useState<UserAssetsRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [userIdFilter, setUserIdFilter] = useState("");
  const [appliedUserId, setAppliedUserId] = useState<string | undefined>();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await paymentsApi.listUserAssets({
        page,
        userId: appliedUserId,
      });
      setItems(res.items);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load user assets");
    } finally {
      setLoading(false);
    }
  }, [page, appliedUserId]);

  useEffect(() => {
    load();
  }, [load]);

  const applyFilter = () => {
    setAppliedUserId(userIdFilter.trim() || undefined);
    setPage(1);
    setExpandedId(null);
  };

  const clearFilter = () => {
    setUserIdFilter("");
    setAppliedUserId(undefined);
    setPage(1);
    setExpandedId(null);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={userIdFilter}
          onChange={(e) => setUserIdFilter(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilter()}
          placeholder="Filter by user ID"
          className={filterClass}
        />
        <button
          type="button"
          onClick={applyFilter}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
        >
          Apply
        </button>
        {appliedUserId && (
          <button
            type="button"
            onClick={clearFilter}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800"
          >
            Clear
          </button>
        )}

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-gray-500">{total} total</span>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingRow label="Loading user assets…" />
      ) : items && items.length > 0 ? (
        <div className="space-y-3">
          {items.map((record) => {
            const expanded = expandedId === record._id;
            const picCount = record.profilePicsPurchased?.length ?? 0;
            const bannerCount = record.profileBannersPurchased?.length ?? 0;

            return (
              <div
                key={record._id}
                className="overflow-hidden rounded-xl border border-zinc-800"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : record._id)}
                  className="flex w-full items-center gap-4 bg-zinc-900/50 px-4 py-3 text-left hover:bg-zinc-900"
                >
                  <div className="flex-1">
                    <UserCell user={record.user} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <ImageIcon className="h-4 w-4" />
                      {picCount} pics
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ShoppingBag className="h-4 w-4" />
                      {bannerCount} banners
                    </span>
                    <span className="hidden sm:inline">
                      Updated {formatDate(record.updatedAt)}
                    </span>
                  </div>
                  {expanded ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-gray-500" />
                  )}
                </button>

                {expanded && (
                  <div className="border-t border-zinc-800 bg-black/40 px-4 py-4">
                    {picCount > 0 && (
                      <div className="mb-4">
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Profile pics purchased
                        </h4>
                        <div className="overflow-x-auto rounded-lg border border-zinc-800">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-900 text-xs uppercase text-gray-500">
                              <tr>
                                <th className="px-3 py-2">Asset</th>
                                <th className="px-3 py-2">Team</th>
                                <th className="px-3 py-2">Coins</th>
                                <th className="px-3 py-2">Purchased</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                              {record.profilePicsPurchased.map((p) => (
                                <tr key={p._id} className="text-gray-300">
                                  <td className="px-3 py-2">
                                    <div className="flex items-center gap-2">
                                      {p.profilePicId?.ppUrl && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                          src={p.profilePicId.ppUrl}
                                          alt=""
                                          className="h-8 w-8 rounded object-cover"
                                        />
                                      )}
                                      <span className="text-white">
                                        {p.profilePicId?.ppName ?? "—"}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2">
                                    {p.profilePicId?.teamAbbreviation ?? "—"}
                                  </td>
                                  <td className="px-3 py-2">{p.coinsUsed}</td>
                                  <td className="px-3 py-2 text-gray-400">
                                    {formatDate(p.purchasedAt)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {bannerCount > 0 && (
                      <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Profile banners purchased
                        </h4>
                        <div className="overflow-x-auto rounded-lg border border-zinc-800">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-900 text-xs uppercase text-gray-500">
                              <tr>
                                <th className="px-3 py-2">Asset</th>
                                <th className="px-3 py-2">Team</th>
                                <th className="px-3 py-2">Coins</th>
                                <th className="px-3 py-2">Purchased</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                              {record.profileBannersPurchased.map((b) => (
                                <tr key={b._id} className="text-gray-300">
                                  <td className="px-3 py-2">
                                    <div className="flex items-center gap-2">
                                      {b.profileBannerId?.pbUrl && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                          src={b.profileBannerId.pbUrl}
                                          alt=""
                                          className="h-8 w-12 rounded object-cover"
                                        />
                                      )}
                                      <span className="text-white">
                                        {b.profileBannerId?.pbName ?? "—"}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2">
                                    {b.profileBannerId?.teamAbbreviation ?? "—"}
                                  </td>
                                  <td className="px-3 py-2">{b.coinsUsed}</td>
                                  <td className="px-3 py-2 text-gray-400">
                                    {formatDate(b.purchasedAt)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {picCount === 0 && bannerCount === 0 && (
                      <p className="text-sm text-gray-500">
                        No purchases recorded.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyRow label="No user asset purchases found." />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={PAYMENTS_PAGE_SIZE}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function PaymentsFilterBar({
  total,
  loading,
  onApply,
  onRefresh,
}: {
  total: number;
  loading: boolean;
  onApply: (filters: ListPaymentsParams) => void;
  onRefresh: () => void;
}) {
  const [status, setStatus] = useState("");
  const [productId, setProductId] = useState("");
  const [userId, setUserId] = useState("");

  const apply = () =>
    onApply({
      status: status.trim() || undefined,
      productId: productId.trim() || undefined,
      userId: userId.trim() || undefined,
    });

  const clear = () => {
    setStatus("");
    setProductId("");
    setUserId("");
    onApply({});
  };

  const hasFilters = status || productId || userId;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <input
        type="text"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && apply()}
        placeholder="Status (e.g. success)"
        className={filterClass}
      />
      <input
        type="text"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && apply()}
        placeholder="Product ID"
        className={filterClass}
      />
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && apply()}
        placeholder="User ID"
        className={filterClass}
      />
      <button
        type="button"
        onClick={apply}
        className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
      >
        Apply
      </button>
      {hasFilters && (
        <button
          type="button"
          onClick={clear}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800"
        >
          Clear
        </button>
      )}

      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-gray-500">{total} total</span>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>
    </div>
  );
}

function UserCell({
  user,
  fallbackId,
}: {
  user: Payment["user"] | UserAssetsRecord["user"] | null;
  fallbackId?: string;
}) {
  if (!user) {
    return (
      <span className="text-gray-500">
        {fallbackId ? `Deleted user (${fallbackId.slice(-6)})` : "—"}
      </span>
    );
  }

  return (
    <div>
      <div className="font-medium text-white">{user.userName}</div>
      <div className="text-xs text-gray-500">{user.email}</div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — ignore.
    }
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2">
      <div className="mb-1 text-xs uppercase tracking-wide text-gray-500">
        {label}
      </div>
      {value ? (
        <button
          type="button"
          onClick={copy}
          title={`Copy ${value}`}
          className="group flex w-full items-center gap-2 text-left font-mono text-xs text-gray-300 hover:text-cyan-300"
        >
          <span className="min-w-0 flex-1 break-all">{value}</span>
          {copied ? (
            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5 shrink-0 text-gray-500 transition-colors group-hover:text-cyan-300" />
          )}
        </button>
      ) : (
        <span className="font-mono text-xs text-gray-500">—</span>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const color =
    normalized === "success"
      ? "bg-emerald-900/50 text-emerald-300 border-emerald-700"
      : normalized === "failed" || normalized === "failure"
        ? "bg-red-900/50 text-red-300 border-red-700"
        : "bg-zinc-800 text-gray-300 border-zinc-700";

  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-xs capitalize ${color}`}
    >
      {status}
    </span>
  );
}

function PlatformBadge({ platform }: { platform?: string }) {
  if (!platform) {
    return <span className="text-gray-500">—</span>;
  }

  const normalized = platform.toLowerCase();
  const color =
    normalized === "ios"
      ? "bg-sky-900/50 text-sky-300 border-sky-700"
      : normalized === "android"
        ? "bg-lime-900/50 text-lime-300 border-lime-700"
        : "bg-zinc-800 text-gray-300 border-zinc-700";

  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-xs uppercase tracking-wide ${color}`}
    >
      {platform}
    </span>
  );
}

function Pagination({
  page,
  totalPages,
  total,
  limit,
  loading,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1 && total === 0) return null;

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
      <span className="text-sm text-gray-500">
        {total > 0 ? `Showing ${start}–${end} of ${total}` : "No results"}
      </span>
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
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
            onClick={onNext}
            disabled={page >= totalPages || loading}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function LoadingRow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
      <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
      {label}
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 py-16 text-center text-sm text-gray-500">
      {label}
    </div>
  );
}
