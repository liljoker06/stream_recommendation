import axios, { type InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// base axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// jwt
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

// ==========================================
//  API CONTENTS (FILMS/SÉRIES)
// ==========================================

export const contentAPI = {
  // recup tous les contenus avec filtres
  getAll: async (filters?: {
    type?: 'movie' | 'series';
    category?: string;
    limit?: number;
    offset?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    
    const response = await api.get(`/contents?${params.toString()}`);
    return response.data;
  },

  // recup un contenu par ID
  getById: async (id: string | number, autoFetchTrailer = true) => {
    const params = autoFetchTrailer ? '?auto_fetch_trailer=true' : '';
    const response = await api.get(`/contents/${id}${params}`);
    return response.data;
  },

  // recup les films
  getMovies: async (limit = 50) => {
    return contentAPI.getAll({ type: 'movie', limit });
  },

  // recup les séries
  getSeries: async (limit = 50) => {
    return contentAPI.getAll({ type: 'series', limit });
  },

  // recup par catégorie
  getByCategory: async (category: string, type?: 'movie' | 'series') => {
    return contentAPI.getAll({ category, type });
  },

  // recup catégories distinctes
  getCategories: async (type?: 'movie' | 'series') => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    
    const response = await api.get(`/contents/categories?${params.toString()}`);
    return response.data;
  },
};

export default api;
