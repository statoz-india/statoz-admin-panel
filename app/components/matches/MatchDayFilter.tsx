"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  dateToMatchDay,
  formatMatchDayLabel,
  matchDayToDate,
  shiftMatchDay,
  todayMatchDay,
} from "@/app/utils/matchDay";

/**
 * Dark-themed classes for `react-day-picker` v9. The package's own stylesheet
 * is not imported and the shadcn `ui/calendar` relies on design tokens this app
 * never defines, so every element is styled explicitly here.
 */
const DAY_PICKER_CLASS_NAMES = {
  root: "text-sm text-zinc-200",
  months: "relative",
  month_caption: "flex h-9 items-center justify-center",
  caption_label: "font-medium text-white",
  nav: "absolute inset-x-0 top-0 flex h-9 items-center justify-between",
  button_previous:
    "inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-300 hover:bg-zinc-800 disabled:opacity-40",
  button_next:
    "inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-300 hover:bg-zinc-800 disabled:opacity-40",
  chevron: "h-4 w-4 fill-current",
  month_grid: "mt-2 w-full border-collapse",
  weekdays: "flex",
  weekday: "w-9 pb-1 text-xs font-normal text-zinc-500",
  week: "flex w-full",
  day: "h-9 w-9 p-0 text-center",
  day_button:
    "h-9 w-9 rounded-md font-normal text-zinc-200 hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
  selected: "[&>button]:bg-white [&>button]:font-semibold [&>button]:text-black",
  today: "[&>button]:text-sky-400",
  outside: "[&>button]:text-zinc-600",
  disabled: "[&>button]:opacity-40",
  hidden: "invisible",
} as const;

/**
 * Day picker for `/match/matchesForDate/:date`.
 *
 * The day is the backend's IST match day, not the viewer's local day — "Today"
 * resolves in IST, while the calendar grid itself is plain wall-clock dates.
 */
export default function MatchDayFilter({
  value,
  onChange,
  onClear,
}: {
  value: string | null;
  onChange: (day: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const today = todayMatchDay();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const selectDay = (day: string) => {
    onChange(day);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
      {value ? (
        <button
          type="button"
          onClick={() => onChange(shiftMatchDay(value, -1))}
          aria-label="Previous day"
          className="rounded-md border border-zinc-600 bg-zinc-800 p-2 text-white transition-colors hover:bg-zinc-700"
        >
          <ChevronLeft size={16} />
        </button>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-colors ${
          value
            ? "bg-white text-black hover:bg-zinc-200"
            : "border border-dashed border-zinc-600 bg-zinc-900 text-white hover:bg-zinc-800"
        }`}
      >
        <CalendarDays size={16} />
        {value ? formatMatchDayLabel(value) : "Browse by date"}
      </button>

      {value ? (
        <>
          <button
            type="button"
            onClick={() => onChange(shiftMatchDay(value, 1))}
            aria-label="Next day"
            className="rounded-md border border-zinc-600 bg-zinc-800 p-2 text-white transition-colors hover:bg-zinc-700"
          >
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear date filter"
            title="Clear date filter"
            className="rounded-md border border-zinc-600 bg-zinc-800 p-2 text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            <X size={16} />
          </button>
        </>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-label="Select match date"
          className="absolute left-0 top-full z-30 mt-2 rounded-xl border border-zinc-700 bg-zinc-900 p-3 shadow-xl"
        >
          <DayPicker
            mode="single"
            required={false}
            selected={value ? matchDayToDate(value) : undefined}
            onSelect={(date) => date && selectDay(dateToMatchDay(date))}
            defaultMonth={
              (value ? matchDayToDate(value) : undefined) ??
              matchDayToDate(today)
            }
            today={matchDayToDate(today)}
            showOutsideDays
            classNames={DAY_PICKER_CLASS_NAMES}
          />
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-zinc-800 pt-3">
            <button
              type="button"
              onClick={() => selectDay(today)}
              className="rounded-md border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-sm text-white transition-colors hover:bg-zinc-700"
            >
              Today
            </button>
            <span className="text-xs text-zinc-500">IST match day</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
