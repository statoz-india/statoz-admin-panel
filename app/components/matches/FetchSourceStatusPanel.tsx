"use client";

import type { MatchData } from "@/app/api/match/route";
import type { MatchSourceLookup } from "@/app/interface/match-answers.interface";
import {
  MATCH_STATUS_LABELS,
  type MatchStatus,
} from "@/app/constants/match-status";
import { statusBadgeClass } from "@/app/utils/statusBadge";
import {
  lookupTeam,
  matchSourceSiteFor,
  MatchSourceLookupCard,
  useMatchSourceLookup,
  type MatchSourceSite,
} from "./MatchSourceSummary";

type FetchSourceStatusPanelProps = {
  match: MatchData;
  /** Opens the status dialog with the site's status pre-selected. */
  onUseStatus: (status: MatchStatus, note: string) => void;
};

/**
 * Looks this match up on Cricbuzz (cricket) or FotMob (football) and shows
 * its state and result there. Nothing is saved unless the admin takes the
 * site's status through `onUseStatus`.
 */
export default function FetchSourceStatusPanel(
  props: FetchSourceStatusPanelProps,
) {
  const site = matchSourceSiteFor(props.match.gameType);
  if (!site) return null;
  return <FetchSourceStatusPanelInner {...props} site={site} />;
}

function FetchSourceStatusPanelInner({
  match,
  onUseStatus,
  site,
}: FetchSourceStatusPanelProps & { site: MatchSourceSite }) {
  const state = useMatchSourceLookup(site);
  const lookup = state.result;

  return (
    <MatchSourceLookupCard
      site={site}
      title={`Match status from ${site.name}`}
      description={`Finds this match on ${site.name} and shows its status and result. Nothing is saved unless you update the match status from it.`}
      fetchLabel={`Fetch from ${site.name}`}
      state={state}
      onFetch={(matchUrl) =>
        void state.fetchLookup(
          () => ({
            gameType: match.gameType ?? "",
            teamA: lookupTeam(match.teamA),
            teamB: lookupTeam(match.teamB),
            matchStartTime: match.matchStartTime,
          }),
          matchUrl,
        )
      }
    >
      {lookup?.suggestedStatus && (
        <SuggestedStatusRow
          lookup={lookup}
          suggested={lookup.suggestedStatus}
          currentStatus={match.matchStatus}
          siteName={site.name}
          onUseStatus={onUseStatus}
        />
      )}
    </MatchSourceLookupCard>
  );
}

function SuggestedStatusRow({
  lookup,
  suggested,
  currentStatus,
  siteName,
  onUseStatus,
}: {
  lookup: MatchSourceLookup;
  suggested: MatchStatus;
  currentStatus: string | undefined;
  siteName: string;
  onUseStatus: FetchSourceStatusPanelProps["onUseStatus"];
}) {
  const label = MATCH_STATUS_LABELS[suggested];
  const same = currentStatus?.toLowerCase() === suggested;
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-700 pt-4">
      <p className="flex flex-wrap items-center gap-2 text-sm text-gray-300">
        {siteName} status:
        <span
          className={`rounded-md px-3 py-0.5 text-xs font-medium ${statusBadgeClass(
            suggested,
          )}`}
        >
          {suggested.toUpperCase()}
        </span>
        <span className="text-gray-400">
          {same
            ? "— same as this match."
            : `— this match is ${currentStatus ? currentStatus.toUpperCase() : "not set"}.`}
        </span>
      </p>
      {!same && (
        <button
          type="button"
          onClick={() =>
            onUseStatus(
              suggested,
              `${siteName} shows ${lookup.match.title} as "${lookup.match.state}" (${lookup.match.status}), so ${label} is pre-selected.`,
            )
          }
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
        >
          Set match status to {label}
        </button>
      )}
    </div>
  );
}
