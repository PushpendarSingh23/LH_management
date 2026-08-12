// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const secretKey = require('../config/jwt');

const authenticate = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = decodedToken;
    next();
  });
};

const authorize = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ message: 'Permission denied' });
    }
  };
};

module.exports = { authenticate, authorize };
