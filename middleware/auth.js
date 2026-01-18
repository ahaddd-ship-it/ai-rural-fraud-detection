const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET env var.');
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Missing token' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload; // { id, username }
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'INVALID_TOKEN', message: 'Token invalid or expired' });
  }
}

module.exports = authMiddleware;
