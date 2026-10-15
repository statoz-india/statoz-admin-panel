"use client";

import { useEffect, useState } from "react";
import type { Tournament } from "@/app/models/tournament.model";

/**
 * A quiz / prediction / event's game type — from the record itself when the
 * backend sends it, otherwise from its tournament.
 */
export function useGameType(
  record: { gameType?: string | null; tournament?: string | null } | null,
): string | null {
  const direct = record?.gameType ?? null;
  const tournament = record?.tournament;
  const [fromTournament, setFromTournament] = useState<string | null>(null);

  useEffect(() => {
    if (direct || !tournament) return;
    let cancelled = false;
    fetch("/api/tournament/getAllTournamentAndDetails", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((payload) => {
        if (cancelled) return;
        const list: Tournament[] = Array.isArray(payload?.data)
          ? payload.data
          : [];
        const match = list.find(
          (t) => t.tournament?.toLowerCase() === tournament.toLowerCase(),
        );
        setFromTournament(match?.gameType ?? null);
      })
      .catch(() => {
        // No game type → no fetch-from-source panel; nothing else depends on it.
      });
    return () => {
      cancelled = true;
    };
  }, [direct, tournament]);

  return direct ?? fromTournament;
}
