const prisma = require('../config/db.postgres');

const includeMilestone = {
  tasks: { include: { assignedTo: { select: { id: true, name: true, email: true } } } },
  createdBy: { select: { id: true, name: true } }
};

const create = (data) => prisma.milestone.create({ data, include: includeMilestone });
const listByProject = (projectId) => prisma.milestone.findMany({ where: { projectId }, include: includeMilestone, orderBy: { dueDate: 'asc' } });
const findById = (id) => prisma.milestone.findUnique({ where: { id }, include: includeMilestone });
const update = (id, data) => prisma.milestone.update({ where: { id }, data, include: includeMilestone });
const remove = (id) => prisma.milestone.delete({ where: { id } });

module.exports = { create, listByProject, findById, update, remove };
