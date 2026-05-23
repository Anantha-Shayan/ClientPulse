const router = require('express').Router();
const mongoose = require('mongoose');
const prisma = require('../config/db.postgres');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const projectRoutes = require('./project.routes');
const milestoneRoutes = require('./milestone.routes');
const taskRoutes = require('./task.routes');
const logRoutes = require('./log.routes');
const analyticsRoutes = require('./analytics.routes');
const { success } = require('../utils/ApiResponse');

router.get('/health', async (_req, res) => {
  let postgres = 'up';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (_err) {
    postgres = 'down';
  }
  success(res, { status: 'ok', postgres, mongodb: mongoose.connection.readyState === 1 ? 'up' : 'down' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/projects/:projectId/milestones', milestoneRoutes);
router.use('/milestones/:milestoneId/tasks', taskRoutes);
router.use('/logs', logRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
