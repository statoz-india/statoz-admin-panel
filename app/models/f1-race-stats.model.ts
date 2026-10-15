/**
 * F1 race stats stored by the backend (`MatchStats` row, gameType `racing`).
 * Only the fields the admin panel reads are typed; `matchSummary` is the
 * live-score service's race payload and carries more (full charts etc.).
 */

export interface F1Driver {
  id: string | null;
  /** e.g. `VER` */
  code: string | null;
  name: string | null;
  team: string | null;
  /** e.g. `#00327D` */
  teamColor: string | null;
}

export interface F1Winner extends Omit<F1Driver, "code"> {
  shortName: string | null;
  country: string | null;
  flag: string | null;
  carNumber: string | null;
  time: string | null;
  finishPosition: number | null;
  gridPosition: number | null;
  positionsGained?: number | null;
  fastestLap?: string | null;
  fastestLapNumber?: number | null;
  pitStops?: number | null;
  lapsLed?: number | null;
  lapsCompleted?: number | null;
  points: number | null;
}

export interface F1ClassificationEntry extends F1Driver {
  position: number | null;
  gridPosition: number | null;
  positionsGained: number | null;
  /** e.g. `+3.857`, `+1 Lap` */
  time: string | null;
  /** null when lapped */
  gapSeconds: number | null;
  lapsCompleted: number | null;
  lapsBehind?: number | null;
  fastestLap?: string | null;
  pitStops: number | null;
  points: number | null;
}

/** A lap time as both display text and seconds (null when none was set). */
export interface F1LapTime {
  time: string | null;
  seconds: number | null;
}

export interface F1GapToLeaderChart {
  onLeadLap: number;
  lapped: number;
  /** Lead-lap drivers only, in finishing order. */
  points: (F1Driver & {
    position: number | null;
    gapSeconds: number | null;
    /** e.g. `+1:18.958`; the winner's race time for P1 */
    gap: string | null;
  })[];
}

export interface F1WeekendPositionTrackChart {
  /** e.g. `FP1 FP2 FP3 QUAL GRID FIN`, only sessions with data */
  stages: string[];
  series: (F1Driver & {
    positions: { stage: string; position: number | null }[];
  })[];
}

export interface F1PaceEvolutionChart {
  stages: string[];
  series: (F1Driver & {
    laps: ({ stage: string; bestLap: string | null } & Pick<
      F1LapTime,
      "seconds"
    >)[];
  })[];
}

export interface F1QualifyingEliminationChart {
  /** `Q1 Q2 Q3` */
  segments: string[];
  eliminatedInQ1: number;
  eliminatedInQ2: number;
  reachedQ3: number;
  series: (F1Driver & {
    /** Qualifying position */
    position: number | null;
    q1: F1LapTime | null;
    q2: F1LapTime | null;
    q3: F1LapTime | null;
    /** `Q1` / `Q2`, or null when the driver reached Q3 */
    eliminatedIn: string | null;
  })[];
}

export type F1GridVsFinishEntry = F1Driver & {
  gridPosition: number | null;
  finishPosition: number | null;
  positionsGained: number | null;
};

export interface F1RaceCharts {
  gapToLeader?: F1GapToLeaderChart | null;
  weekendPositionTrack?: F1WeekendPositionTrackChart | null;
  paceEvolution?: F1PaceEvolutionChart | null;
  qualifyingElimination?: F1QualifyingEliminationChart | null;
  gridVsFinish?: F1GridVsFinishEntry[] | null;
}

export interface F1RaceSummary {
  eventId: string;
  name: string | null;
  shortName: string | null;
  seasonYear: number | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  completed: boolean;
  track: {
    name: string | null;
    city: string | null;
    country: string | null;
    picture: string | null;
    pictureSvg?: string | null;
    laps: number | null;
    lapLengthKm: number | null;
    raceDistanceKm?: number | null;
    turns?: number | null;
    direction?: string | null;
    established?: number | null;
    lapRecord?: {
      driver: string | null;
      time: string | null;
      year: number | null;
      team: string | null;
    } | null;
  } | null;
  winner: F1Winner | null;
  classification: F1ClassificationEntry[];
  /** Sessions not run yet are missing, so every chart may be partial or absent. */
  charts: F1RaceCharts | null;
}

export interface F1RaceStats {
  _id: string;
  /** Race Mongo `_id` */
  matchId: string;
  /** Race readable id, e.g. `F1-R3` */
  matchUniqueId: string;
  espnId: string;
  gameType: "racing";
  /** Last successful fetch */
  fetchedAt: string | null;
  createdAt: string;
  updatedAt: string;
  matchSummary: F1RaceSummary;
}

/** Body for `POST /match/matchStats/f1/race`. `name`/`year` default to the race's. */
export interface FetchF1RaceStatsPayload {
  /** Race `_id` or readable id (`F1-R3`) */
  matchId: string;
  /** ESPN's race name, which usually includes the sponsor */
  name?: string;
  /** Four digits, e.g. `2026` */
  year?: string;
}

/** Backend messages the UI branches on. */
export const F1_STATS_NOT_FOUND = "F1 race stats not found";
export const F1_RACE_NOT_ON_ESPN =
  "F1 race not found in the live score service";
