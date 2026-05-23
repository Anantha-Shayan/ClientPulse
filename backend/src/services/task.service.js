const taskRepo = require('../repositories/task.repo');
const { requireMilestoneAccess, requireTaskAccess } = require('./access.service');
const { recalculateProjectHealth } = require('./health.service');

const createTask = async (milestoneId, payload, user) => {
  const { project } = await requireMilestoneAccess(user, milestoneId);
  const task = await taskRepo.create({
    ...payload,
    dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
    createdById: user.id,
    milestoneId
  });
  await recalculateProjectHealth(project.id);
  return task;
};

const listTasks = async (milestoneId, user) => {
  await requireMilestoneAccess(user, milestoneId);
  return taskRepo.listByMilestone(milestoneId);
};

const getTask = async (id, user) => {
  const { task } = await requireTaskAccess(user, id);
  return task;
};

const updateTask = async (id, payload, user) => {
  const { project } = await requireTaskAccess(user, id);
  const task = await taskRepo.update(id, {
    ...payload,
    dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
    completedAt: payload.status === 'DONE' ? new Date() : undefined
  });
  await recalculateProjectHealth(project.id);
  return task;
};

const addComment = async (id, content, user) => {
  await requireTaskAccess(user, id);
  return taskRepo.addComment(id, user.id, content);
};

module.exports = { createTask, listTasks, getTask, updateTask, addComment };
