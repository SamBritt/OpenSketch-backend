const { Router } = require('express');
const data = require('../data/data.json');

const router = Router();

// GET /api/users
router.get('/', (req, res) => {
  res.json(data.users);
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  const user = data.users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

module.exports = router;
