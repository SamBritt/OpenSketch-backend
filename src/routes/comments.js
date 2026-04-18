const { Router } = require('express');
const data = require('../data/data.json');

const router = Router();

// GET /api/comments
router.get('/', (req, res) => {
  res.json(data.comments);
});

// GET /api/comments/:id
router.get('/:id', (req, res) => {
  const comment = data.comments.find(c => c.id === parseInt(req.params.id));
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  res.json(comment);
});

// GET /api/comments/image/:imageId
router.get('/image/:imageId', (req, res) => {
  const comments = data.comments.filter(c => c.imageId === parseInt(req.params.imageId));
  res.json(comments);
});

module.exports = router;
