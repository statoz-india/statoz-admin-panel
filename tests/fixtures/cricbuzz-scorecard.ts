import type { CbInnings, CbScorecard } from "@/app/api/utils/cricbuzz";

/**
 * A finished T20: Australia (won toss, batted) 185/7 in 20 ov; India chased
 * 186/4 in 19.2 ov — Kohli 102*, player of the match. India won by 6 wkts.
 */
export function t20Scorecard(): CbScorecard {
  const australiaInnings: CbInnings = {
    inningsId: 1,
    batTeamDetails: {
      batTeamId: 4,
      batTeamName: "Australia",
      batTeamShortName: "AUS",
      batsmenData: {
        bat_1: { batId: 201, batName: "Travis Head", runs: 64, balls: 38, fours: 5, sixes: 4, outDesc: "c Kohli b Bumrah" },
        bat_2: { batId: 202, batName: "Mitchell Marsh", runs: 45, balls: 30, fours: 3, sixes: 2, outDesc: "b Bumrah" },
        bat_3: { batId: 203, batName: "Glenn Maxwell", runs: 30, balls: 15, fours: 1, sixes: 3, outDesc: "not out" },
        // Did not bat: no balls, no runs, no dismissal.
        bat_4: { batId: 204, batName: "Pat Cummins", runs: 0, balls: 0, fours: 0, sixes: 7, outDesc: "" },
      },
    },
    bowlTeamDetails: {
      bowlTeamId: 2,
      bowlTeamName: "India",
      bowlTeamShortName: "IND",
      bowlersData: {
        bowl_1: { bowlerId: 301, bowlName: "Jasprit Bumrah", overs: 4, maidens: 0, runs: 28, wickets: 3 },
        bowl_2: { bowlerId: 302, bowlName: "Kuldeep Yadav", overs: 4, maidens: 0, runs: 40, wickets: 2 },
      },
    },
    scoreDetails: { runs: 185, wickets: 7, overs: 20, ballNbr: 120 },
    ppData: { pp_1: { ppOversFrom: 0.1, ppOversTo: 6, ppType: "mandatory", runsScored: 54 } },
    partnershipsData: {
      pat_1: { bat1Name: "Head", bat2Name: "Marsh", totalRuns: 72, totalBalls: 40 },
      pat_2: { bat1Name: "Marsh", bat2Name: "Maxwell", totalRuns: 30, totalBalls: 20 },
    },
  };

  const indiaInnings: CbInnings = {
    inningsId: 2,
    batTeamDetails: {
      batTeamId: 2,
      batTeamName: "India",
      batTeamShortName: "IND",
      batsmenData: {
        bat_1: { batId: 101, batName: "Virat Kohli", runs: 102, balls: 60, fours: 9, sixes: 4, outDesc: "not out" },
        bat_2: { batId: 102, batName: "Rohit Sharma", runs: 40, balls: 25, fours: 4, sixes: 2, outDesc: "c Head b Starc" },
        bat_3: { batId: 103, batName: "Shubman Gill", runs: 20, balls: 15, fours: 2, sixes: 1, outDesc: "b Starc" },
      },
    },
    bowlTeamDetails: {
      bowlTeamId: 4,
      bowlTeamName: "Australia",
      bowlTeamShortName: "AUS",
      bowlersData: {
        bowl_1: { bowlerId: 401, bowlName: "Mitchell Starc", overs: 4, maidens: 0, runs: 35, wickets: 2 },
        bowl_2: { bowlerId: 402, bowlName: "Pat Cummins", overs: 4, maidens: 0, runs: 30, wickets: 1 },
        bowl_3: { bowlerId: 403, bowlName: "Adam Zampa", overs: 3.2, maidens: 0, runs: 40, wickets: 1 },
      },
    },
    // No ballNbr: legal balls come from the overs (19.2 → 116).
    scoreDetails: { runs: 186, wickets: 4, overs: 19.2 },
    ppData: { pp_1: { ppOversFrom: 0.1, ppOversTo: 6, ppType: "mandatory", runsScored: 48 } },
    partnershipsData: {
      pat_1: { bat1Name: "Kohli", bat2Name: "Sharma", totalRuns: 110, totalBalls: 62 },
      pat_2: { bat1Name: "Kohli", bat2Name: "Gill", totalRuns: 45, totalBalls: 30 },
    },
  };

  return {
    scoreCard: [australiaInnings, indiaInnings],
    matchHeader: {
      matchId: 9001,
      matchDescription: "1st T20I",
      matchFormat: "T20",
      state: "Complete",
      status: "India won by 6 wkts",
      complete: true,
      matchStartTimestamp: Date.parse("2026-08-08T14:00:00Z"),
      seriesName: "Australia tour of India, 2026",
      tossResults: { tossWinnerId: 4, tossWinnerName: "Australia", decision: "Batting" },
      result: { resultType: "win", winningTeam: "India", winningteamId: 2, winningMargin: 6 },
      playersOfTheMatch: [{ id: 101, name: "Kohli", fullName: "Virat Kohli" }],
      team1: { id: 2, name: "India", shortName: "IND" },
      team2: { id: 4, name: "Australia", shortName: "AUS" },
    },
  };
}
