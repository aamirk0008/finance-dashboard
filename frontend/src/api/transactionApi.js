import axios from './axios';

export const getTransactionsApi = (params) => axios.get('/api/transactions', { params });
export const getTransactionByIdApi = (id) => axios.get(`/api/transactions/${id}`);
export const createTransactionApi = (data) => axios.post('/api/transactions', data);
export const updateTransactionApi = (id, data) => axios.put(`/api/transactions/${id}`, data);
export const deleteTransactionApi = (id) => axios.delete(`/api/transactions/${id}`);