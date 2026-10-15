"use client";

import { useState } from "react";

const DEFAULT_TYPE = "ANNOUNCEMENT";

export default function NotificationSection() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState(DEFAULT_TYPE);
  const [imageUrl, setImageUrl] = useState("");
  const [androidSound, setAndroidSound] = useState("");
  const [iosSound, setIosSound] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!trimmedTitle || !trimmedBody) {
      setMessage({ kind: "err", text: "Title and body are required." });
      return;
    }

    const data: Record<string, string> = {};
    if (imageUrl.trim()) data.imageUrl = imageUrl.trim();
    if (androidSound.trim()) data.androidSound = androidSound.trim();
    if (iosSound.trim()) data.iosSound = iosSound.trim();

    try {
      setSubmitting(true);
      const res = await fetch("/api/notifications/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: trimmedTitle,
          body: trimmedBody,
          type: type.trim() || DEFAULT_TYPE,
          ...(Object.keys(data).length > 0 ? { data } : {}),
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errText =
          (typeof json?.message === "string" && json.message) ||
          (typeof json?.error === "string" && json.error) ||
          "Broadcast failed.";
        setMessage({ kind: "err", text: errText });
        return;
      }

      setMessage({
        kind: "ok",
        text:
          (typeof json?.message === "string" && json.message) ||
          "Notification broadcast to all users.",
      });
    } catch {
      setMessage({ kind: "err", text: "Network error. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">
        Broadcast notification
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Sends a push notification to all users. Uses your admin session (same as other
        API routes).
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="notif-title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Title
          </label>
          <input
            id="notif-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-white placeholder:text-zinc-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
            placeholder="New drop"
            disabled={submitting}
          />
        </div>

        <div>
          <label
            htmlFor="notif-body"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Body
          </label>
          <textarea
            id="notif-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-white placeholder:text-zinc-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
            placeholder="Check out the latest update."
            disabled={submitting}
          />
        </div>

        <div>
          <label
            htmlFor="notif-type"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Type
          </label>
          <input
            id="notif-type"
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-white placeholder:text-zinc-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
            placeholder={DEFAULT_TYPE}
            disabled={submitting}
          />
        </div>

        <fieldset className="border border-zinc-700 rounded-lg p-4 space-y-4">
          <legend className="px-1 text-sm text-gray-400">Optional payload (data)</legend>
          <div>
            <label
              htmlFor="notif-image"
              className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
            >
              Image URL
            </label>
            <input
              id="notif-image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
              placeholder="https://…"
              disabled={submitting}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="notif-android-sound"
                className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
              >
                Android sound
              </label>
              <input
                id="notif-android-sound"
                type="text"
                value={androidSound}
                onChange={(e) => setAndroidSound(e.target.value)}
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                placeholder="promo"
                disabled={submitting}
              />
            </div>
            <div>
              <label
                htmlFor="notif-ios-sound"
                className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
              >
                iOS sound
              </label>
              <input
                id="notif-ios-sound"
                type="text"
                value={iosSound}
                onChange={(e) => setIosSound(e.target.value)}
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                placeholder="promo.caf"
                disabled={submitting}
              />
            </div>
          </div>
        </fieldset>

        {message && (
          <p
            className={
              message.kind === "ok"
                ? "text-green-600 dark:text-green-400 text-sm"
                : "text-red-600 dark:text-red-400 text-sm"
            }
            role="alert"
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-white px-4 py-2.5 font-medium text-black hover:bg-zinc-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Sending…" : "Send to all users"}
        </button>
      </form>
    </div>
  );
}
