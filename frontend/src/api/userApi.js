import axios from './axios';

export const getUsersApi = (params) => axios.get('/api/users', { params });
export const getUserByIdApi = (id) => axios.get(`/api/users/${id}`);
export const updateRoleApi = (id, role) => axios.patch(`/api/users/${id}/role`, { role });
export const updateStatusApi = (id, isActive) => axios.patch(`/api/users/${id}/status`, { isActive });
export const deleteUserApi = (id) => axios.delete(`/api/users/${id}`);