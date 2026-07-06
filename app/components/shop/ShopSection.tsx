"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ImageIcon,
  ShoppingBag,
  Star,
  UserCircle2,
  Zap,
} from "lucide-react";
import {
  ActionCardsTab,
  PlayerCardsTab,
} from "@/app/components/playerCards/PlayerCardsSection";
import AssetCatalogTab from "@/app/components/userAssets/AssetCatalogTab";
import { stripAdminHomeQueryNoise } from "@/app/utils/buildAdminHomeHref";

type ShopTab = "player" | "action" | "profilePics" | "banners";

const SHOP_TABS: readonly ShopTab[] = [
  "player",
  "action",
  "profilePics",
  "banners",
];

function isShopTab(value: string | null): value is ShopTab {
  return SHOP_TABS.includes(value as ShopTab);
}

export default function ShopSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<ShopTab>(() => {
    const t = searchParams.get("shopTab");
    return isShopTab(t) ? t : "player";
  });

  useEffect(() => {
    const t = searchParams.get("shopTab");
    if (isShopTab(t)) {
      setTab(t);
    }
  }, [searchParams]);

  const setShopTab = useCallback(
    (next: ShopTab) => {
      setTab(next);
      const sp = new URLSearchParams(searchParams.toString());
      sp.set("section", "shop");
      sp.set("shopTab", next);
      stripAdminHomeQueryNoise("shop", sp);
      router.replace(`/?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
          <ShoppingBag className="h-6 w-6 text-cyan-400" />
          Shop
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Manage player cards, action cards, profile pics, and banners for the
          in-app shop.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-zinc-800">
        <TabButton
          active={tab === "player"}
          onClick={() => setShopTab("player")}
        >
          <Star className="h-4 w-4" />
          Player cards
        </TabButton>
        <TabButton
          active={tab === "action"}
          onClick={() => setShopTab("action")}
        >
          <Zap className="h-4 w-4" />
          Action cards
        </TabButton>
        <TabButton
          active={tab === "profilePics"}
          onClick={() => setShopTab("profilePics")}
        >
          <UserCircle2 className="h-4 w-4" />
          Profile pics
        </TabButton>
        <TabButton
          active={tab === "banners"}
          onClick={() => setShopTab("banners")}
        >
          <ImageIcon className="h-4 w-4" />
          Banners
        </TabButton>
      </div>

      {tab === "player" && <PlayerCardsTab />}
      {tab === "action" && <ActionCardsTab />}
      {tab === "profilePics" && (
        <AssetCatalogTab
          kind="profilePic"
          title="Profile pics"
          emptyMessage="No profile pics found."
          previewAspect="square"
        />
      )}
      {tab === "banners" && (
        <AssetCatalogTab
          kind="profileBanner"
          title="Profile banners"
          emptyMessage="No profile banners found."
          previewAspect="video"
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "border-cyan-500 text-white"
          : "border-transparent text-gray-400 hover:text-gray-200"
      }`}
    >
      {children}
    </button>
  );
}
