# Architecture

This document covers how the panel works under the hood. To find out what each screen does, see [features.md](features.md).

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS 4, `lucide-react` icons, `react-loading-indicators` (`Atom` loader) |
| Client state | Zustand (`app/store/authStore.ts`), persisted to `localStorage` as `auth-storage` |
| Charts | Recharts |
| Live data | `socket.io-client` |
| Dates | `date-fns`, `react-day-picker`, `react-time-picker` |
| Tests | Vitest, Testing Library, jsdom |

Almost every page is a client component (`"use client"`). The server side of the app is only the API routes under `app/api`.

## Configuration

| Variable | Used by | Purpose |
| --- | --- | --- |
| `API_BASE_URL` | every proxy route (`app/api/utils/api-helper.ts`) | Base URL of the Statoz backend. It is server-only and never sent to the browser. |
| `SOCKET_URL` | `app/api/socket-config/route.ts` | Optional origin for the live-stats Socket.IO server. It defaults to the API origin. The backend's `CORS_ORIGIN` must list the panel's origin. |

Both live in `.env`. Times in the panel are shown and entered in **IST**, because the admins are in India.

## Code layout

```
app/
  page.tsx                  Home shell: sidebar + the active section (?section=…)
  layout.tsx                Root layout; mounts <SessionGuard/>
  login/                    Email + OTP sign-in
  components/<area>/        One folder per section (MatchesSection, TrendingSection, …)
  match/[id]/, quiz/[id]/…  Detail pages opened from sections
  api/**/route.ts           Proxy routes to the backend (and scrapers)
  api/utils/                Auth/session helpers, answer engines, source scrapers
  constants/                Status enums (match, quiz, prediction, event, future), game types
  interface/, models/       TypeScript shapes of backend payloads
  utils/                    Client helpers (apiRequest, session, URL helpers, curl parser…)
  store/authStore.ts        Signed-in admin
  hooks/                    useAuthHydrated, …
tests/                      api/, client/, unit/, fixtures/, helpers/
docs/                       bugs.md, test-coverage.md, technical/
```

## Navigation model

The panel is mostly one page.

- `/` renders the sidebar and one **section**, chosen by `?section=<id>`. The section ids are the `Section` enum in `app/utils/enums/section.enum.ts`.
- Sub-tabs and filters also live in the URL, so any view can be bookmarked or shared and survives a reload. Examples are `shopTab`, `paymentsTab`, `trendingTab`, `matchTournament`, `matchDate`, `matchesTab`, `gamesTab`, `kqTab`, `unresolvedTab`, `leaderboardTab` and `contactIssue`.
- Switching sections calls `stripAdminHomeQueryNoise` (`app/utils/buildAdminHomeHref.ts`), which drops the other sections' params.
- Unknown or missing sections redirect to the Dashboard.
- Old section ids still work and redirect to where that feature lives now:

  | Old `?section=` | Now |
  | --- | --- |
  | `playercards`, `userassets` | Shop (`shopTab=player` / `profilePics`) |
  | `motorsportmatches` | Matches, Motorsport tab (`matchesTab=motorsport`) |
  | `knowledgequiz` | Statoz Games, Knowledge Quiz tab |
  | `quizzes`, `predictions` | Matches (the tournament param carries over) |

- Detail pages are separate routes, for example `/match/[id]`, `/quiz/[id]`, `/prediction/[id]`, `/motorsport/[id]`, `/users/[id]` and `/knowledge-quiz/...`.
  - They carry `?from=…` and, for nested pages, `?matchId=…`, so "Back" returns to the screen the admin came from.

## Sign-in and sessions

### Signing in

1. On `/login` the admin enters an email address. `POST /api/send-otp` asks the backend to email a one-time code.
2. `POST /api/login` sends the email, the OTP and a **device id** to the backend's `/authorization/superadmin-login`.
   - The email is trimmed and lower-cased, because both calls must send the same string.
   - The device id is a UUID kept in `localStorage` as `statoz.deviceId`.
   - Sending the same device id again reuses this browser's session instead of opening a new one.
   - The backend keeps at most 5 sessions and signs out the least recently used.
3. The login response's `accessToken` and `refreshToken` are written into **httpOnly cookies**.
   - The access token itself expires in about 15 minutes. Its cookie lasts 1 day, so an expired token still reaches the backend and can be renewed.
   - The refresh cookie lasts 7 days.
   - The admin's profile is stored in the Zustand auth store.
   - Backend errors are turned into readable messages by `loginErrorMessage`. A 429 means 5 failed attempts within 15 minutes, and a non-superadmin account gets "This account isn't an admin".

### Keeping the session alive

All of this is in `authenticatedFetch` in `app/api/utils/api-helper.ts`.

- Every proxy call reads the access cookie and forwards it to the backend as `Cookie: accessToken=…`, together with the XSRF token when one is present.
- **498** means the access token has expired. The route renews it with `/authorization/refresh-token`, stores the new cookies and retries once.
  - Parallel requests from one browser share a single renewal.
  - A refresh token that was spent in the last 30 seconds gets that renewal's result again, instead of being re-spent. A backend that rotates refresh tokens would otherwise treat the reuse as theft and sign the browser out.
- **401** means the session is over, so the route clears both cookies.
- If the backend can't be reached during a renewal, the route returns **503** "Couldn't renew your session just now" and keeps the cookies. A backend outage does not sign anyone out.
- If the access cookie is gone but the refresh cookie remains (for example after a reload a day later), the route renews before the first call.

### Noticing a sign-out

`app/components/SessionGuard.tsx` and `watchSession` in `app/utils/session.ts` handle this.

- The guard wraps `window.fetch`.
- Whenever one of the panel's own `/api/*` calls fails, it asks `/api/session-status`. The sign-in routes are excluded.
- If the answer is `signedIn: false`, the guard clears browser storage (keeping the device id) and redirects to `/login`.
- This covers being signed out from another device, from the Devices screen, by expiry, or by the backend.

### Signing out

- `POST /api/logout` ends this browser's session.
- `/api/logout-all` and `/api/sessions/[sessionId]` back the Devices screen.

## The API proxy layer

Every backend call goes through a route in `app/api/**/route.ts`. A typical route works like this:

```ts
export async function GET(req, context) {
  const res = await authenticatedFetch(`/backend/path/${id}`);   // adds session, renews tokens
  const data = await handleExternalApiResponse<T>(res);           // throws a readable error on !ok
  return successResponse(data);                                    // { success: true, data }
}
```

Conventions:

- **Envelope.** Every route answers `{ success, data?, message?, errors? }`. On the client, `apiRequest()` in `app/utils/apiRequest.ts` unwraps it and throws `ApiRequestError`, which carries the `message`, the backend's per-field `errors` and the HTTP `status`.
- **Error messages.** `extractBackendErrorMessage` prefers the specific detail (`data.errors[]` or `data.error`) over a generic top-level `message`, so admins see why a save failed.
- **404 on empty becomes an empty list.** Several backend list endpoints answer 404 when there is simply nothing to show. These include the match-scoped quiz, prediction and event lists, the pending-settlement lists and tournament teams. The helpers in `app/api/utils/match-scoped-list.ts` and `pending-settlement-list.ts` turn that into `200 []`, so the UI only reports real failures.
- **Shared handlers.** Similar routes share one implementation, for example:
  - `curatedTrendingListHandlers` backs `/trending/tournaments` and `/trending/teams`.
  - `proxyUserActivity` backs the user Activity tabs.
  - `match-answers-route.ts` backs the quiz auto-answer routes.
  - `proxyAdminGet` (`api/utils/admin-get-proxy.ts`) backs filtered admin lists: coin and XP history, and settlement failures. It forwards only the query keys a route allows, and keeps the backend's 400 or 403 status and message.
  - `pendingSettlementListResponse` backs both the pending-settlement lists and the marked-unresolved lists.
- **Role checks.** Superadmin-only backend endpoints answer 403 for other tokens. The routes pass the backend's message through.

## Live match stats

- `GET /api/socket-config` tells the browser where the backend's Socket.IO server is, because `API_BASE_URL` is server-only.
- The browser connects to the socket **directly**, with no Next.js proxy in between.
- It subscribes with `subscribe_match_stats` for up to the backend's maximum number of ESPN event ids.
- Each push is a **full snapshot** of one match, not a delta.
- `app/utils/matchStatsSocket.ts` keeps the latest payload for each match and a "last received" heartbeat. The Matches screen's stats panel (`FetchMatchStatsPanel`) uses it.

## External score sources and auto-answering

The panel helps admins answer quiz questions, find match statuses and settle games by reading real match data. These are the sources:

| Source | Sport(s) | Where it runs | How |
| --- | --- | --- | --- |
| **Cricbuzz** (`api/utils/cricbuzz.ts`) | Cricket | Server | Scrapes the Next.js flight chunks (`self.__next_f.push`) on the match-list and scorecard pages, and reads `matchInfo` and `scorecardApiData`. |
| **FotMob** (`api/utils/fotmob.ts`) | Football | Server | Calls the public JSON endpoints `/api/data/matches?date=` and `/api/data/matchDetails?matchId=`, with dates in IST. |
| **Sofascore** (`api/utils/sofascore.ts`) | Cricket, football, basketball | **Browser** | Runs a team search, then that team's events, then the event's details. It runs client-side because Sofascore can reject server requests. |
| **ESPN** (`api/utils/espn.ts`) | Any synced match | Server | Fetches `sports/{espnLeagueName}/summary?event={id}` directly, using the league path and event id that the live-score sync already stored on the match. There is no search by team name. |

A match is found either from the site's own match list (by teams and start time) or from a URL the admin pastes. That logic is in `api/utils/match-source-lookup.ts`.

The answer engines (`quiz-answer-core.ts` plus the cricket, football and basketball engines) work through each quiz question in three steps:

1. Match the question to a template in the **quiz or event question bank**, and work out which team `{teamA}` and `{teamB}` refer to.
2. Run that template's resolver to pull one fact from the match data.
3. Map the fact onto exactly one of the question's options, or explain why it can't.

Questions that aren't in a bank are left for the admin to answer by hand. Every answer comes with the source pages it was read from, so the admin can check them. Nothing is saved until the admin confirms.

## Testing and CI

Testing and CI are covered in more detail in [../../README.md](../../README.md) and [../test-coverage.md](../test-coverage.md).

- `npm test` runs Vitest. Other scripts are `npm run typecheck`, `npm run lint` and `npm run test:coverage`.
- `tests/api/routes-contract.test.ts` finds **every** `route.ts` automatically. It checks that each route:
  - answers with the `{ success }` envelope
  - returns `success: false` when the backend is down or rejects the session
  - forwards the session
- `tests/client/smoke.test.tsx` mounts every section and page, with the backend slow and with it down.
- `tests/unit/` covers the answer engines, the source lookups, the proxy helpers, validators and constants.
- No test touches the network. An un-mocked `fetch` fails the test.
- Coverage floors are set in `vitest.config.mts`. They are stricter for `app/api/utils`, `app/utils`, `app/constants` and `app/store`.
- `.github/workflows/ci.yml` runs lint, typecheck, tests and a production build on every pull request into `production`. **CI passed** is the required check for merging.

## Adding things

- **A new backend call.** Add `app/api/<area>/<name>/route.ts` using `authenticatedFetch`, `handleExternalApiResponse` and `successResponse`. The contract test picks it up automatically.
- **A new section.**
  1. Add it to the `Section` enum and `SECTION_LABELS`.
  2. Add it to `SIDEBAR_SECTION_ORDER` if it belongs in the menu.
  3. Add a `case` in `renderContent()` in `app/page.tsx`.
  4. If it has its own URL params, add them to `stripAdminHomeQueryNoise`.
  The smoke test and the section tests cover it automatically.
- **A new status value.** Add it to the matching list in `app/constants/` and give it a badge in `app/utils/statusBadge.ts`. The completeness tests fail until both are done.
