const { Router } = require('express');
const prisma = require('../lib/prisma');

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
    include: { user: { select: { userName: true } } },
  });
  res.json(comments.map(({ user, ...c }) => ({ ...c, userName: user.userName })));
});

// POST /api/comments
router.post('/', async (req, res) => {
  const { userId, imageId, comment } = req.body;
  if (!userId || !imageId || !comment) {
    return res.status(400).json({ error: 'userId, imageId, and comment are required' });
  }
  const { user, ...newComment } = await prisma.comment.create({
    data: { userId: parseInt(userId), imageId: parseInt(imageId), comment },
    include: { user: { select: { userName: true } } },
  });
  res.status(201).json({ ...newComment, userName: user.userName });
});

// DELETE /api/comments/:id
router.delete('/:id', async (req, res) => {
  await prisma.comment.delete({ where: { id: parseInt(req.params.id) } });
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
