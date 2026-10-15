"use client";

import { useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";
import type { UserClubAndTeams as UserClubAndTeamsEntry } from "@/app/api/users/[id]/userDataForAdmin/route";
import type { Team } from "@/app/api/tournament/teams/route";
import type { Tournament } from "@/app/models/tournament.model";

interface ResolvedEntry {
  tournamentId: string;
  tournament?: Tournament;
  teams: { id: string; team?: Team }[];
}

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.success === false) {
    throw new Error(body?.message || "Request failed");
  }
  return body?.data;
}

function asArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  const nested = (data as { data?: unknown } | null)?.data;
  return Array.isArray(nested) ? (nested as T[]) : [];
}

/**
 * The user's followed tournaments and picked teams. The user record only holds
 * ids, so the tournament list is fetched once and each tournament's teams are
 * fetched by its code; anything that can't be matched is shown as its raw id.
 */
export default function UserClubAndTeams({
  entries,
}: {
  entries: UserClubAndTeamsEntry[];
}) {
  const [resolved, setResolved] = useState<ResolvedEntry[] | null>(null);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      let tournaments: Tournament[] = [];
      try {
        tournaments = asArray<Tournament>(
          await getJson("/api/tournament/getAllTournamentAndDetails"),
        );
      } catch {
        if (!cancelled) {
          setWarning("Couldn’t load tournaments, so ids are shown instead.");
        }
      }
      const tournamentById = new Map(tournaments.map((t) => [t._id, t]));

      let teamsFailed = false;
      const result = await Promise.all(
        entries.map(async (entry): Promise<ResolvedEntry> => {
          const tournament = tournamentById.get(entry.tournament);
          let teamById = new Map<string, Team>();
          if (tournament?.tournament) {
            try {
              const teams = asArray<Team>(
                await getJson(
                  `/api/tournament/teams?tournament=${encodeURIComponent(tournament.tournament)}`,
                ),
              );
              teamById = new Map(teams.map((t) => [t._id, t]));
            } catch {
              teamsFailed = true;
            }
          }
          return {
            tournamentId: entry.tournament,
            tournament,
            teams: entry.teams.map((id) => ({ id, team: teamById.get(id) })),
          };
        }),
      );

      if (cancelled) return;
      if (teamsFailed) {
        setWarning(
          (current) =>
            current || "Some teams couldn’t be loaded, so their ids are shown.",
        );
      }
      setResolved(result);
    };

    void resolve();
    return () => {
      cancelled = true;
    };
  }, [entries]);

  if (entries.length === 0) {
    return <p className="text-sm text-gray-500">No clubs or teams picked.</p>;
  }

  if (!resolved) {
    return (
      <div className="flex items-center justify-center py-6">
        <Atom color="#5CDFFF" size="small" text="" textColor="" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {warning && <p className="text-xs text-amber-300">{warning}</p>}
      {resolved.map(({ tournamentId, tournament, teams }) => (
        <div
          key={tournamentId}
          className="rounded-lg border border-zinc-700 bg-zinc-800/60 p-4"
        >
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span
              className="rounded px-2 py-0.5 text-sm font-bold"
              style={{
                backgroundColor: tournament?.primaryColor ?? "#3f3f46",
                color: tournament?.textColor ?? "#ffffff",
              }}
            >
              {tournament?.tournament ?? tournamentId}
            </span>
            {tournament?.tournamentName && (
              <span className="text-sm text-white">
                {tournament.tournamentName}
                {tournament.tournamentYear
                  ? ` (${tournament.tournamentYear})`
                  : ""}
              </span>
            )}
            <span className="text-xs text-gray-500">
              {teams.length} team{teams.length === 1 ? "" : "s"}
            </span>
          </div>
          {teams.length === 0 ? (
            <p className="text-sm text-gray-500">No teams picked.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {teams.map(({ id, team }) =>
                team ? (
                  <span
                    key={id}
                    title={id}
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: team.primaryColor || "#3f3f46",
                      color: team.textColor || "#ffffff",
                    }}
                  >
                    {team.displayName || team.name}
                  </span>
                ) : (
                  <span
                    key={id}
                    title="Team not found in this tournament"
                    className="rounded-full border border-dashed border-zinc-600 px-3 py-1 font-mono text-xs text-gray-400"
                  >
                    {id}
                  </span>
                ),
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
