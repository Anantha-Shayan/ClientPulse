const milestoneRepo = require('../repositories/milestone.repo');
const milestoneService = require('../services/milestone.service');
const logService = require('../services/log.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');

const create = asyncHandler(async (req, res) => {
  const milestone = await milestoneService.createMilestone(req.params.projectId, req.body, req.user);
  await logService.writeLog(req, 'MILESTONE_CREATED', { type: 'milestone', id: milestone.id, name: milestone.title }, {}, req.params.projectId);
  success(res, milestone, 'Milestone created', 201);
});

const list = asyncHandler(async (req, res) => success(res, await milestoneService.listMilestones(req.params.projectId, req.user)));
const get = asyncHandler(async (req, res) => success(res, await milestoneService.getMilestone(req.params.projectId, req.params.id, req.user)));

const update = asyncHandler(async (req, res) => {
  const milestone = await milestoneService.updateMilestone(req.params.projectId, req.params.id, req.body, req.user);
  await logService.writeLog(req, req.body.status === 'COMPLETED' ? 'MILESTONE_COMPLETED' : 'MILESTONE_UPDATED', { type: 'milestone', id: milestone.id, name: milestone.title }, req.body, req.params.projectId);
  success(res, milestone, 'Milestone updated');
});

const remove = asyncHandler(async (req, res) => success(res, await milestoneRepo.remove(req.params.id), 'Milestone deleted'));

module.exports = { create, list, get, update, remove };
