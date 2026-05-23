const authService = require('../services/auth.service');
const userRepo = require('../repositories/user.repo');
const logService = require('../services/log.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');
const env = require('../config/env');

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  await logService.writeLog(req, 'USER_CREATED', { type: 'user', id: user.id, name: user.name });
  success(res, user, 'Account created', 201);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  req.user = result.user;
  res.cookie('token', result.token, cookieOptions);
  await logService.writeLog(req, 'USER_LOGIN', { type: 'user', id: result.user.id, name: result.user.name });
  success(res, result, 'Logged in');
});

const logout = asyncHandler(async (req, res) => {
  await logService.writeLog(req, 'USER_LOGOUT', { type: 'user', id: req.user.id, name: req.user.name });
  res.clearCookie('token', cookieOptions);
  success(res, {}, 'Logged out');
});

const me = asyncHandler(async (req, res) => success(res, req.user));
const updateMe = asyncHandler(async (req, res) => success(res, await userRepo.update(req.user.id, req.body), 'Profile updated'));

module.exports = { register, login, logout, me, updateMe };
