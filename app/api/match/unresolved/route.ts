import { pendingSettlementListResponse } from "../../utils/pending-settlement-list";
import type { PendingMatch } from "@/app/interface/pending-settlement.interface";

/** Matches that have started but have no final `matchStatus` yet. */
export async function GET() {
  return pendingSettlementListResponse<PendingMatch>(
    "/match/unresolvedMatches",
    "unresolved matches",
  );
}
