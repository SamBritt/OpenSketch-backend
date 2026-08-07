const { Router } = require('express');
const prisma = require('../lib/prisma');
const { requireAuth } = require('../middleware/auth');

const router = Router();

// GET /api/comments
router.get('/', async (req, res) => {
  const comments = await prisma.comment.findMany();
  res.json(comments);
});

// GET /api/comments/image/:imageId  (must be before /:id)
router.get('/image/:imageId', async (req, res) => {
  const comments = await prisma.comment.findMany({
    where: { imageId: parseInt(req.params.imageId) },
    include: { user: { select: { userName: true, avatarUrl: true } } },
  });
  res.json(comments.map(({ user, ...c }) => ({ ...c, userName: user.userName, avatarUrl: user.avatarUrl })));
});

// POST /api/comments
router.post('/', requireAuth, async (req, res) => {
  const { imageId, comment } = req.body;
  if (!imageId || !comment) {
    return res.status(400).json({ error: 'imageId and comment are required' });
  }
  const userId = req.user.id;
  const { user, ...newComment } = await prisma.comment.create({
    data: { userId, imageId: parseInt(imageId), comment },
    include: { user: { select: { userName: true, avatarUrl: true } } },
  });
  res.status(201).json({ ...newComment, userName: user.userName, avatarUrl: user.avatarUrl });
});

// DELETE /api/comments/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const commentId = parseInt(req.params.id);
  const existing = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!existing) return res.status(404).json({ error: 'Comment not found' });
  if (existing.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  await prisma.comment.delete({ where: { id: commentId } });
  res.status(204).end();
});

// GET /api/comments/:id
router.get('/:id', async (req, res) => {
  const comment = await prisma.comment.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  res.json(comment);
});

module.exports = router;
