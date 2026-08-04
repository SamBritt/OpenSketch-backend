Spawn a testing sub-agent to handle the task described in $ARGUMENTS.

The sub-agent has access to both repos:
- Backend: C:\Users\sambr\OneDrive\desktop\repos\OpenSketch-backend
- Frontend: C:\Users\sambr\OneDrive\desktop\repos\OpenSketch3

Context:
- Neither repo has a test runner configured yet. If setting up tests, recommend:
  - Backend: Jest with supertest for route integration tests
  - Frontend: Vitest + @testing-library/react (dependencies already installed)
- Backend API base: http://localhost:3001/api
- Frontend dev server: http://localhost:5173
- userId is hardcoded to 1 in all current API calls — factor this into test fixtures
- Key flows to cover: image feed, user profile images, image detail + likes, comment CRUD, canvas → save sketch

Read both CLAUDE.md files for full architecture context before writing tests.
