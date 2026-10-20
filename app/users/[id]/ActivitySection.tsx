"use client";

import type { ReactNode } from "react";
import { Atom } from "react-loading-indicators";

type ActivitySectionProps = {
  title: string;
  loading: boolean;
  error: string;
  /** Shown instead of `children` once loaded with nothing to show. */
  isEmpty: boolean;
  emptyText: string;
  onRefresh: () => void;
  headerExtra?: ReactNode;
  children: ReactNode;
};

/** Card shell shared by the user activity tabs: title, refresh, states. */
export default function ActivitySection({
  title,
  loading,
  error,
  isEmpty,
  emptyText,
  onRefresh,
  headerExtra,
  children,
}: ActivitySectionProps) {
  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {headerExtra}
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="px-3 py-1.5 text-sm border border-zinc-600 rounded-md text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Atom color="#5CDFFF" size="small" text="" textColor="" />
        </div>
      )}

      {!loading && error && <p className="text-red-400 text-sm">{error}</p>}

      {!loading && !error && isEmpty && (
        <p className="text-gray-400 text-sm">{emptyText}</p>
      )}

      {!loading && !error && !isEmpty && children}
    </div>
  );
}
