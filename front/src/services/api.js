import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error);
    return Promise.reject(error);
  }
);

// Serviços para Sensores
export const sensorService = {
  getAll: () => api.get('/sensores'),
  create: (data) => api.post('/sensores', data),
  update: (id, data) => api.patch(`/sensores/${id}`, data),
  delete: (id) => api.delete(`/sensores/${id}`),
};

// Serviços para Containers
export const containerService = {
  getAll: () => api.get('/container'),
  create: (data) => api.post('/container', data),
  update: (id, data) => api.patch(`/container/${id}`, data),
  delete: (id) => api.delete(`/container/${id}`),
};

// Serviços para Medições
export const measureService = {
  getAll: (params = {}) => api.get('/measure', { params }),
  create: (data) => api.post('/measure', data),
  delete: (id) => api.delete(`/measure/${id}`),
};

export default api; 