import type { CbMatchInfo, CbScorecard } from "@/app/api/utils/cricbuzz";

/**
 * A Cricbuzz page as Next.js serves it: the data in `self.__next_f.push`
 * flight chunks. The flight is split across two chunks (so they must be
 * joined) and followed by a malformed chunk (which must be skipped).
 */
export function flightPage(flight: string, html = ""): string {
  const mid = Math.floor(flight.length / 2);
  const chunks = [flight.slice(0, mid), flight.slice(mid)]
    .map((part) => `<script>self.__next_f.push([1,${JSON.stringify(part)}])</script>`)
    .join("\n");
  return `<!DOCTYPE html><html><body>${html}\n${chunks}\n<script>self.__next_f.push([1,"\\x"])</script></body></html>`;
}

export const INDIA_AUSTRALIA_INFO: CbMatchInfo = {
  matchId: 9001,
  seriesName: "Australia tour of India, 2026",
  matchDesc: "1st T20I",
  matchFormat: "T20",
  startDate: String(Date.parse("2026-08-08T14:00:00Z")),
  state: "Complete",
  status: "India won by 6 wkts",
  team1: { teamId: 2, teamName: "India", teamSName: "IND" },
  team2: { teamId: 4, teamName: "Australia", teamSName: "AUS" },
};

export const ENGLAND_SA_INFO: CbMatchInfo = {
  matchId: 9002,
  // Braces inside a string must not end the object early.
  seriesName: "South Africa tour of England {2026}",
  matchDesc: "2nd ODI",
  matchFormat: "ODI",
  startDate: Date.parse("2026-08-08T09:30:00Z"),
  state: "In Progress",
  status: "England need 120 runs",
  team1: { teamId: 9, teamName: "England", teamSName: "ENG" },
  team2: { teamId: 11, teamName: "South Africa", teamSName: "RSA" },
};

/** The recent-matches page: a duplicate entry, and one entry with a team missing. */
export function recentMatchesPage(infos: CbMatchInfo[] = [INDIA_AUSTRALIA_INFO, ENGLAND_SA_INFO]): string {
  const flight = `1:${JSON.stringify({
    list: infos.map((matchInfo) => ({ matchInfo, matchScore: { note: "a } brace { in a string" } })),
    again: infos[0] ? { matchInfo: { ...infos[0], status: "stale duplicate" } } : null,
    broken: { matchInfo: { matchId: 1234, team1: INDIA_AUSTRALIA_INFO.team1 } },
  })}\n`;
  const links = infos
    .map((i) => `<a href="/live-cricket-scores/${i.matchId}/${i.team1.teamSName.toLowerCase()}-vs-${i.team2.teamSName.toLowerCase()}">x</a>`)
    .join("");
  return flightPage(flight, `${links}<a href="/live-cricket-scores/9001/second-link-ignored">y</a>`);
}

/** A scorecard page; another match's scorecard data is on it too. */
export function scorecardPage(scorecard: CbScorecard): string {
  const other = { scorecardApiData: { scoreCard: [], matchHeader: { ...scorecard.matchHeader, matchId: 1 } } };
  const flight = `3:${JSON.stringify(other)}\n4:${JSON.stringify({ scorecardApiData: scorecard })}\n`;
  return flightPage(flight);
}
