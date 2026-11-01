# Statoz Admin Panel: technical docs

The Statoz Admin Panel is the internal tool the Statoz team uses to run the Statoz app. Admins use it to:

- set up sports, tournaments, teams and matches
- create the games players take part in, such as quizzes, predictions, events, futures and knowledge quizzes
- settle those games and pay out
- curate what the app's home screen shows
- manage the shop and cards
- look after users

Only **superadmin** accounts can sign in.

| Document | What it covers |
| --- | --- |
| [architecture.md](architecture.md) | How the panel is built: the request flow, sign-in and sessions, the API proxy layer, live data, the external score sources, the code layout, testing and CI. Read this before changing code. |
| [features.md](features.md) | Everything an admin can do, section by section, plus the detail pages and the usual workflows (for example, "a match just finished, what do I settle?"). |

Related docs elsewhere in the repo:

- [../bugs.md](../bugs.md) lists known bugs and their tracking tests.
- [../test-coverage.md](../test-coverage.md) describes what the test suite covers.
- [../../README.md](../../README.md) explains how to run, test and merge.

## The panel in one picture

```
 Browser (admin)                 Next.js server (this repo)                Statoz backend
 ┌──────────────────┐   /api/*   ┌──────────────────────────────┐  HTTPS  ┌──────────────┐
 │ React client     │──────────▶ │ app/api/**/route.ts proxies  │───────▶ │ API_BASE_URL │
 │ pages & sections │ ◀──────────│ • adds the admin's session   │◀─────── │ (REST)       │
 │                  │  {success, │ • renews expired tokens      │         └──────────────┘
 │                  │   data,    │ • normalises errors / 404s   │
 │                  │   message} │ • scrapes Cricbuzz / FotMob, │──▶ Cricbuzz, FotMob, ESPN
 │                  │            │   calls ESPN                 │
 │                  │            └──────────────────────────────┘
 │                  │── Socket.IO (live match stats) ─────────────────────▶ backend socket
 │                  │── Sofascore lookups (run in the browser) ───────────▶ Sofascore
 └──────────────────┘
```

The browser never talks to the backend's REST API directly. Every call goes through a route in this repo, which attaches the admin's session from an httpOnly cookie.

There are two exceptions:

- the live-stats socket
- the Sofascore lookups
