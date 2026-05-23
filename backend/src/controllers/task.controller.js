const taskRepo = require('../repositories/task.repo');
const taskService = require('../services/task.service');
const logService = require('../services/log.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');

const create = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.params.milestoneId, req.body, req.user);
  await logService.writeLog(req, 'TASK_CREATED', { type: 'task', id: task.id, name: task.title }, {}, task.milestone.projectId);
  success(res, task, 'Task created', 201);
});

const list = asyncHandler(async (req, res) => success(res, await taskService.listTasks(req.params.milestoneId, req.user)));
const get = asyncHandler(async (req, res) => success(res, await taskService.getTask(req.params.id, req.user)));

const update = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body, req.user);
  const action = req.body.status === 'DONE' ? 'TASK_COMPLETED' : req.body.assignedToId ? 'TASK_ASSIGNED' : 'TASK_UPDATED';
  await logService.writeLog(req, action, { type: 'task', id: task.id, name: task.title }, req.body, task.milestone.projectId);
  success(res, task, 'Task updated');
});

const remove = asyncHandler(async (req, res) => success(res, await taskRepo.remove(req.params.id), 'Task deleted'));

const comment = asyncHandler(async (req, res) => {
  const item = await taskService.addComment(req.params.id, req.body.content, req.user);
  await logService.writeLog(req, 'COMMENT_ADDED', { type: 'task', id: req.params.id }, { commentId: item.id });
  success(res, item, 'Comment added', 201);
});

module.exports = { create, list, get, update, remove, comment };
