"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function MatchIdWithCopy({
  id,
  onQuizClick,
}: {
  id: string;
  onQuizClick?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const idEl = onQuizClick ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onQuizClick();
      }}
      className="cursor-pointer text-left font-mono text-xs break-all text-sky-300 hover:text-sky-200 hover:underline"
      title="Open details"
    >
      {id}
    </button>
  ) : (
    <span className="font-mono text-xs break-all text-gray-300">{id}</span>
  );

  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1">
      {idEl}
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 rounded p-0.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
        aria-label={`Copy id ${id}`}
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
        ) : (
          <Copy className="h-3.5 w-3.5" strokeWidth={2} />
        )}
      </button>
    </span>
  );
}

export function MatchBannerUrlWithCopy({ url }: { url?: string }) {
  const [copied, setCopied] = useState(false);
  const trimmed = url?.trim() ?? "";

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(trimmed);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  if (!trimmed) {
    return <span className="text-zinc-500">—</span>;
  }

  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1">
      <span className="text-xs break-all text-gray-300">{trimmed}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 rounded p-0.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
        aria-label="Copy banner URL"
        title="Copy URL to clipboard"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
        ) : (
          <Copy className="h-3.5 w-3.5" strokeWidth={2} />
        )}
      </button>
    </span>
  );
}
