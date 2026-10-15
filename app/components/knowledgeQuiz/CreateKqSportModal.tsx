"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import type {
  CreateKqSportPayload,
  KqSport,
  KqSportQuiz,
} from "@/app/interface/knowledge-quiz.interface";
import {
  KQ_ICON_OPTIONS,
  KQ_SPORT_ICONS,
  KQ_SPORT_LABELS,
  validateKqSport,
  validateKqSportUpdate,
} from "@/app/interface/knowledge-quiz.interface";
import { kqApi } from "./kq-api";

interface CreateKqSportModalProps {
  /**
   * Sports that can be selected: those without a row, plus — when editing —
   * the row's own current sport, which is otherwise "taken" by itself.
   */
  available: KqSport[];
  /** Row being edited; `null` (or absent) creates a new one. */
  existing?: KqSportQuiz | null;
  onSaved: (sport: KqSportQuiz, mode: "created" | "updated") => void;
  onClose: () => void;
}

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none disabled:opacity-60";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400";

export default function CreateKqSportModal({
  available,
  existing = null,
  onSaved,
  onClose,
}: CreateKqSportModalProps) {
  const isEdit = existing !== null;

  const [sportsType, setSportsType] = useState<KqSport | "">(
    existing?.sportsType ?? "",
  );
  const [sportsIcon, setSportsIcon] = useState(existing?.sportsIcon ?? "");
  const [gameHeading, setGameHeading] = useState(existing?.gameHeading ?? "");
  const [gameSubHeading, setGameSubHeading] = useState(
    existing?.gameSubHeading ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Picking a sport fills in the canonical icon and a sensible heading. Both
   * stay editable — this is a shortcut, not a lock.
   */
  const chooseSport = (value: KqSport | "") => {
    setSportsType(value);
    if (!value) return;
    setSportsIcon(KQ_SPORT_ICONS[value]);
    if (!gameHeading.trim()) {
      setGameHeading(`${KQ_SPORT_LABELS[value]} Knowledge Quiz`);
    }
  };

  const submit = async () => {
    if (saving) return;
    setError(null);

    const payload: Partial<CreateKqSportPayload> = {
      sportsType: (sportsType || undefined) as KqSport | undefined,
      sportsIcon: sportsIcon.trim(),
      gameHeading: gameHeading.trim(),
      gameSubHeading: gameSubHeading.trim(),
    };

    const failures = isEdit
      ? validateKqSportUpdate(payload)
      : validateKqSport(payload);
    if (failures.length > 0) {
      setError(failures.join(", "));
      return;
    }

    setSaving(true);
    try {
      if (isEdit && existing) {
        // Every field is posted, so "at least one field to update" is always
        // satisfied and the merged document is exactly what was validated.
        const updated = await kqApi.updateSport(existing._id, payload);
        onSaved(updated, "updated");
      } else {
        const created = await kqApi.createSport(payload as CreateKqSportPayload);
        onSaved(created, "created");
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : `Failed to ${isEdit ? "update" : "create"} sport`,
      );
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-8">
      <div className="w-full max-w-2xl rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {isEdit
                ? `Edit ${KQ_SPORT_LABELS[existing.sportsType] ?? existing.sportsType} card`
                : "Add a sport to the home screen"}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              One card per sport. This is presentation only — it holds no
              questions.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-gray-500 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="flex items-start gap-2 rounded-lg border border-amber-800 bg-amber-950/40 px-4 py-3 text-xs text-amber-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {isEdit
                ? "Changes go live immediately. There is still no delete endpoint, and the card's position on the home screen is its creation order, which can't be changed."
                : "There is no delete endpoint, so this card can be edited later but never removed. Its position on the home screen is the order it was created in."}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="kq-sport-type" className={labelClass}>
                Sport
              </label>
              <select
                id="kq-sport-type"
                value={sportsType}
                disabled={saving}
                onChange={(e) => chooseSport(e.target.value as KqSport | "")}
                className={inputClass}
              >
                <option value="">-- Select a sport --</option>
                {available.map((sport) => (
                  <option key={sport} value={sport}>
                    {KQ_SPORT_LABELS[sport]}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-gray-600">
                {isEdit
                  ? "Moving this card to a sport that already has one is rejected, so only free sports are listed."
                  : "Sports that already have a card are not listed."}
              </p>
            </div>

            <div>
              <label htmlFor="kq-sport-icon" className={labelClass}>
                Icon
              </label>
              <select
                id="kq-sport-icon"
                value={sportsIcon}
                disabled={saving}
                onChange={(e) => setSportsIcon(e.target.value)}
                className={`${inputClass} font-mono`}
              >
                <option value="">-- Select an icon --</option>
                {KQ_ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-gray-600">
                Material icon name. Nothing validates it server-side — a typo
                saves fine and renders nothing in the app.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="kq-heading" className={labelClass}>
              Heading
            </label>
            <input
              id="kq-heading"
              type="text"
              value={gameHeading}
              disabled={saving}
              onChange={(e) => setGameHeading(e.target.value)}
              placeholder="Football Knowledge Quiz"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="kq-subheading" className={labelClass}>
              Sub-heading
            </label>
            <input
              id="kq-subheading"
              type="text"
              value={gameSubHeading}
              disabled={saving}
              onChange={(e) => setGameSubHeading(e.target.value)}
              placeholder="Prove you know the beautiful game"
              className={inputClass}
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-zinc-800 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving
              ? isEdit
                ? "Saving…"
                : "Creating…"
              : isEdit
                ? "Save changes"
                : "Create sport"}
          </button>
        </div>
      </div>
    </div>
  );
}
