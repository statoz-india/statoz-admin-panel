"use client";

import { useMemo, useState } from "react";
import { Loader2, X } from "lucide-react";
import {
  ASSET_SPORTS,
  type AssetSport,
  type CreateProfileBannerInput,
  type CreateProfilePicInput,
  type ProfileBanner,
  type ProfilePic,
} from "@/app/interface/user-asset.interface";
import { type AssetKind, userAssetsApi } from "./user-assets-api";

type CreateProfileAssetModalProps = {
  kind: AssetKind;
  teamAbbreviations?: string[];
  onClose: () => void;
  onSaved: (item: ProfilePic | ProfileBanner) => void;
};

export default function CreateProfileAssetModal({
  kind,
  teamAbbreviations = [],
  onClose,
  onSaved,
}: CreateProfileAssetModalProps) {
  const isPic = kind === "profilePic";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [team, setTeam] = useState("");
  const [teamAbbreviation, setTeamAbbreviation] = useState("");
  const [sport, setSport] = useState<AssetSport>("football");
  const [coinValue, setCoinValue] = useState("0");
  const [drop, setDrop] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = isPic ? "Create profile pic" : "Create profile banner";
  const nameLabel = isPic ? "Name (ppName)" : "Name (pbName)";
  const urlLabel = isPic ? "Image URL (ppUrl)" : "Image URL (pbUrl)";
  const coinNum = Number(coinValue);
  const isFree = Number.isFinite(coinNum) && coinNum === 0;

  const previewUrl = useMemo(() => {
    const trimmed = url.trim();
    if (!trimmed) return null;
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return trimmed;
      }
    } catch {
      return null;
    }
    return null;
  }, [url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError(isPic ? "ppName is required." : "pbName is required.");
      return;
    }
    if (!url.trim()) {
      setError(isPic ? "ppUrl is required." : "pbUrl is required.");
      return;
    }
    if (!team.trim()) {
      setError("team is required.");
      return;
    }
    if (!teamAbbreviation.trim()) {
      setError("teamAbbreviation is required.");
      return;
    }
    if (!Number.isFinite(coinNum) || coinNum < 0) {
      setError("coinValue must be a non-negative number.");
      return;
    }

    const shared = {
      team: team.trim(),
      teamAbbreviation: teamAbbreviation.trim().toUpperCase(),
      sport,
      coinValue: coinNum,
      ...(drop.trim() ? { drop: drop.trim() } : {}),
      isVisible,
    };

    setSubmitting(true);
    try {
      if (isPic) {
        const input: CreateProfilePicInput = {
          ppName: name.trim(),
          ppUrl: url.trim(),
          ...shared,
          ...(description.trim()
            ? { ppDescription: description.trim() }
            : {}),
        };
        const created = await userAssetsApi.createProfilePic(input);
        onSaved(created);
      } else {
        const input: CreateProfileBannerInput = {
          pbName: name.trim(),
          pbUrl: url.trim(),
          ...shared,
          ...(description.trim()
            ? { pbDescription: description.trim() }
            : {}),
        };
        const created = await userAssetsApi.createProfileBanner(input);
        onSaved(created);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create asset");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-5 py-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="space-y-4 overflow-y-auto p-5"
        >
          {error && (
            <p className="rounded-md border border-red-800 bg-red-900/20 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={`${nameLabel} *`}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder={isPic ? "Arsenal Home Avatar" : "Arsenal Banner"}
                disabled={submitting}
                required
              />
            </Field>

            <Field label="Sport *">
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value as AssetSport)}
                className={inputClass}
                disabled={submitting}
                required
              >
                {ASSET_SPORTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Description (optional)">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} min-h-20 resize-y`}
              placeholder="Optional description"
              disabled={submitting}
            />
          </Field>

          <Field label={`${urlLabel} *`}>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={inputClass}
              placeholder="https://cdn.statoz.com/..."
              disabled={submitting}
              required
            />
          </Field>

          {previewUrl && (
            <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950">
              <p className="border-b border-zinc-800 px-3 py-2 text-xs text-gray-400">
                Image preview
              </p>
              <div
                className={`relative w-full ${
                  isPic ? "aspect-square max-h-48" : "aspect-video max-h-40"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Team *">
              <input
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className={inputClass}
                placeholder="Arsenal"
                disabled={submitting}
                required
              />
            </Field>

            <Field label="Team abbreviation *">
              <input
                value={teamAbbreviation}
                onChange={(e) => setTeamAbbreviation(e.target.value)}
                onBlur={() =>
                  setTeamAbbreviation((v) => v.trim().toUpperCase())
                }
                className={inputClass}
                placeholder="ARS"
                list="team-abbr-suggestions"
                disabled={submitting}
                required
              />
              {teamAbbreviations.length > 0 && (
                <datalist id="team-abbr-suggestions">
                  {teamAbbreviations.map((abbr) => (
                    <option key={abbr} value={abbr} />
                  ))}
                </datalist>
              )}
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Coin value *">
              <input
                type="number"
                min={0}
                step={1}
                value={coinValue}
                onChange={(e) => setCoinValue(e.target.value)}
                className={inputClass}
                disabled={submitting}
                required
              />
              {isFree && (
                <p className="mt-1 text-xs text-green-400">
                  Free item — will show with isFree: true
                </p>
              )}
            </Field>

            <Field label="Drop (optional)">
              <input
                value={drop}
                onChange={(e) => setDrop(e.target.value)}
                className={inputClass}
                placeholder="fifa-2026"
                disabled={submitting}
              />
            </Field>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2.5">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              disabled={submitting}
              className="h-4 w-4 rounded border-zinc-600"
            />
            <span className="text-sm text-gray-300">
              Visible in shop
              {!isVisible && (
                <span className="ml-2 text-amber-400">(Hidden from purchase)</span>
              )}
            </span>
          </label>

          <p className="text-xs text-gray-500">
            {isPic ? "ppId" : "pbId"} is auto-generated on the server. Send
            coinValue as a number, not a string.
          </p>

          <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-md border border-zinc-600 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-300">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600";
