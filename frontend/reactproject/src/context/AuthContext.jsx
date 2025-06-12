import React, { createContext, useState, useContext, useEffect } from 'react';
import { verificarAutenticacao } from '../config/api';

// Criando o contexto
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Função para atualizar os dados do usuário no localStorage quando o estado do usuário mudar
  useEffect(() => {
    if (usuario && autenticado) {
      localStorage.setItem('user', JSON.stringify(usuario));
    }
  }, [usuario, autenticado]);

  useEffect(() => {
    // Verifica se o usuário está autenticado quando o componente é montado
    const verificarUsuario = async () => {
      const estaAutenticado = verificarAutenticacao();
      
      if (estaAutenticado) {
        try {
          // Recuperar informações do usuário armazenadas no localStorage
          const userDataString = localStorage.getItem('user');
          
          if (!userDataString) {
            throw new Error('Dados do usuário não encontrados');
          }
          
          const userData = JSON.parse(userDataString);
          
          if (!userData || !userData.username || !userData.id) {
            throw new Error('Dados do usuário inválidos');
          }
          
          console.log('Usuário autenticado:', userData.username, 'ID:', userData.id);
          setUsuario(userData);
          setAutenticado(true);
        } catch (error) {
          console.error('Erro ao recuperar dados do usuário:', error);
          // Limpar dados inválidos
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAutenticado(false);
          setUsuario(null);
        }
      } else {
        console.log('Usuário não autenticado');
        setAutenticado(false);
        setUsuario(null);
      }
      
      setCarregando(false);
    };

    verificarUsuario();
  }, []);

  return (
    <AuthContext.Provider value={{ autenticado, carregando, usuario, setAutenticado, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
