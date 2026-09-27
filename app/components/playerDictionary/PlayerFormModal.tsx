"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Team } from "@/app/api/tournament/teams/route";
import type { Tournament } from "@/app/models/tournament.model";
import type {
  CreatePlayerPayload,
  Player,
  UpdatePlayerPayload,
} from "@/app/models/player.model";
import { apiRequest, ApiRequestError } from "@/app/utils/apiRequest";
import { isValidSeason } from "@/app/utils/team-season";
import { getTeamSeasonOptions } from "@/app/utils/team-season-options";

interface SeasonRow {
  /** Stable React key — rows are added, removed and edited in place. */
  key: string;
  teamId: string;
  season: string;
}

interface ImageRow {
  key: string;
  url: string;
}

interface FormState {
  playerName: string;
  playerAbbreviation: string;
  playerCode: string;
  tournamentId: string;
  rows: SeasonRow[];
  images: ImageRow[];
  description: string;
}

interface PlayerFormModalProps {
  /** The player being edited; omit to create a new one. */
  player?: Player | null;
  tournaments: Tournament[];
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}

const INPUT_CLASS =
  "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-60";
const LABEL_CLASS = "block text-sm font-medium text-gray-300 mb-2";

function sameList(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((item, i) => item === b[i]);
}

/** One form for both create and edit. Mount it only while open. */
export default function PlayerFormModal({
  player,
  tournaments,
  onClose,
  onSaved,
}: PlayerFormModalProps) {
  const isEdit = Boolean(player);
  const keyCounter = useRef(0);
  const nextKey = () => String(++keyCounter.current);

  const [form, setForm] = useState<FormState>(() => ({
    playerName: player?.playerName ?? "",
    playerAbbreviation: player?.playerAbbreviation ?? "",
    playerCode: player?.playerCode ?? "",
    tournamentId: player?.tournamentId ?? "",
    rows:
      player && player.seasonYear.length > 0
        ? player.seasonYear.map((entry) => ({
            key: nextKey(),
            // Responses carry the expanded team; requests want just its id.
            teamId: entry.team?._id ?? "",
            season: entry.season,
          }))
        : [{ key: nextKey(), teamId: "", season: getTeamSeasonOptions("")[0] }],
    images: (player?.playerImage ?? []).map((url) => ({
      key: nextKey(),
      url,
    })),
    description: player?.description ?? "",
  }));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [teamsError, setTeamsError] = useState("");
  // Guards against an older, slower request overwriting a newer one.
  const teamsRequestRef = useRef(0);

  const tournament = tournaments.find((t) => t._id === form.tournamentId);
  const code = tournament?.tournament ?? "";

  /** The player's own teams stay selectable even if the fetched list lacks them. */
  const knownTeams = new Map(
    (player?.seasonYear ?? []).flatMap((entry) =>
      entry.team ? [[entry.team._id, entry.team] as const] : [],
    ),
  );

  const loadTeams = useCallback(async (tournamentCode: string) => {
    const requestId = ++teamsRequestRef.current;
    if (!tournamentCode) {
      setTeams([]);
      setTeamsError("");
      setTeamsLoading(false);
      return;
    }
    setTeamsLoading(true);
    setTeamsError("");
    try {
      const list = await apiRequest<Team[]>(
        `/api/tournament/teams?tournament=${encodeURIComponent(tournamentCode)}`,
        { method: "GET" },
        "Failed to load teams",
      );
      if (teamsRequestRef.current !== requestId) return;
      setTeams(Array.isArray(list) ? list : []);
    } catch (err) {
      if (teamsRequestRef.current !== requestId) return;
      setTeams([]);
      setTeamsError(
        err instanceof Error ? err.message : "Failed to load teams",
      );
    } finally {
      if (teamsRequestRef.current === requestId) setTeamsLoading(false);
    }
  }, []);

  // Runs on open and whenever the chosen tournament changes.
  useEffect(() => {
    loadTeams(code);
  }, [loadTeams, code]);

  const changeTournament = (tournamentId: string) => {
    const nextCode =
      tournaments.find((t) => t._id === tournamentId)?.tournament ?? "";
    setForm((current) => ({
      ...current,
      tournamentId,
      // Teams belong to a tournament, so the old picks can't carry over.
      rows: [
        {
          key: nextKey(),
          teamId: "",
          season: getTeamSeasonOptions(nextCode)[0],
        },
      ],
    }));
  };

  const updateRow = (key: string, patch: Partial<SeasonRow>) =>
    setForm((current) => ({
      ...current,
      rows: current.rows.map((row) =>
        row.key === key ? { ...row, ...patch } : row,
      ),
    }));

  const addRow = () =>
    setForm((current) => {
      const last = current.rows[current.rows.length - 1];
      return {
        ...current,
        rows: [
          ...current.rows,
          {
            key: nextKey(),
            teamId: "",
            season: last?.season ?? getTeamSeasonOptions(code)[0],
          },
        ],
      };
    });

  const removeRow = (key: string) =>
    setForm((current) => ({
      ...current,
      rows: current.rows.filter((row) => row.key !== key),
    }));

  const updateImage = (key: string, url: string) =>
    setForm((current) => ({
      ...current,
      images: current.images.map((image) =>
        image.key === key ? { ...image, url } : image,
      ),
    }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const problems: string[] = [];
    const playerName = form.playerName.trim();
    if (!playerName) problems.push("Player name is required");
    if (!form.tournamentId) problems.push("Tournament is required");
    if (form.rows.length === 0)
      problems.push("Add at least one team and season");
    form.rows.forEach((row, index) => {
      if (!row.teamId) problems.push(`Row ${index + 1}: pick a team`);
      if (!isValidSeason(row.season)) {
        problems.push(
          `Row ${index + 1}: season must look like 2026 or 2026/27`,
        );
      }
    });
    if (problems.length > 0) {
      setErrors(problems);
      return;
    }

    const seasonYear = form.rows.map((row) => ({
      team: row.teamId,
      season: row.season,
    }));
    const playerImage = form.images
      .map((image) => image.url.trim())
      .filter(Boolean);
    const description = form.description.trim();
    const playerAbbreviation = form.playerAbbreviation.trim();
    const playerCode = form.playerCode.trim();

    let payload: CreatePlayerPayload | UpdatePlayerPayload;

    if (player) {
      // Edit: send only what changed. `seasonYear` and `playerImage` replace
      // the whole list on the backend, so a change sends the full new list.
      const update: UpdatePlayerPayload = {};
      if (playerName !== player.playerName) update.playerName = playerName;
      if (playerAbbreviation !== (player.playerAbbreviation ?? "").trim()) {
        update.playerAbbreviation = playerAbbreviation || null;
      }
      if (playerCode !== (player.playerCode ?? "").trim()) {
        update.playerCode = playerCode || null;
      }
      if (description !== (player.description ?? "").trim()) {
        update.description = description || null;
      }
      if (!sameList(playerImage, player.playerImage)) {
        update.playerImage = playerImage;
      }

      const tournamentChanged = form.tournamentId !== player.tournamentId;
      if (tournamentChanged) update.tournamentId = form.tournamentId;

      const entryKey = (team: string, season: string) => `${team}|${season}`;
      const originalEntries = player.seasonYear.map((entry) =>
        entryKey(entry.team?._id ?? "", entry.season),
      );
      const nextEntries = seasonYear.map((entry) =>
        entryKey(entry.team, entry.season),
      );
      // Moving tournaments re-checks every team, so the rows must go with it.
      if (tournamentChanged || !sameList(nextEntries, originalEntries)) {
        update.seasonYear = seasonYear;
      }

      if (Object.keys(update).length === 0) {
        setErrors(["Nothing has changed."]);
        return;
      }
      payload = update;
    } else {
      payload = {
        tournamentId: form.tournamentId,
        playerName,
        ...(playerAbbreviation ? { playerAbbreviation } : {}),
        ...(playerCode ? { playerCode } : {}),
        seasonYear,
        playerImage,
        ...(description ? { description } : {}),
      };
    }

    setLoading(true);
    try {
      await apiRequest(
        player
          ? `/api/player-dictionary/${encodeURIComponent(player._id)}`
          : "/api/player-dictionary",
        {
          method: player ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        },
        `Failed to ${player ? "update" : "create"} the player`,
      );
      await onSaved();
    } catch (err) {
      setErrors(
        err instanceof ApiRequestError && err.errors.length > 0
          ? err.errors
          : [
              err instanceof Error
                ? err.message
                : `Failed to ${player ? "update" : "create"} the player`,
            ],
      );
    } finally {
      setLoading(false);
    }
  };

  const teamPickDisabled = !form.tournamentId || teamsLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-zinc-900">
        <div className="border-b border-zinc-800 p-6">
          <h2 className="text-2xl font-bold text-white">
            {isEdit ? "Edit player" : "Add player"}
          </h2>
          {player && (
            <p className="mt-1 text-sm text-gray-400">Mongo ID: {player._id}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.length > 0 && (
            <div className="mb-4 rounded-lg border border-red-800 bg-red-900/20 p-4">
              {errors.length === 1 ? (
                <p className="text-sm text-red-400">{errors[0]}</p>
              ) : (
                <ul className="list-inside list-disc space-y-1 text-sm text-red-400">
                  {errors.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={LABEL_CLASS}>Player name *</label>
              <input
                type="text"
                value={form.playerName}
                onChange={(e) =>
                  setForm((c) => ({ ...c, playerName: e.target.value }))
                }
                className={INPUT_CLASS}
                placeholder="e.g., Max Verstappen"
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Tournament *</label>
              <select
                value={form.tournamentId}
                onChange={(e) => changeTournament(e.target.value)}
                className={INPUT_CLASS}
              >
                <option value="">-- Select a tournament --</option>
                {tournaments.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.tournament}
                    {t.tournamentName ? ` — ${t.tournamentName}` : ""}
                  </option>
                ))}
              </select>
              {isEdit && (
                <p className="mt-1 text-xs text-gray-500">
                  Changing the tournament resets the team and season rows —
                  teams belong to a tournament.
                </p>
              )}
            </div>
            <div>
              <label className={LABEL_CLASS}>Player abbreviation</label>
              <input
                type="text"
                value={form.playerAbbreviation}
                onChange={(e) =>
                  setForm((c) => ({ ...c, playerAbbreviation: e.target.value }))
                }
                className={INPUT_CLASS}
                placeholder="e.g., VER"
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Player code</label>
              <input
                type="text"
                value={form.playerCode}
                onChange={(e) =>
                  setForm((c) => ({ ...c, playerCode: e.target.value }))
                }
                className={INPUT_CLASS}
                placeholder="e.g., 1"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">
                Teams by season *
              </label>
              <button
                type="button"
                onClick={addRow}
                disabled={!form.tournamentId}
                className="inline-flex items-center gap-1 text-sm text-cyan-300 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
                Add row
              </button>
            </div>

            <div className="space-y-2">
              {form.rows.map((row) => {
                const known = knownTeams.get(row.teamId);
                const missingFromList =
                  row.teamId !== "" &&
                  known !== undefined &&
                  !teams.some((t) => t._id === row.teamId);
                return (
                  <div
                    key={row.key}
                    className="grid grid-cols-[2fr_1fr_auto] items-center gap-2"
                  >
                    <select
                      value={row.teamId}
                      disabled={teamPickDisabled}
                      onChange={(e) =>
                        updateRow(row.key, { teamId: e.target.value })
                      }
                      aria-label="Team"
                      className={`${INPUT_CLASS} min-w-0`}
                    >
                      <option value="">
                        {!form.tournamentId
                          ? "Pick a tournament first"
                          : teamsLoading
                            ? "Loading teams…"
                            : "-- Select a team --"}
                      </option>
                      {missingFromList && known && (
                        <option value={known._id}>
                          {known.displayName || known.name}
                        </option>
                      )}
                      {teams.map((team) => (
                        <option key={team._id} value={team._id}>
                          {team.displayName || team.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={row.season}
                      onChange={(e) =>
                        updateRow(row.key, { season: e.target.value })
                      }
                      aria-label="Season"
                      className={`${INPUT_CLASS} min-w-0`}
                    >
                      {getTeamSeasonOptions(code, [row.season]).map(
                        (season) => (
                          <option key={season} value={season}>
                            {season}
                          </option>
                        ),
                      )}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeRow(row.key)}
                      disabled={form.rows.length === 1}
                      aria-label="Remove row"
                      className="rounded p-2 text-gray-400 transition-colors hover:bg-red-900/40 hover:text-red-300 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {teamsError && (
              <p className="mt-2 text-xs text-red-400">{teamsError}</p>
            )}
            {!teamsError &&
              form.tournamentId &&
              !teamsLoading &&
              teams.length === 0 && (
                <p className="mt-2 text-xs text-amber-300">
                  This tournament has no teams yet — add some on the Teams page
                  first.
                </p>
              )}
            <p className="mt-2 text-xs text-gray-500">
              The same player can be on two teams in one season (a mid-season
              move) — add a row for each.
            </p>
          </div>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">
                Images
              </label>
              <button
                type="button"
                onClick={() =>
                  setForm((c) => ({
                    ...c,
                    images: [...c.images, { key: nextKey(), url: "" }],
                  }))
                }
                className="inline-flex items-center gap-1 text-sm text-cyan-300 hover:text-cyan-200"
              >
                <Plus className="h-4 w-4" />
                Add image URL
              </button>
            </div>
            {form.images.length === 0 ? (
              <p className="text-xs text-gray-500">No images.</p>
            ) : (
              <div className="space-y-2">
                {form.images.map((image) => (
                  <div key={image.key} className="flex items-center gap-2">
                    {/^https?:\/\//.test(image.url.trim()) && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image.url.trim()}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded object-cover"
                      />
                    )}
                    <input
                      type="text"
                      value={image.url}
                      onChange={(e) => updateImage(image.key, e.target.value)}
                      placeholder="https://cdn.example.com/player.png"
                      aria-label="Image URL"
                      className={`${INPUT_CLASS} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((c) => ({
                          ...c,
                          images: c.images.filter((i) => i.key !== image.key),
                        }))
                      }
                      aria-label="Remove image"
                      className="rounded p-2 text-gray-400 transition-colors hover:bg-red-900/40 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-gray-500">
              URLs only — files aren’t uploaded here, so host the image first.
              Blank rows are ignored.
            </p>
          </div>

          <div className="mb-6">
            <label className={LABEL_CLASS}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((c) => ({ ...c, description: e.target.value }))
              }
              rows={3}
              className={INPUT_CLASS}
              placeholder="e.g., Four-time world champion"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-md border border-zinc-600 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? isEdit
                  ? "Saving..."
                  : "Adding..."
                : isEdit
                  ? "Save changes"
                  : "Add player"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
