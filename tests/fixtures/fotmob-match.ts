import type { FmEvent, FmMatchDetails } from "@/app/api/utils/fotmob";

const goal = (time: number, isHome: boolean, name: string, extra: Partial<FmEvent> = {}): FmEvent => ({
  type: "Goal",
  time,
  isHome,
  player: { id: time, name },
  ...extra,
});

const card = (time: number, isHome: boolean, kind: string): FmEvent => ({ type: "Card", time, isHome, card: kind });

/**
 * Leeds United 4–1 Newcastle United, finished. Leeds led 2–1 at half-time
 * (a 45+2 penalty), scored an own goal's worth late, and Newcastle had a man
 * sent off. Full team stats included.
 */
export function leedsNewcastle(): FmMatchDetails {
  return {
    general: {
      matchId: "5795450",
      leagueName: "Premier League",
      leagueRoundName: "Round 4",
      matchTimeUTCDate: "2026-08-08T14:00:00.000Z",
    },
    header: {
      teams: [
        { id: 10, name: "Leeds United", score: 4 },
        { id: 20, name: "Newcastle United", score: 1 },
      ],
      status: { utcTime: "2026-08-08T14:00:00.000Z", started: true, finished: true, cancelled: false, scoreStr: "4 - 1" },
    },
    content: {
      matchFacts: {
        playerOfTheMatch: { name: { fullName: "Joel Piroe" }, rating: { num: "8.9" } },
        events: {
          events: [
            goal(88, true, "Joel Piroe"),
            goal(12, true, "Joel Piroe"),
            goal(30, false, "Alexander Isak"),
            goal(45, true, "Wilfried Gnonto", { overloadTime: 2, goalDescriptionKey: "penalty" }),
            goal(70, true, "Dan Burn", { ownGoal: true }),
            card(40, false, "Yellow"),
            card(55, true, "Yellow"),
            card(80, false, "Red"),
            // Shootout kicks aren't match goals.
            goal(120, false, "Shootout taker", { isPenaltyShootoutEvent: true }),
          ],
        },
      },
      stats: {
        Periods: {
          All: {
            stats: [
              {
                key: "top_stats",
                stats: [
                  { key: "BallPossesion", title: "Ball possession", stats: [55, 45] },
                  { key: "total_shots", title: "Total shots", stats: [15, 9] },
                  { key: "ShotsOnTarget", title: "Shots on target", stats: ["7", "3"] },
                  { key: "corners", title: "Corners", stats: [6, 4] },
                ],
              },
              {
                key: "discipline",
                stats: [
                  { key: "fouls", title: "Fouls committed", stats: [11, 9] },
                  { key: "yellow_cards", title: "Yellow cards", stats: [1, 1] },
                  { key: "red_cards", title: "Red cards", stats: [0, 1] },
                  // A later duplicate of a stat is ignored.
                  { key: "corners", title: "Corners", stats: [99, 99] },
                ],
              },
            ],
          },
        },
      },
    },
  };
}
