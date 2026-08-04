# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start with nodemon (hot reload)
npm start         # Start without hot reload

node prisma/seed.js   # Seed the database from src/data/data.json
node prisma/clear.js  # Clear the database
npx prisma migrate dev --name <name>  # Create and apply a new migration
npx prisma generate   # Regenerate Prisma client after schema changes
```

## Architecture

Express 5 REST API backed by PostgreSQL (Supabase) via Prisma ORM with a `pg` connection pool driver adapter (`@prisma/adapter-pg`).

**Entry point:** `src/index.js` — sets up CORS (origin from `CLIENT_ORIGIN` env), 10mb JSON body limit, and mounts all routes under `/api`.

**Routing:** `src/routes/index.js` aggregates sub-routers:
- `/api/users` → `src/routes/users.js`
- `/api/images` → `src/routes/images.js`
- `/api/comments` → `src/routes/comments.js`
- `/api/health` → inline health check

**Prisma client:** `src/lib/prisma.js` — singleton that wires `pg.Pool` → `PrismaPg` adapter → `PrismaClient`. Import this everywhere database access is needed.

**Data model:** `User` → `Image` (one-to-many), `Image` → `Comment` (one-to-many), `Like` (join table with `@@unique([userId, imageId])` constraint for dedup). The `likes` field on `Image` is a denormalized count incremented/decremented atomically alongside `Like` row creation/deletion.

**Image response shape:** Routes never return raw Prisma `Image` objects. The `flattenImage` helper in `images.js` strips the nested `user` and `likedBy` relations and replaces them with `userName: string` and `liked: boolean`. All image endpoints must pass through this helper.

**`liked` field:** The `likedBy` relation is conditionally included only when a `userId` query param is present. Without it, `liked` defaults to `false`. This pattern (`buildWithUser` / `buildListSelect`) is used consistently across all image endpoints.

**Route ordering:** In `images.js`, named-segment routes (`/username/:userName`, `/user/:userId`) must be registered before `/:id` to avoid Express matching them as IDs.

## Environment

```
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://...  # Supabase connection string
```
