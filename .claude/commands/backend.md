Spawn a backend sub-agent to handle the task described in $ARGUMENTS.

The sub-agent works exclusively in C:\Users\sambr\OneDrive\desktop\repos\OpenSketch-backend.

Read CLAUDE.md for full architecture details before making changes.

---

## Stack
- Express 5, Node.js (CommonJS), no TypeScript
- PostgreSQL via Supabase, Prisma ORM with pg pool adapter (`src/lib/prisma.js`)
- Dev server: `npm run dev` (nodemon, port 3001)

## Route structure (`src/routes/`)
All routes mount under `/api` in `src/index.js`:
- `/api/auth`    → `src/routes/auth.js`
- `/api/users`   → `src/routes/users.js`
- `/api/images`  → `src/routes/images.js`
- `/api/comments`→ `src/routes/comments.js`
- `/api/health`  → inline in `src/routes/index.js`

## Auth
- Middleware: `src/middleware/auth.js` exports `requireAuth` and `optionalAuth`
- `requireAuth`: verifies `Authorization: Bearer <token>` using `JWT_SECRET`, attaches `{ id, userName }` to `req.user`, returns 401 on failure
- `optionalAuth`: same but always calls `next()`, sets `req.user = null` on failure
- Token: JWT, payload `{ sub: userId, userName }`, 7-day expiry
- `JWT_SECRET` is in `.env`

## Auth routes (`/api/auth`)
- `POST /register` — `{ userName, firstName, lastName, password }` → creates user with bcrypt hash, returns `{ token, user }`
- `POST /login`    — `{ userName, password }` → verifies hash, returns `{ token, user }`
- `GET  /me`       — requireAuth → returns current user (no passwordHash)

## User routes (`/api/users`)
- `GET  /`                  — returns all users (no passwordHash)
- `GET  /username/:userName` — returns `{ id, userName, firstName, lastName, avatarUrl }` (before /:id)
- `GET  /:id`               — returns single user (no passwordHash)
- `PATCH /me`               — requireAuth → updates any subset of `avatarUrl`, `userName`, or password (`newPassword` requires matching `currentPassword`, verified via bcrypt); reissues a fresh JWT (payload embeds `userName`) and returns `{ user, token }`

## Image routes (`/api/images`)
- Read routes use `optionalAuth` — `userId` comes from `req.user?.id ?? null`, never from query params
- `GET  /`, `/username/:userName`, `/user/:userId`, `/:id` — public, optionalAuth for liked state
- `POST /`           — requireAuth, `userId` from `req.user.id`
- `POST /:id/like`   — requireAuth, `userId` from `req.user.id`
- `DELETE /:id/like` — requireAuth, `userId` from `req.user.id`
- All image responses pass through `flattenImage` helper (strips nested `user`/`likedBy`, adds `userName` + `liked`)
- Named-segment routes (`/username/:x`, `/user/:x`) MUST be registered before `/:id`

## Comment routes (`/api/comments`)
- `GET  /`              — public
- `GET  /image/:imageId`— public (before /:id), response includes `avatarUrl` alongside `userName` (flattened from `user`)
- `POST /`              — requireAuth, `userId` from `req.user.id`, response includes `avatarUrl` alongside `userName`
- `DELETE /:id`         — requireAuth, ownership check (`comment.userId === req.user.id`)
- `GET  /:id`           — public

## Prisma schema (`prisma/schema.prisma`)
Models: `User`, `Image`, `Comment`, `Like`
- `User`: id, userName (unique), firstName, lastName, passwordHash (nullable), avatarUrl (nullable)
- `Image`: id, userId, name, description, imageUrl, likes (denormalized count), views
- `Like`: @@unique([userId, imageId]) — dedup constraint
- Schema changes: edit schema → `npx prisma migrate dev --name <name>` → `npx prisma generate`

## Key rules
- Always `require('../lib/prisma')` — never instantiate PrismaClient directly
- Never expose `passwordHash` in any response — use explicit `select`
- No test framework set up yet
