const { Router } = require('express');
const usersRouter = require('./users');
const imagesRouter = require('./images');
const commentsRouter = require('./comments');

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.use('/users', usersRouter);
router.use('/images', imagesRouter);
router.use('/comments', commentsRouter);

module.exports = router;
