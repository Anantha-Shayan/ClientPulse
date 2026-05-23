import api from './api';

export const listTasks = (milestoneId) => api.get(`/milestones/${milestoneId}/tasks`);
export const createTask = (milestoneId, payload) => api.post(`/milestones/${milestoneId}/tasks`, payload);
export const updateTask = (milestoneId, id, payload) => api.patch(`/milestones/${milestoneId}/tasks/${id}`, payload);
