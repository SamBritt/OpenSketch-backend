Spawn a testing sub-agent to handle the task described in $ARGUMENTS.

The sub-agent has access to both repos:
- Backend: C:\Users\sambr\OneDrive\desktop\repos\OpenSketch-backend
- Frontend: C:\Users\sambr\OneDrive\desktop\repos\OpenSketch3

Read both CLAUDE.md files for full architecture context before writing tests.

---

## Current state
Neither repo has a test runner configured yet.

Recommended setup:
- **Backend**: Jest + supertest for route integration tests
- **Frontend**: Vitest + `@testing-library/react` (both already installed as dependencies)

## Backend context
- Express 5, Node.js (CommonJS), Prisma + PostgreSQL (Supabase)
- Auth: JWT (`JWT_SECRET` in `.env`), bcrypt password hashing
- All protected routes require `Authorization: Bearer <token>` header
- `requireAuth` middleware attaches `req.user = { id, userName }` from JWT
- `optionalAuth` middleware sets `req.user = null` if no/invalid token

### Key flows to test (backend)
- `POST /api/auth/register` — happy path, duplicate username (409), missing fields (400)
- `POST /api/auth/login` — happy path, wrong password (401), unknown user (401)
- `GET /api/auth/me` — valid token, missing token (401), expired token (401)
- `GET /api/images` — public, returns `liked: false` when unauthenticated
- `POST /api/images` — requires auth, creates image, returns flattenImage shape
- `POST /api/images/:id/like` + `DELETE /api/images/:id/like` — requires auth
- `POST /api/comments` — requires auth, `userId` comes from token not body
- `DELETE /api/comments/:id` — requires auth + ownership (403 if wrong user)
- `PATCH /api/users/me` — requires auth, updates avatarUrl

## Frontend context
- React 18 + TypeScript, Zustand stores, Axios with JWT interceptor
- Token stored in `localStorage` under `'os_token'`
- `useAuthStore` — user, token, isLoading, login/register/logout/restoreSession/updateAvatar
- `useImageStore` — images, userImages, currentImage, imagesLoading (no hardcoded userId)
- `useCommentStore` — comments for current image

### Key flows to test (frontend)
- `authStore.login` — stores token in localStorage, sets user in state
- `authStore.logout` — clears localStorage and state
- `authStore.restoreSession` — reads token from localStorage, calls /auth/me, handles expired token
- `imageStore.fetchImages` — calls API, sets images, sets imagesLoading correctly
- `imageStore.likeImage` / `unlikeImage` — updates images, userImages, and currentImage simultaneously via `updateImage` helper
- `commentStore.postComment` / `deleteComment` — optimistic local state updates
- `GalleryCard` — renders skeleton when loading, shows title/@author/likes footer
- `ProtectedRoute` — redirects to /login when user is null, shows loading when isLoading

## Backend API base
`http://localhost:3001/api`

## Frontend dev server
`http://localhost:5173`
