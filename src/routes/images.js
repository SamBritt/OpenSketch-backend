const { Router } = require('express');
const prisma = require('../lib/prisma');

const router = Router();

// GET /api/images
router.get('/', async (req, res) => {
  const images = await prisma.image.findMany();
  res.json(images);
});

// GET /api/images/user/:userId  (must be before /:id)
router.get('/user/:userId', async (req, res) => {
  const images = await prisma.image.findMany({
    where: { userId: parseInt(req.params.userId) },
  });
  res.json(images);
});

// GET /api/images/:id
router.get('/:id', async (req, res) => {
  const image = await prisma.image.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!image) return res.status(404).json({ error: 'Image not found' });
  res.json(image);
});

module.exports = router;
