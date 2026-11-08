import { NextResponse } from "next/server";
import type {
  DataSetItem,
  StatusPage,
} from "@/app/interface/data-set.interface";
import {
  dataSetPrefix,
  dataSetResponse,
  dataSetTabFrom,
} from "../../utils/data-set";

/**
 * One page of the tab's items. `?status=` is optional (missing = every status,
 * deleted and hidden included); `?page=` starts at 1, 50 items per page.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ tab: string }> },
) {
  const tab = await dataSetTabFrom(context.params);
  if (tab instanceof NextResponse) return tab;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status")?.trim() ?? "";
  const page = searchParams.get("page")?.trim() || "1";

  const statusPath = status ? `/${encodeURIComponent(status)}` : "";
  return dataSetResponse<StatusPage<DataSetItem>>(
    `${dataSetPrefix(tab)}/byStatus${statusPath}?page=${encodeURIComponent(page)}`,
    tab,
  );
}
