"use client";

import { useState, FormEvent } from "react";
import { GAME_TYPE_OPTIONS, GameType } from "@/app/constants/game-type";
import type {
  CreateGamePayload,
  Game,
  UpdateGamePayload,
} from "@/app/interface/game-catalog.interface";
import { gamesApi } from "./statoz-games-api";

interface GameFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** The game to edit. Leave out to create a new game. */
  game?: Game | null;
}

interface GameFormData {
  title: string;
  subtitle: string;
  key: string;
  gameType: "" | GameType;
  isQuickPlay: boolean;
  isLive: boolean;
  message: string;
}

const EMPTY_FORM: GameFormData = {
  title: "",
  subtitle: "",
  key: "",
  gameType: "",
  isQuickPlay: false,
  isLive: false,
  message: "",
};

const INPUT_CLASS =
  "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white";
const LABEL_CLASS =
  "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

function formFromGame(game: Game): GameFormData {
  return {
    title: game.title,
    subtitle: game.subtitle,
    key: game.key,
    gameType: game.gameType,
    isQuickPlay: game.isQuickPlay,
    isLive: game.isLive,
    message: game.message ?? "",
  };
}

/** Only the fields that differ from `game`, so the update leaves the rest alone. */
function changedFields(game: Game, form: GameFormData): UpdateGamePayload {
  const patch: UpdateGamePayload = {};
  const title = form.title.trim();
  const subtitle = form.subtitle.trim();
  const key = form.key.trim();
  // A blank message is sent as null, which clears it.
  const message = form.message.trim() || null;

  if (title !== game.title) patch.title = title;
  if (subtitle !== game.subtitle) patch.subtitle = subtitle;
  if (key !== game.key) patch.key = key;
  if (form.gameType && form.gameType !== game.gameType) {
    patch.gameType = form.gameType;
  }
  if (form.isQuickPlay !== game.isQuickPlay) {
    patch.isQuickPlay = form.isQuickPlay;
  }
  if (form.isLive !== game.isLive) patch.isLive = form.isLive;
  if (message !== (game.message || null)) patch.message = message;

  return patch;
}

export default function GameFormModal({
  isOpen,
  onClose,
  onSuccess,
  game,
}: GameFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<GameFormData>(() =>
    game ? formFromGame(game) : EMPTY_FORM,
  );

  if (!isOpen) return null;

  const patch = game ? changedFields(game, formData) : null;
  const hasChanges = !patch || Object.keys(patch).length > 0;

  const handleClose = () => {
    setError("");
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const title = formData.title.trim();
    const subtitle = formData.subtitle.trim();
    const key = formData.key.trim();

    if (!title || !subtitle || !key) {
      setError("Title, subtitle and key are required");
      return;
    }
    if (!formData.gameType) {
      setError("Please select game type");
      return;
    }

    setLoading(true);
    try {
      if (game && patch) {
        await gamesApi.updateGame(game._id, patch);
      } else {
        const payload: CreateGamePayload = {
          title,
          subtitle,
          key,
          gameType: formData.gameType,
          isQuickPlay: formData.isQuickPlay,
          isLive: formData.isLive,
        };
        // A blank message is left out so the backend stores its default (null).
        if (formData.message.trim()) {
          payload.message = formData.message.trim();
        }
        await gamesApi.createGame(payload);
        setFormData(EMPTY_FORM);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : game
            ? "Failed to update game"
            : "Failed to create game",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            {game ? "Edit Game" : "Create New Game"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="col-span-2">
              <label className={LABEL_CLASS}>Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Penalty Shootout"
                className={INPUT_CLASS}
              />
            </div>
            <div className="col-span-2">
              <label className={LABEL_CLASS}>Subtitle *</label>
              <input
                type="text"
                required
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                placeholder="e.g. Beat the keeper in 5 kicks"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Key *</label>
              <input
                type="text"
                required
                value={formData.key}
                onChange={(e) =>
                  setFormData({ ...formData, key: e.target.value })
                }
                placeholder="e.g. penalty-shootout"
                className={INPUT_CLASS}
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be unique across all games.
              </p>
            </div>
            <div>
              <label className={LABEL_CLASS}>Game Type *</label>
              <select
                required
                value={formData.gameType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gameType: e.target.value as GameFormData["gameType"],
                  })
                }
                className={INPUT_CLASS}
              >
                <option value="">-- Select game type --</option>
                {GAME_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              {patch?.gameType && (
                <p className="mt-1 text-xs text-amber-500">
                  Moves this game to the end of the {patch.gameType} order.
                </p>
              )}
            </div>
            <div className="col-span-2">
              <label className={LABEL_CLASS}>
                Message{" "}
                <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder={
                  game ? "Leave blank to clear the message" : "e.g. New!"
                }
                className={INPUT_CLASS}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={formData.isQuickPlay}
                onChange={(e) =>
                  setFormData({ ...formData, isQuickPlay: e.target.checked })
                }
                className="h-4 w-4"
              />
              Quick play
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={formData.isLive}
                onChange={(e) =>
                  setFormData({ ...formData, isLive: e.target.checked })
                }
                className="h-4 w-4"
              />
              Live
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !hasChanges}
              title={hasChanges ? undefined : "No changes to save"}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {game
                ? loading
                  ? "Saving..."
                  : "Save changes"
                : loading
                  ? "Creating..."
                  : "Create Game"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
