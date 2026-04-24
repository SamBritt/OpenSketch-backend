const { Router } = require('express');
const prisma = require('../lib/prisma');

const router = Router();

const flattenImage = ({ user, likedBy, ...img }) => ({
  ...img,
  userName: user.userName,
  liked: likedBy.length > 0,
});
const withUser = {
  user: { select: { userName: true } },
  likedBy: { where: { userId: 1 } },
};

// GET /api/images
router.get('/', async (req, res) => {
  const images = await prisma.image.findMany({ include: withUser });
  res.json(images.map(flattenImage));
});

// GET /api/images/username/:userName  (must be before /:id)
router.get('/username/:userName', async (req, res) => {
  const images = await prisma.image.findMany({
    where: { user: { userName: req.params.userName } },
    include: withUser,
  });
  res.json(images.map(flattenImage));
});

// GET /api/images/user/:userId  (must be before /:id)
router.get('/user/:userId', async (req, res) => {
  const images = await prisma.image.findMany({
    where: { userId: parseInt(req.params.userId) },
    include: withUser,
  });
  res.json(images.map(flattenImage));
});

// POST /api/images
router.post('/', async (req, res) => {
  const { name, description, userId, imageUrl } = req.body;
  if (!name || !userId) return res.status(400).json({ error: 'name and userId are required' });
  const image = await prisma.image.create({
    data: { name, description: description ?? '', userId: parseInt(userId), imageUrl },
    include: withUser,
  });
  res.status(201).json(flattenImage(image));
});

// POST /api/images/:id/like
router.post('/:id/like', async (req, res) => {
  const imageId = parseInt(req.params.id);
  await prisma.like.create({ data: { userId: 1, imageId } });
  const image = await prisma.image.update({
    where: { id: imageId },
    data: { likes: { increment: 1 } },
    include: withUser,
  });
  res.json(flattenImage(image));
});

// DELETE /api/images/:id/like
router.delete('/:id/like', async (req, res) => {
  const imageId = parseInt(req.params.id);
  await prisma.like.delete({ where: { userId_imageId: { userId: 1, imageId } } });
  const image = await prisma.image.update({
    where: { id: imageId },
    data: { likes: { decrement: 1 } },
    include: withUser,
  });
  res.json(flattenImage(image));
});

// GET /api/images/:id
router.get('/:id', async (req, res) => {
  const image = await prisma.image.findUnique({
    where: { id: parseInt(req.params.id) },
    include: withUser,
  });
  if (!image) return res.status(404).json({ error: 'Image not found' });
  res.json(flattenImage(image));
});

module.exports = router;
