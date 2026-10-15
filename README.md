This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Testing

```bash
npm test               # run the whole suite once
npm run test:watch     # re-run on save
npm run test:coverage  # with coverage (HTML report in coverage/)
npm run typecheck
npm run lint
```

Tests live in `tests/` and use [Vitest](https://vitest.dev) and Testing Library:

- `tests/api/routes-contract.test.ts` finds every `app/api/**/route.ts` and checks the contract the panel depends on: a JSON `{ success }` envelope, `success: false` when the backend is down or rejects the session, and the admin's session sent with every backend call. New routes are covered automatically.
- `tests/client/smoke.test.tsx` mounts every admin section and page with the backend slow and with it down. New sections and pages are covered automatically.
- `tests/unit/` covers the logic: the quiz auto-answer engines, the Cricbuzz/FotMob/ESPN/Sofascore lookups, the proxy helpers, validators and utilities.
- `tests/fixtures/` holds realistic match data; `tests/helpers/` has `mockFetch`, `signIn` and request builders.

No test touches the network: an un-mocked `fetch` fails the test.

## CI and merging to `production`

`.github/workflows/ci.yml` runs on every pull request into `production`: lint, typecheck, tests (with coverage floors set in `vitest.config.mts`) and a production build. The **CI passed** check summarises them. Branch protection on `production` should list **CI passed** as a required status check; with that set, the merge button stays disabled until everything passes.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
