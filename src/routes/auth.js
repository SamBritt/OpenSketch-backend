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

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { userName, firstName, lastName, password } = req.body;
  if (!userName || !firstName || !lastName || !password) {
    return res.status(400).json({ error: 'userName, firstName, lastName, and password are required' });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { userName, firstName, lastName, passwordHash },
      select: userSelect,
    });
    const token = jwt.sign(
      { sub: user.id, userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.status(201).json({ token, user });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Username already taken' });
    }
    throw err;
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(400).json({ error: 'userName and password are required' });
  }
  const user = await prisma.user.findUnique({ where: { userName } });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign(
    { sub: user.id, userName: user.userName },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  return res.json({
    token,
    user: {
      id: user.id,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
    },
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: userSelect,
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

module.exports = router;
