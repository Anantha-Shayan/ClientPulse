import api from './api';

export const listUsers = (params) => api.get('/users', { params });
export const updateUserStatus = (id, status) => api.patch(`/users/${id}/status`, { status });
export const inviteClient = (payload) => api.post('/users/invite-client', payload);
export const deleteUser = (id) => api.delete(`/users/${id}`);
