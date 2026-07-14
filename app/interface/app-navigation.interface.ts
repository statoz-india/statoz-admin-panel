export const APP_OS = ["android", "ios"] as const;

export type AppOs = (typeof APP_OS)[number];

export function isAppOs(value: string): value is AppOs {
  return (APP_OS as readonly string[]).includes(value);
}

export interface NavigationConfig {
  tabs: string[];
  navbar: string[];
}

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

export const SUGGESTED_TABS = ["Predict", "Pick", "Games"] as const;
export const SUGGESTED_NAVBAR = ["Match", "Top", "Shop", "Profile"] as const;

export const OS_LABELS: Record<AppOs, string> = {
  android: "Android",
  ios: "iOS",
};
