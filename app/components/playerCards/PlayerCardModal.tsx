"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import {
  CARD_TYPES,
  FOOTBALL_POSITIONS,
  PLAYER_TYPES,
  SPORTS,
  type CreatePlayerCardInput,
  type PlayerCard,
} from "@/app/interface/player-card.interface";
import { cardsApi } from "./cards-api";

interface PlayerCardModalProps {
  /** When provided the modal edits this card; otherwise it creates a new one. */
  card?: PlayerCard;
  onClose: () => void;
  onSaved: (card: PlayerCard) => void;
}

export default function PlayerCardModal({
  card,
  onClose,
  onSaved,
}: PlayerCardModalProps) {
  const isEdit = Boolean(card);

  const [playerId, setPlayerId] = useState(card?.playerId ?? "");
  const [name, setName] = useState(card?.name ?? "");
  const [shortName, setShortName] = useState(card?.shortName ?? "");
  const [image, setImage] = useState(card?.image ?? "");
  const [team, setTeam] = useState(card?.team ?? "");
  const [teamAbbreviation, setTeamAbbreviation] = useState(
    card?.teamAbbreviation ?? "",
  );
  const [sport, setSport] = useState<string>(card?.sport ?? SPORTS[0]);
  const [ratings, setRatings] = useState(
    card?.ratings != null ? String(card.ratings) : "",
  );
  const [coinValue, setCoinValue] = useState(
    card?.coinValue != null ? String(card.coinValue) : "",
  );
  const [cardType, setCardType] = useState<string>(
    card?.cardType ?? CARD_TYPES[0],
  );
  const [position, setPosition] = useState<string>(
    card?.position ?? FOOTBALL_POSITIONS[0],
  );
  const [playerType, setPlayerType] = useState<string>(card?.playerType ?? "");
  const [trait, setTrait] = useState(card?.trait ?? "");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const ratingNum = Number(ratings);
    if (!ratings.trim() || !Number.isFinite(ratingNum) || ratingNum < 0) {
      setError("Ratings must be a number ≥ 0.");
      return;
    }
    const coinValueNum = Number(coinValue);
    if (
      !coinValue.trim() ||
      !Number.isFinite(coinValueNum) ||
      coinValueNum < 0
    ) {
      setError("Coin value must be a number ≥ 0.");
      return;
    }
    if (
      !playerId.trim() ||
      !name.trim() ||
      !image.trim() ||
      !team.trim() ||
      !teamAbbreviation.trim()
    ) {
      setError(
        "Player ID, name, image, team and team abbreviation are required.",
      );
      return;
    }

    const payload: CreatePlayerCardInput = {
      playerId: playerId.trim(),
      name: name.trim(),
      image: image.trim(),
      team: team.trim(),
      teamAbbreviation: teamAbbreviation.trim(),
      sport: sport as CreatePlayerCardInput["sport"],
      ratings: ratingNum,
      coinValue: coinValueNum,
      cardType: cardType as CreatePlayerCardInput["cardType"],
      position,
    };
    if (shortName.trim()) payload.shortName = shortName.trim();
    if (playerType)
      payload.playerType = playerType as CreatePlayerCardInput["playerType"];
    if (trait.trim()) payload.trait = trait.trim();

    try {
      setSubmitting(true);
      const saved =
        isEdit && card
          ? await cardsApi.updatePlayerCard(card._id, payload)
          : await cardsApi.createPlayerCard(payload);
      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save card.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950">
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 p-5">
          <h3 className="text-lg font-semibold text-white">
            {isEdit ? "Edit player card" : "Create player card"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && (
            <div className="rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Player ID" required>
              <input
                type="text"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                placeholder="mbappe-1"
                className={inputClass}
              />
            </Field>
            <Field label="Name" required>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Kylian Mbappé"
                className={inputClass}
              />
            </Field>
            <Field label="Short name">
              <input
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="Mbappé"
                className={inputClass}
              />
            </Field>
            <Field label="Team" required>
              <input
                type="text"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="Real Madrid"
                className={inputClass}
              />
            </Field>
            <Field label="Team abbreviation" required>
              <input
                type="text"
                value={teamAbbreviation}
                onChange={(e) => setTeamAbbreviation(e.target.value)}
                placeholder="RMA"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Image URL" required>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://…/card.png"
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Sport" required>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className={inputClass}
              >
                {SPORTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Card type" required>
              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                className={inputClass}
              >
                {CARD_TYPES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Position" required>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className={inputClass}
              >
                {FOOTBALL_POSITIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Player type" hint="Needed for starter-pack pools.">
              <select
                value={playerType}
                onChange={(e) => setPlayerType(e.target.value)}
                className={inputClass}
              >
                <option value="">—</option>
                {PLAYER_TYPES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Ratings" required>
              <input
                type="number"
                min={0}
                value={ratings}
                onChange={(e) => setRatings(e.target.value)}
                placeholder="91"
                className={inputClass}
              />
            </Field>
            <Field label="Coin value" required>
              <input
                type="number"
                min={0}
                value={coinValue}
                onChange={(e) => setCoinValue(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="10"
                className={inputClass}
              />
            </Field>
            <Field label="Trait">
              <input
                type="text"
                value={trait}
                onChange={(e) => setTrait(e.target.value)}
                placeholder="Speedster"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isEdit ? "Save changes" : "Create card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </label>
  );
}
