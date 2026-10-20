# Admin panel: user activity APIs

Four new backend endpoints let the admin panel show, for one user:

1. the motorsport quizzes they played and their score,
2. every mini-game they played and the result,
3. every asset they own (profile pics, banners, player cards, action cards),
4. whether they bought anything, and what.

They sit next to the existing `playedQuizzesForAdmin`, `playedPredictionsForAdmin`,
`playedEventsForAdmin` and `playedFuturesForAdmin` endpoints and behave the same way,
so the natural place for them is the existing user detail page in the admin panel.

---

## Common to all four

|            |                                                                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Base path  | `{API_BASE_URL}/api/v1/user`                                                                                                              |
| Method     | `GET`                                                                                                                                     |
| Path param | `userId`: the user's Mongo `_id` (24 hex chars)                                                                                           |
| Auth       | Superadmin only. Send the access token as the `accessToken` cookie or `Authorization: Bearer <token>`, the same as the other admin calls. |
| Pagination | None. Each call returns everything for that user.                                                                                         |

### Response envelope

Every response is wrapped like this:

```ts
type ApiResponse<T> = {
  statusCode: number;
  data: T;
  message: string;
  success: boolean; // statusCode < 400
};
```

### Errors

| Status | When                              | Body                                                                                     |
| ------ | --------------------------------- | ---------------------------------------------------------------------------------------- |
| 400    | `userId` is not a valid ObjectId  | `{ statusCode: 400, data: null, message: "Invalid user id", success: false }`            |
| 401    | Missing, invalid or expired token | `{ statusCode: 401, message: "...", success: false }`                                    |
| 403    | Logged in but not a superadmin    | `{ statusCode: 403, message: "Forbidden - SuperAdmin access required", success: false }` |

A valid id for a user who has never done anything returns **200 with empty data**, not 404.
Every section needs an empty state.

### Fetch helper (example)

```ts
// lib/adminUserActivity.ts
async function adminGet<T>(path: string, token: string): Promise<T> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user${path}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );
  const body = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !body.success) throw new Error(body.message);
  return body.data;
}

export const getUserMotorsportQuizzes = (userId: string, token: string) =>
  adminGet<MotorsportQuizSubmission[]>(
    `/playedMotorsportQuizzesForAdmin/${userId}`,
    token,
  );

export const getUserGames = (userId: string, token: string) =>
  adminGet<UserGames>(`/playedGamesForAdmin/${userId}`, token);

export const getUserAssets = (userId: string, token: string) =>
  adminGet<UserAssets>(`/userAssetsForAdmin/${userId}`, token);

export const getUserPayments = (userId: string, token: string) =>
  adminGet<UserPayments>(`/paymentsForAdmin/${userId}`, token);
```

Change the env var name and token handling to whatever the existing admin API calls use.

---

## 1. Motorsport quizzes played

`GET /api/v1/user/playedMotorsportQuizzesForAdmin/:userId`

Every motorsport quiz the user submitted, **newest first**. This is the same shape as
`playedQuizzesForAdmin`, but with a `match` (the race) instead of teams.

```ts
type MotorsportQuizSubmission = {
  submissionId: string;
  quizId: string; // MotorsportQuiz _id
  submissionTime: string; // ISO date
  obtainedXP?: number; // the score; missing until the quiz is settled
  xpCredited: boolean; // true once XP was paid to the user
  quiz: {
    quizId: string; // readable id
    quizStatus: QuizStatus;
    tournament: string; // Tournament _id
  } | null; // null if the quiz was deleted
  match: {
    _id: string;
    matchId: string; // readable race id, e.g. "F1-R3"
    name: string; // race name
    tournament: string;
    gameType: string;
    seasonYear: string;
    matchStatus: "Upcoming" | "Ongoing" | "Finished" | "Cancelled";
    raceStartTime?: string;
  } | null;
  questions: Array<{
    questionNumber: number;
    questionText: string | null;
    questionType: string | null;
    options?: string[];
    userAnswer: { option: string; value: string };
    correctAnswer: string | null; // null until answers are set
    correctAnswerOption: string | null;
  }>;
};

type QuizStatus =
  | "UPCOMING"
  | "LIVE"
  | "FINISHED"
  | "ENTRYNOTSTARTED"
  | "ENTRYCLOSED"
  | "SETTLEMENT_DONE"
  | "NOT_VISIBLE"
  | "ADMIN_VISIBLE"
  | "ANSWER_UPDATED"
  | "ABANDONED";
```

**Suggested UI:** a table with one row per submission showing race name, `matchId`,
submission time, quiz status, XP and "credited" (yes/no). Each row expands to show the
questions, with the user's answer next to the correct answer, highlighted as right or
wrong when `correctAnswer` is not null. If the existing quiz section already has an
expandable row, reuse that component, because the `questions` shape is identical.

---

## 2. Mini-games played

`GET /api/v1/user/playedGamesForAdmin/:userId`

Results from all 7 mini-games, grouped by game. Each list is **newest first**. Every
key is always present; a game the user never played has `matchesPlayed: 0` and
`results: []`.

```ts
type GameBlock<R> = { matchesPlayed: number; results: R[] };

type UserGames = {
  pitchDuel: GameBlock<PitchDuelResult>;
  penaltyShootout: GameBlock<PenaltyShootoutResult>;
  footballChess: GameBlock<FootballChessResult>;
  finalOver: GameBlock<FinalOverResult>;
  grandPrixDash: GameBlock<GrandPrixDashResult>;
  hoopDuel: GameBlock<HoopDuelResult>;
  tennisRally: GameBlock<TennisRallyResult>;
};
```

Every result has `_id`, `submittedUserId` and `createdAt` (when the game was played).
The fields worth showing for each game:

| Game              | Score                                      | Outcome             | XP                   | Other useful fields                                        |
| ----------------- | ------------------------------------------ | ------------------- | -------------------- | ---------------------------------------------------------- |
| `pitchDuel`       | `finalScore.user` – `finalScore.opponent`  | `finalScore.status` | `finalScore.xpDelta` | `hasUserWonToss`, `opponentId`                             |
| `penaltyShootout` | `finalScore` (a string, e.g. `"4-3"`)      | `finalMessage`      | `obtainedXp`         | `finalScoreMessage`, `opponentId`                          |
| `footballChess`   | `finalScore.user` – `finalScore.opponent`  | `finalScore.status` | `finalScore.xpDelta` | `gameMode`, `totalTurns`, `durationSeconds`, `abandoned`   |
| `finalOver`       | `scored` / `chasing` (`wicketLost` wkts)   | `message`           | `xpDelta`            | `chaseTier`, `sixes`, `fours`                              |
| `grandPrixDash`   | P`startingPosition` → P`finishingPosition` | `finalStatus`       | `xpDelta`            | `raceTime`, `totalCars`, `totalLap`                        |
| `hoopDuel`        | `finalYourScore` – `finalOpponentScore`    | `status`            | `xpDelta`            | `difficulty`, `dunks`, `blocks`, `steals`, `bestRun`       |
| `tennisRally`     | `finalYourScore` – `finalOpponentScore`    | `status`            | `xpDelta`            | `grade`, `longestRally`, `playingWinners`, `playingErrors` |

Note: penalty shootout spells it `obtainedXp`; every other game uses `xpDelta`.

The full result documents come back, including move-by-move logs (`duelLog` in pitch duel,
`kickLog` in penalty shootout, `lineup`/`goals` in football chess). Type only the fields
you show and ignore the rest. For a very active user this response can be large.

**Suggested UI:** a summary row of 7 cards (game name + `matchesPlayed`), then one
tab or accordion per game with a table: date, score, outcome, XP.

---

## 3. Assets owned

`GET /api/v1/user/userAssetsForAdmin/:userId`

Everything the user owns. The item details are already populated, so no further calls are needed.

```ts
type UserAssets = {
  userId: string;
  profilePicsPurchased: Array<{
    profilePicId: {
      // the full ProfilePic
      _id: string;
      ppId: string;
      ppName: string;
      ppDescription?: string;
      ppUrl: string; // full image URL
      team: string;
      teamAbbreviation: string;
      sport: string;
      coinValue: number;
    } | null; // null if the pic was deleted
    purchasedAt: string;
    coinsUsed: number; // 0 for free pics
  }>;
  profileBannersPurchased: Array<{
    profileBannerId: {
      // the full ProfileBanner
      _id: string;
      pbId: string;
      pbName: string;
      pbDescription?: string;
      pbUrl: string;
      team: string;
      teamAbbreviation: string;
      sport: string;
      coinValue: number;
    } | null;
    purchasedAt: string;
    coinsUsed: number;
  }>;
  playerCards: Array<{
    playerCardId: {
      // the full PlayerCards doc
      _id: string;
      playerId: string;
      name: string;
      shortName: string;
      image: string;
      team: string;
      teamAbbreviation: string;
      position: string;
      playerType: string;
      cardType: string;
      finalRating: number;
      coinValue: number;
    } | null;
    acquiredAt: string;
    source:
      | "admin"
      | "pack"
      | "reward"
      | "daily-drop"
      | "starter-pack"
      | "bought";
  }>;
  actionCards: Array<{
    actionCardId: {
      _id: string;
      baseId: string;
      title: string;
      category: string;
      basePower: number;
      risky: boolean;
      icon: string;
    } | null;
    acquiredAt: string;
    source:
      | "admin"
      | "pack"
      | "reward"
      | "daily-drop"
      | "starter-pack"
      | "bought";
  }>;
};
```

**Suggested UI:** four grids (profile pics, banners, player cards, action cards) with a
count in each heading. For each item show the image and name, plus `coinsUsed` or `source`
and the date. Skip or grey out entries whose populated item is `null`.

---

## 4. Purchases

`GET /api/v1/user/paymentsForAdmin/:userId`

The user's real-money in-app purchases, **newest first**.

```ts
type UserPayments = {
  hasPurchased: boolean; // false → user has never paid
  totalPayments: number; // number of payment records
  totalAmount: number; // sum of `amount`, mixed currencies are added as-is
  payments: Array<{
    _id: string;
    userId: string;
    amount: number;
    currency: string; // e.g. "INR", "USD"
    productId: string;
    status: string; // "success" for verified purchases
    transactionDate: string;
    platform?: string; // the store the purchase came from
    orderId?: string;
    coinsCredited: number;
    createdAt: string;
    updatedAt: string;
  }>;
};
```

`verificationData` (the store receipt) and `purchaseToken` are deliberately not returned.

**Suggested UI:** a badge near the user's name, **Paying user** or **Never paid**, from
`hasPurchased`. Below it, a table with date, product, amount + currency, coins credited,
platform, order id and status. If a user can pay in more than one currency, show totals
per currency instead of `totalAmount`.

---

## Checklist

- [ ] Add the four fetch functions and types.
- [ ] Add four sections or tabs to the user detail page: **Motorsport quizzes**, **Games**, **Assets**, **Purchases**.
- [ ] Load each section on its own (separate request, its own loading and error state), so one slow call doesn't block the page.
- [ ] Empty state for every section and for every game with `matchesPlayed: 0`.
- [ ] Handle `null` populated items (deleted pics, banners, cards, quizzes).
- [ ] Dates come back as UTC ISO strings; format them the same way as the rest of the admin panel.
- [ ] Handle 401/403 the same way as the other admin calls (redirect to login / show "no access").
