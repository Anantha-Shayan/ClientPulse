import api from './api';

export const listMilestones = (projectId) => api.get(`/projects/${projectId}/milestones`);
export const createMilestone = (projectId, payload) => api.post(`/projects/${projectId}/milestones`, payload);
