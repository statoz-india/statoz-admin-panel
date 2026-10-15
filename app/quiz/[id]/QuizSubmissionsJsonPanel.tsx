"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Atom } from "react-loading-indicators";

type QuizSubmissionsJsonPanelProps = {
  embedded?: boolean;
};

export default function QuizSubmissionsJsonPanel({
  embedded,
}: QuizSubmissionsJsonPanelProps = {}) {
  const params = useParams();
  const quizId = params?.id as string;
  const [rawJson, setRawJson] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) return;

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await fetch(`/api/quiz/${quizId}/user-response`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const text = await res.text();
        let parsed: unknown;
        try {
          parsed = text ? JSON.parse(text) : null;
        } catch {
          parsed = { _parseNote: "Response was not valid JSON", body: text };
        }
        if (!cancelled) {
          setRawJson(parsed);
          if (!res.ok) {
            setFetchError(`HTTP ${res.status}`);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setRawJson(null);
          setFetchError(e instanceof Error ? e.message : "Request failed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [quizId]);

  const formatted =
    rawJson === null ? "—" : JSON.stringify(rawJson, null, 2);

  return (
    <div
      className={
        embedded
          ? "bg-zinc-900 rounded-lg border border-zinc-700 p-6"
          : "bg-zinc-900 p-6"
      }
    >
      <h2 className="text-2xl font-bold text-white mb-4">
        Quiz submissions (raw JSON)
      </h2>
      {fetchError && (
        <p className="text-amber-400 text-sm mb-3">
          Warning: {fetchError} — body shown below if any.
        </p>
      )}
      {loading ? (
        <div className="flex justify-center py-12">
          <Atom color="#5CDFFF" size="medium" text="" textColor="" />
        </div>
      ) : (
        <pre className="max-h-[70vh] overflow-auto rounded-md border border-zinc-700 bg-zinc-950 p-4 text-xs text-zinc-200 whitespace-pre-wrap wrap-break-word font-mono">
          {formatted || "—"}
        </pre>
      )}
    </div>
  );
}
