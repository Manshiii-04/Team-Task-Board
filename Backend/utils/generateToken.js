const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT containing the user's id and role.
 * @param {Object} user - Mongoose user document (must have _id and role)
 * @returns {string} signed JWT
 */
function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

module.exports = generateToken;
