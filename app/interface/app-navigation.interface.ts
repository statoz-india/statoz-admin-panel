export const APP_OS = ["android", "ios"] as const;

export type AppOs = (typeof APP_OS)[number];

export function isAppOs(value: string): value is AppOs {
  return (APP_OS as readonly string[]).includes(value);
}

export interface NavigationConfig {
  tabs: string[];
  navbar: string[];
  shopTabs: string[];
  matchesTabs: string[];
}

/** Independently configurable lists, in display order. */
export const NAV_LISTS = ["tabs", "navbar", "shopTabs", "matchesTabs"] as const;

export type NavList = (typeof NAV_LISTS)[number];

export interface VersionNavigationConfig extends NavigationConfig {
  os: AppOs;
  version: string;
}

export interface AppNavigationOverview {
  default: NavigationConfig;
  versions: VersionNavigationConfig[];
}

export type UpdateDefaultBody = NavigationConfig;

export type UpsertVersionBody = VersionNavigationConfig;

export interface DeleteVersionBody {
  os: AppOs;
  version: string;
}

/** Resolved config for an os/version, mirroring the app-side lookup. */
export interface ResolvedNavigation extends NavigationConfig {
  os: AppOs;
  version: string;
  source: "version" | "default";
}

/**
 * Backend defaults. Values are case-sensitive and must match the identifiers
 * the app knows — a wrong case is accepted by the API but fails silently in
 * the app.
 */
export const SUGGESTED_TABS = ["MATCH", "GAMES"] as const;
export const SUGGESTED_NAVBAR = ["SPORTS", "TOP", "SHOP", "PROFILE"] as const;
export const SUGGESTED_SHOP_TABS = [
  "COINS",
  "AVATAR",
  "BANNER",
  "CARDS",
] as const;
export const SUGGESTED_MATCHES_TABS = ["PREDICT", "PICKS"] as const;

export const NAV_LIST_META: Record<
  NavList,
  { label: string; hint: string; suggestions: readonly string[] }
> = {
  tabs: {
    label: "Tabs",
    hint: "Main content tabs",
    suggestions: SUGGESTED_TABS,
  },
  navbar: {
    label: "Navbar",
    hint: "Bottom navigation bar",
    suggestions: SUGGESTED_NAVBAR,
  },
  shopTabs: {
    label: "Shop tabs",
    hint: "Tabs inside the Shop screen",
    suggestions: SUGGESTED_SHOP_TABS,
  },
  matchesTabs: {
    label: "Matches tabs",
    hint: "Tabs inside the Matches / MATCH screen",
    suggestions: SUGGESTED_MATCHES_TABS,
  },
};

/** Navbar entry that has to be present for the Shop screen to be reachable. */
export const SHOP_NAVBAR_ENTRY = "SHOP";

/** Main tab that hosts the matchesTabs list. */
export const MATCH_TAB_ENTRY = "MATCH";

export const OS_LABELS: Record<AppOs, string> = {
  android: "Android",
  ios: "iOS",
};
