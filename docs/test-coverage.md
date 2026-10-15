# Test coverage

What the test suite covers today, what it doesn't, and how it gates merges into `production`. Last updated 2026-10-15.

## Snapshot

| | |
| --- | --- |
| Test files | 30 |
| Tests | 2,329: **2,327 passing**, 2 `todo` (known bugs, see [bugs.md](bugs.md)) |
| Runtime | a few seconds; the suite never touches the network |
| Line coverage | 37.97% (22,256 / 58,613) |
| Branch coverage | 67.69% |
| Function coverage | 47.88% |

The overall line figure is low because it counts ~150 UI files (`.tsx`), which are only smoke-tested. The logic the panel depends on (API helpers, answer engines, proxies, validators, utilities) is at 95–100%.

## Running the tests

```bash
npm test               # whole suite once
npm run test:watch     # re-run on save
npm run test:coverage  # with coverage; HTML report in coverage/index.html
npm run typecheck
npm run lint
```

Run one file or one test name:

```bash
npx vitest run tests/unit/answer-engines/fotmob-answer-engine.test.ts
npx vitest run -t "teamForOption"
```

## Coverage by area

"CI floor" is the minimum set in `vitest.config.mts` (lines / branches / functions). If coverage of an area drops below its floor, the Tests check fails and the PR can't merge.

| Area | Files | Lines | Branches | Functions | CI floor |
| --- | ---: | ---: | ---: | ---: | --- |
| API helpers and answer engines (`app/api/utils`) | 16 | 98.6% | 88.4% | 99.1% | 95 / 85 / 95 |
| API proxy helpers (`app/api/**/*proxy.ts`) | 10 | 98.7% | 94.7% | 100% | 95 / 90 / 95 |
| API route handlers (`app/api/**/route.ts`) | 200 | 62.4% | 57.3% | 95.9% | 55 / 50 / 90 |
| Interfaces and validators (`app/interface`) | 21 | 99.7% | 99.0% | 100% | 95 / 95 / 95 |
| Utilities (`app/utils`) | 17 | 85.1% | 95.4% | 91.1% | 80 / 85 / 85 |
| Constants (`app/constants`) | 6 | 100% | 100% | 100% | 95 / 95 / 95 |
| Auth store (`app/store`) | 1 | 100% | 100% | 100% | 90 / 85 / 90 |
| Hooks (`app/hooks`) | 2 | 92.0% | 87.0% | 100% | none |
| Section API clients and helpers (`app/components/**/*.ts`) | 11 | 85.2% | 87.8% | 65.7% | none |
| Models (`app/models`) | 11 | 87.8% | 100% | 100% | none |
| UI components and pages (`*.tsx`) | 147 | 23.8% | 44.8% | 16.4% | none |
| **Whole repo** | | **38.0%** | **67.7%** | **47.9%** | 35 / 60 / 45 |

## What is tested

### API routes: `tests/api/` (1,181 tests)

**`routes-contract.test.ts`** (1,125 tests) finds every `app/api/**/route.ts` (200 routes) automatically and checks each exported handler. New routes are covered without anyone writing a test. Each handler is checked for four things:
- With a healthy backend, it answers with JSON in the `{ success, ... }` envelope the UI expects.
- With the backend unreachable, it answers `success: false` with a 4xx/5xx status, never a fake success.
- When the backend rejects the session (401), it never reports success.
- It sends the admin's session cookie with every backend call. The only exceptions are login, send-otp and socket-config, which run before login or don't call the backend.

**`auth-routes.test.ts`** (16 tests):
- Login: cookies are set, the backend's errors are passed through, the backend being down gives a 500, and CORS preflights are answered.
- Logout: both tokens go to the backend, and the cookies are cleared even when the backend fails.
- `send-otp`.
- `socket-config`.

**`feature-routes.test.ts`** (28 tests):
- App navigation: the default config and its version.
- Events: GET and POST.
- Knowledge-quiz questions, including the 409 replay/duplicate path.

**`api-testing-route.test.ts`** (12 tests): the API-testing proxy. It needs an admin session, sends the admin's token and masks it in the echo, never sends a body on GET, reports backend failures as data, refreshes an expired token once, and handles malformed payloads and timeouts.

### Server logic: `tests/unit/` (1,050 tests)

**Answer engines** (`answer-engines/`, 311 tests). These decide which quiz option is correct from real match data. Each engine runs against realistic fixtures in `tests/fixtures/`:
- `quiz-answer-core`: option parsing, team and player matching, ties and "nobody" options, numeric ranges.
- `cricbuzz-answer-engine`: a T20 chase won in the final over with a Kohli century. Also covers unfinished matches (waits for the toss or second innings), no-result, reduced-overs and DLS games (it won't guess a revised target), and the event-question bank.
- `fotmob-answer-engine`: a 4–1 match with a penalty in added time, an own goal, cards and team stats. A shootout is correctly ignored.
- `basketball-answer-engine` and `sofascore-answer-engine`: football, NBA and IPL data from Sofascore.

**Data sources** (`sources/`, 133 tests). These parse the live match pages and APIs the engines read:
- Cricbuzz, including its split and malformed Next.js flight chunks.
- FotMob and ESPN.
- Sofascore.
- `match-source-lookup`, which picks a source for a match.

**API helpers** (`api-utils/`, 193 tests):
- `api-helper`: authenticated fetch, token refresh, and the error/success envelopes.
- All 10 proxy helpers.
- The shared list, settlement and match-answers route builders.

**Validators** (`interfaces/`, 80 tests): every knowledge-quiz validation rule.

**Utilities** (`utils/`, 242 tests):
- Match-day and timezone maths (verified under UTC, Los Angeles and UTC+14).
- The cURL parser used by API testing.
- `buildAdminHomeHref` (admin URLs).
- Edit-form helpers and team/season helpers.
- Status labels and constants.
- Motorsport helpers.
- `apiRequest`.

### Browser code: `tests/client/` (187 tests)

- **`smoke.test.tsx`** (91 tests): mounts **every admin section** (26, from `?section=`) and **every other page** (19, found automatically). Each is mounted twice, once with the backend never answering and once with it down, and must render without crashing or going blank. New sections and pages are covered automatically.
- **`api-clients.test.ts`** (58 tests): the per-section API clients (`*-api.ts`) send the right URL, method and body, and turn errors into exceptions.
- **`auth-and-hooks.test.tsx`** (14 tests):
  - the auth store: login, logout, what it saves, and restoring a saved session;
  - `useAuthHydrated` and `useGameType`;
  - pinned tournaments, including sync across tabs and corrupt storage;
  - the number-input scroll guard.
- **`components.test.tsx`** (14 tests): Sidebar, SeasonMultiSelect, the match copy chips and Button.
- **`pages.test.tsx`** (10 tests): the OTP login flow end to end, and Shop section tab switching.

## How the tests are isolated

- **No network.** `fetch` is replaced in every test, and any call a test didn't mock fails it with "Unexpected network call".
- **Sessions.** `next/headers` cookies are an in-memory jar. `signIn()` puts tokens in it.
- **Helpers** (`tests/helpers/`): `mockFetch`, `jsonResponse`, `makeRequest`, `routeContext` and `fetchCall`, for calling route handlers directly.
- **Fixtures** (`tests/fixtures/`): realistic Cricbuzz, FotMob and Sofascore match data.
- **Environments.** Server code runs in Node. Component tests opt into a browser environment (jsdom) with `// @vitest-environment jsdom`.
- **Stable results.** The suite passes in any timezone and in shuffled order (`npx vitest run --sequence.shuffle`).

## Merge gate on `production`

`.github/workflows/ci.yml` runs on every pull request into `production`:

| Check | Command | Fails when |
| --- | --- | --- |
| Lint | `npm run lint` | any ESLint error (warnings are allowed) |
| Typecheck | `npm run typecheck` | any TypeScript error |
| Tests | `npm run test:coverage` | any test fails, or coverage drops below a floor |
| Build | `npm run build` | the production build fails |
| **CI passed** | (summary) | any of the four checks above fails, is cancelled or is skipped |

For the merge button to stay disabled until everything passes, make **CI passed** a required status check in GitHub: Settings → Branches → rule for `production`. Each run's HTML coverage report is attached to the run as the `coverage-report` artifact.

## Gaps: what is not covered yet

In priority order:

1. **Settlement and result routes.** These have the lowest coverage among the routes. They are also the most important, because they settle quizzes and predictions and pay out coins. The contract test only reaches their input validation: its generic request body is rejected before the backend is called. Each one needs a test with a valid body that checks what is sent to the backend.
   - `quiz/[id]/update-status` (26%)
   - `quiz/[id]/submit-correct-answer` (27%)
   - `predictions/[id]/update-status` (29%)
   - `predictions/[id]/setCorrectTeamWon` (31%)
   - `futures/[id]/correct-choice` (32%)
   - `futures/[id]/add-choices`, `edit-choices` and `edit` (24–32%)
   - `events/[id]/update-result` (32%)

   35 of the 200 routes are under 50% line coverage. The lowest is `tournament/football-order` (21%).
2. **UI behaviour.** The smoke tests prove every screen loads. They don't check that its forms, buttons and modals work. The least-covered UI:

   | Folder | Lines |
   | --- | ---: |
   | userAssets | 1.7% |
   | coinsLeaderboard | 1.7% |
   | futures | 4.5% |
   | events | 6.5% |
   | motorsportMatches | 9.8% |
   | appNavigation | 11.3% |
   | matches | 11.6% |
   | trending | 13.3% |
   | botUsers | 14.0% |
   | statozGames | 14.4% |

   The quiz detail page (`app/quiz/[id]`, 24%) is the most valuable one to cover next.
3. **Never rendered:** `app/components/waitlist` (0%, possibly unused) and `app/layout.tsx` (0%, the root layout, which the build check covers instead).

## Keeping coverage up

- **Adding an API route or an admin section/page:** the contract and smoke tests pick it up automatically. Add a focused test only for logic beyond simple proxying.
- **Adding logic** to `app/api/utils`, `app/interface` or `app/utils`: add unit tests in the same PR. Those areas have high floors, so untested code there will fail CI.
- **Fixing a bug:** add a test that fails before the fix.
- **Raising the floors:** when coverage of an area grows, raise its floor in `vitest.config.mts` to just under the new figure, so the gain can't quietly be lost.
