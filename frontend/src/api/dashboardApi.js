import axios from './axios';

export const getSummaryApi = () => axios.get('/api/dashboard/summary');
export const getCategoriesApi = () => axios.get('/api/dashboard/categories');
export const getTrendsApi = (year) => axios.get('/api/dashboard/trends', { params: { year } });
export const getRatioApi = () => axios.get('/api/dashboard/ratio');