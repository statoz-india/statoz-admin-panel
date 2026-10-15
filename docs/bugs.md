# Known bugs

Found while building the test suite (`tests/`). Last updated 2026-10-15.

None of these are fixed in app code yet. Each confirmed bug has an `it.todo` test as a placeholder. When you fix one, replace the `it.todo` with a real test so the bug can't come back.

| # | Bug | Severity | Location | Tracking test |
| --- | --- | --- | --- | --- |
| 1 | Login drops the panel's session cookies when the backend sets a cookie | High (if the backend sends `Set-Cookie`) | `app/api/login/route.ts:68` | `tests/api/auth-routes.test.ts:87` |
| 2 | Auto-answer can't map full team names in same-city derbies | Medium | `app/api/utils/quiz-answer-core.ts:220` | `tests/unit/answer-engines/quiz-answer-core.test.ts:194` |
| 3 | Leftover debug `console.log` in the quiz list route | Low | `app/api/quiz/route.ts:86` | none |

---

## 1. Login drops the session cookies when the backend sets a cookie

**Where:** `app/api/login/route.ts:68`, in `POST /api/login`

**What happens:**
1. On a successful login, the route stores the backend's tokens as `accessToken` and `refreshToken` cookies, using `nextResponse.cookies.set(...)`.
2. It then copies the backend's own cookie onto the response:

   ```ts
   const setCookieHeader = response.headers.get("set-cookie");
   if (setCookieHeader) {
     nextResponse.headers.set("set-cookie", setCookieHeader);
   }
   ```

   `headers.set` **replaces** every `Set-Cookie` header already on the response. So whenever the backend's login response includes `Set-Cookie`, the browser receives only the backend's cookie. It never gets `accessToken`/`refreshToken`.

**Impact:**
- Every server-side API route reads `accessToken` from the cookie. Without it, every call after login is unauthenticated (401), and the admin is sent back to `/login`.
- Login only works today if the backend sends no `Set-Cookie` on login, or happens to send cookies with exactly those names. Any backend change that adds a cookie would break admin login.
- A second, smaller problem: `headers.get("set-cookie")` joins multiple cookies into one comma-separated string. That string is not a valid single cookie, so when the backend sends two or more cookies, they arrive mangled.

**Confirmed by:** a test that mocks a backend login response carrying `Set-Cookie`. The response then holds only the backend's cookie.

**Fix:** append each backend cookie instead of replacing:

```ts
for (const cookie of response.headers.getSetCookie()) {
  nextResponse.headers.append("set-cookie", cookie);
}
```

**Test to add:** in `tests/api/auth-routes.test.ts`, replace the `it.todo`:
1. Mock the backend login to return `Set-Cookie: backendSession=...`.
2. Assert that `res.headers.getSetCookie()` contains `accessToken`, `refreshToken` **and** `backendSession`.

---

## 2. Auto-answer can't map full team names in same-city derbies

**Where:** `teamForOption` in `app/api/utils/quiz-answer-core.ts:220`. All the answer engines use it: cricket, football, basketball and Sofascore.

**What happens:**
- Each team gets a list of aliases: its full name plus its distinctive words. "Manchester United" gets `manchester united`, `manchester`, …
- An option counts as matching a team if it equals an alias **or contains one as a phrase**. The option only maps if exactly one team matches.
- In a same-city derby, both teams share the city word. The option "Manchester United" contains `manchester`, an alias of Manchester City, so it matches both teams. It is treated as ambiguous and maps to neither.

Verified results:

| Match | Full-name options | Abbreviations (MUN, MCI, …) |
| --- | --- | --- |
| Manchester United vs Manchester City | not mapped | mapped |
| Inter Milan vs AC Milan | not mapped | mapped |
| Real Madrid vs Atlético Madrid | not mapped | mapped |
| Sheffield United vs Sheffield Wednesday | not mapped | mapped |
| Arsenal vs Chelsea (control) | mapped | mapped |

**Impact:** for these fixtures, team questions written with full names ("Who will win?" → "Manchester United") are not auto-answered, so an admin has to settle them by hand. Nothing is answered **wrongly**: the engine gives up rather than guessing.

**Fix:** before the phrase matching, prefer an exact alias match that points to exactly one team:

```ts
export function teamForOption(option: string, teams: AnswerTeam[]): AnswerTeam | undefined {
  const forms = [...new Set([normWords(option), canonicalTeam(option)])].filter(Boolean);
  if (!forms.length) return undefined;
  const exact = teams.filter((t) => t.aliases.some((a) => forms.includes(a)));
  if (exact.length === 1) return exact[0];
  // ...existing phrase matching...
}
```

A throwaway test checked this approach. It maps every row in the table above. A bare city word ("Manchester", "Madrid") stays ambiguous, as it should. All the existing `teamForOption` cases are unchanged.

**Test to add:** in `tests/unit/answer-engines/quiz-answer-core.test.ts`, replace the `it.todo` with the derby rows above.

---

## 3. Leftover debug `console.log` in the quiz list route

**Where:** `app/api/quiz/route.ts:86`, `console.log("response", response);`

**Impact:** every quiz-list request dumps the whole backend `Response` object into the server logs. That is noise, and it makes real errors harder to find. It has no effect on users.

**Fix:** delete the line.

---

## Fixed while adding the tests

### Shop section: lint error that would have failed CI

**Where:** `app/components/shop/ShopSection.tsx`

**Problem:** the section copied the `shopTab` URL param into state from inside a `useEffect`. That breaks the `react-hooks/set-state-in-effect` rule, and as the only lint **error** in the repo, it would have failed the Lint check on every PR.

**Fix:** the tab is now read directly from the URL, the same way `PaymentsSection` does it.

**Behaviour change:** an invalid `?shopTab=` value now shows the Player cards tab.

---

## Lint warnings (not blocking, not confirmed bugs)

`npm run lint` reports 12 warnings. CI allows warnings, so they don't block merges. None has caused a visible bug in testing, but they are worth cleaning up.

| Location | Warning | Note |
| --- | --- | --- |
| `app/prediction/[id]/page.tsx:127` | `useEffect` missing `fetchPrediction` | Runs only on mount. If the page is reused for a different prediction ID without remounting, it would show stale data. |
| `app/prediction/[id]/page.tsx:133` | `useEffect` missing `fetchUserSubmissions` | Re-fetches submissions whenever the `prediction` object changes. |
| `app/quiz/[id]/page.tsx:100` | `useEffect` missing `fetchQuiz` | Keyed on `quizId`, so in practice it behaves correctly. |
| `app/quiz/[id]/userSubmissions/page.tsx:46` | `useEffect` missing `fetchUserResponses` | Same as above. |
| `app/quiz/[id]/QuizGraphPanel.tsx:168` (×3) | `questions` makes three `useMemo` hooks recompute on every render | Performance only. Wrap it in `useMemo`. |
| `app/components/appNavigation/AppNavigationSection.tsx:126` | `saveDefault` is never used | Dead code, probably left behind when the "save default" button was removed. |
| `app/components/predictions/CreatePredictionModal.tsx:109` (×2) | `handleEntryStopTimeChange` is unused, and it does nothing | Dead code. |
| `app/prediction/[id]/page.tsx:120` | unused `err` | Cosmetic. |
| `app/api/utils/api-helper.ts:89` | unused `e` | Cosmetic. |
