// config/jwt.js
// Single source of truth for the JWT secret. Previously, userAuthController.js
// read process.env.JWT_SECRET, but authMiddlewares.js and verifyToken.js both
// hardcoded the literal string 'your-secret-key' and never touched the
// environment at all -- meaning a real JWT_SECRET set in .env would sign
// tokens that the verification middleware could never actually verify.
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

module.exports = JWT_SECRET;
