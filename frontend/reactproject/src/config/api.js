import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configuração para incluir o token de autenticação nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Função de login
export const login = async (username, password, userType) => {
  try {
    // Mostrar informações da tentativa de login para debug
    console.log(`Tentando fazer login como ${username} do tipo ${userType}`);
    
    // Fazer a requisição com um timeout para evitar que fique pendente indefinidamente
    const response = await api.post('/login', { username, password, userType }, {
      timeout: 10000 // 10 segundos de timeout
    });
    
    console.log('Resposta de login recebida:', response.data);
    
    // Verificar se a resposta contém um token
    if (!response.data.token) {
      console.error('Resposta de login não contém token:', response.data);
      throw new Error('Resposta de login inválida do servidor');
    }
    
    return response.data;
  } catch (error) {
    // Melhorar o log de erro com mais detalhes
    console.error('Erro durante o login:', error);
    
    // Se tivermos uma resposta do servidor, mostrar o erro específico
    if (error.response) {
      console.error('Resposta de erro do servidor:', error.response.data);
      console.error('Status do erro:', error.response.status);
      
      // Personalizar mensagens baseadas no código de erro
      if (error.response.status === 401) {
        throw new Error('Nome de usuário ou senha incorretos');
      } else if (error.response.status === 400) {
        throw new Error(error.response.data.error || 'Dados de login inválidos');
      } else if (error.response.status === 500) {
        throw new Error('Erro interno do servidor. Por favor, tente novamente mais tarde');
      }
      
      throw error;
    }
    
    // Se for um erro de timeout ou de rede
    if (error.request) {
      console.error('Erro de rede ou timeout na requisição');
      throw new Error('Não foi possível se conectar ao servidor. Verifique sua conexão.');
    }
    
    // Para outros erros
    throw error;
  }
};

// Função para verificar se o usuário está autenticado
export const verificarAutenticacao = () => {
  const token = localStorage.getItem('token');
  return !!token; // Retorna true se o token existir, false caso contrário
};

// Função para logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
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

// =======================
// CRUD DE CONTACTS
export const getContacts = async () => {
  try {
    const response = await api.get('/contacts');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    throw error;
  }
};

export const getContactById = async (id) => {
  try {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar contato:', error);
    throw error;
  }
};

export const createContact = async (contact) => {
  try {
    const response = await api.post('/contacts', contact);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar contato:', error);
    throw error;
  }
};

export const updateContact = async (id, contact) => {
  try {
    const response = await api.put(`/contacts/${id}`, contact);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
    throw error;
  }
};

export const deleteContact = async (id) => {
  try {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir contato:', error);
    throw error;
  }
};

// =======================
// CRUD DE MESSAGES
export const getMessages = async (contactId) => {
  try {
    const response = await api.get(`/contacts/${contactId}/messages`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    throw error;
  }
};

export const getMessageById = async (contactId, messageId) => {
  try {
    const response = await api.get(`/contacts/${contactId}/messages/${messageId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar mensagem:', error);
    throw error;
  }
};

export const createMessage = async (contactId, message) => {
  try {
    const response = await api.post(`/contacts/${contactId}/messages`, message);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar mensagem:', error);
    throw error;
  }
};

export const updateMessage = async (contactId, messageId, message) => {
  try {
    const response = await api.put(`/contacts/${contactId}/messages/${messageId}`, message);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar mensagem:', error);
    throw error;
  }
};

export const deleteMessage = async (contactId, messageId) => {
  try {
    const response = await api.delete(`/contacts/${contactId}/messages/${messageId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir mensagem:', error);
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