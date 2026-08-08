const { Router } = require('express');
const usersRouter = require('./users');
const imagesRouter = require('./images');
const commentsRouter = require('./comments');
const authRouter = require('./auth');
const palettesRouter = require('./palettes');

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/images', imagesRouter);
router.use('/comments', commentsRouter);
router.use('/palettes', palettesRouter);

module.exports = router;
