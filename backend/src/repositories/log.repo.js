const ActivityLog = require('../models/ActivityLog.model');

const create = (data) => ActivityLog.create(data).catch(() => null);

const list = async ({ page, limit, action, projectId, userId, from, to }) => {
  const query = {
    ...(action ? { action } : {}),
    ...(projectId ? { projectId } : {}),
    ...(userId ? { 'performedBy.userId': userId } : {}),
    ...(from || to ? { createdAt: { ...(from ? { $gte: new Date(from) } : {}), ...(to ? { $lte: new Date(to) } : {}) } } : {})
  };
  const [data, total] = await Promise.all([
    ActivityLog.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ActivityLog.countDocuments(query)
  ]);
  return { data, total };
};

module.exports = { create, list };
