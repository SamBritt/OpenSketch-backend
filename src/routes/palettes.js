const { Router } = require('express');
const prisma = require('../lib/prisma');
const { requireAuth } = require('../middleware/auth');

const router = Router();

// GET /api/palettes
router.get('/', requireAuth, async (req, res) => {
  const palettes = await prisma.palette.findMany({ where: { userId: req.user.id } });
  res.json(palettes);
});

// POST /api/palettes
router.post('/', requireAuth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const palette = await prisma.palette.create({
    data: { userId: req.user.id, name, colors: [] },
  });
  res.status(201).json(palette);
});

// PATCH /api/palettes/:id
router.patch('/:id', requireAuth, async (req, res) => {
  const paletteId = parseInt(req.params.id);
  const existing = await prisma.palette.findUnique({ where: { id: paletteId } });
  if (!existing) return res.status(404).json({ error: 'Palette not found' });
  if (existing.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { name, colors } = req.body;
  const data = {};
  if (name !== undefined) data.name = name;
  if (colors !== undefined) data.colors = colors;

  const palette = await prisma.palette.update({ where: { id: paletteId }, data });
  res.json(palette);
});

// DELETE /api/palettes/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const paletteId = parseInt(req.params.id);
  const existing = await prisma.palette.findUnique({ where: { id: paletteId } });
  if (!existing) return res.status(404).json({ error: 'Palette not found' });
  if (existing.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  await prisma.palette.delete({ where: { id: paletteId } });
  res.status(204).end();
});

module.exports = router;
