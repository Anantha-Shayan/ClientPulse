const projectRepo = require('../repositories/project.repo');
const ApiError = require('../utils/ApiError');
const { paginationMeta } = require('../utils/paginate');
const { canAccessProject } = require('./access.service');

const normalizeProject = (project, user) => {
  if (!project) return project;
  const base = {
    ...project,
    healthLabel: project.healthScore >= 80 ? 'On Track' : project.healthScore >= 50 ? 'At Risk' : 'Critical'
  };
  if (user?.role === 'client') {
    const { budget, createdBy, ...clientSafe } = base;
    return {
      ...clientSafe,
      members: project.members.map((member) => ({
        role: member.role,
        user: { id: member.user.id, name: member.user.name.split(' ')[0], role: member.user.role.toLowerCase() }
      }))
    };
  }
  return base;
};

const createProject = (payload, userId) => {
  const { tags = [], memberIds = [], ...data } = payload;
  return projectRepo.create({
    ...data,
    status: data.status || 'PLANNING',
    startDate: new Date(data.startDate),
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    createdById: userId,
    tags: { create: tags.map((label) => ({ label })) },
    members: { create: memberIds.map((id) => ({ userId: id })) }
  });
};

const listProjects = async ({ page, limit, skip, ...filters }) => {
  const { data, total } = await projectRepo.list({ skip, limit, ...filters });
  return { data: data.map((project) => normalizeProject(project)), pagination: paginationMeta(page, limit, total) };
};

const myProjects = (userId) => projectRepo.assignedToUser(userId).then((projects) => projects.map((project) => normalizeProject(project)));
const clientProject = (userId) => projectRepo.clientProject(userId).then((project) => normalizeProject(project, { role: 'client' }));

const getProject = async (id, user) => {
  const project = await projectRepo.findById(id);
  if (!project) throw new ApiError(404, 'NOT_FOUND', 'Project not found');
  if (!canAccessProject(user, project)) throw new ApiError(403, 'FORBIDDEN', 'Project is outside your access scope');
  return normalizeProject(project, user);
};

const updateProject = async (id, payload, user) => {
  await getProject(id, user);
  const { tags, memberIds, startDate, endDate, ...data } = payload;
  return projectRepo.update(id, {
    ...data,
    ...(startDate ? { startDate: new Date(startDate) } : {}),
    ...(endDate ? { endDate: new Date(endDate) } : {})
  }).then((updated) => normalizeProject(updated, user));
};

module.exports = { createProject, listProjects, myProjects, clientProject, getProject, updateProject, normalizeProject };
