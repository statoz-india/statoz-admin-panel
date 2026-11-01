import { pendingSettlementListResponse } from "../../utils/pending-settlement-list";
import type { PendingEvent } from "@/app/interface/pending-settlement.interface";

/** Events an admin marked unresolved; they're left out of pending settlement. */
export async function GET() {
  return pendingSettlementListResponse<PendingEvent>(
    "/events/unresolvedEvents",
    "unresolved events",
  );
}
