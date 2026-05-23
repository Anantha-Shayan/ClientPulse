const logService = require('../services/log.service');
const projectRepo = require('../repositories/project.repo');
const { canAccessProject } = require('../services/access.service');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { paginated } = require('../utils/ApiResponse');

const list = asyncHandler(async (req, res) => {
  const result = await logService.listLogs(req.query);
  paginated(res, result.data, result.pagination);
});

const project = asyncHandler(async (req, res) => {
  const project = await projectRepo.findById(req.params.id);
  if (!canAccessProject(req.user, project)) throw new ApiError(403, 'FORBIDDEN', 'Project is outside your access scope');
  const result = await logService.listLogs({ ...req.query, projectId: req.params.id });
  if (req.user.role === 'client') {
    const publicActions = ['MILESTONE_CREATED', 'MILESTONE_UPDATED', 'MILESTONE_COMPLETED', 'TASK_COMPLETED'];
    result.data = result.data.filter((item) => publicActions.includes(item.action));
  }
  paginated(res, result.data, result.pagination);
});

const me = asyncHandler(async (req, res) => {
  const result = await logService.listLogs({ ...req.query, userId: req.user.id });
  paginated(res, result.data, result.pagination);
});

module.exports = { list, project, me };
