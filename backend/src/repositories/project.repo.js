const prisma = require('../config/db.postgres');

const includeProject = {
  client: { select: { id: true, name: true, email: true, role: true } },
  createdBy: { select: { id: true, name: true, email: true } },
  members: { include: { user: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } } } },
  tags: true,
  milestones: { include: { tasks: true }, orderBy: { dueDate: 'asc' } }
};

const create = (data) => prisma.project.create({ data, include: includeProject });
const findById = (id) => prisma.project.findUnique({ where: { id }, include: includeProject });
const update = (id, data) => prisma.project.update({ where: { id }, data, include: includeProject });
const remove = (id) => prisma.project.delete({ where: { id } });
const addMember = (projectId, userId, role = 'member') =>
  prisma.projectMember.upsert({
    where: { projectId_userId: { projectId, userId } },
    update: { role },
    create: { projectId, userId, role },
    include: { user: { select: { id: true, name: true, email: true, role: true } } }
  });
const removeMember = (projectId, userId) => prisma.projectMember.delete({ where: { projectId_userId: { projectId, userId } } });

const list = async ({ skip, limit, status, tag, search, startDate, endDate }) => {
  const where = {
    ...(status ? { status } : {}),
    ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
    ...(tag ? { tags: { some: { label: { equals: tag, mode: 'insensitive' } } } } : {}),
    ...(startDate || endDate
      ? { startDate: { ...(startDate ? { gte: new Date(startDate) } : {}), ...(endDate ? { lte: new Date(endDate) } : {}) } }
      : {})
  };
  const [data, total] = await Promise.all([
    prisma.project.findMany({ where, skip, take: limit, orderBy: { updatedAt: 'desc' }, include: includeProject }),
    prisma.project.count({ where })
  ]);
  return { data, total };
};

const assignedToUser = (userId) =>
  prisma.project.findMany({
    where: { members: { some: { userId } } },
    orderBy: { updatedAt: 'desc' },
    include: includeProject
  });

const clientProject = (clientId) => prisma.project.findFirst({ where: { clientId }, include: includeProject });

module.exports = { create, findById, update, remove, list, assignedToUser, clientProject, addMember, removeMember, includeProject };
