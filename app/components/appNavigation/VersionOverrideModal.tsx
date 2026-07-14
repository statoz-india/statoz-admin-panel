"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import type {
  AppOs,
  UpsertVersionBody,
  VersionNavigationConfig,
} from "@/app/interface/app-navigation.interface";
import {
  APP_OS,
  OS_LABELS,
  SUGGESTED_NAVBAR,
  SUGGESTED_TABS,
} from "@/app/interface/app-navigation.interface";
import OrderedListEditor from "./OrderedListEditor";

interface VersionOverrideModalProps {
  /** Existing override to edit; `null` creates a new one. */
  existing: VersionNavigationConfig | null;
  /** Overrides already saved, used to warn before overwriting on create. */
  taken: VersionNavigationConfig[];
  /** Prefilled lists when creating — the current default config. */
  initialTabs: string[];
  initialNavbar: string[];
  onSave: (payload: UpsertVersionBody) => Promise<void>;
  onClose: () => void;
}

export default function VersionOverrideModal({
  existing,
  taken,
  initialTabs,
  initialNavbar,
  onSave,
  onClose,
}: VersionOverrideModalProps) {
  const isEdit = existing !== null;

  const [os, setOs] = useState<AppOs>(existing?.os ?? "android");
  const [version, setVersion] = useState(existing?.version ?? "");
  const [tabs, setTabs] = useState<string[]>(existing?.tabs ?? initialTabs);
  const [navbar, setNavbar] = useState<string[]>(
    existing?.navbar ?? initialNavbar,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedVersion = version.trim();

  const collides =
    !isEdit &&
    trimmedVersion.length > 0 &&
    taken.some((v) => v.os === os && v.version === trimmedVersion);

  const canSave =
    trimmedVersion.length > 0 &&
    tabs.length > 0 &&
    navbar.length > 0 &&
    !saving;

  const submit = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      await onSave({ os, version: trimmedVersion, tabs, navbar });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save override");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-8">
      <div className="w-full max-w-2xl rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {isEdit ? "Edit version override" : "New version override"}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              Builds matching this OS and version get this config instead of the
              default.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-gray-500 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                OS
              </label>
              <div className="flex gap-2">
                {APP_OS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setOs(value)}
                    disabled={isEdit}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors disabled:opacity-60 ${
                      os === value
                        ? "border-cyan-500 bg-cyan-950/40 text-white"
                        : "border-zinc-700 text-gray-400 hover:bg-zinc-900"
                    }`}
                  >
                    {OS_LABELS[value]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="override-version"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400"
              >
                Version
              </label>
              <input
                id="override-version"
                type="text"
                value={version}
                disabled={isEdit}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.1.1+23"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none disabled:opacity-60"
              />
              <p className="mt-1.5 text-xs text-gray-600">
                Exact match, as reported by the build (e.g. 1.1.1+23).
              </p>
            </div>
          </div>

          {isEdit && (
            <p className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-gray-500">
              OS and version identify the override and can&apos;t be changed.
              Delete it and create a new one to target a different build.
            </p>
          )}

          {collides && (
            <p className="rounded-lg border border-amber-800 bg-amber-950/40 px-3 py-2 text-xs text-amber-300">
              An override for {OS_LABELS[os]} {trimmedVersion} already exists —
              saving will overwrite it.
            </p>
          )}

          <OrderedListEditor
            label="Tabs"
            items={tabs}
            onChange={setTabs}
            suggestions={SUGGESTED_TABS}
            placeholder="Add a tab"
            disabled={saving}
          />

          <OrderedListEditor
            label="Navbar"
            items={navbar}
            onChange={setNavbar}
            suggestions={SUGGESTED_NAVBAR}
            placeholder="Add a navbar item"
            disabled={saving}
          />

          {error && (
            <div className="rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-zinc-800 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!canSave}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create override"}
          </button>
        </div>
      </div>
    </div>
  );
}
