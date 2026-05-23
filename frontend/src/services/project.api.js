import api from './api';

export const listProjects = (params) => api.get('/projects', { params });
export const listMyProjects = () => api.get('/projects/my');
export const getClientProject = () => api.get('/projects/client-portal');
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (payload) => api.post('/projects', payload);
export const updateProject = (id, payload) => api.patch(`/projects/${id}`, payload);
