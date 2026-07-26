export const GAME_TYPE_OPTIONS = ["cricket", "football", "basketball"] as const;

export type GameType = (typeof GAME_TYPE_OPTIONS)[number];

export function isGameType(value: unknown): value is GameType {
  return (
    typeof value === "string" &&
    (GAME_TYPE_OPTIONS as readonly string[]).includes(value)
  );
}
