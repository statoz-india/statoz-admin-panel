import { NextResponse } from "next/server";
import type {
  KqQuestion,
  UpdateKqQuestionPayload,
} from "@/app/interface/knowledge-quiz.interface";
import {
  isObjectId,
  validateKqQuestionUpdate,
} from "@/app/interface/knowledge-quiz.interface";
import {
  authenticatedFetch,
  errorResponse,
  handleExternalApiResponse,
  successResponse,
} from "../../../utils/api-helper";
import { backendErrorMessage } from "../../proxy";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const { id } = await Promise.resolve(context.params);

    if (!isObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid question id" },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/knowledge-quiz/questions/${encodeURIComponent(id)}`,
    );

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          success: false,
          message: backendErrorMessage(
            errorText,
            `Failed to fetch question (Status: ${response.status})`,
          ),
        },
        { status: response.status || 500 },
      );
    }

    const body = await handleExternalApiResponse<{ data: KqQuestion }>(
      response,
    );

    return successResponse(body?.data, {
      status: 200,
      message: "Knowledge quiz question fetched successfully",
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching knowledge quiz question:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch question",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const { id } = await Promise.resolve(context.params);

    if (!isObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid question id" },
        { status: 400 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    const payload: UpdateKqQuestionPayload = {};

    if (body.questionText !== undefined) {
      payload.questionText =
        typeof body.questionText === "string"
          ? body.questionText.trim()
          : (body.questionText as string);
    }
    if (body.answerOptions !== undefined) {
      payload.answerOptions = Array.isArray(body.answerOptions)
        ? body.answerOptions.map((o) => (typeof o === "string" ? o.trim() : o))
        : (body.answerOptions as string[]);
    }
    if (body.correctAnswerIndex !== undefined) {
      payload.correctAnswerIndex = body.correctAnswerIndex as number[];
    }
    if (body.answerType !== undefined) {
      payload.answerType = body.answerType as UpdateKqQuestionPayload["answerType"];
    }
    if (body.xp !== undefined) {
      payload.xp = body.xp as number;
    }

    // `correctAnswer` is dropped: the server re-derives it from the indexes on
    // every write, so forwarding it can only mislead.
    //
    // `sportsType` is forwarded rather than dropped. Resending it unchanged is
    // allowed, and an actual change earns a precise 400 naming the kqQuestionId
    // that encodes the sport — far better than silently ignoring the request and
    // reporting success.
    const forwarded: Record<string, unknown> = { ...payload };
    if (body.sportsType !== undefined) {
      forwarded.sportsType = body.sportsType;
    }

    const hasEditableField = Object.keys(payload).length > 0;
    if (!hasEditableField && forwarded.sportsType === undefined) {
      return NextResponse.json(
        { success: false, message: "Provide at least one field to update" },
        { status: 400 },
      );
    }

    // A sportsType-only body has nothing for the local rules to check — the
    // backend owns that verdict.
    const failures = hasEditableField ? validateKqQuestionUpdate(payload) : [];
    if (failures.length > 0) {
      return NextResponse.json(
        { success: false, message: failures.join(", ") },
        { status: 400 },
      );
    }

    const response = await authenticatedFetch(
      `/knowledge-quiz/updateQuestion/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(forwarded),
      },
    );

    if (response.status === 401 || response.status === 498) {
      return await errorResponse("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          success: false,
          message: backendErrorMessage(
            errorText,
            `Failed to update question (Status: ${response.status})`,
          ),
        },
        { status: response.status || 500 },
      );
    }

    const updated = await handleExternalApiResponse<{ data: KqQuestion }>(
      response,
    );

    return successResponse(updated?.data, { status: 200 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error updating knowledge quiz question:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update question",
      },
      { status: 500 },
    );
  }
}
