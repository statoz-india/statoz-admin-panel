"use client";

import type { ReactNode } from "react";
import type { UserAssets as UserAssetsData } from "@/app/interface/userActivity.interface";
import ActivitySection from "@/app/users/[id]/ActivitySection";
import { formatDate, useUserActivity } from "@/app/users/[id]/useUserActivity";

type AssetTile = {
  key: string;
  /** null when the populated item was deleted. */
  image: string | null;
  name: string | null;
  sub?: string;
  meta: string;
  date: string;
};

function AssetGrid({
  title,
  tiles,
  imageClassName,
}: {
  title: string;
  tiles: AssetTile[];
  imageClassName: string;
}) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-gray-300 mb-2">
        {title} <span className="text-gray-500">({tiles.length})</span>
      </h3>
      {tiles.length === 0 ? (
        <p className="text-gray-500 text-sm">None.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {tiles.map((t) => (
            <div
              key={t.key}
              className={`rounded-lg border border-zinc-700 bg-zinc-950/60 p-2 text-xs ${
                t.name === null ? "opacity-50" : ""
              }`}
            >
              <div
                className={`mb-2 flex items-center justify-center overflow-hidden rounded bg-zinc-800 ${imageClassName}`}
              >
                {t.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.image}
                    alt={t.name ?? ""}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-gray-600">No image</span>
                )}
              </div>
              <p className="text-white font-medium truncate" title={t.name ?? undefined}>
                {t.name ?? "Deleted item"}
              </p>
              {t.sub && <p className="text-gray-500 truncate">{t.sub}</p>}
              <p className="text-gray-400 mt-1">{t.meta}</p>
              <p className="text-gray-600">{t.date}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const coins = (n: number) => (n > 0 ? `${n} coins` : "Free");

function Grids({ data }: { data: UserAssetsData }): ReactNode {
  const pics: AssetTile[] = (data.profilePicsPurchased ?? []).map((p, i) => ({
    key: p.profilePicId?._id ?? `pp-${i}`,
    image: p.profilePicId?.ppUrl ?? null,
    name: p.profilePicId?.ppName ?? null,
    sub: p.profilePicId?.teamAbbreviation ?? p.profilePicId?.team,
    meta: coins(p.coinsUsed),
    date: formatDate(p.purchasedAt),
  }));
  const banners: AssetTile[] = (data.profileBannersPurchased ?? []).map(
    (b, i) => ({
      key: b.profileBannerId?._id ?? `pb-${i}`,
      image: b.profileBannerId?.pbUrl ?? null,
      name: b.profileBannerId?.pbName ?? null,
      sub: b.profileBannerId?.teamAbbreviation ?? b.profileBannerId?.team,
      meta: coins(b.coinsUsed),
      date: formatDate(b.purchasedAt),
    }),
  );
  const players: AssetTile[] = (data.playerCards ?? []).map((c, i) => ({
    key: `${c.playerCardId?._id ?? "deleted"}-${i}`,
    image: c.playerCardId?.image ?? null,
    name: c.playerCardId?.name ?? null,
    sub: c.playerCardId
      ? [
          c.playerCardId.teamAbbreviation,
          c.playerCardId.cardType,
          c.playerCardId.finalRating,
        ]
          .filter((v) => v !== undefined && v !== null && v !== "")
          .join(" · ")
      : undefined,
    meta: `Source: ${c.source}`,
    date: formatDate(c.acquiredAt),
  }));
  const actions: AssetTile[] = (data.actionCards ?? []).map((c, i) => ({
    key: `${c.actionCardId?._id ?? "deleted"}-${i}`,
    image: c.actionCardId?.icon ?? null,
    name: c.actionCardId?.title ?? null,
    sub: c.actionCardId
      ? `${c.actionCardId.category} · Power ${c.actionCardId.basePower}${
          c.actionCardId.risky ? " · Risky" : ""
        }`
      : undefined,
    meta: `Source: ${c.source}`,
    date: formatDate(c.acquiredAt),
  }));

  return (
    <div className="space-y-6">
      <AssetGrid title="Profile pics" tiles={pics} imageClassName="aspect-square" />
      <AssetGrid title="Profile banners" tiles={banners} imageClassName="aspect-[3/1]" />
      <AssetGrid title="Player cards" tiles={players} imageClassName="aspect-[3/4]" />
      <AssetGrid title="Action cards" tiles={actions} imageClassName="aspect-square" />
    </div>
  );
}

type Props = { userId: string };

export default function UserAssets({ userId }: Props) {
  const { data, loading, error, load } = useUserActivity<UserAssetsData>(
    userId,
    "userAssetsForAdmin",
    "Failed to load user assets",
  );

  const total = data
    ? (data.profilePicsPurchased?.length ?? 0) +
      (data.profileBannersPurchased?.length ?? 0) +
      (data.playerCards?.length ?? 0) +
      (data.actionCards?.length ?? 0)
    : 0;

  return (
    <ActivitySection
      title="Assets"
      loading={loading}
      error={error}
      isEmpty={!data || total === 0}
      emptyText="The user doesn't own any assets yet."
      onRefresh={() => void load()}
      headerExtra={
        data ? <span className="text-sm text-gray-400">{total} owned</span> : null
      }
    >
      {data && <Grids data={data} />}
    </ActivitySection>
  );
}
