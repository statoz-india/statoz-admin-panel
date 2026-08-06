"use client";

import type { ReactNode } from "react";

function DialogShell({
  titleId,
  title,
  busy,
  onClose,
  children,
}: {
  titleId: string;
  title: string;
  busy: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="fixed inset-0 bg-black/70"
        aria-hidden
        onClick={() => !busy && onClose()}
      />
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-xl">
        <h2 id={titleId} className="mb-4 text-lg font-semibold text-white">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

export type OutcomeChoice = {
  value: string;
  label: string;
  /** Small right-hand hint, e.g. the raw enum value or the coins backing it. */
  hint?: string;
  labelClass?: string;
};

/**
 * Step 1 of settlement: pick the outcome. Used for predictions (A / B / D) and
 * events (Y / N / M) — the caller decides which options are legal.
 */
export function DeclareResultDialog({
  title,
  description,
  options,
  selected,
  onSelect,
  error,
  busy,
  onCancel,
  onSubmit,
}: {
  title: string;
  description: string;
  options: OutcomeChoice[];
  selected: string | null;
  onSelect: (value: string) => void;
  error: string;
  busy: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <DialogShell
      titleId="unresolved-declare-dialog-title"
      title={title}
      busy={busy}
      onClose={onCancel}
    >
      <p className="mb-4 text-sm text-gray-400">{description}</p>
      <div className="mb-6 space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            disabled={busy}
            className={`flex w-full items-center justify-between rounded-lg border-2 p-3 text-left transition-colors ${
              selected === option.value
                ? "border-blue-500 bg-blue-900/30"
                : "border-zinc-600 hover:border-zinc-500"
            }`}
          >
            <span
              className={`font-medium ${option.labelClass ?? "text-zinc-100"}`}
            >
              {option.label}
            </span>
            {option.hint ? (
              <span className="font-mono text-xs text-zinc-500">
                {option.hint}
              </span>
            ) : null}
          </button>
        ))}
      </div>
      {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="rounded-md border border-zinc-600 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!selected || busy}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
        >
          {busy ? "Declaring…" : "Declare result"}
        </button>
      </div>
    </DialogShell>
  );
}

/**
 * Step 2 of settlement. Payouts and XP credits are irreversible and fan out to
 * every participant, so the blast radius is shown before confirming.
 */
export function ConfirmSettleDialog({
  title,
  description,
  facts,
  error,
  busy,
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  facts: { label: string; value: string }[];
  error: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <DialogShell
      titleId="unresolved-settle-dialog-title"
      title={title}
      busy={busy}
      onClose={onCancel}
    >
      <p className="mb-4 text-sm text-gray-400">{description}</p>
      <dl className="mb-6 divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-950/60 px-4">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="flex items-center justify-between gap-4 py-2.5 text-sm"
          >
            <dt className="text-zinc-500">{fact.label}</dt>
            <dd className="text-right font-medium text-zinc-200">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mb-4 text-sm text-amber-300">
        This cannot be undone.
      </p>
      {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="rounded-md border border-zinc-600 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="rounded-md bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {busy ? "Settling…" : "Yes, settle now"}
        </button>
      </div>
    </DialogShell>
  );
}
