const jwt = require('jsonwebtoken');

const verifyToken = (req) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return { id: payload.sub, userName: payload.userName };
  } catch {
    return null;
  }
};

const requireAuth = (req, res, next) => {
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
};

const optionalAuth = (req, res, next) => {
  req.user = verifyToken(req);
  next();
};

module.exports = { requireAuth, optionalAuth };
