import { pendingSettlementListResponse } from "../../utils/pending-settlement-list";
import type { PlayEvent } from "@/app/interface/app-user.interface";

/** Every `ACTIVE` event, soonest entry close first; closed entries are included. */
export async function GET() {
  return pendingSettlementListResponse<PlayEvent>("/events/activeEvents", "active events");
}
