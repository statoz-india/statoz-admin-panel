"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  Check,
  Laptop,
  Loader2,
  LogOut,
  MonitorSmartphone,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import { redirectToLogin } from "@/app/api/utils/clearAuthStore";
import type { DeviceSession } from "@/app/interface/session.interface";
import { ApiRequestError, apiRequest } from "@/app/utils/apiRequest";
import { clearBrowserStorage } from "@/app/utils/session";

/** A signed-out device's access token keeps working until it expires. */
const LATE_NOTICE = "up to 15 minutes, until its current access token expires";

const devicesApi = {
  list: async (): Promise<DeviceSession[]> => {
    const data = await apiRequest<DeviceSession[]>(
      "/api/sessions",
      { method: "GET" },
      "Failed to load signed-in devices",
    );
    return Array.isArray(data) ? data : [];
  },
  signOut: (sessionId: string) =>
    apiRequest<unknown>(
      `/api/sessions/${encodeURIComponent(sessionId)}`,
      { method: "DELETE" },
      "Failed to sign the device out",
    ),
  signOutOthers: () =>
    apiRequest<unknown>(
      "/api/logout-all",
      { method: "POST", body: JSON.stringify({ keepCurrent: true }) },
      "Failed to sign out the other devices",
    ),
  signOutEverywhere: () =>
    apiRequest<unknown>(
      "/api/logout-all",
      { method: "POST", body: JSON.stringify({}) },
      "Failed to sign out everywhere",
    ),
};

type PendingAction =
  | { kind: "device"; session: DeviceSession }
  | { kind: "others" }
  | { kind: "everywhere" };

function deviceLabel(session: DeviceSession): string {
  return session.deviceName?.trim() || "Unknown device";
}

function errorMessage(e: unknown, fallback: string): string {
  if (e instanceof ApiRequestError && e.status === 403) {
    return "This account doesn't have admin access.";
  }
  return e instanceof Error ? e.message : fallback;
}

function formatWhen(iso: string | undefined): {
  relative: string;
  absolute: string;
} {
  const date = iso ? new Date(iso) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return { relative: "—", absolute: "" };
  }
  return {
    relative: formatDistanceToNow(date, { addSuffix: true }),
    absolute: date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    }),
  };
}

export default function DevicesSection() {
  const router = useRouter();
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [working, setWorking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSessions(await devicesApi.list());
    } catch (e) {
      setError(errorMessage(e, "Failed to load signed-in devices"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  const confirm = async () => {
    if (!pending) return;
    setWorking(true);
    setError(null);
    try {
      if (pending.kind === "device") {
        await devicesApi.signOut(pending.session._id);
        setSessions((prev) => prev.filter((s) => s._id !== pending.session._id));
        setNotice(
          `Signed out ${deviceLabel(pending.session)}. It can keep working for ${LATE_NOTICE}.`,
        );
      } else if (pending.kind === "others") {
        await devicesApi.signOutOthers();
        setSessions((prev) => prev.filter((s) => s.isCurrent));
        setNotice(
          `Signed out every other device. Each can keep working for ${LATE_NOTICE}.`,
        );
      } else {
        await devicesApi.signOutEverywhere();
        clearBrowserStorage();
        redirectToLogin(router);
        return;
      }
      setPending(null);
    } catch (e) {
      if (
        pending.kind === "device" &&
        e instanceof ApiRequestError &&
        e.status === 404
      ) {
        // Already gone: signed out elsewhere, or expired.
        setSessions((prev) => prev.filter((s) => s._id !== pending.session._id));
        setNotice("That device was already signed out.");
        setPending(null);
      } else {
        setError(errorMessage(e, "Failed to sign out"));
      }
    } finally {
      setWorking(false);
    }
  };

  const others = sessions.filter((s) => !s.isCurrent);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
            <MonitorSmartphone className="h-6 w-6 text-cyan-400" />
            Signed-in Devices
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-400">
            Every browser and phone signed in to this admin account, most
            recently used first. A device you sign out can&apos;t renew its
            session, but it can keep working for {LATE_NOTICE}.
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
          Loading signed-in devices…
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30">
            {sessions.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-gray-500">
                No signed-in devices to show.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-900 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-5 py-3">Device</th>
                      <th className="px-5 py-3">App</th>
                      <th className="px-5 py-3">IP</th>
                      <th className="px-5 py-3">Last used</th>
                      <th className="px-5 py-3">Signed in</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {sessions.map((session) => (
                      <DeviceRow
                        key={session._id}
                        session={session}
                        onSignOut={() => setPending({ kind: "device", session })}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 px-5 py-4">
            <p className="text-sm text-gray-400">
              Lost a phone, or signed in somewhere you shouldn&apos;t have?
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPending({ kind: "others" })}
                disabled={others.length === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-40"
              >
                <LogOut className="h-4 w-4" />
                Sign out all other devices
              </button>
              <button
                type="button"
                onClick={() => setPending({ kind: "everywhere" })}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
              >
                <LogOut className="h-4 w-4" />
                Sign out everywhere
              </button>
            </div>
          </section>
        </div>
      )}

      {pending && (
        <ConfirmDialog
          action={pending}
          working={working}
          onConfirm={confirm}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
}

function DeviceRow({
  session,
  onSignOut,
}: {
  session: DeviceSession;
  onSignOut: () => void;
}) {
  const lastUsed = formatWhen(session.lastUsedAt);
  const signedIn = formatWhen(session.createdAt);
  const Icon = session.platform === "web" ? Laptop : Smartphone;
  const app = [session.platform, session.appVersion].filter(Boolean).join(" · ");

  return (
    <tr className="text-gray-300">
      <td className="px-5 py-3">
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <Icon className="h-4 w-4 text-gray-500" />
          <span className="text-white">{deviceLabel(session)}</span>
          {session.isCurrent && (
            <span className="rounded-full border border-cyan-700 bg-cyan-950/50 px-2 py-0.5 text-xs text-cyan-300">
              This browser
            </span>
          )}
        </span>
      </td>
      <td className="whitespace-nowrap px-5 py-3 font-mono text-xs">
        {app || "—"}
      </td>
      <td className="whitespace-nowrap px-5 py-3 font-mono text-xs">
        {session.ip || "—"}
      </td>
      <td className="whitespace-nowrap px-5 py-3" title={lastUsed.absolute}>
        {lastUsed.relative}
      </td>
      <td className="whitespace-nowrap px-5 py-3" title={signedIn.absolute}>
        {signedIn.relative}
      </td>
      <td className="px-5 py-3 text-right">
        {/* This browser signs out with Logout. */}
        {!session.isCurrent && (
          <button
            type="button"
            onClick={onSignOut}
            aria-label={`Sign out ${deviceLabel(session)}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-gray-300 hover:border-red-800 hover:bg-red-950/50 hover:text-red-300"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        )}
      </td>
    </tr>
  );
}

function ConfirmDialog({
  action,
  working,
  onConfirm,
  onCancel,
}: {
  action: PendingAction;
  working: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { title, body, confirmLabel } =
    action.kind === "device"
      ? {
          title: `Sign out ${deviceLabel(action.session)}?`,
          body: `It can't renew its session after this, but it can keep working for ${LATE_NOTICE}.`,
          confirmLabel: "Sign out",
        }
      : action.kind === "others"
        ? {
            title: "Sign out all other devices?",
            body: `Every device except this browser. Each can keep working for ${LATE_NOTICE}.`,
            confirmLabel: "Sign out others",
          }
        : {
            title: "Sign out everywhere?",
            body: `Every device, this browser included: you'll go to the login page. The others can keep working for ${LATE_NOTICE}.`,
            confirmLabel: "Sign out everywhere",
          };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="devices-confirm-title"
        className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl"
      >
        <h3
          id="devices-confirm-title"
          className="flex items-center gap-2 text-lg font-semibold text-white"
        >
          <AlertTriangle className="h-5 w-5 text-red-400" />
          {title}
        </h3>
        <p className="mt-3 text-sm text-gray-400">{body}</p>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={working}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={working}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
          >
            {working && <Loader2 className="h-4 w-4 animate-spin" />}
            {working ? "Signing out…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
