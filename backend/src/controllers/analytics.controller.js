const analytics = require('../services/analytics.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');

const overview = asyncHandler(async (_req, res) => success(res, await analytics.overview()));
const projects = asyncHandler(async (_req, res) => success(res, await analytics.projects()));
const team = asyncHandler(async (_req, res) => success(res, await analytics.team()));
const project = asyncHandler(async (req, res) => success(res, await analytics.projectMetrics(req.params.id, req.user)));

module.exports = { overview, projects, team, project };
