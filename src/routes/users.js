const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { requireAuth } = require('../middleware/auth');

const router = Router();

const userSelect = {
  id: true,
  userName: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
};

// GET /api/users
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany({ select: userSelect });
  res.json(users);
});

// GET /api/users/username/:userName  (must be before /:id)
router.get('/username/:userName', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { userName: req.params.userName },
    select: userSelect,
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// PATCH /api/users/me
router.patch('/me', requireAuth, async (req, res) => {
  const { avatarUrl, userName, currentPassword, newPassword } = req.body;

  const data = {};
  if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;
  if (userName !== undefined) data.userName = userName;

  if (newPassword !== undefined) {
    if (!currentPassword) {
      return res.status(400).json({ error: 'currentPassword is required to set a new password' });
    }
    const existing = await prisma.user.findUnique({ where: { id: req.user.id } });
    const match = existing?.passwordHash && (await bcrypt.compare(currentPassword, existing.passwordHash));
    if (!match) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    data.passwordHash = await bcrypt.hash(newPassword, 12);
  }

  let user;
  try {
    user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: userSelect,
    });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Username already taken' });
    }
    throw err;
  }

  const token = jwt.sign(
    { sub: user.id, userName: user.userName },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ user, token });
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
    select: userSelect,
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

module.exports = router;
