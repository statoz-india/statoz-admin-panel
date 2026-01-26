import { NextResponse } from "next/server";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../utils/api-helper";
import { Quiz } from "../route";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const params = await Promise.resolve(context.params);
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Quiz ID is required",
        },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(`/quiz/${id}`);
    if (response.status === 401) {
      return await errorResponse();
    }
    const data = await handleExternalApiResponse<Quiz>(response);
    console.log(data);
    return successResponse(data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch quizes",
      },
      { status: 500 },
    );
  }
}
