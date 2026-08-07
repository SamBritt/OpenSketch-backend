Spawn a frontend sub-agent to handle the task described in $ARGUMENTS.

The sub-agent works exclusively in C:\Users\sambr\OneDrive\desktop\repos\OpenSketch3.

Read CLAUDE.md for full architecture details before making changes.

---

## Stack
- React 18 + TypeScript, Vite, Tailwind CSS, React Router v6, Zustand, Axios
- Path alias: `@/` → `src/`
- Dev server: `npm run dev` (port 5173) — backend must be running on port 3001

## Design system (DeviantArt-inspired)
The app uses a custom `da-*` Tailwind color palette (defined in `tailwind.config.js`):
- `bg-da-bg` (#111111) — page background
- `bg-da-surface` (#1a1a1a) — cards, panels
- `bg-da-elevated` (#222222) — inputs, dropdowns
- `border-da-border` (#333333) — dividers, card borders
- `text-da-text` (#e8e8e8) — primary text
- `text-da-subtle` (#999999) — secondary text
- `text-da-muted` (#555555) — placeholder, labels
- `bg-da-green` / `text-da-green` (#05b802) — signature green accent (buttons, links, active states)
- `bg-da-green-hover` (#04a001) — green hover state
- `bg-da-green-dim` (#0a4f09) — dark green for Avatar fallback background
Do NOT use old `zinc-*`, `stone-*`, or `blue-600` classes — use `da-*` tokens instead.

## Auth
- `src/store/authStore.ts` — Zustand store with `user`, `token`, `isLoading`
- Actions: `login`, `register`, `logout`, `restoreSession`, `updateAvatar`
- Token stored in `localStorage` under key `'os_token'`
- `src/lib/api.ts` has a request interceptor that automatically attaches `Authorization: Bearer <token>` — no store action needs to manually send userId
- Response interceptor on 401 calls `logout()` automatically
- `src/components/ProtectedRoute.tsx` — redirects to `/login` if no user

## Stores
- `src/store/authStore.ts` — current user, login/register/logout/restoreSession/updateAvatar
- `src/store/imageStore.ts` — images, userImages, currentImage, imagesLoading; NO hardcoded userId anywhere
- `src/store/commentStore.ts` — comments for current image; NO hardcoded userId

## Routes (`src/App.tsx`)
- `/`              → Landing
- `/login`         → Login
- `/register`      → Register
- `/create`        → ProtectedRoute → Create
- `/settings`      → ProtectedRoute → Settings
- `/:userName`     → Profile
- `/:userName/:id` → ImageDetail

## Components (`src/components/`)
- `Avatar` — shows image if `avatarUrl` set, else initials circle in da-green-dim/da-green. Sizes: sm/md/lg
- `ProtectedRoute` — auth guard, redirects to /login
- `Gallery` — CSS columns masonry layout, accepts `images`, `loading` (shows 12 skeletons), `condensed` (ignored)
- `GalleryCard` — dark card with square image + always-visible footer (title, @author, ♥ likes). Exports `GalleryCardSkeleton`
- `CommentSection` — full-width, da-palette styled, delete requires `window.confirm`
- Barrel export from `src/components/index.ts` — always import components from `@/components`

## Pages (`src/pages/`)
- `Landing` — hero (logged-out only) + section header + masonry gallery with skeleton/empty state
- `Profile` — banner, green-ringed avatar, Gallery/About tabs, fetches profileUser from `/api/users/username/:userName`
- `ImageDetail` — stacked layout, like/comment actions, smooth scroll to comments, "More by @artist" row
- `Create` — canvas + SketchForm side by side
- `Login` / `Register` — da-palette cards with pencil logo, green buttons
- `Settings` — avatar upload with preview
- Barrel export from `src/pages/index.ts`

## API response shapes
- Image responses are flat: `userName` and `liked` are top-level fields (no nested `user` object)
- Auth responses: `{ token, user: { id, userName, firstName, lastName, avatarUrl } }`
- Comment responses include `userName` at top level

## Key rules
- All HTTP calls go through `src/lib/api.ts` — never import axios directly
- Never pass `userId` in request body or params — the JWT interceptor handles it server-side
- `GalleryCard` can be imported directly from its file in `ImageDetail` to avoid circular imports
- No test runner configured yet — `@testing-library/react` and vitest are available but not wired up
