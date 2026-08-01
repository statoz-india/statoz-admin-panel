"use client";

import { useEffect, useState, type FormEvent } from "react";
import { GAME_TYPE_OPTIONS, type GameType } from "@/app/constants/game-type";
import type {
  Tournament,
  UpdateTournamentPayload,
} from "@/app/models/tournament.model";

const DEFAULT_PRIMARY_COLOR = "#19398A";
const DEFAULT_SECONDARY_COLOR = "#ffffff";
const DEFAULT_TEXT_COLOR = "#ffffff";

/** Fixed palette applied when toggling ICC on (same as create). */
const ICC_COLORS = {
  primaryColor: "#19398a",
  secondaryColor: "#000000",
  textColor: "#ffffff",
};

interface EditTournamentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tournament: Tournament | null;
}

type EditFormData = {
  tournament: string;
  tournamentName: string;
  tournamentYear: string;
  gameType: "" | GameType;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  isIccTournament: boolean;
};

function tournamentToForm(tournament: Tournament): EditFormData {
  const gameType =
    tournament.gameType &&
    (GAME_TYPE_OPTIONS as readonly string[]).includes(tournament.gameType)
      ? (tournament.gameType as GameType)
      : "";

  return {
    tournament: tournament.tournament || "",
    tournamentName: tournament.tournamentName || "",
    tournamentYear: tournament.tournamentYear || "",
    gameType,
    primaryColor: tournament.primaryColor?.trim() || DEFAULT_PRIMARY_COLOR,
    secondaryColor:
      tournament.secondaryColor?.trim() || DEFAULT_SECONDARY_COLOR,
    textColor: tournament.textColor?.trim() || DEFAULT_TEXT_COLOR,
    isIccTournament: tournament.isIccTournament === true,
  };
}

export default function EditTournamentSheet({
  isOpen,
  onClose,
  onSuccess,
  tournament,
}: EditTournamentSheetProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<EditFormData>({
    tournament: "",
    tournamentName: "",
    tournamentYear: "",
    gameType: "",
    primaryColor: DEFAULT_PRIMARY_COLOR,
    secondaryColor: DEFAULT_SECONDARY_COLOR,
    textColor: DEFAULT_TEXT_COLOR,
    isIccTournament: false,
  });

  useEffect(() => {
    if (!tournament) return;
    setFormData(tournamentToForm(tournament));
    setError("");
  }, [tournament]);

  if (!isOpen || !tournament) return null;

  const handleIccToggle = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isIccTournament: checked,
      ...(checked ? ICC_COLORS : {}),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const trimmedCode = formData.tournament.trim();
    const trimmedName = formData.tournamentName.trim();
    const trimmedYear = formData.tournamentYear.trim();

    if (!trimmedCode || !trimmedName || !trimmedYear) {
      setError("Tournament code, name and year are required");
      setLoading(false);
      return;
    }

    const payload: UpdateTournamentPayload = {
      tournament: trimmedCode,
      tournamentName: trimmedName,
      tournamentYear: trimmedYear,
      primaryColor: formData.primaryColor.trim(),
      secondaryColor: formData.secondaryColor.trim(),
      textColor: formData.textColor.trim(),
      isIccTournament: formData.isIccTournament,
    };

    if (formData.gameType) {
      payload.gameType = formData.gameType;
    }

    try {
      const res = await fetch(`/api/tournament/${tournament._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const response = await res.json();

      if (!res.ok || !response.success) {
        throw new Error(response.message || "Failed to update tournament");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update tournament",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close tournament editor"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-tournament-title"
        className="relative flex h-full w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-900 shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-zinc-800 p-6">
          <div>
            <h2
              id="edit-tournament-title"
              className="text-2xl font-bold text-white"
            >
              Edit Tournament
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Partial update — same fields as create
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-y-auto p-6"
        >
          {error && (
            <div className="mb-4 rounded-lg border border-red-800 bg-red-900/20 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Tournament Abbreviation *
            </label>
            <input
              type="text"
              required
              value={formData.tournament}
              onChange={(e) =>
                setFormData({ ...formData, tournament: e.target.value })
              }
              className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="e.g., IPL"
            />
            <p className="mt-1 text-xs text-gray-500">
              Changing the short code does not rename related matches or quizzes.
            </p>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Tournament Name *
            </label>
            <input
              type="text"
              required
              value={formData.tournamentName}
              onChange={(e) =>
                setFormData({ ...formData, tournamentName: e.target.value })
              }
              className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="e.g., Indian Premier League"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Tournament Year *
            </label>
            <input
              type="text"
              required
              value={formData.tournamentYear}
              onChange={(e) =>
                setFormData({ ...formData, tournamentYear: e.target.value })
              }
              className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="e.g., 2026"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Game Type
            </label>
            <select
              value={formData.gameType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gameType: e.target.value as "" | GameType,
                })
              }
              className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="">-- Select game type --</option>
              {GAME_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-3 text-sm font-medium text-gray-300">
              <input
                type="checkbox"
                checked={formData.isIccTournament}
                onChange={(e) => handleIccToggle(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-white"
              />
              ICC Tournament
            </label>
            <p className="mt-1 text-xs text-gray-500">
              {formData.isIccTournament
                ? "Colors below are set to the ICC palette — you can still edit them."
                : "Off by default — tick only for ICC tournaments."}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Primary Color
              </label>
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, primaryColor: e.target.value })
                }
                className="h-10 w-full cursor-pointer rounded-md border border-zinc-600"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Secondary Color
              </label>
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, secondaryColor: e.target.value })
                }
                className="h-10 w-full cursor-pointer rounded-md border border-zinc-600"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Text Color
              </label>
              <input
                type="color"
                value={formData.textColor}
                onChange={(e) =>
                  setFormData({ ...formData, textColor: e.target.value })
                }
                className="h-10 w-full cursor-pointer rounded-md border border-zinc-600"
              />
            </div>
          </div>

          <div
            className="mb-6 rounded-lg border border-zinc-700 border-b-4 p-4 text-center"
            style={{
              backgroundColor: formData.primaryColor,
              borderBottomColor: formData.secondaryColor,
              color: formData.textColor,
            }}
          >
            <span className="text-xl font-bold tracking-wide">
              {formData.tournament || "CODE"}
            </span>
            <p className="mt-1 text-sm font-medium opacity-95">
              {formData.tournamentName || "Tournament name"}
            </p>
            <p className="mt-1 text-xs opacity-80">
              {formData.tournamentYear || "Year"}
              {formData.gameType ? ` · ${formData.gameType}` : ""}
            </p>
          </div>

          <div className="mt-auto flex justify-end gap-3 border-t border-zinc-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-zinc-600 px-4 py-2 text-white hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
