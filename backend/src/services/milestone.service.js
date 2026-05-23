const milestoneRepo = require('../repositories/milestone.repo');
const { requireProjectAccess } = require('./access.service');
const { recalculateProjectHealth } = require('./health.service');

const withComputedOverdue = (milestone) => {
  if (!milestone) return milestone;
  if (milestone.status !== 'COMPLETED' && milestone.dueDate < new Date()) return { ...milestone, computedStatus: 'OVERDUE' };
  return { ...milestone, computedStatus: milestone.status };
};

const createMilestone = async (projectId, payload, user) => {
  await requireProjectAccess(user, projectId);
  const milestone = await milestoneRepo.create({
    ...payload,
    dueDate: new Date(payload.dueDate),
    createdById: user.id,
    projectId
  });
  await recalculateProjectHealth(projectId);
  return withComputedOverdue(milestone);
};

const listMilestones = async (projectId, user) => {
  await requireProjectAccess(user, projectId);
  const milestones = await milestoneRepo.listByProject(projectId);
  return milestones.map(withComputedOverdue);
};

const getMilestone = async (projectId, id, user) => {
  await requireProjectAccess(user, projectId);
  return withComputedOverdue(await milestoneRepo.findById(id));
};

const updateMilestone = async (projectId, id, payload, user) => {
  await requireProjectAccess(user, projectId);
  const data = {
    ...payload,
    ...(payload.dueDate ? { dueDate: new Date(payload.dueDate) } : {}),
    ...(payload.status === 'COMPLETED' ? { completedAt: new Date() } : {})
  };
  const milestone = await milestoneRepo.update(id, data);
  await recalculateProjectHealth(projectId);
  return withComputedOverdue(milestone);
};

module.exports = { createMilestone, listMilestones, getMilestone, updateMilestone };
