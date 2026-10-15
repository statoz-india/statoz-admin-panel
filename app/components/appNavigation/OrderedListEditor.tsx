"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  GripVertical,
  Plus,
  X,
} from "lucide-react";

interface OrderedListEditorProps {
  label: string;
  /** What this list controls in the app, shown under the label. */
  hint?: string;
  items: string[];
  onChange: (items: string[]) => void;
  /** One-click chips for the common values. Already-added ones are hidden. */
  suggestions?: readonly string[];
  /** Non-blocking caveat about the current contents, e.g. a missing entry. */
  warning?: string | null;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Ordered list editor: add, remove, and reorder entries. Order is meaningful —
 * it is the order the app renders the tabs / navbar in.
 */
export default function OrderedListEditor({
  label,
  hint,
  items,
  onChange,
  suggestions = [],
  warning = null,
  placeholder = "Add an item",
  disabled = false,
}: OrderedListEditorProps) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const add = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    if (items.includes(value)) {
      setError(`"${value}" is already in the list`);
      return;
    }
    onChange([...items, value]);
    setDraft("");
    setError(null);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    setError(null);
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const unusedSuggestions = suggestions.filter(
    (suggestion) => !items.includes(suggestion),
  );

  /**
   * A value that matches a known identifier except for case is almost always a
   * typo: the API accepts it, but the app silently fails to match it.
   */
  const caseMismatchFor = (item: string): string | undefined =>
    suggestions.find(
      (suggestion) =>
        suggestion !== item &&
        suggestion.toLowerCase() === item.toLowerCase(),
    );

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {label}
          </label>
          {hint && <p className="mt-0.5 text-xs text-gray-600">{hint}</p>}
        </div>
        <span className="shrink-0 text-xs text-gray-600">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-950">
        {items.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-gray-600">
            No items yet — add at least one.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {items.map((item, index) => {
              const expected = caseMismatchFor(item);
              return (
              <li
                key={`${item}-${index}`}
                className="flex items-center gap-2 px-3 py-2"
              >
                <GripVertical className="h-4 w-4 shrink-0 text-zinc-700" />
                <span className="w-5 shrink-0 text-xs text-gray-600">
                  {index + 1}
                </span>
                <span className="flex-1 truncate text-sm text-white">
                  {item}
                  {expected && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...items];
                        next[index] = expected;
                        onChange(next);
                      }}
                      disabled={disabled}
                      title={`Values are case-sensitive — the app expects "${expected}"`}
                      className="ml-2 inline-flex items-center gap-1 rounded border border-amber-800 bg-amber-950/50 px-1.5 py-0.5 align-middle text-xs text-amber-300 hover:bg-amber-900/50 disabled:opacity-50"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      Use {expected}
                    </button>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={disabled || index === 0}
                  aria-label={`Move ${item} up`}
                  className="rounded p-1 text-gray-500 hover:bg-zinc-800 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={disabled || index === items.length - 1}
                  aria-label={`Move ${item} down`}
                  className="rounded p-1 text-gray-500 hover:bg-zinc-800 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={disabled}
                  aria-label={`Remove ${item}`}
                  className="rounded p-1 text-gray-500 hover:bg-red-950 hover:text-red-400 disabled:opacity-30"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
              );
            })}
          </ul>
        )}

        <div className="flex items-center gap-2 border-t border-zinc-800 p-2">
          <input
            type="text"
            value={draft}
            disabled={disabled}
            onChange={(e) => {
              setDraft(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add(draft);
              }
            }}
            placeholder={placeholder}
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => add(draft)}
            disabled={disabled || !draft.trim()}
            className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-3 py-1.5 text-sm text-white hover:bg-zinc-700 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}

      {warning && (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-400">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
          {warning}
        </p>
      )}

      {unusedSuggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-600">Suggested:</span>
          {unusedSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => add(suggestion)}
              disabled={disabled}
              className="rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs text-gray-400 hover:border-cyan-600 hover:text-cyan-300 disabled:opacity-40"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
