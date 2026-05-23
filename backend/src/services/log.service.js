const logRepo = require('../repositories/log.repo');
const { paginationMeta } = require('../utils/paginate');

const actorFromRequest = (req) => ({
  userId: req.user?.id || 'system',
  name: req.user?.name || 'System',
  role: req.user?.role || 'system'
});

const writeLog = (req, action, targetEntity = {}, metadata = {}, projectId) =>
  logRepo.create({
    action,
    performedBy: actorFromRequest(req),
    targetEntity,
    projectId,
    metadata,
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });

const listLogs = async (query) => {
  const page = Math.max(parseInt(query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(query.limit || '20', 10), 1), 100);
  const { data, total } = await logRepo.list({ ...query, page, limit });
  return { data, pagination: paginationMeta(page, limit, total) };
};

module.exports = { writeLog, listLogs };
