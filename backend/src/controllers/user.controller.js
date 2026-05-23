const userService = require('../services/user.service');
const logService = require('../services/log.service');
const { getPagination } = require('../utils/paginate');
const asyncHandler = require('../utils/asyncHandler');
const { success, paginated } = require('../utils/ApiResponse');

const list = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const result = await userService.listUsers({ ...pagination, ...req.query });
  paginated(res, result.data, result.pagination);
});

const get = asyncHandler(async (req, res) => success(res, await userService.getUser(req.params.id)));

const updateStatus = asyncHandler(async (req, res) => {
  const user = await userService.updateStatus(req.params.id, req.body.status);
  await logService.writeLog(req, 'USER_STATUS_CHANGED', { type: 'user', id: user.id, name: user.name }, { status: req.body.status });
  success(res, user, 'User status updated');
});

const remove = asyncHandler(async (req, res) => {
  const user = await userService.deleteUser(req.user.id, req.params.id);
  success(res, user, 'User deleted');
});

const inviteClient = asyncHandler(async (req, res) => {
  const client = await userService.inviteClient(req.body);
  await logService.writeLog(req, 'CLIENT_INVITED', { type: 'user', id: client.id, name: client.name }, {}, req.body.projectId);
  success(res, client, 'Client invited', 201);
});

module.exports = { list, get, updateStatus, remove, inviteClient };
