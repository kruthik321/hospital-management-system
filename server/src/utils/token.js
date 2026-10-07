const jwt = require('jsonwebtoken');

const generateToken = (userId, roleId) => {
  return jwt.sign(
    { userId, roleId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

module.exports = { generateToken };
