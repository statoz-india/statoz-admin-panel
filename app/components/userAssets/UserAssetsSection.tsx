"use client";

import { useState } from "react";
import { ImageIcon, UserCircle2 } from "lucide-react";
import AssetCatalogTab from "./AssetCatalogTab";

type Tab = "banners" | "profilePics";

export default function UserAssetsSection() {
  const [tab, setTab] = useState<Tab>("profilePics");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
          <ImageIcon className="h-6 w-6 text-cyan-400" />
          User Assets
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Admin catalog for profile pics and profile banners — list, filter by
          team, preview paid shop items, and create new assets.
        </p>
      </div>

      <div className="mb-6 flex gap-2 border-b border-zinc-800">
        <TabButton
          active={tab === "profilePics"}
          onClick={() => setTab("profilePics")}
        >
          <UserCircle2 className="h-4 w-4" />
          Profile pics
        </TabButton>
        <TabButton active={tab === "banners"} onClick={() => setTab("banners")}>
          <ImageIcon className="h-4 w-4" />
          Banners
        </TabButton>
      </div>

      {tab === "profilePics" ? (
        <AssetCatalogTab
          kind="profilePic"
          title="Profile pics"
          emptyMessage="No profile pics found."
          previewAspect="square"
        />
      ) : (
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
