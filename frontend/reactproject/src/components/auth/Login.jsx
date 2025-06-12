import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login, API_URL } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: 'gamer' // Padrão para gamer, mas o usuário pode alterar
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAutenticado, setUsuario } = useAuth();
  
  // Pega a página de onde o usuário veio
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log(`Tentando login: ${formData.username} (${formData.userType})`);      // Verificar se o backend está acessível antes de tentar fazer login
      try {
        // Usando AbortController para implementar timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        // Primeiro tenta a rota de saúde mais leve
        const healthResponse = await fetch(`${API_URL}/health`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Verifica se o servidor respondeu corretamente
        if (!healthResponse.ok) {
          // Se a rota de saúde falhar, tenta a rota de teste do banco como um backup
          const dbController = new AbortController();
          const dbTimeoutId = setTimeout(() => dbController.abort(), 3000);
          
          const dbResponse = await fetch(`${API_URL}/test-db`, {
            signal: dbController.signal
          });
          
          clearTimeout(dbTimeoutId);
          
          if (!dbResponse.ok) {
            throw new Error('Servidor não está respondendo corretamente.');
          }
        }
      } catch (networkErr) {
        throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está em execução.');
      }
      
      const response = await login(formData.username, formData.password, formData.userType);
      
      // Salvar token e dados do usuário no localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Atualizar o contexto de autenticação
      setAutenticado(true);
      setUsuario(response.user);
      
      console.log('Login bem-sucedido, redirecionando para:', from);
      // Redirecionar para a página que o usuário tentou acessar originalmente
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      
      if (err.message === 'Network Error' || err.message.includes('conectar ao servidor')) {
        setError('Não foi possível conectar ao servidor. Verifique se o backend está em execução.');
      } else if (err.response?.status === 401) {
        setError('Nome de usuário ou senha incorretos.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Erro ao fazer login. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ 
      maxWidth: '450px', 
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      border: '1px solid #ddd'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src="/logo.jpeg" alt="Level All Logo" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
        <h2 style={{ fontSize: '24px', margin: '15px 0 5px', color: '#333' }}>Login - Level All</h2>
        {from !== '/' && (
          <p style={{ color: '#666', margin: '5px 0' }}>
            Para acessar: {from}
          </p>
        )}
      </div>
      
      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '10px 15px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
            Nome de Usuário:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
            placeholder="Digite seu nome de usuário"
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
            Senha:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
            placeholder="Digite sua senha"
          />
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <label htmlFor="userType" style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2d2633' }}>
            Tipo de Usuário:
          </label>
          <select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              fontSize: '16px',
              backgroundColor: '#fff'
            }}
          >
            <option value="gamer">Gamer</option>
            <option value="developer">Desenvolvedor</option>
            <option value="investor">Investidor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '14px', 
            backgroundColor: '#a48ad4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            fontSize: '16px',
            fontWeight: '600',
            transition: 'background-color 0.3s'
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <div style={{ marginBottom: '10px', color: '#666' }}>
            Não tem uma conta? <Link to="/register" style={{ color: '#a48ad4', textDecoration: 'none', fontWeight: '500' }}>Registre-se</Link>
          </div>
          <Link to="/" style={{ color: '#a48ad4', textDecoration: 'none', display: 'block', marginTop: '5px' }}>
            Voltar para página inicial
          </Link>
        </div>
      </form>
      
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px', fontSize: '14px', color: '#666' }}>
        <p style={{ margin: '0 0 10px', fontWeight: '500' }}>Usuários para teste:</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ marginBottom: '5px' }}>
            <strong>Gamer:</strong> shadowwolf01<br />
            <strong>Senha:</strong> senha123
          </div>
          <div style={{ marginBottom: '5px' }}>
            <strong>Developer:</strong> bruno.ribeiro<br />
            <strong>Senha:</strong> forgeTech24
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
