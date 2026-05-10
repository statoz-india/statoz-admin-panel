export enum Section {
  USERS = "users",
  MATCHES = "matches",
  QUIZZES = "quizzes",
  PREDICTIONS = "predictions",
  EVENTS = "events",
  FUTURES = "futures",
  LEADERBOARD = "leaderboard",
  TEAMS = "teams",
  NOTIFICATION = "notification",
}

export const VALID_SECTIONS = Object.values(Section);

const SECTION_SET = new Set<string>(VALID_SECTIONS);

export function isValidSection(value: string): value is Section {
  return SECTION_SET.has(value);
}

const SECTION_LABELS: Record<Section, string> = {
  [Section.USERS]: "Users",
  [Section.TEAMS]: "Teams",
  [Section.MATCHES]: "Matches",
  [Section.QUIZZES]: "Quizzes",
  [Section.PREDICTIONS]: "Predictions",
  [Section.EVENTS]: "Events",
  [Section.FUTURES]: "Futures",
  [Section.LEADERBOARD]: "Leaderboard",
  [Section.NOTIFICATION]: "Notification",
};

/** Sections shown in the sidebar, in display order. */
const SIDEBAR_SECTION_ORDER: readonly Section[] = [
  Section.USERS,
  Section.TEAMS,
  Section.MATCHES,
  Section.QUIZZES,
  Section.PREDICTIONS,
  Section.EVENTS,
  Section.FUTURES,
  Section.LEADERBOARD,
  Section.NOTIFICATION,
];

export type SidebarMenuItem = { id: Section; label: string };

export const SIDEBAR_MENU_ITEMS: readonly SidebarMenuItem[] =
  SIDEBAR_SECTION_ORDER.map((section) => ({
    id: section,
    label: SECTION_LABELS[section],
  }));
