# devtreff

A small presentation app, starting with a working Next.js + Convex foundation.
The product idea and features come next. The starter page only checks the live
Convex connection; there are no app tables or authentication yet.

- Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4
- Convex cloud backend with generated API types
- npm and Node.js 22
- Vercel build configuration for deploying the frontend and backend together

## Run locally

From this already configured checkout:

```sh
npm run dev
```

Open [localhost:3000](http://localhost:3000). The command syncs Convex first, then
starts Next.js, and keeps both running. The page shows **Connected** after its
backend query succeeds over the live connection.

For a fresh clone:

```sh
npm ci
npx convex dev --configure existing --team willi --project devtreff --dev-deployment cloud --once
npm run dev
```

Sign in to an account with access to the project when prompted. Convex creates
`.env.local` with your development deployment details. `.env.example` documents
the variables; real environment files and deploy keys stay out of Git.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run Convex and Next.js together |
| `npm run dev:frontend` | Run only Next.js |
| `npm run dev:backend` | Run only the Convex watcher |
| `npm run check` | Lint and typecheck the frontend and backend |
| `npm run convex:check` | Typecheck, generate types, and sync the dev backend once |
| `npm run build` | Build Next.js for production using the configured Convex URL |
| `npm start` | Serve the local production build |
| `npm run build:vercel` | Deploy Convex and build Next.js with the matching URL |

## Project layout

- `src/app/`: routes, layout, and global styles
- `src/components/`: shared UI and the Convex client provider
- `convex/schema.ts`: database schema, currently empty
- `convex/health.ts`: small read-only connection check
- `convex/_generated/`: generated Convex API and types; commit these files
- `vercel.json`: Vercel build configuration

Use `@/` for frontend imports and `@convex/` for the generated backend API.

## Deploy to Vercel later

1. Import [willi-bit/devtreff](https://github.com/willi-bit/devtreff) into Vercel.
   Use the repository root and Node.js 22.x.
2. In the [Convex project dashboard](https://dashboard.convex.dev/t/willi/devtreff),
   create a production deployment when ready. Generate its production deploy key
   with the `deployment:deploy` permission in deployment settings.
3. Add the key as `CONVEX_DEPLOY_KEY` in Vercel, scoped to **Production**.
4. Deploy. `vercel.json` selects `npm run build:vercel`, which deploys Convex and
   provides `NEXT_PUBLIC_CONVEX_URL` to the Next.js build automatically.

For Vercel previews, create a separate **preview deploy key** in Convex project
settings and set it as `CONVEX_DEPLOY_KEY` scoped to **Preview**. Each branch gets
its own backend. Preview builds require that key; keep the production key scoped
to Production.

Vercel has not been provisioned. See the
[official Convex Vercel guide](https://docs.convex.dev/production/hosting/vercel)
for the deployment workflow.
