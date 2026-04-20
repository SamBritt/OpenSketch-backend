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
  });
  res.json(comments);
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
