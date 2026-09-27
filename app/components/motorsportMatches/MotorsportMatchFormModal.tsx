"use client";

import { useState, type FormEvent } from "react";
import type { Tournament } from "@/app/models/tournament.model";
import {
  MOTORSPORT_MATCH_STATUSES,
  type CreateMotorsportMatchPayload,
  type MotorsportMatch,
  type MotorsportMatchStatus,
  type UpdateMotorsportMatchPayload,
} from "@/app/models/motorsport-match.model";
import { isoToIstInput, istInputToIso } from "./motorsportHelpers";

interface FormState {
  name: string;
  tournament: string;
  seasonYear: string;
  matchStatus: MotorsportMatchStatus;
  tag: string;
  description: string;
  summary: string;
  isVisible: boolean;
  /** The three dates are IST `datetime-local` values (or ""). */
  raceEventStartDate: string;
  raceEventStopDate: string;
  raceStartTime: string;
}

interface MotorsportMatchFormModalProps {
  /** The race being edited; omit to create a new one. */
  match?: MotorsportMatch | null;
  tournaments: Tournament[];
  /** Shown under the tournament dropdown, e.g. when it fell back to all tournaments. */
  tournamentHint?: string;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}

const INPUT_CLASS =
  "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white";
const LABEL_CLASS = "block text-sm font-medium text-gray-300 mb-2";

function initialForm(match?: MotorsportMatch | null): FormState {
  return {
    name: match?.name ?? "",
    tournament: match?.tournament ?? "",
    seasonYear: match?.seasonYear ?? String(new Date().getFullYear()),
    matchStatus: match?.matchStatus ?? "Upcoming",
    tag: match?.tag ?? "",
    description: match?.description ?? "",
    summary: match?.summary ?? "",
    isVisible: match?.isVisible ?? true,
    raceEventStartDate: isoToIstInput(match?.raceEventStartDate),
    raceEventStopDate: isoToIstInput(match?.raceEventStopDate),
    raceStartTime: isoToIstInput(match?.raceStartTime),
  };
}

const DATE_FIELDS = [
  ["raceEventStartDate", "Weekend starts (IST)"],
  ["raceEventStopDate", "Weekend ends (IST)"],
  ["raceStartTime", "Race starts (IST)"],
] as const;

/** Returns a problem to show, or "" when the dates are fine. */
function validateDates(form: FormState, original: FormState): string {
  for (const [key, label] of DATE_FIELDS) {
    // The backend takes ISO strings only, so a date can't be blanked once set.
    if (original[key] && !form[key]) {
      return `${label} can't be cleared once set — pick a new date instead.`;
    }
  }
  if (
    form.raceEventStartDate &&
    form.raceEventStopDate &&
    form.raceEventStopDate < form.raceEventStartDate
  ) {
    return "The weekend can't end before it starts.";
  }
  return "";
}

/** Only what changed, as the PATCH endpoint expects. `null` clears free text. */
function buildUpdatePayload(
  form: FormState,
  original: FormState,
): UpdateMotorsportMatchPayload {
  const payload: UpdateMotorsportMatchPayload = {};

  const name = form.name.trim();
  if (name !== original.name) payload.name = name;

  const seasonYear = form.seasonYear.trim();
  if (seasonYear !== original.seasonYear) payload.seasonYear = seasonYear;

  if (form.tournament !== original.tournament) {
    payload.tournament = form.tournament;
  }
  if (form.matchStatus !== original.matchStatus) {
    payload.matchStatus = form.matchStatus;
  }
  if (form.isVisible !== original.isVisible) {
    payload.isVisible = form.isVisible;
  }

  for (const key of ["tag", "description", "summary"] as const) {
    const next = form[key].trim();
    if (next !== original[key].trim()) payload[key] = next || null;
  }

  for (const [key] of DATE_FIELDS) {
    if (form[key] !== original[key]) payload[key] = istInputToIso(form[key]);
  }

  return payload;
}

function buildCreatePayload(form: FormState): CreateMotorsportMatchPayload {
  const payload: CreateMotorsportMatchPayload = {
    name: form.name.trim(),
    tournament: form.tournament,
    seasonYear: form.seasonYear.trim(),
    matchStatus: form.matchStatus,
    isVisible: form.isVisible,
  };

  for (const key of ["tag", "description", "summary"] as const) {
    const value = form[key].trim();
    if (value) payload[key] = value;
  }
  for (const [key] of DATE_FIELDS) {
    if (form[key]) payload[key] = istInputToIso(form[key]);
  }

  return payload;
}

/** One form for both create and edit. Mount it only while open. */
export default function MotorsportMatchFormModal({
  match,
  tournaments,
  tournamentHint,
  onClose,
  onSaved,
}: MotorsportMatchFormModalProps) {
  const isEdit = Boolean(match);
  const [original] = useState(() => initialForm(match));
  const [form, setForm] = useState<FormState>(original);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  // The race's own tournament stays selectable even if the list doesn't have it.
  const tournamentOptions = tournaments.some(
    (t) => t.tournament === form.tournament,
  )
    ? tournaments
    : form.tournament
      ? [
          {
            _id: "current",
            tournament: form.tournament,
            tournamentName: "",
          } as Tournament,
          ...tournaments,
        ]
      : tournaments;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const missing: string[] = [];
    if (!form.name.trim()) missing.push("Name is required");
    if (!form.tournament) missing.push("Tournament is required");
    if (!form.seasonYear.trim()) missing.push("Season year is required");
    if (missing.length > 0) {
      setErrors(missing);
      return;
    }

    const dateProblem = validateDates(form, original);
    if (dateProblem) {
      setErrors([dateProblem]);
      return;
    }

    const updatePayload = isEdit ? buildUpdatePayload(form, original) : null;
    if (updatePayload && Object.keys(updatePayload).length === 0) {
      setErrors(["Nothing has changed."]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        isEdit
          ? `/api/match/motorsport/${encodeURIComponent(match!._id)}`
          : "/api/match/motorsport",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatePayload ?? buildCreatePayload(form)),
        },
      );
      const body = await res.json().catch(() => ({}));

      if (!res.ok || !body?.success) {
        setErrors(
          Array.isArray(body?.errors) && body.errors.length > 0
            ? body.errors
            : [
                body?.message ||
                  `Failed to ${isEdit ? "update" : "create"} the race`,
              ],
        );
        return;
      }

      await onSaved();
    } catch (err) {
      setErrors([
        err instanceof Error
          ? err.message
          : `Failed to ${isEdit ? "update" : "create"} the race`,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-zinc-900">
        <div className="border-b border-zinc-800 p-6">
          <h2 className="text-2xl font-bold text-white">
            {isEdit ? "Edit race" : "Create race"}
          </h2>
          {match && (
            <p className="mt-1 text-sm text-gray-400">
              Match ID {match.matchId} — assigned by the server, can’t be
              changed.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.length > 0 && (
            <div className="mb-4 rounded-lg border border-red-800 bg-red-900/20 p-4">
              {errors.length === 1 ? (
                <p className="text-sm text-red-400">{errors[0]}</p>
              ) : (
                <ul className="list-inside list-disc space-y-1 text-sm text-red-400">
                  {errors.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className={LABEL_CLASS}>Race name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={INPUT_CLASS}
              placeholder="e.g., Monaco Grand Prix"
            />
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={LABEL_CLASS}>Tournament *</label>
              <select
                value={form.tournament}
                onChange={(e) => set("tournament", e.target.value)}
                className={INPUT_CLASS}
              >
                <option value="">-- Select a tournament --</option>
                {tournamentOptions.map((t) => (
                  <option key={t._id} value={t.tournament}>
                    {t.tournamentName
                      ? `${t.tournament} — ${t.tournamentName}`
                      : t.tournament}
                  </option>
                ))}
              </select>
              {tournamentHint && (
                <p className="mt-1 text-xs text-gray-500">{tournamentHint}</p>
              )}
              {isEdit && (
                <p className="mt-1 text-xs text-gray-500">
                  Moving a race to another tournament doesn’t renumber its
                  Match ID.
                </p>
              )}
            </div>
            <div>
              <label className={LABEL_CLASS}>Season year *</label>
              <input
                type="text"
                value={form.seasonYear}
                onChange={(e) => set("seasonYear", e.target.value)}
                className={INPUT_CLASS}
                placeholder="e.g., 2026"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={LABEL_CLASS}>Status</label>
              <select
                value={form.matchStatus}
                onChange={(e) =>
                  set("matchStatus", e.target.value as MotorsportMatchStatus)
                }
                className={INPUT_CLASS}
              >
                {MOTORSPORT_MATCH_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL_CLASS}>Tag</label>
              <input
                type="text"
                value={form.tag}
                onChange={(e) => set("tag", e.target.value)}
                className={INPUT_CLASS}
                placeholder="e.g., Featured"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {DATE_FIELDS.map(([key, label]) => (
              <div key={key}>
                <label className={LABEL_CLASS}>{label}</label>
                <input
                  type="datetime-local"
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className={LABEL_CLASS}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              className={INPUT_CLASS}
              placeholder="e.g., Round 8 of the season"
            />
          </div>

          <div className="mb-4">
            <label className={LABEL_CLASS}>Summary</label>
            <textarea
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              rows={2}
              className={INPUT_CLASS}
              placeholder="e.g., Race under way"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-3 text-sm font-medium text-gray-300">
              <input
                type="checkbox"
                checked={form.isVisible}
                onChange={(e) => set("isVisible", e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-white"
              />
              Visible in the app
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-md border border-zinc-600 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                  ? "Save changes"
                  : "Create race"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
