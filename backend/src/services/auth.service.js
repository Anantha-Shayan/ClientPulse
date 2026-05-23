const bcrypt = require('bcrypt');
const userRepo = require('../repositories/user.repo');
const ApiError = require('../utils/ApiError');
const { signToken } = require('../utils/jwt');

const publicUser = (user) => {
  const { password, ...safe } = user;
  return { ...safe, role: safe.role?.toLowerCase(), status: safe.status?.toLowerCase() };
};

const register = async (payload) => {
  const exists = await userRepo.findByEmail(payload.email);
  if (exists) throw new ApiError(409, 'EMAIL_EXISTS', 'Email is already registered');
  const password = await bcrypt.hash(payload.password, 12);
  const user = await userRepo.create({ ...payload, password, role: payload.role.toUpperCase() });
  return publicUser(user);
};

const login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  if (user.status !== 'ACTIVE') throw new ApiError(403, 'ACCOUNT_INACTIVE', 'Account is inactive');
  const matches = await bcrypt.compare(password, user.password);
  if (!matches) throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  return { token: signToken(user), user: publicUser(user) };
};

module.exports = { register, login, publicUser };
