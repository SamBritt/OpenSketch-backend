const { Router } = require('express');
const prisma = require('../lib/prisma');

const router = Router();

// GET /api/users
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

module.exports = router;
