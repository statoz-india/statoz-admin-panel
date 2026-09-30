/**
 * Finding a match on its source site — Cricbuzz for cricket, FotMob for
 * football — either on the site's own match list or from a pasted URL.
 * Shared by the quiz auto-answer routes and the match page's status lookup.
 * (Sofascore lookups run in the browser instead: see `sofascore.ts`.)
 */

import {
  CRICBUZZ_RECENT_MATCHES_URL,
  cricbuzzScorecardUrl,
  fetchCricbuzzScorecard,
  fetchRecentCricbuzzMatches,
  findCricbuzzMatchForQuiz,
  parseCricbuzzMatchId,
  type CbMatchHeader,
  type CbScorecard,
} from "./cricbuzz";
import {
  fetchFotmobMatchDetails,
  fetchFotmobMatchesForDate,
  findFotmobMatchForQuiz,
  fotmobDateKey,
  fotmobDatePageUrl,
  fotmobMatchPageUrl,
  fotmobNearMisses,
  FOTMOB_TIME_ZONE,
  parseFotmobMatchId,
  type FmListMatch,
  type FmMatchDetails,
} from "./fotmob";
import { espnSummaryUrl, fetchEspnSummary, type EspnStatusType } from "./espn";
import { MatchAnswersError } from "./match-answers-route";
import { teamPairingWarning, type QuizTeamLike } from "./quiz-answer-core";
import type {
  MatchAnswerSourceUrl,
  MatchSourceLookup,
} from "@/app/interface/match-answers.interface";
import type { MatchStatus } from "@/app/constants/match-status";

/** What a match is looked up by — a quiz's teams and start, or a match's own. */
export interface MatchLookupTarget {
  teamA: QuizTeamLike;
  teamB: QuizTeamLike;
  matchStartTime?: string;
}

/**
 * Cricbuzz's `state` ("Preview", "Toss", "In Progress", "Innings Break",
 * "Stumps", "Complete", "Abandon", …) as our match status.
 */
function cricbuzzMatchStatus(header: CbMatchHeader): MatchStatus {
  const state = header.state.toLowerCase();
  if (/no result/i.test(header.status)) return "no_result";
  if (state.startsWith("abandon")) return "abandoned";
  if (state.startsWith("cancel")) return "canceled";
  if (state.startsWith("postpon")) return "postponed";
  if (header.complete || state === "complete") return "result";
  if (state === "preview" || state === "upcoming" || state === "toss") {
    return "upcoming";
  }
  // Everything else is a phase of a match under way (breaks, rain delays…).
  return "live";
}

/** Why answers read off this scorecard might still change, if they might. */
export function cricbuzzAnswersWarning(header: CbMatchHeader): string | null {
  return header.complete
    ? null
    : `Cricbuzz shows this match as "${header.state}" (${header.status}) — answers can still change.`;
}

/**
 * The target's match on Cricbuzz and its scorecard. `warnings` only flags a
 * doubtful team pairing; callers add their own about the match state.
 * Pushes each page onto `sourceUrls` before fetching it.
 */
export async function lookupCricbuzzMatch(
  target: MatchLookupTarget,
  matchUrl: string,
  sourceUrls: MatchAnswerSourceUrl[],
): Promise<{ lookup: MatchSourceLookup; scorecard: CbScorecard }> {
  let matchId: number;
  let slug: string | undefined;

  if (matchUrl) {
    const parsed = parseCricbuzzMatchId(matchUrl);
    if (!parsed) {
      throw new MatchAnswersError(
        "That isn't a Cricbuzz match URL (expected something like https://www.cricbuzz.com/live-cricket-scores/12345/…).",
      );
    }
    matchId = parsed;
  } else {
    sourceUrls.push({
      label: "Recent matches",
      url: CRICBUZZ_RECENT_MATCHES_URL,
    });
    const match = findCricbuzzMatchForQuiz(
      await fetchRecentCricbuzzMatches(),
      target,
    );
    if (!match) {
      throw new MatchAnswersError(
        `Couldn't find ${target.teamA?.name} vs ${target.teamB?.name} (within 36h of the match start) on Cricbuzz's recent matches. Paste the Cricbuzz match URL to use it directly.`,
        404,
      );
    }
    matchId = match.matchId;
    slug = match.slug;
  }

  sourceUrls.push({
    label: "Scorecard",
    url: cricbuzzScorecardUrl(matchId, slug),
  });
  const scorecard = await fetchCricbuzzScorecard(matchId, slug);
  const header = scorecard.matchHeader;

  const pairingWarning = teamPairingWarning(
    target,
    header.team1,
    header.team2,
    "Cricbuzz",
  );

  return {
    lookup: {
      source: "cricbuzz",
      match: {
        externalMatchId: matchId,
        title: `${header.team1.name} vs ${header.team2.name}`,
        subtitle: [header.matchDescription, header.seriesName]
          .filter(Boolean)
          .join(" · "),
        state: header.state,
        status: header.status,
        startTime: new Date(Number(header.matchStartTimestamp)).toISOString(),
        isComplete: !!header.complete,
      },
      sourceUrls,
      matchedBy: matchUrl ? "url" : "auto",
      suggestedStatus: cricbuzzMatchStatus(header),
      warnings: pairingWarning ? [pairingWarning] : [],
    },
    scorecard,
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;

const formatDay = (ms: number) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: FOTMOB_TIME_ZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(ms);

/** FotMob's status flags as our match status. */
function fotmobMatchStatus(
  status: FmMatchDetails["header"]["status"],
): MatchStatus {
  const reason = `${status.reason?.long ?? ""} ${status.reason?.short ?? ""}`;
  if (/postpon/i.test(reason)) return "postponed";
  if (/abandon/i.test(reason)) return "abandoned";
  if (status.cancelled) return "canceled";
  if (status.finished) return "result";
  return status.started ? "live" : "upcoming";
}

/** Why answers read off this match might be missing or still change, if so. */
export function fotmobAnswersWarning(
  status: FmMatchDetails["header"]["status"],
): string | null {
  if (status.cancelled) return "FotMob lists this match as cancelled.";
  if (!status.started) {
    return "The match hasn't started on FotMob yet, so nothing can be answered.";
  }
  if (!status.finished) {
    return `The match is still in progress on FotMob (${status.scoreStr ?? "live"}) — answers can still change.`;
  }
  return null;
}

/**
 * The target's match on FotMob and its details. `warnings` only flags a
 * doubtful team pairing; callers add their own about the match state.
 * Pushes each page onto `sourceUrls` before fetching it.
 */
export async function lookupFotmobMatch(
  target: MatchLookupTarget,
  matchUrl: string,
  sourceUrls: MatchAnswerSourceUrl[],
): Promise<{ lookup: MatchSourceLookup; details: FmMatchDetails }> {
  let matchId: number;

  if (matchUrl) {
    const parsed = parseFotmobMatchId(matchUrl);
    if (!parsed) {
      throw new MatchAnswersError(
        "That isn't a FotMob match URL (expected something like https://www.fotmob.com/match/12345).",
      );
    }
    matchId = parsed;
  } else {
    const start = target.matchStartTime
      ? Date.parse(target.matchStartTime)
      : NaN;
    if (Number.isNaN(start)) {
      throw new MatchAnswersError(
        "There's no match start time to look the match up by. Paste the FotMob match URL instead.",
      );
    }
    // FotMob's list for the match date (IST), then the days either side in
    // case the start time is off.
    let found: FmListMatch | null = null;
    const listed: FmListMatch[] = [];
    for (const offset of [0, -1, 1]) {
      const day = start + offset * DAY_MS;
      const date = fotmobDateKey(day);
      sourceUrls.push({
        label: `Matches on ${formatDay(day)}`,
        url: fotmobDatePageUrl(date),
      });
      const matches = await fetchFotmobMatchesForDate(date);
      listed.push(...matches);
      found = findFotmobMatchForQuiz(matches, target);
      if (found) break;
    }
    if (!found) {
      const teams = `${target.teamA?.name} vs ${target.teamB?.name}`;
      const where = `FotMob's match list for ${formatDay(start)} (or the day before or after)`;
      const near = fotmobNearMisses(listed, target).slice(0, 5);
      throw new MatchAnswersError(
        near.length
          ? `${teams} isn't in ${where}. Matches there with one of these teams: ${near
              .map((m) => `${m.home.name} vs ${m.away.name} (${m.leagueName})`)
              .join("; ")}. If one of them is this match, paste its FotMob URL.`
          : `${teams} isn't in ${where}, and neither team plays in any match listed there — FotMob probably doesn't cover this competition. Paste a FotMob match URL if you find the match under other names.`,
        404,
      );
    }
    matchId = found.id;
  }

  sourceUrls.push({ label: "Match", url: fotmobMatchPageUrl(matchId) });
  const details = await fetchFotmobMatchDetails(matchId);
  const [home, away] = details.header.teams;
  const status = details.header.status;

  const pairingWarning = teamPairingWarning(
    target,
    { name: home.name, shortName: home.name },
    { name: away.name, shortName: away.name },
    "FotMob",
  );

  const round = details.general.leagueRoundName;
  return {
    lookup: {
      source: "fotmob",
      match: {
        externalMatchId: matchId,
        title: `${home.name} vs ${away.name}`,
        subtitle: [
          details.general.leagueName,
          round ? (/^\d+$/.test(round) ? `Round ${round}` : round) : "",
        ]
          .filter(Boolean)
          .join(" · "),
        state:
          status.reason?.long ??
          (status.finished
            ? "Full-Time"
            : status.started
              ? "Live"
              : "Not started"),
        status: `${home.name} ${home.score ?? 0} - ${away.score ?? 0} ${away.name}`,
        startTime: new Date(status.utcTime).toISOString(),
        isComplete: !!status.finished,
      },
      sourceUrls,
      matchedBy: matchUrl ? "url" : "auto",
      suggestedStatus: fotmobMatchStatus(status),
      warnings: pairingWarning ? [pairingWarning] : [],
    },
    details,
  };
}

/** What a match is looked up by on ESPN — its own saved league path and event id. */
export interface EspnLookupTarget {
  /** e.g. "cricket/1554562", written by the live-score sync. */
  espnLeagueName?: string | null;
  /** ESPN's event id, from `matchEvent.id`. */
  espnEventId?: string | null;
}

/** The ESPN event id in a pasted match URL like `.../gameId/401873742/…`, if any. */
function parseEspnEventId(url: string): string | null {
  const match = url.match(/gameId\/(\d+)/i);
  return match ? match[1] : null;
}

/**
 * Whether ESPN considers the match finished. Football's `status.type`
 * includes a `completed` flag; cricket's omits it entirely, so `state ===
 * "post"` is the only reliable signal there — used as a fallback everywhere.
 */
function espnMatchComplete(type: EspnStatusType): boolean {
  return type.completed === true || type.state === "post";
}

/** ESPN's `status.type` as our match status. */
function espnMatchStatus(type: EspnStatusType): MatchStatus {
  const name = type.name?.toUpperCase() ?? "";
  const text = `${type.description ?? ""} ${type.detail ?? ""}`.toLowerCase();
  if (/postpon/.test(text) || name.includes("POSTPONED")) return "postponed";
  if (/abandon/.test(text) || name.includes("ABANDONED")) return "abandoned";
  if (/cancel/.test(text) || name.includes("CANCEL")) return "canceled";
  if (/no result/.test(text)) return "no_result";
  if (espnMatchComplete(type)) return "result";
  if (type.state === "in") return "live";
  return "upcoming";
}

/**
 * The match's own ESPN summary. There's no team-name search here: every
 * match already carries the exact league path and event id the live-score
 * sync wrote, so this just fetches `sports/{leaguePath}/summary?event={id}`.
 * A pasted match URL only overrides the event id — the league path always
 * comes from the match, since ESPN's URL doesn't carry it.
 */
export async function lookupEspnMatch(
  target: EspnLookupTarget,
  matchUrl: string,
  sourceUrls: MatchAnswerSourceUrl[],
): Promise<MatchSourceLookup> {
  const leaguePath = target.espnLeagueName?.trim();
  if (!leaguePath) {
    throw new MatchAnswersError(
      "This match has no ESPN league saved (espnLeagueName), so it can't be looked up on ESPN.",
    );
  }
  const eventId = (matchUrl ? parseEspnEventId(matchUrl) : null) ?? target.espnEventId?.trim();
  if (!eventId) {
    throw new MatchAnswersError(
      matchUrl
        ? "That doesn't look like an ESPN match URL (expected something like https://www.espn.in/football/match/_/gameId/401873742/…)."
        : "This match has no ESPN event id saved yet. Paste an ESPN match URL to use instead.",
    );
  }

  sourceUrls.push({
    label: "ESPN summary",
    url: espnSummaryUrl(leaguePath, eventId),
  });
  const summary = await fetchEspnSummary(leaguePath, eventId);
  const competition = summary.header.competitions[0];
  const home = competition.competitors.find((c) => c.homeAway === "home");
  const away = competition.competitors.find((c) => c.homeAway === "away");
  if (!home || !away) {
    throw new MatchAnswersError(
      `ESPN's data for event ${eventId} is missing a team.`,
    );
  }
  const statusType = competition.status.type;

  return {
    source: "espn",
    match: {
      externalMatchId: Number(eventId),
      title: `${home.team.displayName} vs ${away.team.displayName}`,
      subtitle: summary.header.season?.name ?? "",
      state: statusType.description || statusType.shortDetail,
      status: `${home.team.displayName} ${home.score ?? "0"} - ${away.score ?? "0"} ${away.team.displayName}`,
      startTime: competition.date,
      isComplete: espnMatchComplete(statusType),
    },
    sourceUrls,
    matchedBy: matchUrl ? "url" : "auto",
    suggestedStatus: espnMatchStatus(statusType),
    warnings: [],
  };
}
