import axios, { type InternalAxiosRequestConfig } from 'axios';

// Récupération de l'URL de l'API depuis les variables d'environnement
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Configuration de base pour axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// ==========================================
//  API AUTHENTICATION
// ==========================================

export const authAPI = {
  // Inscription
  signup: async (userData: {
    name?: string;
    email: string;
    password: string;
    age?: number;
    gender?: string;
    preferences?: any;
  }) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // Connexion
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Vérifier le token
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

export default api;
