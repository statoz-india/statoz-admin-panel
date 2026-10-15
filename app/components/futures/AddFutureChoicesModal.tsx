"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { Team } from "@/app/api/tournament/teams/route";
import type {
  CreateFutureChoicePayload,
  Future,
} from "@/app/models/futures.model";

interface AddFutureChoicesModalProps {
  isOpen: boolean;
  future: Future;
  onClose: () => void;
  onSuccess: () => void;
}

interface ChoiceFormRow {
  choiceName: string;
  choiceDescription: string;
  choiceImage: string;
  initialCoinsOnChoice: number;
  teamId: string;
  isVisible: boolean;
  placeholderColor: string;
  textColor: string;
}

const defaultChoiceRow = (): ChoiceFormRow => ({
  choiceName: "",
  choiceDescription: "",
  choiceImage: "",
  initialCoinsOnChoice: 0,
  teamId: "",
  isVisible: true,
  placeholderColor: "#2CA85E",
  textColor: "#FFFFFF",
});

export default function AddFutureChoicesModal({
  isOpen,
  future,
  onClose,
  onSuccess,
}: AddFutureChoicesModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<ChoiceFormRow[]>([defaultChoiceRow()]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  const fetchTeams = useCallback(async (tournamentKey?: string) => {
    if (!tournamentKey?.trim()) {
      setTeams([]);
      return;
    }
    try {
      setTeamsLoading(true);
      const res = await fetch(
        `/api/tournament/teams?tournament=${encodeURIComponent(tournamentKey)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      const response = await res.json();
      const list = Array.isArray(response.data) ? response.data : [];
      setTeams(response?.success === true ? list : []);
    } catch {
      setTeams([]);
    } finally {
      setTeamsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setRows([defaultChoiceRow()]);
    void fetchTeams(future.tournament);
  }, [isOpen, future, fetchTeams]);

  const updateRow = (index: number, patch: Partial<ChoiceFormRow>) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const named = rows.filter((r) => r.choiceName.trim());
    if (named.length === 0) {
      setError("At least one choice must have a name.");
      return;
    }
    if (named.length !== rows.length) {
      setError("Every choice must have a name.");
      return;
    }

    const choices: CreateFutureChoicePayload[] = rows.map((r) => {
      const payload: CreateFutureChoicePayload = {
        choiceName: r.choiceName.trim(),
        choiceCoins: 0,
        initialCoinsOnChoice: Number.isFinite(r.initialCoinsOnChoice)
          ? r.initialCoinsOnChoice
          : 0,
        isVisible: r.isVisible,
      };
      if (r.choiceDescription.trim())
        payload.choiceDescription = r.choiceDescription.trim();
      if (r.choiceImage.trim()) payload.choiceImage = r.choiceImage.trim();
      if (r.teamId.trim()) payload.teamDetails = r.teamId.trim();
      if (r.placeholderColor.trim())
        payload.placeholderColor = r.placeholderColor.trim();
      if (r.textColor.trim()) payload.textColor = r.textColor.trim();
      return payload;
    });

    try {
      setLoading(true);
      const res = await fetch(
        `/api/futures/${encodeURIComponent(future._id)}/add-choices`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ choices }),
        },
      );
      const response = await res.json();
      if (!res.ok || !response?.success) {
        setError(
          (typeof response?.message === "string" && response.message) ||
            "Failed to add choices",
        );
        return;
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add choices");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-choices-dialog-title"
    >
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70"
        aria-hidden
        onClick={() => !loading && onClose()}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-zinc-600 dark:bg-zinc-900">
        <h2
          id="add-choices-dialog-title"
          className="mb-1 text-lg font-semibold text-black dark:text-white"
        >
          Add choices
        </h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {future.eventName} · {future.futureId}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {rows.map((row, index) => (
            <div
              key={index}
              className="space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-zinc-500">
                  {row.choiceName || `Choice ${index + 1}`}
                </span>
                {rows.length > 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setRows((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="text-xs font-medium text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <input
                type="text"
                required
                placeholder="Name *"
                value={row.choiceName}
                onChange={(e) =>
                  updateRow(index, { choiceName: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              />
              <textarea
                rows={2}
                placeholder="Description (optional)"
                value={row.choiceDescription}
                onChange={(e) =>
                  updateRow(index, { choiceDescription: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              />
              <input
                type="text"
                inputMode="url"
                placeholder="Image URL (optional)"
                value={row.choiceImage}
                onChange={(e) =>
                  updateRow(index, { choiceImage: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Placeholder color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={row.placeholderColor || "#2CA85E"}
                      onChange={(e) =>
                        updateRow(index, { placeholderColor: e.target.value })
                      }
                      className="h-10 w-14 shrink-0 cursor-pointer rounded-md border border-gray-300 dark:border-zinc-600"
                      aria-label={`Placeholder color for ${row.choiceName || `choice ${index + 1}`}`}
                    />
                    <span className="font-mono text-xs text-zinc-500">
                      {row.placeholderColor || "#2CA85E"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Text color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={row.textColor || "#FFFFFF"}
                      onChange={(e) =>
                        updateRow(index, { textColor: e.target.value })
                      }
                      className="h-10 w-14 shrink-0 cursor-pointer rounded-md border border-gray-300 dark:border-zinc-600"
                      aria-label={`Text color for ${row.choiceName || `choice ${index + 1}`}`}
                    />
                    <span className="font-mono text-xs text-zinc-500">
                      {row.textColor || "#FFFFFF"}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Team{" "}
                  <span className="font-normal text-zinc-500">(optional)</span>
                </label>
                <select
                  value={row.teamId}
                  onChange={(e) => {
                    const id = e.target.value;
                    const picked = id
                      ? teams.find((t) => t._id === id)
                      : undefined;
                    updateRow(index, {
                      teamId: id,
                      ...(picked ? { choiceName: picked.name } : {}),
                    });
                  }}
                  disabled={teamsLoading}
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                >
                  <option value="">
                    {teamsLoading
                      ? "Loading teams…"
                      : teams.length === 0
                        ? "No teams for this tournament"
                        : "— No team —"}
                  </option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name} ({team.abbreviation})
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={row.isVisible}
                  onChange={(e) =>
                    updateRow(index, { isVisible: e.target.checked })
                  }
                  className="rounded border-gray-300 dark:border-zinc-600"
                />
                Visible
              </label>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setRows((prev) => [...prev, defaultChoiceRow()])}
            className="w-full rounded-md border border-dashed border-zinc-500 px-3 py-2 text-sm text-gray-700 hover:bg-zinc-100 dark:text-gray-300 dark:hover:bg-zinc-800"
          >
            Add another choice
          </button>

          {error ? (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-md border border-gray-300 px-4 py-2 text-black hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {loading ? "Adding…" : "Add choices"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
