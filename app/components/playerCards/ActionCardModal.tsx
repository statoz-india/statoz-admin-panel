"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import {
  ACTION_CATEGORIES,
  type ActionCard,
  type CreateActionCardInput,
} from "@/app/interface/player-card.interface";
import { cardsApi } from "./cards-api";

interface ActionCardModalProps {
  /** When provided the modal edits this card; otherwise it creates a new one. */
  card?: ActionCard;
  onClose: () => void;
  onSaved: (card: ActionCard) => void;
}

export default function ActionCardModal({
  card,
  onClose,
  onSaved,
}: ActionCardModalProps) {
  const isEdit = Boolean(card);

  const [baseId, setBaseId] = useState(card?.baseId ?? "");
  const [title, setTitle] = useState(card?.title ?? "");
  const [category, setCategory] = useState<string>(
    card?.category ?? ACTION_CATEGORIES[0],
  );
  const [basePower, setBasePower] = useState(
    card?.basePower != null ? String(card.basePower) : "",
  );
  const [icon, setIcon] = useState(card?.icon ?? "");
  const [effectTemplate, setEffectTemplate] = useState(
    card?.effectTemplate ?? "",
  );
  const [risky, setRisky] = useState(card?.risky ?? false);
  const [isVisible, setIsVisible] = useState(card?.isVisible ?? true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const powerNum = Number(basePower);
    if (!basePower.trim() || !Number.isFinite(powerNum) || powerNum < 0) {
      setError("Base power must be a number ≥ 0.");
      return;
    }
    if (
      !baseId.trim() ||
      !title.trim() ||
      !icon.trim() ||
      !effectTemplate.trim()
    ) {
      setError("Base ID, title, icon and effect template are required.");
      return;
    }

    const payload: CreateActionCardInput = {
      baseId: baseId.trim(),
      title: title.trim(),
      category: category as CreateActionCardInput["category"],
      basePower: powerNum,
      icon: icon.trim(),
      effectTemplate: effectTemplate.trim(),
      risky,
      isVisible,
    };

    try {
      setSubmitting(true);
      const saved =
        isEdit && card
          ? await cardsApi.updateActionCard(card._id, payload)
          : await cardsApi.createActionCard(payload);
      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save card.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950">
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 p-5">
          <h3 className="text-lg font-semibold text-white">
            {isEdit ? "Edit action card" : "Create action card"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && (
            <div className="rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Base ID" required>
              <input
                type="text"
                value={baseId}
                onChange={(e) => setBaseId(e.target.value)}
                placeholder="through-ball"
                className={inputClass}
              />
            </Field>
            <Field label="Title" required>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Through Ball"
                className={inputClass}
              />
            </Field>
            <Field label="Category" required>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                {ACTION_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Base power" required>
              <input
                type="number"
                min={0}
                value={basePower}
                onChange={(e) => setBasePower(e.target.value)}
                placeholder="40"
                className={inputClass}
              />
            </Field>
            <Field label="Icon" required>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="https://…/icon.webp"
                  className={inputClass}
                />
                {icon.trim() && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={icon}
                    alt="icon preview"
                    className="h-9 w-9 flex-shrink-0 rounded-lg border border-zinc-700 bg-black/30 object-contain"
                  />
                )}
              </div>
            </Field>
          </div>

          <Field label="Effect template" required>
            <input
              type="text"
              value={effectTemplate}
              onChange={(e) => setEffectTemplate(e.target.value)}
              placeholder="Deal {power} attack"
              className={inputClass}
            />
          </Field>

          <div className="flex flex-wrap gap-6 pt-1">
            <label className="inline-flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={risky}
                onChange={(e) => setRisky(e.target.checked)}
                className="h-4 w-4 accent-cyan-500"
              />
              Risky
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="h-4 w-4 accent-cyan-500"
              />
              Visible
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isEdit ? "Save changes" : "Create card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </span>
      {children}
    </label>
  );
}
