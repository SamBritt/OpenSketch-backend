const { Router } = require('express');
const data = require('../data/data.json');

const router = Router();

// GET /api/images
router.get('/', (req, res) => {
  res.json(data.images);
});

// GET /api/images/:id
router.get('/:id', (req, res) => {
  const image = data.images.find(i => i.id === parseInt(req.params.id));
  if (!image) return res.status(404).json({ error: 'Image not found' });
  res.json(image);
});

// GET /api/images/user/:userId
router.get('/user/:userId', (req, res) => {
  const images = data.images.filter(i => i.userId === parseInt(req.params.userId));
  res.json(images);
});

module.exports = router;
