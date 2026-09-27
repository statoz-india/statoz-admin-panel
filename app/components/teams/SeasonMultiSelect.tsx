"use client";

import { X } from "lucide-react";

interface SeasonMultiSelectProps {
  value: string[];
  onChange: (seasons: string[]) => void;
  /** Seasons the dropdown offers (see `app/utils/team-season-options.ts`). */
  options: string[];
  disabled?: boolean;
}

/**
 * A team's seasons: the chosen ones as removable chips, and a dropdown to add
 * another from the options configured for the team's tournament.
 */
export default function SeasonMultiSelect({
  value,
  onChange,
  options,
  disabled = false,
}: SeasonMultiSelectProps) {
  const remaining = options.filter((season) => !value.includes(season));

  return (
    <div>
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {value.map((season) => (
            <span
              key={season}
              className="inline-flex items-center gap-1 rounded-full bg-zinc-700 px-2.5 py-1 text-sm text-white"
            >
              {season}
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(value.filter((s) => s !== season))}
                aria-label={`Remove season ${season}`}
                className="rounded-full text-gray-400 hover:text-white disabled:cursor-not-allowed"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <select
        // Always shows the prompt: picking an option adds it and resets.
        value=""
        disabled={disabled || remaining.length === 0}
        onChange={(e) => {
          if (e.target.value) onChange([...value, e.target.value]);
        }}
        aria-label="Add a season"
        className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-60"
      >
        <option value="">
          {remaining.length === 0
            ? "All available seasons added"
            : "-- Add a season --"}
        </option>
        {remaining.map((season) => (
          <option key={season} value={season}>
            {season}
          </option>
        ))}
      </select>

      {value.length === 0 && (
        <p className="mt-1 text-xs text-gray-500">
          No seasons — this team won’t be tied to any season.
        </p>
      )}
    </div>
  );
}
