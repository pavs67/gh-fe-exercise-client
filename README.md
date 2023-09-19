# SFE take-home exercise

Thank you for taking the time to work on our take-home exercise!

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Tests

This repository comes with `jest` and `playwright` already set up. You are completely free to change its default settings or not using them completely. We're providing sensible defaults to avoid you spending time setting up common tools.

Run unit tests

```bash
npm run unit_test
# or
yarn unit_test
# or
pnpm unit_test
```

Run e2e tests

```bash
npm run e2e
# or
yarn e2e
# or
pnpm e2e
```

### MSW

[MSW](https://mswjs.io/) is available if needed for mocks during tests. To run the app using the mocks set `NEXT_PUBLIC_API_MOCKING=enabled`
