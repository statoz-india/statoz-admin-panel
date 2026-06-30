"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import type {
  BotUser,
  CreateBotPayload,
} from "@/app/interface/bot-user.interface";
import { botApi } from "./bot-api";

interface CreateBotModalProps {
  onClose: () => void;
  onCreated: (bot: BotUser) => void;
}

export default function CreateBotModal({
  onClose,
  onCreated,
}: CreateBotModalProps) {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [coins, setCoins] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }

    const payload: CreateBotPayload = { email: trimmedEmail };
    if (userName.trim()) payload.userName = userName.trim();
    if (avatarUrl.trim()) payload.avatarUrl = avatarUrl.trim();
    if (bannerUrl.trim()) payload.bannerUrl = bannerUrl.trim();
    if (coins.trim()) {
      const n = Number(coins);
      if (!Number.isFinite(n) || n < 0) {
        setError("Coins must be a number ≥ 0.");
        return;
      }
      payload.coins = n;
    }

    try {
      setSubmitting(true);
      const bot = await botApi.create(payload);
      onCreated(bot);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create bot.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-800 p-5">
          <h3 className="text-lg font-semibold text-white">Create bot user</h3>
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

          <Field label="Email" required>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="captaincool@statoz.in"
              className={inputClass}
            />
          </Field>

          <Field label="Username">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="CaptainCool"
              className={inputClass}
            />
          </Field>

          <Field label="Avatar URL">
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://…/avatar.png"
              className={inputClass}
            />
          </Field>

          <Field label="Banner URL">
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://…/banner.png"
              className={inputClass}
            />
          </Field>

          <Field label="Coins" hint="Defaults to 1000 if left empty.">
            <input
              type="number"
              min={0}
              value={coins}
              onChange={(e) => setCoins(e.target.value)}
              placeholder="1000"
              className={inputClass}
            />
          </Field>

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
              Create bot
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
