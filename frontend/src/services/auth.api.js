import api from './api';

export const login = (payload) => api.post('/auth/login', payload);
export const logout = () => api.post('/auth/logout');
export const me = () => api.get('/auth/me');
export const updateMe = (payload) => api.patch('/auth/me', payload);
export const register = (payload) => api.post('/auth/register', payload);
