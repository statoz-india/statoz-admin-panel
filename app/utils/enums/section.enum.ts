export enum Section {
  DASHBOARD = "dashboard",
  USERS = "users",
  PAYMENTS = "payments",
  MATCHES = "matches",
  TOURNAMENTS = "tournaments",
  GAMES = "games",
  QUIZZES = "quizzes",
  PREDICTIONS = "predictions",
  EVENTS = "events",
  FUTURES = "futures",
  LEADERBOARD = "leaderboard",
  TEAMS = "teams",
  NOTIFICATION = "notification",
  BOT_USERS = "botusers",
  SHOP = "shop",
  PLAYER_CARDS = "playercards",
  USER_CARDS = "usercards",
  USER_ASSETS = "userassets",
  STATOZ_GAMES = "statoz_games",
  APP_NAVIGATION = "appnavigation",
}

export const VALID_SECTIONS = Object.values(Section);

const SECTION_SET = new Set<string>(VALID_SECTIONS);

export function isValidSection(value: string): value is Section {
  return SECTION_SET.has(value);
}

const SECTION_LABELS: Record<Section, string> = {
  [Section.DASHBOARD]: "Dashboard",
  [Section.USERS]: "Users",
  [Section.PAYMENTS]: "Payments",
  [Section.TOURNAMENTS]: "Tournaments",
  [Section.GAMES]: "Games",
  [Section.TEAMS]: "Teams",
  [Section.MATCHES]: "Matches",
  [Section.QUIZZES]: "Quizzes",
  [Section.PREDICTIONS]: "Predictions",
  [Section.EVENTS]: "Events",
  [Section.FUTURES]: "Futures",
  [Section.LEADERBOARD]: "Leaderboard",
  [Section.NOTIFICATION]: "Notification",
  [Section.BOT_USERS]: "Bot Users",
  [Section.SHOP]: "Shop",
  [Section.PLAYER_CARDS]: "Player Cards",
  [Section.USER_CARDS]: "User Cards",
  [Section.USER_ASSETS]: "User Assets",
  [Section.STATOZ_GAMES]: "Statoz Games",
  [Section.APP_NAVIGATION]: "App Navigation",
};

/** Sections shown in the sidebar, in display order. */
const SIDEBAR_SECTION_ORDER: readonly Section[] = [
  Section.DASHBOARD,
  Section.USERS,
  Section.PAYMENTS,
  Section.TOURNAMENTS,
  Section.GAMES,
  Section.MATCHES,
  Section.QUIZZES,
  Section.PREDICTIONS,
  Section.EVENTS,
  Section.FUTURES,
  Section.LEADERBOARD,
  Section.NOTIFICATION,
  Section.BOT_USERS,
  Section.SHOP,
  Section.USER_CARDS,
  Section.STATOZ_GAMES,
  Section.APP_NAVIGATION,
];

export type SidebarMenuItem = { id: Section; label: string };

export const SIDEBAR_MENU_ITEMS: readonly SidebarMenuItem[] =
  SIDEBAR_SECTION_ORDER.map((section) => ({
    id: section,
    label: SECTION_LABELS[section],
  }));
