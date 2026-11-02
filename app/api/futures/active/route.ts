import { pendingSettlementListResponse } from "../../utils/pending-settlement-list";
import type { PlayFuture } from "@/app/interface/app-user.interface";

/** Every `ACTIVE` future, soonest entry close first; closed entries are included. */
export async function GET() {
  return pendingSettlementListResponse<PlayFuture>("/futures/activeFutures", "active futures");
}
