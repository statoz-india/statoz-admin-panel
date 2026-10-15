import { pendingSettlementListResponse } from "../../utils/pending-settlement-list";
import type { PendingPrediction } from "@/app/interface/pending-settlement.interface";

/** Predictions whose entry window has opened but that are not settled yet. */
export async function GET() {
  return pendingSettlementListResponse<PendingPrediction>(
    "/prediction/pendingSettlementPredictions",
    "pending settlement predictions",
  );
}
