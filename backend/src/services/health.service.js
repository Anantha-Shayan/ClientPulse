const prisma = require('../config/db.postgres');

const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)));

const healthLabel = (score) => {
  if (score >= 80) return 'On Track';
  if (score >= 50) return 'At Risk';
  return 'Critical';
};

const recalculateProjectHealth = async (projectId) => {
  const milestones = await prisma.milestone.findMany({
    where: { projectId },
    include: { tasks: true }
  });

  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter((m) => m.status === 'COMPLETED').length;
  const tasks = milestones.flatMap((m) => m.tasks);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'DONE').length;
  const now = new Date();
  const overdueMilestones = milestones.filter((m) => m.status !== 'COMPLETED' && m.dueDate < now).length;
  const overdueTasks = tasks.filter((task) => task.status !== 'DONE' && task.dueDate && task.dueDate < now).length;

  const milestoneScore = totalMilestones ? (completedMilestones / totalMilestones) * 50 : 50;
  const taskScore = totalTasks ? (completedTasks / totalTasks) * 30 : 30;
  const healthScore = clamp(milestoneScore + taskScore - (overdueMilestones + overdueTasks) * 5);

  return prisma.project.update({ where: { id: projectId }, data: { healthScore } });
};

module.exports = { recalculateProjectHealth, healthLabel };
