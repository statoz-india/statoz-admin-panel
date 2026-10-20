"use client";

import type { UserPayments as UserPaymentsData } from "@/app/interface/userActivity.interface";
import ActivitySection from "@/app/users/[id]/ActivitySection";
import { formatDate, useUserActivity } from "@/app/users/[id]/useUserActivity";

type Props = { userId: string };

export default function UserPayments({ userId }: Props) {
  const { data, loading, error, load } = useUserActivity<UserPaymentsData>(
    userId,
    "paymentsForAdmin",
    "Failed to load purchases",
  );
  const payments = data?.payments ?? [];

  // Amounts can be in several currencies, so total them per currency.
  const totals = Object.entries(
    payments.reduce<Record<string, number>>((acc, p) => {
      const currency = p.currency || "—";
      acc[currency] = (acc[currency] ?? 0) + (Number(p.amount) || 0);
      return acc;
    }, {}),
  );
  const coinsTotal = payments.reduce(
    (sum, p) => sum + (Number(p.coinsCredited) || 0),
    0,
  );

  return (
    <ActivitySection
      title="Purchases"
      loading={loading}
      error={error}
      isEmpty={payments.length === 0}
      emptyText="This user has never made a purchase."
      onRefresh={() => void load()}
      headerExtra={
        data ? (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
              data.hasPurchased
                ? "bg-green-900/40 text-green-300 border-green-700"
                : "bg-zinc-800 text-gray-400 border-zinc-600"
            }`}
          >
            {data.hasPurchased ? "Paying user" : "Never paid"}
          </span>
        ) : null
      }
    >
      <div className="flex flex-wrap gap-6 mb-4 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Payments</p>
          <p className="text-white font-semibold">{data?.totalPayments ?? 0}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Total spent</p>
          <p className="text-white font-semibold">
            {totals
              .map(([currency, amount]) => `${amount.toLocaleString()} ${currency}`)
              .join(" + ")}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Coins credited</p>
          <p className="text-white font-semibold">
            {coinsTotal.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="min-w-full text-left text-sm text-gray-300">
          <thead>
            <tr className="border-b border-zinc-700 text-xs uppercase tracking-wider text-gray-500">
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Product</th>
              <th className="py-2 pr-4 font-medium">Amount</th>
              <th className="py-2 pr-4 font-medium">Coins</th>
              <th className="py-2 pr-4 font-medium">Platform</th>
              <th className="py-2 pr-4 font-medium">Order ID</th>
              <th className="py-2 pr-0 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-b border-zinc-800 align-top">
                <td className="py-3 pr-4 whitespace-nowrap">
                  {formatDate(p.transactionDate || p.createdAt)}
                </td>
                <td className="py-3 pr-4 text-white">{p.productId}</td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  {p.amount} {p.currency}
                </td>
                <td className="py-3 pr-4">{p.coinsCredited ?? "—"}</td>
                <td className="py-3 pr-4">{p.platform ?? "—"}</td>
                <td className="py-3 pr-4 font-mono text-xs break-all">
                  {p.orderId ?? "—"}
                </td>
                <td
                  className={`py-3 pr-0 ${
                    p.status === "success" ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {p.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ActivitySection>
  );
}
