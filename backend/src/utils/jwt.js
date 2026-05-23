const jwt = require('jsonwebtoken');
const env = require('../config/env');

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role.toLowerCase(), name: user.name }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });

const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET);

module.exports = { signToken, verifyToken };
