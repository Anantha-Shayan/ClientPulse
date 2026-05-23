const ApiError = require('../utils/ApiError');
const projectRepo = require('../repositories/project.repo');
const milestoneRepo = require('../repositories/milestone.repo');
const taskRepo = require('../repositories/task.repo');

const canAccessProject = (user, project) => {
  if (!project) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'client') return project.clientId === user.id;
  return project.members.some((member) => member.userId === user.id);
};

const requireProjectAccess = async (user, projectId) => {
  const project = await projectRepo.findById(projectId);
  if (!canAccessProject(user, project)) throw new ApiError(403, 'FORBIDDEN', 'Project is outside your access scope');
  return project;
};

const requireMilestoneAccess = async (user, milestoneId) => {
  const milestone = await milestoneRepo.findById(milestoneId);
  if (!milestone) throw new ApiError(404, 'NOT_FOUND', 'Milestone not found');
  const project = await requireProjectAccess(user, milestone.projectId);
  return { milestone, project };
};

const requireTaskAccess = async (user, taskId) => {
  const task = await taskRepo.findById(taskId);
  if (!task) throw new ApiError(404, 'NOT_FOUND', 'Task not found');
  const project = await requireProjectAccess(user, task.milestone.projectId);
  return { task, project };
};

module.exports = { canAccessProject, requireProjectAccess, requireMilestoneAccess, requireTaskAccess };
