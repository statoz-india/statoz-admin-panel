import type { Paginated } from "@/app/interface/pagination.interface";
import type {
  ProfileBanner,
  ProfilePic,
} from "@/app/interface/user-asset.interface";

export interface PaymentUser {
  _id: string;
  userName: string;
  email: string;
  avatarUrl?: string;
  userType: string;
  userStatus?: string;
  coins?: number;
}

export interface Payment {
  _id: string;
  userId: string;
  amount: number;
  currency: string;
  productId: string;
  status: string;
  transactionDate: string;
  verificationData?: {
    orderId?: string;
    purchaseToken?: string;
    [key: string]: unknown;
  };
  coinsCredited?: number;
  createdAt: string;
  updatedAt: string;
  user: PaymentUser | null;
}

export interface PurchasedProfilePic {
  _id: string;
  profilePicId: ProfilePic;
  purchasedAt: string;
  coinsUsed: number;
}

export interface PurchasedProfileBanner {
  _id: string;
  profileBannerId: ProfileBanner;
  purchasedAt: string;
  coinsUsed: number;
}

export interface UserAssetsRecord {
  _id: string;
  user: PaymentUser;
  profilePicsPurchased: PurchasedProfilePic[];
  profileBannersPurchased: PurchasedProfileBanner[];
  createdAt: string;
  updatedAt: string;
}

export const PAYMENTS_PAGE_SIZE = 50;

export type PaginatedPayments = Paginated<Payment>;
export type PaginatedUserAssetsRecords = Paginated<UserAssetsRecord>;

export interface ListPaymentsParams {
  page?: number;
  status?: string;
  productId?: string;
  userId?: string;
}

export interface ListUserAssetsParams {
  page?: number;
  userId?: string;
}
