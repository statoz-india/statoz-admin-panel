"use client";

import { CSSProperties, ReactNode, useState } from "react";

export type CardTier = "bronze" | "silver" | "gold" | "platinum";

export const TIER_COLOR: Record<CardTier, string> = {
  bronze: "#cd7f32",
  silver: "#cbd5e1",
  gold: "#facc15",
  platinum: "#67e8f9",
};

export const TIER_RANK: Record<CardTier, 0 | 1 | 2 | 3> = {
  bronze: 0,
  silver: 1,
  gold: 2,
  platinum: 3,
};

// Mirrors _foilColors / _foilStops — diagonal (top-left → bottom-right) foil.
export function foilGradient(tier: string, rank: number): string {
  const t = (a: number) => hexA(tier, a);
  switch (rank) {
    case 3: // platinum
      return `linear-gradient(135deg, #0b1426 0%, ${t(0.22)} 30%, #141d3a 50%, ${hexA(
        "#8b5cf6",
        0.18
      )} 72%, #0b1426 100%)`;
    case 2: // gold
      return `linear-gradient(135deg, #1a1606 0%, ${t(0.16)} 34%, #14130a 70%, #0f1118 100%)`;
    case 1: // silver
      return `linear-gradient(135deg, #141a24 0%, ${t(0.12)} 36%, #10151f 70%, #0e1118 100%)`;
    default: // bronze
      return `linear-gradient(135deg, #19120c 0%, ${t(0.1)} 50%, #120f0e 100%)`;
  }
}

// Diagonal foil stripes — CardStripePainter (tier @ 11%, every 18px).
export function stripeOverlay(tier: string): string {
  return `repeating-linear-gradient(45deg, ${hexA(tier, 0.11)} 0 1px, transparent 1px 18px)`;
}

// #rrggbb + alpha → rgba()  (equivalent of Color.withValues(alpha:))
export function hexA(hex: string, alpha: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

// Chamfered corners — HudChamferClipper / CyberClipper (bottom-right cut).
export const CHAMFER =
  "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)";

export function TierCard({
  tier,
  selected = false,
  disabled = false,
  selectedAccent = "#22d3ee",
  onClick,
  children,
}: {
  tier: CardTier;
  selected?: boolean;
  disabled?: boolean;
  selectedAccent?: string;
  onClick?: () => void;
  children?: ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const accent = TIER_COLOR[tier];
  const rank = TIER_RANK[tier];
  const hot = hovered && !disabled && !selected;

  const wrapper: CSSProperties = {
    transform: `translateY(${selected ? -5 : hot ? -3 : 0}px) scale(${hot ? 1.02 : 1})`,
    transition: "transform 150ms ease",
    boxShadow: hot ? `0 0 16px ${hexA(accent, 0.28)}` : "none",
    cursor: disabled ? "not-allowed" : "pointer",
    width: 128,
    height: 192,
  };

  const card: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    clipPath: CHAMFER,
    background: foilGradient(accent, rank),
    border: selected ? `2px solid ${selectedAccent}` : "none",
    filter: disabled ? "grayscale(1)" : "none",
    overflow: "hidden",
  };

  return (
    <div
      style={wrapper}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={disabled ? undefined : onClick}
    >
      <div style={card}>
        {/* diagonal foil stripes */}
        <div style={{ position: "absolute", inset: 0, background: stripeOverlay(accent) }} />
        {/* selection tint */}
        {selected && (
          <div style={{ position: "absolute", inset: 0, background: hexA(selectedAccent, 0.12) }} />
        )}
        <div style={{ position: "relative" }}>{children}</div>
      </div>
    </div>
  );
}
