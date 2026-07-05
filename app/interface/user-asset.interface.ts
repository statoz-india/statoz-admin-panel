import type { Paginated } from "@/app/interface/pagination.interface";

export const ASSET_SPORTS = ["cricket", "football", "basketball"] as const;
export type AssetSport = (typeof ASSET_SPORTS)[number];

export interface ProfilePic {
  _id: string;
  ppId: string;
  ppName: string;
  ppDescription?: string;
  ppUrl: string;
  team?: string;
  teamAbbreviation?: string;
  sport?: AssetSport;
  coinValue?: number;
  isVisible?: boolean;
  isFree?: boolean;
  drop?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileBanner {
  _id: string;
  pbId: string;
  pbName: string;
  pbDescription?: string;
  pbUrl: string;
  team?: string;
  teamAbbreviation?: string;
  sport?: AssetSport;
  coinValue?: number;
  isVisible?: boolean;
  isFree?: boolean;
  drop?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProfilePicInput {
  ppName: string;
  ppUrl: string;
  team: string;
  teamAbbreviation: string;
  sport: AssetSport;
  coinValue: number;
  ppDescription?: string;
  drop?: string;
  isVisible?: boolean;
}

export interface CreateProfileBannerInput {
  pbName: string;
  pbUrl: string;
  team: string;
  teamAbbreviation: string;
  sport: AssetSport;
  coinValue: number;
  pbDescription?: string;
  drop?: string;
  isVisible?: boolean;
}

export type PaginatedProfilePics = Paginated<ProfilePic>;
export type PaginatedProfileBanners = Paginated<ProfileBanner>;
