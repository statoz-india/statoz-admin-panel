"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Info,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
} from "lucide-react";
import type {
  KqSport,
  KqSportQuiz,
} from "@/app/interface/knowledge-quiz.interface";
import {
  KQ_SPORTS,
  KQ_SPORT_ICONS,
  KQ_SPORT_LABELS,
  isKqSport,
} from "@/app/interface/knowledge-quiz.interface";
import CreateKqSportModal from "./CreateKqSportModal";
import { kqApi } from "./kq-api";

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function KqSportsPanel() {
  const [sports, setSports] = useState<KqSportQuiz[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<KqSportQuiz | null>(null);

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
  }, [load]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  /**
   * A sport can only have one row, so the create form offers what is left.
   * Without this the only way to discover the conflict is to submit and get a
   * 409 back.
   */
  const available = useMemo<KqSport[]>(() => {
    const taken = new Set((sports ?? []).map((s) => s.sportsType));
    // When editing, the row's own sport is "taken" by itself — keep it, or the
    // dropdown would have no valid current value.
    if (editing) taken.delete(editing.sportsType);
    return KQ_SPORTS.filter((sport) => !taken.has(sport));
  }, [sports, editing]);

  const handleSaved = (saved: KqSportQuiz, mode: "created" | "updated") => {
    const label = KQ_SPORT_LABELS[saved.sportsType] ?? saved.sportsType;
    setNotice(
      mode === "created"
        ? `Added ${label} — "${saved.gameHeading}"`
        : `Updated ${label} — live on the home screen now`,
    );
    setModalOpen(false);
    setEditing(null);
    load();
  };

  const openEdit = (sport: KqSportQuiz) => {
    setEditing(sport);
    setModalOpen(true);
  };

  const rows = sports ?? [];
  const allConfigured = sports !== null && available.length === 0;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-gray-500">
          One card per sport on the knowledge quiz home screen — icon and copy
          only, no questions. Cards render in the order they were created.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            disabled={loading || allConfigured}
            title={
              allConfigured ? "All five sports already have a card" : undefined
            }
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
            Add sport
          </button>
        </div>
      </div>

      {notice && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-700 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
          <Check className="mt-0.5 h-4 w-4 shrink-0" />
          {notice}
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/30">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Home screen</h3>
            <p className="mt-0.5 text-xs text-gray-500">
              {sports === null
                ? "Loading…"
                : `${rows.length} of ${KQ_SPORTS.length} sports configured`}
            </p>
          </div>
          {allConfigured && (
            <span className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-gray-500">
              All sports configured
            </span>
          )}
        </div>

        {loading && sports === null ? (
          <div className="flex items-center justify-center gap-2 py-20 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
            Loading sports…
          </div>
        ) : rows.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-gray-400">
              No sports configured yet — the knowledge quiz home screen is empty.
            </p>
            <p className="mx-auto mt-2 max-w-lg text-xs text-gray-600">
              Add a card for each sport you want players to see. Questions live
              separately, under the Questions tab.
            </p>
          </div>
        ) : (
          <div className={`overflow-x-auto ${loading ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-zinc-800 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">#</th>
                  <th className="px-5 py-3 font-medium">Sport</th>
                  <th className="px-5 py-3 font-medium">Icon</th>
                  <th className="px-5 py-3 font-medium">Heading</th>
                  <th className="px-5 py-3 font-medium">Sub-heading</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70">
                {rows.map((sport, index) => {
                  const canonical = isKqSport(sport.sportsType)
                    ? KQ_SPORT_ICONS[sport.sportsType]
                    : null;
                  const iconMismatch =
                    canonical !== null && canonical !== sport.sportsIcon;
                  return (
                    <tr key={sport._id} className="hover:bg-zinc-900/40">
                      <td className="whitespace-nowrap px-5 py-3 text-gray-600">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-gray-300">
                        {isKqSport(sport.sportsType)
                          ? KQ_SPORT_LABELS[sport.sportsType]
                          : sport.sportsType}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3">
                        <span className="font-mono text-xs text-gray-400">
                          {sport.sportsIcon}
                        </span>
                        {iconMismatch && (
                          <span
                            title={`Canonical icon for this sport is ${canonical}`}
                            className="ml-2 rounded bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-400"
                          >
                            Non-standard
                          </span>
                        )}
                      </td>
                      <td className="max-w-xs px-5 py-3 text-gray-300">
                        {sport.gameHeading}
                      </td>
                      <td className="max-w-sm px-5 py-3 text-gray-400">
                        {sport.gameSubHeading}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-gray-500">
                        {formatDate(sport.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openEdit(sport)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-gray-300 hover:bg-zinc-800"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-zinc-800 bg-zinc-900/30 px-5 py-4 text-xs text-gray-500">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-600" />
        <p>
          There is no update or delete endpoint, so a card saved with the wrong
          copy cannot be corrected from here. Card order is creation order and
          cannot be changed — the backend has no display-order field.
        </p>
      </div>

      {modalOpen && (
        <CreateKqSportModal
          available={available}
          existing={editing}
          onSaved={handleSaved}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
