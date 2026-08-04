Spawn a frontend sub-agent to handle the task described in $ARGUMENTS.

The sub-agent works exclusively in C:\Users\sambr\OneDrive\desktop\repos\OpenSketch3.

Context for the sub-agent:
- React 18 + TypeScript, Vite, Tailwind CSS (dark stone/zinc palette), React Router v6, Zustand, Axios
- Path alias: @/ maps to src/
- All HTTP calls go through the Axios instance in src/lib/api.ts — never import axios directly
- Global state lives in src/store/imageStore.ts and src/store/commentStore.ts
- userId is hardcoded to 1 everywhere — auth is not implemented yet
- Always import components from @/components and pages from @/pages (barrel exports)
- API image responses are flat: userName and liked are top-level fields, no nested user object
- Dev server: yarn dev (port 5173), backend must be running on port 3001
- No test runner is configured yet

Read CLAUDE.md for full architecture details before making changes.
