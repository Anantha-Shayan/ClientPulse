const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        'USER_LOGIN',
        'USER_LOGOUT',
        'USER_CREATED',
        'USER_STATUS_CHANGED',
        'PROJECT_CREATED',
        'PROJECT_UPDATED',
        'PROJECT_DELETED',
        'MILESTONE_CREATED',
        'MILESTONE_UPDATED',
        'MILESTONE_COMPLETED',
        'TASK_CREATED',
        'TASK_UPDATED',
        'TASK_ASSIGNED',
        'TASK_COMPLETED',
        'TASK_DELETED',
        'COMMENT_ADDED',
        'MEMBER_ADDED',
        'MEMBER_REMOVED',
        'CLIENT_INVITED'
      ]
    },
    performedBy: {
      userId: { type: String, required: true },
      name: { type: String, required: true },
      role: { type: String, required: true }
    },
    targetEntity: {
      type: { type: String },
      id: { type: String },
      name: { type: String }
    },
    projectId: { type: String, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String }
  },
  { timestamps: true, collection: 'activity_logs' }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ projectId: 1, createdAt: -1 });
activityLogSchema.index({ 'performedBy.userId': 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
