import axios from "axios";


export const sendCommandApi = (message) => axios.post('/api/finai', {message})