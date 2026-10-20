import type { UserAssets } from "@/app/interface/userActivity.interface";
import { proxyUserActivity } from "../proxyUserActivity";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  return proxyUserActivity<UserAssets>(context, "userAssetsForAdmin", "user assets");
}
