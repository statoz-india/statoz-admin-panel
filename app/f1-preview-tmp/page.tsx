"use client";
import F1StatsCharts from "@/app/components/motorsportMatches/F1StatsCharts";
import type { F1RaceSummary } from "@/app/models/f1-race-stats.model";
import sample from "./sample.json";
export default function Preview() {
  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-6xl rounded-lg border border-zinc-700 bg-zinc-900 p-6">
        <F1StatsCharts summary={sample as unknown as F1RaceSummary} />
      </div>
    </div>
  );
}
