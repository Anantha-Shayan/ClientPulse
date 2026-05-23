import { getHealthLabel } from '../utils/getHealthColor';

export function summarizeProject(project) {
  const milestones = project?.milestones || [];
  const tasks = milestones.flatMap((milestone) => milestone.tasks || []);
  const completedMilestones = milestones.filter((milestone) => milestone.status === 'COMPLETED').length;
  const completedTasks = tasks.filter((task) => task.status === 'DONE').length;
  return {
    milestones,
    tasks,
    completedMilestones,
    completedTasks,
    milestoneRate: milestones.length ? Math.round((completedMilestones / milestones.length) * 100) : 0,
    taskRate: tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0,
    healthLabel: getHealthLabel(project?.healthScore || 0)
  };
}

export function projectHealthDistribution(projects = []) {
  return [
    { name: 'On Track', value: projects.filter((project) => project.healthScore >= 80).length, color: '#006e4b' },
    { name: 'At Risk', value: projects.filter((project) => project.healthScore >= 50 && project.healthScore < 80).length, color: '#b7791f' },
    { name: 'Critical', value: projects.filter((project) => project.healthScore < 50).length, color: '#ba1a1a' }
  ];
}
