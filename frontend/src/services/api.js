import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1',
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lumina_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  const message = error.response?.data?.error || (error.code === 'ECONNABORTED' ? 'A API demorou para responder.' : 'Não foi possível conectar à Lumina. Verifique se o servidor está ativo.');
  if (error.response?.status === 401 && localStorage.getItem('lumina_token')) {
    localStorage.removeItem('lumina_token');
    localStorage.removeItem('lumina_user');
    window.dispatchEvent(new Event('lumina:session-expired'));
  }
  return Promise.reject(new Error(message));
});

export const authService = {
  login: async (credentials) => (await api.post('/auth/login', credentials)).data.data,
  register: async (credentials) => (await api.post('/auth/register', credentials)).data.data
};

export const chatService = {
  list: async () => (await api.get('/chats')).data.data,
  create: async (title = 'Nova conversa') => (await api.post('/chats', { title })).data.data,
  get: async (id) => (await api.get(`/chats/${id}`)).data.data,
  rename: async (id, title) => (await api.put(`/chats/${id}`, { title })).data.data,
  remove: async (id) => api.delete(`/chats/${id}`),
  addMessage: async (id, message) => (await api.post(`/chats/${id}/messages`, message)).data.data,
  ask: async (id, content) => (await api.post(`/chats/${id}/ask`, { content })).data.data
};
export const exerciseService = {
  list: async () => (await api.get('/exercises')).data.data
};
