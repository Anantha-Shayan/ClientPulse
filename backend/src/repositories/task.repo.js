const prisma = require('../config/db.postgres');

const includeTask = {
  assignedTo: { select: { id: true, name: true, email: true } },
  createdBy: { select: { id: true, name: true } },
  comments: { orderBy: { createdAt: 'asc' } },
  milestone: { select: { id: true, title: true, projectId: true } }
};

const create = (data) => prisma.task.create({ data, include: includeTask });
const listByMilestone = (milestoneId) => prisma.task.findMany({ where: { milestoneId }, include: includeTask, orderBy: { createdAt: 'asc' } });
const findById = (id) => prisma.task.findUnique({ where: { id }, include: includeTask });
const update = (id, data) => prisma.task.update({ where: { id }, data, include: includeTask });
const remove = (id) => prisma.task.delete({ where: { id } });
const addComment = (taskId, authorId, content) => prisma.comment.create({ data: { taskId, authorId, content } });

module.exports = { create, listByMilestone, findById, update, remove, addComment };
