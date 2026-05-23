const prisma = require('../config/db.postgres');

const safeUser = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true
};

const findByEmail = (email) => prisma.user.findUnique({ where: { email } });
const findById = (id) => prisma.user.findUnique({ where: { id }, select: safeUser });
const create = (data) => prisma.user.create({ data, select: safeUser });
const update = (id, data) => prisma.user.update({ where: { id }, data, select: safeUser });
const remove = (id) => prisma.user.delete({ where: { id }, select: safeUser });

const list = async ({ skip, limit, role, status, search }) => {
  const where = {
    ...(role ? { role: role.toUpperCase() } : {}),
    ...(status ? { status: status.toUpperCase() } : {}),
    ...(search
      ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] }
      : {})
  };
  const [data, total] = await Promise.all([
    prisma.user.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: safeUser }),
    prisma.user.count({ where })
  ]);
  return { data, total };
};

module.exports = { findByEmail, findById, create, update, remove, list, safeUser };
