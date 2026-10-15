"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type {
  KqSport,
  KqSportQuiz,
} from "@/app/interface/knowledge-quiz.interface";
import {
  KQ_SPORTS,
  KQ_SPORT_LABELS,
} from "@/app/interface/knowledge-quiz.interface";
import CreateKqSportModal from "./CreateKqSportModal";
import { kqApi } from "./kq-api";

export default function KqSportsPanel({ refreshKey = 0 }: { refreshKey?: number }) {
  const router = useRouter();
  const [sports, setSports] = useState<KqSportQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSports(await kqApi.listSports());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load sports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  const available = useMemo<KqSport[]>(() => {
    const configured = new Set(sports.map((sport) => sport.sportsType));
    return KQ_SPORTS.filter((sport) => !configured.has(sport));
  }, [sports]);

  const allConfigured = !loading && available.length === 0;

  const handleSaved = (saved: KqSportQuiz) => {
    setNotice(
      `${KQ_SPORT_LABELS[saved.sportsType] ?? saved.sportsType} added successfully`,
    );
    setModalOpen(false);
    load();
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          disabled={loading || allConfigured}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          Add Sports
        </button>
      </div>

      {notice && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-700 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
          <Check className="h-4 w-4 shrink-0" />
          {notice}
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
          Loading sports…
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sports.map((sport) => (
            <button
              type="button"
              key={sport._id}
              onClick={() =>
                router.push(
                  `/knowledge-quiz/${encodeURIComponent(sport._id)}?name=${encodeURIComponent(KQ_SPORT_LABELS[sport.sportsType] ?? sport.sportsType)}&icon=${encodeURIComponent(sport.sportsIcon)}`,
                )
              }
              className="flex aspect-square items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 text-center transition-colors hover:border-cyan-700 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <div>
                <span
                  className="material-icons text-6xl text-cyan-400"
                  aria-hidden="true"
                  title={sport.sportsIcon}
                >
                  {sport.sportsIcon}
                </span>
                <p className="mt-4 text-lg font-semibold text-white">
                  {KQ_SPORT_LABELS[sport.sportsType] ?? sport.sportsType}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {modalOpen && (
        <CreateKqSportModal
          available={available}
          onSaved={handleSaved}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
