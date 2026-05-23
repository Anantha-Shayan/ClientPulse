const prisma = require('../config/db.postgres');
const logService = require('./log.service');
const { requireProjectAccess } = require('./access.service');

const overview = async () => {
  const [totalUsers, activeUsers, totalProjects, activeProjects, completedProjects] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.project.count(),
    prisma.project.count({ where: { status: { in: ['PLANNING', 'IN_PROGRESS', 'ON_HOLD'] } } }),
    prisma.project.count({ where: { status: 'COMPLETED' } })
  ]);
  const recentActivity = await logService.listLogs({ page: 1, limit: 20 });
  return { totalUsers, activeUsers, totalProjects, activeProjects, completedProjects, recentActivity: recentActivity.data };
};

const projects = async () => {
  const all = await prisma.project.findMany({ select: { id: true, name: true, status: true, healthScore: true } });
  return {
    projects: all,
    healthDistribution: {
      onTrack: all.filter((p) => p.healthScore >= 80).length,
      atRisk: all.filter((p) => p.healthScore >= 50 && p.healthScore < 80).length,
      critical: all.filter((p) => p.healthScore < 50).length
    }
  };
};

const team = async () => {
  const users = await prisma.user.findMany({
    where: { role: 'MEMBER' },
    select: { id: true, name: true, tasksAssigned: { select: { id: true, status: true, priority: true } } }
  });
  return users.map((user) => ({ id: user.id, name: user.name, assignedTasks: user.tasksAssigned.length, tasks: user.tasksAssigned }));
};

const projectMetrics = async (id, user) => {
  await requireProjectAccess(user, id);
  const project = await prisma.project.findUnique({
    where: { id },
    include: { milestones: { include: { tasks: true } } }
  });
  const tasks = project.milestones.flatMap((m) => m.tasks);
  return {
    id: project.id,
    name: project.name,
    healthScore: project.healthScore,
    milestones: {
      total: project.milestones.length,
      completed: project.milestones.filter((m) => m.status === 'COMPLETED').length
    },
    tasks: {
      total: tasks.length,
      done: tasks.filter((task) => task.status === 'DONE').length,
      byStatus: tasks.reduce((acc, task) => ({ ...acc, [task.status]: (acc[task.status] || 0) + 1 }), {})
    }
  };
};

module.exports = { overview, projects, team, projectMetrics };
