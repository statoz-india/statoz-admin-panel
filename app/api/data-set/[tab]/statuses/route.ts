import { NextResponse } from "next/server";
import {
  dataSetPrefix,
  dataSetResponse,
  dataSetTabFrom,
} from "../../../utils/data-set";

/** Every valid status for the tab, in the backend's declared order. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ tab: string }> },
) {
  const tab = await dataSetTabFrom(context.params);
  if (tab instanceof NextResponse) return tab;
  return dataSetResponse<string[]>(
    `${dataSetPrefix(tab)}/statuses`,
    `${tab} statuses`,
  );
}
