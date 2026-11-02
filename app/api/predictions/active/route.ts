import { pendingSettlementListResponse } from "../../utils/pending-settlement-list";
import type { PlayPrediction } from "@/app/interface/app-user.interface";

/** Every `ACTIVE` prediction, soonest match first. */
export async function GET() {
  return pendingSettlementListResponse<PlayPrediction>(
    "/prediction/activePredictions",
    "active predictions",
  );
}
