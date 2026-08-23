/**
 * middleware/auth.js
 * ------------------------------------------------------------
 * requireAuth  -> verifies the JWT from the Authorization header,
 *                 attaches the decoded payload to req.user.
 * requireAdmin -> must run AFTER requireAuth; blocks non-admins.
 * ------------------------------------------------------------
 */
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization; // "Bearer <token>"
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
