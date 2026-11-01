import { pendingSettlementListResponse } from "../../utils/pending-settlement-list";
import type { PendingPrediction } from "@/app/interface/pending-settlement.interface";

/** Predictions an admin marked unresolved; they're left out of pending settlement. */
export async function GET() {
  return pendingSettlementListResponse<PendingPrediction>(
    "/prediction/unresolvedPredictions",
    "unresolved predictions",
  );
}
