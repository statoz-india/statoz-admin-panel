import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";

export interface UserXP {
  totalXP: number;
  [key: string]: number;
}

/** One tournament the user follows, with the teams they picked in it. Both are
 * Mongo ids — resolve them against the tournament and team lists to display. */
export interface UserClubAndTeams {
  tournament: string;
  teams: string[];
}

export interface UserDataForAdmin {
  _id: string;
  userName: string;
  email: string;
  userType: string;
  coins: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  xp: UserXP;
  gameXp?: UserXP;
  firebaseUid?: string;
  authProvider?: string;
  emailVerified?: boolean;
  avatarUrl?: string;
  bannerUrl?: string;
  profilePic?: string;
  profileBanner?: string;
  userStatus?: string;
  sportsType?: string[];
  clubAndTeams?: UserClubAndTeams[];
  showQuizWalkthrough?: boolean;
  showPredictionWalkThrough?: boolean;
  showPenaltyShootoutTooltip?: boolean;
  showPitchDuelTooltip?: boolean;
  showHomePageInfoBanner?: boolean;
}

type BackendUserResponse = {
  statusCode: number;
  data: UserDataForAdmin;
  message?: string;
  success?: boolean;
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const params = await Promise.resolve(context.params);
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(`/user/userDataForAdmin/${id}`);
    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    const data = await handleExternalApiResponse<BackendUserResponse>(response);

    return successResponse(data.data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching user data for admin:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user data",
      },
      { status: 500 },
    );
  }
}
