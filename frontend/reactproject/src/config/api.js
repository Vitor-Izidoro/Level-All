import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Autenticação
export const login = async (username, password) => {
  try {
    const response = await api.post('/login', { username, password });
    const { token, userType } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  window.location.href = '/login';
};

// operações de usuário
export const getUsers = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUser = async (username) => {
  try {
    const response = await api.get(`/user/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const createUserGamer = async (userData) => {
  try {
    const response = await api.post('/user_gamer', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating gamer user:', error);
    throw error;
  }
};

export const createUserDeveloper = async (userData) => {
  try {
    const response = await api.post('/user_developer', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating developer user:', error);
    throw error;
  }
};

export const createUserInvestor = async (userData) => {
  try {
    const response = await api.post('/user_investor', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating investor user:', error);
    throw error;
  }
};

export const createUserAdmin = async (userData) => {
  try {
    const response = await api.post('/user_admin', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

export const updateUserGamer = async (username, userData) => {
  try {
    const response = await api.put(`/user_gamer/${username}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating gamer user:', error);
    throw error;
  }
};

export const updateUserDeveloper = async (username, userData) => {
  try {
    const response = await api.put(`/user_developer/${username}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating developer user:', error);
    throw error;
  }
};

export const updateUserInvestor = async (username, userData) => {
  try {
    const response = await api.put(`/user_investor/${username}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating investor user:', error);
    throw error;
  }
};

export const updateUserAdmin = async (username, userData) => {
  try {
    const response = await api.put(`/user_admin/${username}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating admin user:', error);
    throw error;
  }
};

export const deleteUser = async (username) => {
  try {
    const response = await api.delete(`/user/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const testConnection = async () => {
  try {
    const response = await api.get('/test-db');
    return response.data;
  } catch (error) {
    console.error('Error testing connection:', error);
    throw error;
  }
};

export default api; 