# Admin Game Result Routes — Next.js Integration

Admin-facing endpoints to browse **every** penalty shootout and pitch duel
played across all users. All four require **`verifyJWT` + `verifySuperAdmin`** —
the JWT must belong to a user whose `userType` is `superadmin`, otherwise the
request returns `403 Forbidden`.

> Base URL example: `https://api.statoz.app`
> Set it via `API_BASE_URL` (server-side) or `NEXT_PUBLIC_API_BASE_URL`.

## Auth

```
Authorization: Bearer <accessToken>
```

| Status | Meaning                                                                   |
| ------ | ------------------------------------------------------------------------- |
| `401`  | Missing/invalid JWT — `Unauthorized - Please login first as a superadmin` |
| `403`  | Logged in but not superadmin — `Forbidden - SuperAdmin access required`   |
| `400`  | Invalid `:id` (not a Mongo ObjectId)                                      |
| `404`  | Result not found                                                          |

All responses use the standard envelope:

```jsonc
{
  "statusCode": 200,
  "data": {
    /* payload */
  },
  "message": "Penalty shootout results fetched successfully",
  "success": true,
}
```

---

## Route reference

| #   | Method | Path                                                        | Action                        |
| --- | ------ | ----------------------------------------------------------- | ----------------------------- |
| 1   | `GET`  | `/api/v1/penalty-shootout/admin/penaltyShootoutResults`     | List all penalty shootouts    |
| 2   | `GET`  | `/api/v1/penalty-shootout/admin/penaltyShootoutResults/:id` | One penalty shootout (detail) |
| 3   | `GET`  | `/api/v1/pitch-duel/admin/pitchDuelResults`                 | List all pitch duels          |
| 4   | `GET`  | `/api/v1/pitch-duel/admin/pitchDuelResults/:id`             | One pitch duel (detail)       |

### List query params (routes 1 & 3)

| Param             | Values     | Notes                         |
| ----------------- | ---------- | ----------------------------- |
| `page`            | number ≥ 1 | default `1`                   |
| `limit`           | 1–100      | default `20`, clamped to 100  |
| `submittedUserId` | ObjectId   | filter by the submitting user |
| `opponentId`      | ObjectId   | filter by the bot opponent    |

Results are sorted newest first (`createdAt` desc). List `data` is paginated:

```ts
interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}
```

---

## Response shapes

```ts
// Shared list item — penalty shootout
export interface PenaltyShootoutListItem {
  _id: string;
  submittedUserId: string;
  username: string; // taker (user) username from kick log
  opponentUsername: string; // bot username from kick log
  finalScore: string; // e.g. "3 - 2"
  finalMessage: string;
  finalScoreMessage: string;
  obtainedXp: number;
  isWin: boolean;
  userGoals: number;
  opponentGoals: number;
  totalRounds: number;
  playedAt: string; // ISO date
}

// Detail (route 2) = list item + kick log + timestamps
export interface PenaltyKickDetail {
  userId: string;
  username: string;
  isOpponent: boolean;
  shoot: "left" | "center" | "right";
  dive: "left" | "center" | "right";
  isGoal: boolean;
  taker_id: string;
  taker_card_details: CardDetails | null;
  keeper_id: string;
  keeper_card_details: CardDetails | null;
}
export interface PenaltyShootoutDetail extends PenaltyShootoutListItem {
  kickLog: PenaltyKickDetail[];
  createdAt: string;
  updatedAt: string;
}

// Shared list item — pitch duel
export interface PitchDuelListItem {
  _id: string;
  submittedUserId: string;
  username: string;
  opponentId?: string;
  opponentUsername: string;
  toss: "heads" | "tails";
  tossUserSelection: "attack" | "defend";
  hasUserWonToss: boolean;
  userScore: number;
  opponentScore: number;
  status: string;
  xpDelta: number;
  mvp: string; // player card id
  isWin: boolean;
  totalRounds: number;
  playedAt: string;
}

// Detail (route 4) = list item + finalScore (with mvp card) + duelLog + timestamps
export interface PitchDuelDetail extends PitchDuelListItem {
  finalScore: {
    user: number;
    opponent: number;
    status: string;
    xpDelta: number;
    mvp: string;
    mvp_card_details: CardDetails | null;
  };
  duelLog: unknown[]; // per-round detail (currentUser/opponentUser cards, result, score, ...)
  createdAt: string;
  updatedAt: string;
}

export type CardDetails = Record<string, unknown> | null;
```

---

## Next.js API client

`lib/admin-game-results.ts` — SSR-safe; pass the superadmin token explicitly.

```ts
// lib/admin-game-results.ts
import type {
  Paginated,
  PenaltyShootoutListItem,
  PenaltyShootoutDetail,
  PitchDuelListItem,
  PitchDuelDetail,
} from "@/types/game-results";

const BASE_URL =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface ApiEnvelope<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

interface ListParams {
  page?: number;
  limit?: number;
  submittedUserId?: string;
  opponentId?: string;
}

function qs(params: Record<string, unknown>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

async function request<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok || !body.success) {
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }
  return body.data;
}

/* ---------- Penalty shootout ---------- */

export const listPenaltyShootouts = (token: string, params: ListParams = {}) =>
  request<Paginated<PenaltyShootoutListItem>>(
    `/api/v1/penalty-shootout/admin/penaltyShootoutResults${qs(params)}`,
    token,
  );

export const getPenaltyShootout = (token: string, id: string) =>
  request<PenaltyShootoutDetail>(
    `/api/v1/penalty-shootout/admin/penaltyShootoutResults/${id}`,
    token,
  );

/* ---------- Pitch duel ---------- */

export const listPitchDuels = (token: string, params: ListParams = {}) =>
  request<Paginated<PitchDuelListItem>>(
    `/api/v1/pitch-duel/admin/pitchDuelResults${qs(params)}`,
    token,
  );

export const getPitchDuel = (token: string, id: string) =>
  request<PitchDuelDetail>(
    `/api/v1/pitch-duel/admin/pitchDuelResults/${id}`,
    token,
  );
```

---

## Server Component example (App Router)

`app/admin/penalty-shootouts/page.tsx`:

```tsx
import { cookies } from "next/headers";
import { listPenaltyShootouts } from "@/lib/admin-game-results";

export default async function PenaltyShootoutsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const token = cookies().get("accessToken")?.value;
  if (!token) return <p>Not authenticated</p>;

  const page = Number(searchParams.page ?? 1);
  const { items, total, totalPages, hasMore } = await listPenaltyShootouts(
    token,
    { page, limit: 20 },
  );

  return (
    <div>
      <h1>Penalty Shootouts ({total})</h1>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Opponent</th>
            <th>Score</th>
            <th>Result</th>
            <th>XP</th>
            <th>Played</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r._id}>
              <td>{r.username}</td>
              <td>{r.opponentUsername}</td>
              <td>{r.finalScore}</td>
              <td>{r.isWin ? "Win" : "Loss"}</td>
              <td>{r.obtainedXp}</td>
              <td>{new Date(r.playedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Page {page} / {totalPages} {hasMore ? "(more)" : ""}
      </p>
    </div>
  );
}
```

The pitch duel list page is identical — swap `listPitchDuels` and render
`userScore`/`opponentScore`/`status` columns.

---

## Route Handler proxy (optional)

Keep the token server-side and let the browser call your own API.

`app/api/admin/penalty-shootouts/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { listPenaltyShootouts } from "@/lib/admin-game-results";

export async function GET(req: NextRequest) {
  const token = cookies().get("accessToken")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const sp = req.nextUrl.searchParams;
    const data = await listPenaltyShootouts(token, {
      page: Number(sp.get("page") ?? 1),
      limit: Number(sp.get("limit") ?? 20),
      submittedUserId: sp.get("submittedUserId") ?? undefined,
      opponentId: sp.get("opponentId") ?? undefined,
    });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 400 },
    );
  }
}
```

---

## curl smoke tests

```bash
TOKEN="<superadmin-jwt>"
API="https://api.statoz.app"

# 1. List penalty shootouts (filter by user)
curl "$API/api/v1/penalty-shootout/admin/penaltyShootoutResults?page=1&limit=20&submittedUserId=<userId>" \
  -H "Authorization: Bearer $TOKEN"

# 2. Penalty shootout detail
curl "$API/api/v1/penalty-shootout/admin/penaltyShootoutResults/<id>" \
  -H "Authorization: Bearer $TOKEN"

# 3. List pitch duels
curl "$API/api/v1/pitch-duel/admin/pitchDuelResults?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"

# 4. Pitch duel detail
curl "$API/api/v1/pitch-duel/admin/pitchDuelResults/<id>" \
  -H "Authorization: Bearer $TOKEN"
```
