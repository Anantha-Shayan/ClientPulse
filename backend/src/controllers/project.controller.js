const projectRepo = require('../repositories/project.repo');
const projectService = require('../services/project.service');
const logService = require('../services/log.service');
const { getPagination } = require('../utils/paginate');
const asyncHandler = require('../utils/asyncHandler');
const { success, paginated } = require('../utils/ApiResponse');

const create = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.body, req.user.id);
  await logService.writeLog(req, 'PROJECT_CREATED', { type: 'project', id: project.id, name: project.name }, {}, project.id);
  success(res, project, 'Project created', 201);
});

const list = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const result = await projectService.listProjects({ ...pagination, ...req.query });
  paginated(res, result.data, result.pagination);
});

const my = asyncHandler(async (req, res) => success(res, await projectService.myProjects(req.user.id)));
const clientPortal = asyncHandler(async (req, res) => success(res, await projectService.clientProject(req.user.id)));
const get = asyncHandler(async (req, res) => success(res, await projectService.getProject(req.params.id, req.user)));

const update = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(req.params.id, req.body, req.user);
  await logService.writeLog(req, 'PROJECT_UPDATED', { type: 'project', id: project.id, name: project.name }, req.body, project.id);
  success(res, project, 'Project updated');
});

const remove = asyncHandler(async (req, res) => {
  const project = await projectRepo.remove(req.params.id);
  await logService.writeLog(req, 'PROJECT_DELETED', { type: 'project', id: project.id, name: project.name }, {}, project.id);
  success(res, project, 'Project deleted');
});

const addMember = asyncHandler(async (req, res) => {
  const member = await projectRepo.addMember(req.params.id, req.body.userId, req.body.role);
  await logService.writeLog(req, 'MEMBER_ADDED', { type: 'user', id: req.body.userId, name: member.user.name }, { role: req.body.role }, req.params.id);
  success(res, member, 'Member added', 201);
});

const removeMember = asyncHandler(async (req, res) => {
  await projectRepo.removeMember(req.params.id, req.params.userId);
  await logService.writeLog(req, 'MEMBER_REMOVED', { type: 'user', id: req.params.userId }, {}, req.params.id);
  success(res, {}, 'Member removed');
});

module.exports = { create, list, my, clientPortal, get, update, remove, addMember, removeMember };
