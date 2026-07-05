"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
} from "lucide-react";
import type { ProfileBanner, ProfilePic } from "@/app/interface/user-asset.interface";
import CreateProfileAssetModal from "./CreateProfileAssetModal";
import EditProfileAssetModal from "./EditProfileAssetModal";
import {
  type AssetKind,
  type CatalogItem,
  assetBusinessId,
  assetDescription,
  assetName,
  assetUrl,
  isItemFree,
  userAssetsApi,
} from "./user-assets-api";

type CatalogView = "all" | "paid";

type AssetCatalogTabProps = {
  kind: AssetKind;
  title: string;
  emptyMessage: string;
  previewAspect: "square" | "video";
};

const PAGE_SIZE = 20;

export default function AssetCatalogTab({
  kind,
  title,
  emptyMessage,
  previewAspect,
}: AssetCatalogTabProps) {
  const isPic = kind === "profilePic";

  const [catalogView, setCatalogView] = useState<CatalogView>("all");
  const [teamAbbreviations, setTeamAbbreviations] = useState<string[]>([]);
  const [teamFilter, setTeamFilter] = useState("");
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  const loadTeams = useCallback(async () => {
    try {
      const teams = isPic
        ? await userAssetsApi.profilePicTeamAbbreviations()
        : await userAssetsApi.profileBannerTeamAbbreviations();
      setTeamAbbreviations(Array.isArray(teams) ? teams : []);
    } catch {
      setTeamAbbreviations([]);
    }
  }, [isPic]);

  const fetchPage = useCallback(
    async (targetPage: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else {
        setLoading(true);
        setError(null);
      }

      try {
        if (teamFilter) {
          const data = isPic
            ? await userAssetsApi.profilePicsByTeam(teamFilter)
            : await userAssetsApi.profileBannersByTeam(teamFilter);
          setItems(data);
          setPage(1);
          setTotalPages(1);
          setTotal(data.length);
          setHasMore(false);
          return;
        }

        if (catalogView === "all") {
          const data = isPic
            ? await userAssetsApi.listProfilePics()
            : await userAssetsApi.listProfileBanners();
          setItems(data);
          setPage(1);
          setTotalPages(1);
          setTotal(data.length);
          setHasMore(false);
          return;
        }

        const res = isPic
          ? await userAssetsApi.listPaidProfilePics(targetPage, PAGE_SIZE)
          : await userAssetsApi.listPaidProfileBanners(targetPage, PAGE_SIZE);

        setItems((prev) =>
          append ? [...prev, ...res.items] : res.items,
        );
        setPage(res.page);
        setTotalPages(res.totalPages);
        setTotal(res.total);
        setHasMore(res.hasMore);
      } catch (e) {
        if (!append) {
          setItems([]);
          setError(
            e instanceof Error ? e.message : `Failed to load ${title.toLowerCase()}`,
          );
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [catalogView, isPic, teamFilter, title],
  );

  useEffect(() => {
    void loadTeams();
  }, [loadTeams]);

  useEffect(() => {
    void fetchPage(1, false);
  }, [fetchPage]);

  const handleCreated = (created: ProfilePic | ProfileBanner) => {
    setItems((prev) => [created, ...prev]);
    setTotal((t) => t + 1);
  };

  const handleUpdated = (updated: ProfilePic | ProfileBanner) => {
    setItems((prev) =>
      prev.map((item) => (item._id === updated._id ? updated : item)),
    );
  };

  const subtitle = teamFilter
    ? `${total} item${total !== 1 ? "s" : ""} for ${teamFilter}`
    : catalogView === "paid"
      ? `${total} paid item${total !== 1 ? "s" : ""} · page ${page}/${Math.max(totalPages, 1)}`
      : `${total} item${total !== 1 ? "s" : ""} in catalog`;

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <ViewToggle
            active={catalogView === "all"}
            onClick={() => {
              setCatalogView("all");
              setTeamFilter("");
            }}
            disabled={loading}
          >
            All catalog
          </ViewToggle>
          <ViewToggle
            active={catalogView === "paid"}
            onClick={() => {
              setCatalogView("paid");
              setTeamFilter("");
            }}
            disabled={loading}
          >
            Paid shop
          </ViewToggle>

          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            disabled={loading}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white"
          >
            <option value="">All teams</option>
            {teamAbbreviations.map((abbr) => (
              <option key={abbr} value={abbr}>
                {abbr}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void fetchPage(1, false)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-cyan-700"
          >
            <Plus className="h-4 w-4" />
            Create {isPic ? "pic" : "banner"}
          </button>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-400">{subtitle}</p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-800 bg-red-900/20 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 text-center text-gray-400">
          {emptyMessage}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <AssetCard
                key={item._id}
                item={item}
                previewAspect={previewAspect}
                onEdit={() => setEditingItem(item)}
              />
            ))}
          </div>

          {catalogView === "paid" && !teamFilter && totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => void fetchPage(page - 1, false)}
                disabled={loadingMore || page <= 1}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <span className="text-sm text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => void fetchPage(page + 1, false)}
                disabled={loadingMore || page >= totalPages}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
              {hasMore && (
                <button
                  type="button"
                  onClick={() => void fetchPage(page + 1, true)}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-md border border-cyan-800 bg-cyan-900/30 px-3 py-1.5 text-sm text-cyan-200 hover:bg-cyan-900/50 disabled:opacity-40"
                >
                  {loadingMore && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Load more
                </button>
              )}
            </div>
          )}
        </>
      )}

      {showCreate && (
        <CreateProfileAssetModal
          kind={kind}
          teamAbbreviations={teamAbbreviations}
          onClose={() => setShowCreate(false)}
          onSaved={handleCreated}
        />
      )}

      {editingItem && (
        <EditProfileAssetModal
          kind={kind}
          item={editingItem}
          teamAbbreviations={teamAbbreviations}
          onClose={() => setEditingItem(null)}
          onSaved={handleUpdated}
        />
      )}
    </div>
  );
}

function ViewToggle({
  active,
  onClick,
  disabled,
  children,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
        active
          ? "bg-white text-black"
          : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
      }`}
    >
      {children}
    </button>
  );
}

function AssetCard({
  item,
  previewAspect,
  onEdit,
}: {
  item: CatalogItem;
  previewAspect: "square" | "video";
  onEdit: () => void;
}) {
  const imageUrl = assetUrl(item);
  const description = assetDescription(item);
  const free = isItemFree(item);

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      <div
        className={`relative w-full bg-zinc-950 ${
          previewAspect === "square" ? "aspect-square" : "aspect-video"
        }`}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={assetName(item)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-600">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-white">{assetName(item)}</p>
          <span className="shrink-0 rounded bg-zinc-800 px-2 py-0.5 text-xs text-gray-300">
            {assetBusinessId(item)}
          </span>
        </div>

        {description && (
          <p className="line-clamp-2 text-xs text-gray-400">{description}</p>
        )}

        <div className="flex flex-wrap gap-2 text-xs">
          <span
            className={`rounded px-2 py-0.5 ${
              free
                ? "bg-green-900/40 text-green-300"
                : "bg-amber-900/40 text-amber-300"
            }`}
          >
            {free ? "Free" : `${item.coinValue ?? 0} coins`}
          </span>
          {item.teamAbbreviation && (
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-gray-300">
              {item.teamAbbreviation}
            </span>
          )}
          {item.sport && (
            <span className="rounded bg-zinc-800 px-2 py-0.5 capitalize text-gray-300">
              {item.sport}
            </span>
          )}
          {item.isVisible === false && (
            <span className="rounded bg-red-900/30 px-2 py-0.5 text-red-300">
              Hidden
            </span>
          )}
          {item.drop && (
            <span className="rounded bg-purple-900/30 px-2 py-0.5 text-purple-300">
              {item.drop}
            </span>
          )}
        </div>

        {item.team && (
          <p className="text-xs text-gray-500">Team: {item.team}</p>
        )}

        <a
          href={imageUrl}
          target="_blank"
          rel="noreferrer"
          className="block truncate text-xs text-cyan-400 hover:underline"
        >
          {imageUrl}
        </a>

        <button
          type="button"
          onClick={onEdit}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-zinc-800"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>
    </div>
  );
}
