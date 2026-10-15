import { pendingSettlementListResponse } from "../../utils/pending-settlement-list";
import type { PendingEvent } from "@/app/interface/pending-settlement.interface";

/** Events whose entry window has opened but that are not settled yet. */
export async function GET() {
  return pendingSettlementListResponse<PendingEvent>(
    "/events/pendingSettlementEvents",
    "pending settlement events",
  );
}
