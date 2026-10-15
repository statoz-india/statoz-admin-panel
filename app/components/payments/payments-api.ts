"use client";

import type {
  ListPaymentsParams,
  ListUserAssetsParams,
  PaginatedPayments,
  PaginatedUserAssetsRecords,
} from "@/app/interface/payment.interface";

async function request<T>(path: string): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) {
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }
  return body.data as T;
}

function qs(params: object): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export const paymentsApi = {
  listPayments: (params: ListPaymentsParams = {}) =>
    request<PaginatedPayments>(`/api/payments/admin${qs(params)}`),

  listUserAssets: (params: ListUserAssetsParams = {}) =>
    request<PaginatedUserAssetsRecords>(
      `/api/payments/user-assets${qs(params)}`,
    ),
};
