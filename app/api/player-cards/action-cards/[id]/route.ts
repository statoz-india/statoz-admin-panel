// PUT    /api/player-cards/action-cards/:id -> backend PUT    /player-cards/action-cards/update/:id
// DELETE /api/player-cards/action-cards/:id -> backend DELETE /player-cards/action-cards/delete/:id

import { NextRequest, NextResponse } from "next/server";
import type {
  ActionCard,
  UpdateActionCardInput,
} from "@/app/interface/player-card.interface";
import { proxyPlayerCards } from "../../proxy";

type Context = { params: Promise<{ id: string }> | { id: string } };

async function getId(context: Context): Promise<string | null> {
  const params = await Promise.resolve(context.params);
  return params.id?.trim() || null;
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    const id = await getId(context);
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Action card id is required" },
        { status: 400 },
      );
    }

    const body = (await request.json()) as UpdateActionCardInput;

    return await proxyPlayerCards<ActionCard>(
      `/player-cards/action-cards/update/${encodeURIComponent(id)}`,
      { method: "PUT", body: JSON.stringify(body) },
      "Failed to update action card",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error updating action card:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update action card" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  try {
    const id = await getId(context);
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Action card id is required" },
        { status: 400 },
      );
    }

    return await proxyPlayerCards<{ _id: string }>(
      `/player-cards/action-cards/delete/${encodeURIComponent(id)}`,
      { method: "DELETE" },
      "Failed to delete action card",
    );
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error deleting action card:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete action card" },
      { status: 500 },
    );
  }
}
