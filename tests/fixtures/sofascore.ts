import type { SofascoreMatchData, SsEvent, SsTeam } from "@/app/api/utils/sofascore";

export const ARSENAL: SsTeam = { id: 10, name: "Arsenal", slug: "arsenal", shortName: "Arsenal", nameCode: "ARS", sport: { slug: "football" } };
export const CHELSEA: SsTeam = { id: 20, name: "Chelsea", slug: "chelsea", shortName: "Chelsea", nameCode: "CHE", sport: { slug: "football" } };

/** Arsenal 2–1 Chelsea, finished: Saka 10', White own goal 30', Ødegaard pen 45+3'. */
export function arsenalChelseaEvent(overrides: Partial<SsEvent> = {}): SsEvent {
  return {
    id: 1,
    slug: "arsenal-chelsea",
    customId: "RsR",
    startTimestamp: Date.parse("2026-08-08T14:00:00Z") / 1000,
    status: { code: 100, description: "Ended", type: "finished" },
    winnerCode: 1,
    homeTeam: ARSENAL,
    awayTeam: CHELSEA,
    homeScore: { current: 2, display: 2 },
    awayScore: { current: 1, display: 1 },
    tournament: { name: "Premier League", category: { sport: { slug: "football" } } },
    roundInfo: { round: 4 },
    ...overrides,
  };
}

export function arsenalChelseaData(event = arsenalChelseaEvent()): SofascoreMatchData {
  return {
    sport: "football",
    event,
    innings: null,
    balls: null,
    incidents: [
      { incidentType: "period", time: 45, addedTime: 999 },
      { incidentType: "goal", incidentClass: "penalty", time: 45, addedTime: 3, isHome: true, player: { id: 3, name: "Martin Ødegaard" }, homeScore: 2, awayScore: 1 },
      // An Arsenal player's own goal: the running score says it counts for Chelsea.
      { incidentType: "goal", incidentClass: "ownGoal", time: 30, isHome: true, player: { id: 2, name: "Ben White" }, homeScore: 1, awayScore: 1 },
      { incidentType: "goal", incidentClass: "regular", time: 10, isHome: true, player: { id: 1, name: "Bukayo Saka" }, homeScore: 1, awayScore: 0 },
      { incidentType: "card", incidentClass: "yellow", time: 50, isHome: false },
      { incidentType: "card", incidentClass: "yellowRed", time: 80, isHome: false },
    ],
    statistics: [
      {
        period: "ALL",
        groups: [
          {
            groupName: "Match overview",
            statisticsItems: [
              { key: "ballPossession", name: "Ball possession", home: "58%", away: "42%", homeValue: 58, awayValue: 42 },
              { key: "cornerKicks", name: "Corner kicks", homeValue: 7, awayValue: 3 },
              // No numeric values: read from the strings.
              { key: "yellowCards", name: "Yellow cards", home: "1", away: "2" },
            ],
          },
        ],
      },
      { period: "1ST", groups: [{ groupName: "x", statisticsItems: [{ key: "cornerKicks", name: "Corner kicks", homeValue: 99, awayValue: 99 }] }] },
    ],
    lineups: null,
    playerOfTheMatch: { name: "Bukayo Saka", rating: "8.5" },
  };
}

export const LAKERS: SsTeam = { id: 1, name: "Los Angeles Lakers", shortName: "Lakers", nameCode: "LAL", sport: { slug: "basketball" } };
export const CELTICS: SsTeam = { id: 2, name: "Boston Celtics", shortName: "Celtics", nameCode: "BOS", sport: { slug: "basketball" } };

/** Lakers 110–100 Celtics: quarters 30–25, 28–30, 25–20, 27–25. */
export function lakersCelticsData(): SofascoreMatchData {
  return {
    sport: "basketball",
    event: {
      id: 2,
      startTimestamp: Date.parse("2026-08-08T02:00:00Z") / 1000,
      status: { code: 100, description: "Ended", type: "finished" },
      homeTeam: LAKERS,
      awayTeam: CELTICS,
      homeScore: { display: 110, period1: 30, period2: 28, period3: 25, period4: 27 },
      awayScore: { display: 100, period1: 25, period2: 30, period3: 20, period4: 25 },
      defaultPeriodCount: 4,
    },
    innings: null,
    balls: null,
    incidents: null,
    statistics: [
      {
        period: "ALL",
        groups: [
          {
            groupName: "Scoring",
            statisticsItems: [
              { name: "3 pointers", homeValue: 12, awayValue: 16 },
              { name: "Rebounds", homeValue: 48, awayValue: 40 },
              { name: "Assists", home: "26", away: "22" },
            ],
          },
        ],
      },
    ],
    lineups: {
      home: {
        players: [
          { player: { id: 11, name: "LeBron James" }, statistics: { points: 35, rebounds: 10, assists: 12, threePointsMade: 3 } },
          // Rebounds split into defensive and offensive.
          { player: { id: 12, name: "Anthony Davis" }, statistics: { points: 28, defensiveRebounds: 10, offensiveRebounds: 4 } },
        ],
      },
      away: {
        players: [
          { player: { id: 21, name: "Jayson Tatum" }, teamId: 2, statistics: { points: 30, totalRebounds: 8 } },
          // Listed twice: counted once.
          { player: { id: 21, name: "Jayson Tatum" }, teamId: 2, statistics: { points: 30 } },
        ],
      },
    },
    playerOfTheMatch: null,
  };
}

const CSK: SsTeam = { id: 100, name: "Chennai Super Kings", shortName: "CSK", sport: { slug: "cricket" } };
const MI: SsTeam = { id: 200, name: "Mumbai Indians", shortName: "MI", nameCode: "MI", sport: { slug: "cricket" } };

/** IPL: CSK 190/5 (20) beat MI 170/8 (20) by 20 runs. MI won the toss and bowled. */
export function cskMiData(): SofascoreMatchData {
  return {
    sport: "cricket",
    event: {
      id: 3,
      startTimestamp: Date.parse("2026-04-10T14:00:00Z") / 1000,
      status: { code: 100, description: "Ended", type: "finished" },
      winnerCode: 1,
      homeTeam: CSK,
      awayTeam: MI,
      tournament: { name: "Indian Premier League", uniqueTournament: { name: "Indian Premier League" } },
      note: "Chennai Super Kings won by 20 runs",
      tossWin: "Mumbai Indians",
      tossDecision: "Bowling",
    },
    innings: [
      {
        number: 2,
        battingTeam: MI,
        bowlingTeam: CSK,
        score: 170,
        wickets: 8,
        overs: 20,
        battingLine: [{ player: { id: 4, name: "Rohit Sharma" }, score: 60, balls: 40, s6: 4, wicketTypeName: "Bowled" }],
        bowlingLine: [{ player: { id: 8, name: "Matheesha Pathirana" }, over: 4, run: 28, wicket: 3 }],
        partnerships: [{ score: 55 }],
      },
      {
        number: 1,
        battingTeam: CSK,
        bowlingTeam: MI,
        score: 190,
        wickets: 5,
        overs: 20,
        battingLine: [
          { player: { id: 1, name: "Ruturaj Gaikwad" }, score: 80, balls: 50, s4: 8, s6: 3, wicketTypeName: "Caught" },
          { player: { id: 2, name: "MS Dhoni" }, score: 20, balls: 8, s6: 2, wicketTypeName: "Not out" },
          { player: { id: 3, name: "Tail Ender" }, s6: 9, wicketTypeName: "Did not bat" },
        ],
        bowlingLine: [{ player: { id: 9, name: "Jasprit Bumrah" }, over: 4, run: 25, wicket: 2 }],
        partnerships: [{ score: 90 }, { score: 40 }],
      },
    ],
    balls: [
      { inningNumber: 1, over: 5, score: "50/1" },
      { inningNumber: 1, over: 6, score: "58/1" },
      { inningNumber: 1, over: 7, score: "66/2" },
      { inningNumber: 2, over: 6, score: "41/3" },
    ],
    incidents: null,
    statistics: null,
    lineups: null,
    playerOfTheMatch: null,
  };
}
