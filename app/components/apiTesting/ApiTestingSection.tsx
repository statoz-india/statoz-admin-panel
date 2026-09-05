"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Send, TerminalSquare, Trash2 } from "lucide-react";
import { Atom } from "react-loading-indicators";
import { parseCurl, type ParsedCurl } from "@/app/utils/curl-parser";

interface HeaderEntry {
  key: string;
  value: string;
}

interface TestResult {
  request: {
    method: string;
    url: string;
    headers: HeaderEntry[];
    body: string | null;
    refreshedToken: boolean;
  };
  response: {
    status: number;
    statusText: string;
    ok: boolean;
    durationMs: number;
    sizeBytes: number;
    truncated: boolean;
    headers: HeaderEntry[];
    body: string;
  };
}

const PLACEHOLDER = `curl -X POST "/knowledge-quiz/create" \\
  -H "Content-Type: application/json" \\
  -d '{ "sportsType": "FOOTBALL", "gameHeading": "Football IQ" }'`;

/** Pretty-print JSON bodies; leave anything else exactly as it came back. */
function formatBody(raw: string): { text: string; isJson: boolean } {
  const trimmed = raw.trim();
  if (!trimmed) return { text: "", isJson: false };
  if (!'{["'.includes(trimmed[0])) return { text: raw, isJson: false };
  try {
    return { text: JSON.stringify(JSON.parse(trimmed), null, 2), isJson: true };
  } catch {
    return { text: raw, isJson: false };
  }
}

function statusTone(status: number): string {
  if (status >= 200 && status < 300)
    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/40";
  if (status >= 300 && status < 400)
    return "bg-sky-500/15 text-sky-400 border-sky-500/40";
  if (status >= 400 && status < 500)
    return "bg-amber-500/15 text-amber-400 border-amber-500/40";
  return "bg-red-500/15 text-red-400 border-red-500/40";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const ESPN_SUMMARY_TEMPLATE =
  "https://site.api.espn.com/apis/site/v2/sports/{tournament}/summary?event={eventId}";

function buildEspnSummaryUrl(tournament: string, eventId: string): string {
  const path = tournament
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
    .join("/");
  return `https://site.api.espn.com/apis/site/v2/sports/${path}/summary?event=${encodeURIComponent(eventId.trim())}`;
}

function EspnSummaryHelper({
  sending,
  onFillCommand,
  onSend,
}: {
  sending: boolean;
  onFillCommand: (command: string) => void;
  onSend: (parsed: ParsedCurl) => Promise<void>;
}) {
  const [tournament, setTournament] = useState("");
  const [eventId, setEventId] = useState("");
  const canSend = Boolean(tournament.trim() && eventId.trim()) && !sending;

  const fillAndSend = async () => {
    if (!canSend) return;
    const url = buildEspnSummaryUrl(tournament, eventId);
    onFillCommand(`curl --location '${url}'`);
    await onSend({
      method: "GET",
      url,
      headers: [],
      body: null,
      warnings: [],
    });
  };

  return (
    <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="text-sm font-semibold text-white">ESPN summary API</h3>
      <p className="mt-1 font-mono text-xs break-all text-gray-400">
        {ESPN_SUMMARY_TEMPLATE}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Tournament
          </span>
          <input
            type="text"
            value={tournament}
            onChange={(e) => setTournament(e.target.value)}
            placeholder="soccer/eng.1"
            className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Event ID
          </span>
          <input
            type="text"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            placeholder="401879295"
            className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={fillAndSend}
        disabled={!canSend}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="h-4 w-4" aria-hidden />
        Send ESPN summary
      </button>
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard is unavailable outside a secure context — nothing to do.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 px-2.5 py-1 text-xs text-gray-300 transition-colors hover:bg-zinc-800"
      title={`Copy ${label}`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function HeaderTable({ rows }: { rows: HeaderEntry[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-gray-500">No headers.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-800 text-sm">
        <tbody className="divide-y divide-zinc-800">
          {rows.map((row, i) => (
            <tr key={`${row.key}-${i}`}>
              <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-gray-400 align-top">
                {row.key}
              </td>
              <td className="px-4 py-2 font-mono text-xs break-all text-gray-200">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ApiTestingSection() {
  const [command, setCommand] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TestResult | null>(null);
  const [showResponseHeaders, setShowResponseHeaders] = useState(false);
  const [showRequestDetails, setShowRequestDetails] = useState(false);

  // Live preview of what will actually be sent; parse errors stay quiet until
  // the user hits Send so half-typed commands do not shout at them.
  const preview = useMemo<{ parsed: ParsedCurl | null; error: string }>(() => {
    if (!command.trim()) return { parsed: null, error: "" };
    try {
      return { parsed: parseCurl(command), error: "" };
    } catch (err) {
      return {
        parsed: null,
        error: err instanceof Error ? err.message : "Could not parse command",
      };
    }
  }, [command]);

  const formattedResponse = useMemo(
    () => (result ? formatBody(result.response.body) : null),
    [result],
  );

  const send = async () => {
    if (sending) return;

    let parsed: ParsedCurl;
    try {
      parsed = parseCurl(command);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not parse command");
      setResult(null);
      return;
    }

    await executeRequest(parsed);
  };

  const executeRequest = async (parsed: ParsedCurl) => {
    try {
      setSending(true);
      setError("");

      const res = await fetch("/api/api-testing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          method: parsed.method,
          url: parsed.url,
          headers: parsed.headers,
          body: parsed.body,
        }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok || !payload?.success) {
        throw new Error(
          (typeof payload?.message === "string" && payload.message) ||
            `Request failed (${res.status})`,
        );
      }

      setResult(payload.data as TestResult);
      setShowResponseHeaders(false);
      setShowRequestDetails(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send request");
      setResult(null);
    } finally {
      setSending(false);
    }
  };

  const clear = () => {
    setCommand("");
    setResult(null);
    setError("");
  };

  return (
    <div className="p-6">
      <div className="mb-5">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
          <TerminalSquare className="h-6 w-6 text-cyan-400" />
          API Testing
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-gray-400">
          Paste a cURL command and send it with your admin access token attached
          — as both the <code className="text-gray-300">accessToken</code>{" "}
          cookie and an{" "}
          <code className="text-gray-300">Authorization: Bearer</code> header.
          Any auth in the pasted command is ignored. A bare path such as{" "}
          <code className="text-gray-300">/knowledge-quiz/</code> resolves
          against the configured backend.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <label
          htmlFor="curl-command"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          cURL command
        </label>
        <textarea
          id="curl-command"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              send();
            }
          }}
          spellCheck={false}
          rows={8}
          placeholder={PLACEHOLDER}
          className="w-full resize-y rounded-lg border border-zinc-700 bg-black p-3 font-mono text-sm text-gray-100 placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none"
        />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={send}
            disabled={sending || !command.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" aria-hidden />
            {sending ? "Sending..." : "Send request"}
          </button>
          <button
            type="button"
            onClick={clear}
            disabled={sending || (!command && !result && !error)}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Clear
          </button>
          <span className="text-xs text-gray-500">⌘/Ctrl + Enter to send</span>
        </div>

        {preview.parsed && (
          <div className="mt-4 rounded-lg border border-zinc-800 bg-black/40 p-3">
            <p className="font-mono text-xs break-all text-gray-300">
              <span className="mr-2 rounded bg-zinc-800 px-1.5 py-0.5 text-cyan-400">
                {preview.parsed.method}
              </span>
              {preview.parsed.url}
            </p>
            {preview.parsed.headers.length > 0 && (
              <p className="mt-2 font-mono text-[11px] break-all text-gray-500">
                {preview.parsed.headers
                  .map((h) => `${h.key}: ${h.value}`)
                  .join("  •  ")}
              </p>
            )}
            {preview.parsed.warnings.map((warning) => (
              <p key={warning} className="mt-1 text-xs text-amber-400">
                {warning}
              </p>
            ))}
          </div>
        )}

        {!preview.parsed && preview.error && command.trim() && (
          <p className="mt-3 text-xs text-gray-500">{preview.error}</p>
        )}
      </div>

      <EspnSummaryHelper
        sending={sending}
        onFillCommand={setCommand}
        onSend={executeRequest}
      />

      {error && (
        <div className="mt-4 rounded-lg border border-red-800 bg-red-900/20 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {sending && (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Atom color="#5CDFFF" size="medium" text="" textColor="" />
        </div>
      )}

      {!sending && result && formattedResponse && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-md border px-2.5 py-1 text-sm font-semibold ${statusTone(
                result.response.status,
              )}`}
            >
              {result.response.status} {result.response.statusText}
            </span>
            <span className="text-sm text-gray-400">
              {result.response.durationMs} ms
            </span>
            <span className="text-sm text-gray-400">
              {formatSize(result.response.sizeBytes)}
            </span>
            {result.request.refreshedToken && (
              <span className="text-xs text-amber-400">
                Session token was refreshed and the request retried
              </span>
            )}
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowRequestDetails((v) => !v)}
                className="rounded-md border border-zinc-700 px-2.5 py-1 text-xs text-gray-300 transition-colors hover:bg-zinc-800"
              >
                {showRequestDetails ? "Hide request" : "Show request"}
              </button>
              <button
                type="button"
                onClick={() => setShowResponseHeaders((v) => !v)}
                className="rounded-md border border-zinc-700 px-2.5 py-1 text-xs text-gray-300 transition-colors hover:bg-zinc-800"
              >
                {showResponseHeaders
                  ? "Hide response headers"
                  : "Response headers"}
              </button>
              <CopyButton text={result.response.body} label="response body" />
            </div>
          </div>

          {showRequestDetails && (
            <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <p className="font-mono text-xs break-all text-gray-300">
                {result.request.method} {result.request.url}
              </p>
              <HeaderTable rows={result.request.headers} />
              {result.request.body && (
                <pre className="max-h-64 overflow-auto rounded-lg border border-zinc-800 bg-black p-3 font-mono text-xs text-gray-200">
                  {result.request.body}
                </pre>
              )}
            </div>
          )}

          {showResponseHeaders && (
            <HeaderTable rows={result.response.headers} />
          )}

          <div>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-sm font-medium text-gray-300">Response</h3>
              {formattedResponse.isJson && (
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[11px] text-gray-400">
                  JSON
                </span>
              )}
              {result.response.truncated && (
                <span className="text-[11px] text-amber-400">
                  truncated — body was too large to show in full
                </span>
              )}
            </div>
            <pre className="max-h-[60vh] overflow-auto rounded-lg border border-zinc-800 bg-black p-4 font-mono text-xs whitespace-pre-wrap wrap-break-word text-gray-100">
              {formattedResponse.text || "(empty body)"}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
