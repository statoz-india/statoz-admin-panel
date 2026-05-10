"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { Team } from "../../api/tournament/teams/route";
import type {
  CreateFutureChoicePayload,
  CreateFuturePayload,
} from "../../models/futures.model";
import { FutureStatus } from "../../utils/enums/future.enum";

function convertToISTISO(dateTimeLocal: string): string {
  if (!dateTimeLocal) return "";
  const [datePart, timePart] = dateTimeLocal.split("T");
  if (!datePart || !timePart) return dateTimeLocal;
  return `${datePart}T${timePart}:00.000+05:30`;
}

interface ChoiceFormRow {
  choiceName: string;
  choiceDescription: string;
  choiceImage: string;
  choiceCoins: number;
  initialCoinsOnChoice: number;
  teamDetails: string;
  isVisible: boolean;
}

interface CreateFutureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const defaultChoiceRow = (): ChoiceFormRow => ({
  choiceName: "",
  choiceDescription: "",
  choiceImage: "",
  choiceCoins: 0,
  initialCoinsOnChoice: 0,
  teamDetails: "",
  isVisible: true,
});

const creatableFutureStatuses = [
  FutureStatus.UPCOMING,
  FutureStatus.ACTIVE,
  FutureStatus.FINISHED,
  FutureStatus.CANCELLED,
  FutureStatus.SETTLEMENT_DONE,
  FutureStatus.WINNING_OPTION_UPDATED,
];

export default function CreateFutureModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateFutureModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tournaments, setTournaments] = useState<string[]>([]);
  const [tournament, setTournament] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [eventDescriptionImage, setEventDescriptionImage] = useState("");
  const [entryStartTime, setEntryStartTime] = useState("");
  const [entryCloseTime, setEntryCloseTime] = useState("");
  const [futureStatus, setFutureStatus] = useState<string>(
    FutureStatus.UPCOMING,
  );
  const [choices, setChoices] = useState<ChoiceFormRow[]>(() => [
    defaultChoiceRow(),
    defaultChoiceRow(),
  ]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  const fetchTournaments = async () => {
    try {
      const res = await fetch("/api/tournament", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) return;
      const response = await res.json();
      const tournamentData = response.success ? response.data.data : [];
      setTournaments(Array.isArray(tournamentData) ? tournamentData : []);
    } catch {
      setTournaments([]);
    }
  };

  const fetchTeamsForTournament = useCallback(async (tournamentName: string) => {
    if (!tournamentName.trim()) {
      setTeams([]);
      setTeamsLoading(false);
      return;
    }
    try {
      setTeamsLoading(true);
      const res = await fetch(
        `/api/tournament/teams?tournament=${encodeURIComponent(tournamentName)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      if (!res.ok) {
        setTeams([]);
        return;
      }
      const response = await res.json();
      const teamsData =
        response.success && response.data ? response.data : [];
      setTeams(Array.isArray(teamsData) ? teamsData : []);
    } catch {
      setTeams([]);
    } finally {
      setTeamsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setTournament("");
      setTeams([]);
      setTeamsLoading(false);
      return;
    }
    fetchTournaments();
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const local = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const close = new Date(now.getTime() + 60 * 60 * 1000);
    const localClose = `${close.getFullYear()}-${pad(close.getMonth() + 1)}-${pad(close.getDate())}T${pad(close.getHours())}:${pad(close.getMinutes())}`;
    setEntryStartTime(local);
    setEntryCloseTime(localClose);
    setFutureStatus(FutureStatus.UPCOMING);
    setChoices([defaultChoiceRow(), defaultChoiceRow()]);
    setTournament("");
    setEventName("");
    setEventDescription("");
    setEventImage("");
    setEventDescriptionImage("");
    setTeams([]);
    setError("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    fetchTeamsForTournament(tournament);
  }, [isOpen, tournament, fetchTeamsForTournament]);

  useEffect(() => {
    if (!isOpen) return;
    setChoices((prev) => prev.map((row) => ({ ...row, teamDetails: "" })));
  }, [tournament, isOpen]);

  if (!isOpen) return null;

  const updateChoice = (index: number, patch: Partial<ChoiceFormRow>) => {
    setChoices((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!tournament.trim()) {
      setError("Please select a tournament");
      return;
    }
    if (!eventName.trim()) {
      setError("Please enter an event name");
      return;
    }
    if (!entryStartTime) {
      setError("Please set entry start time");
      return;
    }
    if (!entryCloseTime) {
      setError("Please set entry close time");
      return;
    }
    const startMs = new Date(`${entryStartTime}+05:30`).getTime();
    const closeMs = new Date(`${entryCloseTime}+05:30`).getTime();
    if (
      Number.isFinite(startMs) &&
      Number.isFinite(closeMs) &&
      closeMs <= startMs
    ) {
      setError("Entry close time must be after entry start time");
      return;
    }

    const payloadChoices: CreateFutureChoicePayload[] = choices
      .filter((c) => c.choiceName.trim())
      .map((c) => {
        const row: CreateFutureChoicePayload = {
          choiceName: c.choiceName.trim(),
          choiceCoins: Number.isFinite(c.choiceCoins) ? c.choiceCoins : 0,
          initialCoinsOnChoice: Number.isFinite(c.initialCoinsOnChoice)
            ? c.initialCoinsOnChoice
            : 0,
          isVisible: c.isVisible,
        };
        const choiceDesc = c.choiceDescription.trim();
        const choiceImg = c.choiceImage.trim();
        const team = c.teamDetails.trim();
        if (choiceDesc) row.choiceDescription = choiceDesc;
        if (choiceImg) row.choiceImage = choiceImg;
        if (team) row.teamDetails = team;
        return row;
      });

    if (payloadChoices.length === 0) {
      setError("Add at least one choice with a name");
      return;
    }

    const payload: CreateFuturePayload = {
      tournament: tournament.trim(),
      eventName: eventName.trim(),
      entryStartTime: convertToISTISO(entryStartTime),
      entryCloseTime: convertToISTISO(entryCloseTime),
      futureStatus,
      choices: payloadChoices,
    };
    const evDesc = eventDescription.trim();
    const evImg = eventImage.trim();
    const evDescImg = eventDescriptionImage.trim();
    if (evDesc) payload.eventDescription = evDesc;
    if (evImg) payload.eventImage = evImg;
    if (evDescImg) payload.eventDescriptionImage = evDescImg;

    setLoading(true);
    try {
      const res = await fetch("/api/futures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const response = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message =
          (typeof response.message === "string" && response.message) ||
          (typeof response.error === "string" && response.error) ||
          "Failed to create future";
        throw new Error(message);
      }
      if (!response.success) {
        throw new Error(
          (typeof response.message === "string" && response.message) ||
            "Failed to create future",
        );
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create future");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white dark:bg-zinc-900">
        <div className="border-b border-gray-200 p-6 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Create new future
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error ? (
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          ) : null}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tournament *
            </label>
            <select
              required
              value={tournament}
              onChange={(e) => setTournament(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            >
              <option value="">-- Select a tournament --</option>
              {tournaments.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Event name *
            </label>
            <input
              type="text"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description{" "}
              <span className="font-normal text-zinc-500">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Event image URL{" "}
              <span className="font-normal text-zinc-500">(optional)</span>
            </label>
            <input
              type="text"
              inputMode="url"
              placeholder="https://…"
              value={eventImage}
              onChange={(e) => setEventImage(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description image URL{" "}
              <span className="font-normal text-zinc-500">(optional)</span>
            </label>
            <input
              type="text"
              inputMode="url"
              placeholder="https://…"
              value={eventDescriptionImage}
              onChange={(e) => setEventDescriptionImage(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status *
            </label>
            <select
              value={futureStatus}
              onChange={(e) => setFutureStatus(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            >
              {creatableFutureStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Entry start time *
            </label>
            <input
              type="datetime-local"
              required
              value={entryStartTime}
              onChange={(e) => setEntryStartTime(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Entry close time *
            </label>
            <input
              type="datetime-local"
              required
              value={entryCloseTime}
              onChange={(e) => setEntryCloseTime(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="space-y-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Choices{" "}
              <span className="font-normal text-zinc-500">
                (at least one named choice)
              </span>
            </span>
            {choices.map((row, index) => (
              <div
                key={index}
                className="space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700"
              >
                <span className="text-xs font-medium text-zinc-500">
                  Choice {index + 1}
                </span>
                <input
                  type="text"
                  placeholder="Name *"
                  value={row.choiceName}
                  onChange={(e) =>
                    updateChoice(index, { choiceName: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                />
                <textarea
                  rows={2}
                  placeholder="Description (optional)"
                  value={row.choiceDescription}
                  onChange={(e) =>
                    updateChoice(index, { choiceDescription: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                />
                <input
                  type="text"
                  inputMode="url"
                  placeholder="Image URL (optional)"
                  value={row.choiceImage}
                  onChange={(e) =>
                    updateChoice(index, { choiceImage: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                />

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Team{" "}
                    <span className="font-normal text-zinc-500">
                      (optional)
                    </span>
                  </label>
                  <select
                    value={row.teamDetails}
                    onChange={(e) => {
                      const id = e.target.value;
                      const picked = id
                        ? teams.find((t) => t._id === id)
                        : undefined;
                      updateChoice(index, {
                        teamDetails: id,
                        ...(picked ? { choiceName: picked.name } : {}),
                      });
                    }}
                    disabled={!tournament.trim() || teamsLoading}
                    className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                  >
                    <option value="">
                      {teamsLoading
                        ? "Loading teams…"
                        : !tournament.trim()
                          ? "Select tournament first"
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
                      updateChoice(index, { isVisible: e.target.checked })
                    }
                    className="rounded border-gray-300 dark:border-zinc-600"
                  />
                  Visible
                </label>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setChoices((prev) => [...prev, defaultChoiceRow()])
              }
              className="w-full rounded-md border border-dashed border-zinc-500 px-3 py-2 text-sm text-gray-700 hover:bg-zinc-100 dark:text-gray-300 dark:hover:bg-zinc-800"
            >
              Add choice
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-zinc-600 px-4 py-2 text-gray-800 hover:bg-zinc-100 dark:text-gray-200 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200 disabled:opacity-50 dark:bg-zinc-100 dark:text-black"
            >
              {loading ? "Creating…" : "Create future"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
