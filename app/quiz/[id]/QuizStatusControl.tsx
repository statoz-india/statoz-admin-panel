"use client";

import { useState } from "react";
import {
  isQuizStatusFinal,
  QUIZ_STATUS_VALUES,
  type QuizStatus,
} from "@/app/constants/quiz-status";
import { statusBadgeClass } from "@/app/utils/statusBadge";

/**
 * The quiz status badge on the detail page. Click to change the status,
 * unless it's final (SETTLEMENT_DONE, ABANDONED, NO_RESULT).
 */
export default function QuizStatusControl({
  quizId,
  status,
  onUpdated,
}: {
  quizId: string;
  status: string;
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const final = isQuizStatusFinal(status);

  const updateStatus = async (next: QuizStatus) => {
    if (next === status?.toUpperCase()) {
      setOpen(false);
      return;
    }
    if (
      isQuizStatusFinal(next) &&
      !window.confirm(
        `Set this quiz to ${next}? That's a final status — it can't be changed afterwards.`,
      )
    ) {
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/quiz/${quizId}/update-status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quizStatus: next }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload?.success) {
        throw new Error(payload?.message || "Failed to update quiz status");
      }
      setOpen(false);
      onUpdated();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update quiz status",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          type="button"
          disabled={final || saving}
          onClick={() => setOpen((o) => !o)}
          title={
            final
              ? "Final status — it can't be changed"
              : "Change quiz status"
          }
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadgeClass(
            status ?? "",
          )} ${final ? "cursor-not-allowed opacity-80" : "cursor-pointer"} ${
            saving ? "opacity-60 cursor-wait" : ""
          }`}
        >
          {status || "UNKNOWN"}
          {!final && " ▾"}
        </button>

        {open && !final && (
          <div className="absolute left-0 mt-2 min-w-[220px] bg-zinc-900 border border-zinc-700 rounded-md shadow-lg z-20 p-1">
            {QUIZ_STATUS_VALUES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => void updateStatus(s)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  status?.toUpperCase() === s
                    ? "bg-white text-black"
                    : "text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                {s}
                {isQuizStatusFinal(s) && (
                  <span className="ml-2 text-xs text-zinc-500">final</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      {final && (
        <span className="text-xs text-gray-500">
          Final status — can&apos;t be changed
        </span>
      )}
      {error && <span className="text-sm text-red-400">{error}</span>}
    </>
  );
}
