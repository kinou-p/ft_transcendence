import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost/api',
  withCredentials: true,
  headers: {
    Authorization: 'Bearer My token here',
  },
});

export default api;