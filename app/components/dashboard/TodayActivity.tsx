"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, HelpCircle, Target } from "lucide-react";
import { Section } from "@/app/utils/enums/section.enum";
import type { TodayListResponse } from "@/app/interface/dashboard.interface";
import {
  fetchAdmin,
  StatValue,
} from "@/app/components/dashboard/dashboard-ui";

type TodayKey = "quizzes" | "predictions" | "events";

/** Cards showing today's scheduled activity (IST). */
const TODAY_CARDS: {
  key: TodayKey;
  label: string;
  section: Section;
  icon: React.ComponentType<{ className?: string }>;
  endpoint: string;
}[] = [
  {
    key: "quizzes",
    label: "Quizzes today",
    section: Section.QUIZZES,
    icon: HelpCircle,
    endpoint: "/api/admin-api/gettodayquizzes",
  },
  {
    key: "predictions",
    label: "Predictions today",
    section: Section.PREDICTIONS,
    icon: Target,
    endpoint: "/api/admin-api/gettodaypredictions",
  },
  {
    key: "events",
    label: "Events closing today",
    section: Section.EVENTS,
    icon: CalendarClock,
    endpoint: "/api/admin-api/gettodayevents",
  },
];

/**
 * Today's quizzes, predictions and events. Each card fills in as soon as its
 * own request returns and links to its admin section.
 */
export default function TodayActivity() {
  const router = useRouter();
  /** A key is present once its request has returned (null when it failed). */
  const [today, setToday] = useState<Partial<Record<TodayKey, number | null>>>(
    {},
  );

  useEffect(() => {
    let cancelled = false;

    for (const card of TODAY_CARDS) {
      fetchAdmin<TodayListResponse>(card.endpoint).then((data) => {
        if (cancelled) return;
        setToday((prev) => ({
          ...prev,
          [card.key]: data ? data.total : null,
        }));
      });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-white">
        Today&apos;s activity
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {TODAY_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.key}
              type="button"
              // This lives on its own route, so jump back into the admin home.
              onClick={() => router.push(`/?section=${card.section}`)}
              className="group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-left transition-colors hover:border-cyan-500/60 hover:bg-zinc-800"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-cyan-400 group-hover:bg-zinc-700">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <StatValue
                  loading={!(card.key in today)}
                  value={today[card.key] ?? null}
                />
                <span className="mt-1 block text-sm text-gray-400">
                  {card.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
