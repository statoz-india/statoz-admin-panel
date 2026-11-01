import type { NextRequest } from "next/server";
import {
  SETTLEMENT_FAILURE_QUERY_KEYS,
  type SettlementFailure,
} from "@/app/interface/settlement-failure.interface";
import type { Paginated } from "@/app/interface/pagination.interface";
import { proxyAdminGet } from "../../utils/admin-get-proxy";

/** Settlement requests the service rejected or never answered, latest first. */
export async function GET(request: NextRequest) {
  return proxyAdminGet<Paginated<SettlementFailure>>(
    "/admin-data/getSettlementFailures",
    new URL(request.url).searchParams,
    SETTLEMENT_FAILURE_QUERY_KEYS,
    "settlement failures",
  );
}
