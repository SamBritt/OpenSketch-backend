Spawn a backend sub-agent to handle the task described in $ARGUMENTS.

The sub-agent works exclusively in C:\Users\sambr\OneDrive\desktop\repos\OpenSketch-backend.

Context for the sub-agent:
- Express 5 REST API, Node.js (CommonJS), no TypeScript
- Database: PostgreSQL via Supabase, accessed through Prisma ORM with a pg pool adapter (src/lib/prisma.js)
- All routes live in src/routes/ and are mounted under /api in src/index.js
- Shared Prisma singleton: always import from src/lib/prisma.js — never instantiate PrismaClient directly
- Image responses must always pass through the flattenImage helper in src/routes/images.js
- Named-segment routes (/username/:x, /user/:x) must be registered before /:id in Express
- Schema changes require: edit prisma/schema.prisma → npx prisma migrate dev --name <name> → npx prisma generate
- Dev server: npm run dev (nodemon, port 3001)
- No test framework is set up yet

Read CLAUDE.md for full architecture details before making changes.
