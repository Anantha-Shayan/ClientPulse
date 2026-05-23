const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/jwt');
const prisma = require('../config/db.postgres');

module.exports = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    const token = req.cookies?.token || (header?.startsWith('Bearer ') ? header.slice(7) : null);

    if (!token) throw new ApiError(401, 'UNAUTHENTICATED', 'Authentication token is required');

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, email: true, role: true, status: true, avatarUrl: true }
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new ApiError(401, 'UNAUTHENTICATED', 'Account is inactive or no longer exists');
    }

    req.user = { ...user, role: user.role.toLowerCase() };
    next();
  } catch (err) {
    next(err.statusCode ? err : new ApiError(401, 'UNAUTHENTICATED', 'Invalid or expired token'));
  }
};
