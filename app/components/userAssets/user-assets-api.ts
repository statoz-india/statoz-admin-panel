"use client";

import type {
  CreateProfileBannerInput,
  CreateProfilePicInput,
  PaginatedProfileBanners,
  PaginatedProfilePics,
  ProfileBanner,
  ProfilePic,
} from "@/app/interface/user-asset.interface";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/user-assets${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) {
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }
  return body.data as T;
}

function qs(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export const userAssetsApi = {
  listProfilePics: () => request<ProfilePic[]>("/profile-pics"),
  listPaidProfilePics: (page = 1, limit = 50) =>
    request<PaginatedProfilePics>(
      `/profile-pics/paid${qs({ page, limit })}`,
    ),
  profilePicTeamAbbreviations: () =>
    request<string[]>("/profile-pics/team-abbreviations"),
  profilePicsByTeam: (teamAbbreviation: string) =>
    request<ProfilePic[]>(
      `/profile-pics/by-team/${encodeURIComponent(teamAbbreviation)}`,
    ),
  getProfilePic: (ppId: string) =>
    request<ProfilePic>(`/profile-pics/${encodeURIComponent(ppId)}`),
  createProfilePic: (input: CreateProfilePicInput) =>
    request<ProfilePic>("/profile-pics", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  listProfileBanners: () => request<ProfileBanner[]>("/profile-banners"),
  listPaidProfileBanners: (page = 1, limit = 50) =>
    request<PaginatedProfileBanners>(
      `/profile-banners/paid${qs({ page, limit })}`,
    ),
  profileBannerTeamAbbreviations: () =>
    request<string[]>("/profile-banners/team-abbreviations"),
  profileBannersByTeam: (teamAbbreviation: string) =>
    request<ProfileBanner[]>(
      `/profile-banners/by-team/${encodeURIComponent(teamAbbreviation)}`,
    ),
  getProfileBanner: (pbId: string) =>
    request<ProfileBanner>(`/profile-banners/${encodeURIComponent(pbId)}`),
  createProfileBanner: (input: CreateProfileBannerInput) =>
    request<ProfileBanner>("/profile-banners", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};

export type AssetKind = "profilePic" | "profileBanner";

export type CatalogItem = ProfilePic | ProfileBanner;

export function isProfilePic(item: CatalogItem): item is ProfilePic {
  return "ppId" in item;
}

export function assetBusinessId(item: CatalogItem): string {
  return isProfilePic(item) ? item.ppId : item.pbId;
}

export function assetName(item: CatalogItem): string {
  return isProfilePic(item) ? item.ppName : item.pbName;
}

export function assetUrl(item: CatalogItem): string {
  return isProfilePic(item) ? item.ppUrl : item.pbUrl;
}

export function assetDescription(item: CatalogItem): string | undefined {
  return isProfilePic(item) ? item.ppDescription : item.pbDescription;
}

export function isItemFree(item: CatalogItem): boolean {
  if (item.isFree === true) return true;
  if (item.isFree === false) return false;
  return (item.coinValue ?? 0) === 0;
}
