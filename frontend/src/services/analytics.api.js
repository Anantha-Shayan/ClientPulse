import api from './api';

export const getOverview = () => api.get('/analytics/overview');
export const getProjectAnalytics = () => api.get('/analytics/projects');
export const getTeamAnalytics = () => api.get('/analytics/team');
export const getLogs = (params) => api.get('/logs', { params });
export const getProjectLogs = (id) => api.get(`/logs/project/${id}`);
export const getMyLogs = (params) => api.get('/logs/me', { params });
