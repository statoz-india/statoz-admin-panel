"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Eye,
  LayoutGrid,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Smartphone,
  Trash2,
} from "lucide-react";
import type {
  AppNavigationOverview,
  AppOs,
  ResolvedNavigation,
  UpsertVersionBody,
  VersionNavigationConfig,
} from "@/app/interface/app-navigation.interface";
import {
  APP_OS,
  OS_LABELS,
  SUGGESTED_NAVBAR,
  SUGGESTED_TABS,
} from "@/app/interface/app-navigation.interface";
import { appNavigationApi } from "./app-navigation-api";
import OrderedListEditor from "./OrderedListEditor";
import VersionOverrideModal from "./VersionOverrideModal";

function sameList(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((item, i) => item === b[i]);
}

/**
 * Mirror of the app-side lookup: exact `(os, version)` override wins, otherwise
 * the default config is used.
 */
function resolveNavigation(
  overview: AppNavigationOverview,
  os: AppOs,
  version: string,
): ResolvedNavigation {
  const override = overview.versions.find(
    (v) => v.os === os && v.version === version,
  );
  if (override) {
    return {
      os,
      version,
      source: "version",
      tabs: override.tabs,
      navbar: override.navbar,
    };
  }
  return {
    os,
    version,
    source: "default",
    tabs: overview.default.tabs,
    navbar: overview.default.navbar,
  };
}

export default function AppNavigationSection() {
  const [overview, setOverview] = useState<AppNavigationOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Default config draft
  const [tabs, setTabs] = useState<string[]>([]);
  const [navbar, setNavbar] = useState<string[]>([]);
  const [savingDefault, setSavingDefault] = useState(false);

  // Version override dialogs
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<VersionNavigationConfig | null>(null);
  const [pendingDelete, setPendingDelete] =
    useState<VersionNavigationConfig | null>(null);
  const [deleting, setDeleting] = useState(false);

  const applyOverview = useCallback((data: AppNavigationOverview) => {
    setOverview(data);
    setTabs(data.default.tabs);
    setNavbar(data.default.navbar);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      applyOverview(await appNavigationApi.getOverview());
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to load app navigation config",
      );
    } finally {
      setLoading(false);
    }
  }, [applyOverview]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const defaultDirty = useMemo(() => {
    if (!overview) return false;
    return (
      !sameList(tabs, overview.default.tabs) ||
      !sameList(navbar, overview.default.navbar)
    );
  }, [overview, tabs, navbar]);

  const canSaveDefault =
    defaultDirty && tabs.length > 0 && navbar.length > 0 && !savingDefault;

  const saveDefault = async () => {
    if (!canSaveDefault) return;
    setSavingDefault(true);
    setError(null);
    try {
      const saved = await appNavigationApi.updateDefault({ tabs, navbar });
      setOverview((prev) =>
        prev
          ? { ...prev, default: { tabs: saved.tabs, navbar: saved.navbar } }
          : prev,
      );
      setTabs(saved.tabs);
      setNavbar(saved.navbar);
      setNotice("Default navigation saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save default");
    } finally {
      setSavingDefault(false);
    }
  };

  const resetDefault = () => {
    if (!overview) return;
    setTabs(overview.default.tabs);
    setNavbar(overview.default.navbar);
  };

  const saveOverride = async (payload: UpsertVersionBody) => {
    const saved = await appNavigationApi.upsertVersion(payload);
    setOverview((prev) => {
      if (!prev) return prev;
      const next = prev.versions.filter(
        (v) => !(v.os === saved.os && v.version === saved.version),
      );
      next.push(saved);
      return { ...prev, versions: next };
    });
    setModalOpen(false);
    setEditing(null);
    setNotice(
      `Override for ${OS_LABELS[payload.os]} ${payload.version} saved.`,
    );
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    setError(null);
    try {
      await appNavigationApi.deleteVersion({
        os: pendingDelete.os,
        version: pendingDelete.version,
      });
      setOverview((prev) =>
        prev
          ? {
              ...prev,
              versions: prev.versions.filter(
                (v) =>
                  !(
                    v.os === pendingDelete.os &&
                    v.version === pendingDelete.version
                  ),
              ),
            }
          : prev,
      );
      setNotice(
        `Override for ${OS_LABELS[pendingDelete.os]} ${
          pendingDelete.version
        } deleted — those builds now fall back to the default.`,
      );
      setPendingDelete(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete override");
    } finally {
      setDeleting(false);
    }
  };

  const versions = useMemo(() => {
    if (!overview) return [];
    return [...overview.versions].sort(
      (a, b) =>
        a.os.localeCompare(b.os) ||
        b.version.localeCompare(a.version, undefined, { numeric: true }),
    );
  }, [overview]);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
            <LayoutGrid className="h-6 w-6 text-cyan-400" />
            App Navigation
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Remote config for the app&apos;s tabs and navbar. A build gets its
            exact OS/version override if one exists, otherwise the default.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {notice && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-700 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
          <Check className="h-4 w-4 shrink-0" />
          {notice}
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
          Loading app navigation config…
        </div>
      ) : !overview ? (
        <div className="rounded-xl border border-zinc-800 py-16 text-center text-sm text-gray-500">
          No config loaded.
        </div>
      ) : (
        <div className="space-y-6">
          {/* ---------------- Default config ---------------- */}
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Default config
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Used by every build without a version override.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {defaultDirty && (
                  <span className="mr-1 text-xs text-amber-400">
                    Unsaved changes
                  </span>
                )}
                <button
                  type="button"
                  onClick={resetDefault}
                  disabled={!defaultDirty || savingDefault}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-40"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={saveDefault}
                  disabled={!canSaveDefault}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
                >
                  {savingDefault && <Loader2 className="h-4 w-4 animate-spin" />}
                  {savingDefault ? "Saving…" : "Save default"}
                </button>
              </div>
            </div>

            <div className="grid gap-6 px-5 py-5 md:grid-cols-2">
              <OrderedListEditor
                label="Tabs"
                items={tabs}
                onChange={setTabs}
                suggestions={SUGGESTED_TABS}
                placeholder="Add a tab"
                disabled={savingDefault}
              />
              <OrderedListEditor
                label="Navbar"
                items={navbar}
                onChange={setNavbar}
                suggestions={SUGGESTED_NAVBAR}
                placeholder="Add a navbar item"
                disabled={savingDefault}
              />
            </div>

            {(tabs.length === 0 || navbar.length === 0) && (
              <p className="border-t border-zinc-800 px-5 py-3 text-xs text-amber-400">
                Tabs and navbar must each have at least one item before saving.
              </p>
            )}
          </section>

          {/* ---------------- Version overrides ---------------- */}
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Version overrides
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  {versions.length === 0
                    ? "No overrides — every build uses the default."
                    : `${versions.length} override${
                        versions.length === 1 ? "" : "s"
                      } matched on exact OS + version.`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
              >
                <Plus className="h-4 w-4" />
                New override
              </button>
            </div>

            {versions.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-gray-500">
                Add an override to give a specific build a different set of tabs
                or navbar items.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-900 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-5 py-3">OS</th>
                      <th className="px-5 py-3">Version</th>
                      <th className="px-5 py-3">Tabs</th>
                      <th className="px-5 py-3">Navbar</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {versions.map((v) => (
                      <tr key={`${v.os}-${v.version}`} className="text-gray-300">
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-1.5">
                            <Smartphone className="h-4 w-4 text-gray-500" />
                            {OS_LABELS[v.os]}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-cyan-300">
                          {v.version}
                        </td>
                        <td className="px-5 py-3">
                          <ChipList items={v.tabs} />
                        </td>
                        <td className="px-5 py-3">
                          <ChipList items={v.navbar} />
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditing(v);
                                setModalOpen(true);
                              }}
                              aria-label={`Edit ${OS_LABELS[v.os]} ${v.version}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-gray-300 hover:bg-zinc-800"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDelete(v)}
                              aria-label={`Delete ${OS_LABELS[v.os]} ${
                                v.version
                              }`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-gray-300 hover:border-red-800 hover:bg-red-950/50 hover:text-red-300"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ---------------- Preview ---------------- */}
          <PreviewPanel overview={overview} />
        </div>
      )}

      {modalOpen && overview && (
        <VersionOverrideModal
          existing={editing}
          taken={overview.versions}
          initialTabs={overview.default.tabs}
          initialNavbar={overview.default.navbar}
          onSave={saveOverride}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      )}

      {pendingDelete && (
        <DeleteOverrideDialog
          target={pendingDelete}
          deleting={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Preview                                                             */
/* ------------------------------------------------------------------ */

function PreviewPanel({ overview }: { overview: AppNavigationOverview }) {
  const [os, setOs] = useState<AppOs>("android");
  const [version, setVersion] = useState("");

  const trimmed = version.trim();
  const resolved = trimmed ? resolveNavigation(overview, os, trimmed) : null;

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/30">
      <div className="border-b border-zinc-800 px-5 py-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Eye className="h-5 w-5 text-cyan-400" />
          Preview what a build gets
        </h3>
        <p className="mt-0.5 text-xs text-gray-500">
          Resolved from the config above using the same lookup the app does.
        </p>
      </div>

      <div className="space-y-4 px-5 py-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {APP_OS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setOs(value)}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                  os === value
                    ? "border-cyan-500 bg-cyan-950/40 text-white"
                    : "border-zinc-700 text-gray-400 hover:bg-zinc-900"
                }`}
              >
                {OS_LABELS[value]}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="1.1.1+23"
            className="w-48 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-white placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none"
          />
          {resolved && (
            <span
              className={`inline-block rounded-full border px-2.5 py-1 text-xs ${
                resolved.source === "version"
                  ? "border-cyan-700 bg-cyan-950/50 text-cyan-300"
                  : "border-zinc-700 bg-zinc-800 text-gray-300"
              }`}
            >
              {resolved.source === "version"
                ? "Version override"
                : "Falls back to default"}
            </span>
          )}
        </div>

        {resolved ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <PreviewList label="Tabs" items={resolved.tabs} />
            <PreviewList label="Navbar" items={resolved.navbar} />
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            Enter a version to see what that build resolves to.
          </p>
        )}
      </div>
    </section>
  );
}

function PreviewList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <ol className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-sm text-white"
          >
            <span className="mr-1.5 text-xs text-gray-600">{index + 1}</span>
            {item}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-xs text-gray-300"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function DeleteOverrideDialog({
  target,
  deleting,
  onConfirm,
  onCancel,
}: {
  target: VersionNavigationConfig;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          Delete override?
        </h3>
        <p className="mt-3 text-sm text-gray-400">
          <span className="font-medium text-white">
            {OS_LABELS[target.os]} {target.version}
          </span>{" "}
          will fall back to the default config. This can&apos;t be undone.
        </p>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
          >
            {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
