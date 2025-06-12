import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../config/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    userType: 'gamer', // Padrão para gamer
    cnpj: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

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
      // Validação simples do lado do cliente
      if (!formData.username || !formData.nome || !formData.email || !formData.senha) {
        throw new Error('Todos os campos são obrigatórios');
      }

      if (formData.senha !== formData.confirmarSenha) {
        throw new Error('As senhas não coincidem');
      }

      if (formData.userType === 'investor' && !formData.cnpj) {
        throw new Error('CNPJ é obrigatório para investidores');
      }

      console.log(`Tentando registrar: ${formData.username} (${formData.userType})`);
      
      // Enviar dados para o backend
      const response = await register(
        formData.username,
        formData.nome,
        formData.email,
        formData.senha,
        formData.userType,
        formData.cnpj
      );

      console.log('Registro bem-sucedido:', response);
      
      // Mostrar mensagem de sucesso
      setSuccess(true);
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            from: '/', 
            message: 'Cadastro realizado com sucesso! Faça login para continuar.'
          }
        });
      }, 2000);
    } catch (err) {
      console.error('Erro ao registrar:', err);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Erro ao registrar usuário. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      border: '1px solid #ddd'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src="/logo.jpeg" alt="Level All Logo" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
        <h2 style={{ fontSize: '24px', margin: '15px 0 5px', color: '#333' }}>Criar Conta - Level All</h2>
        <p style={{ color: '#666', margin: '5px 0 20px' }}>
          Preencha os campos abaixo para se cadastrar
        </p>
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
      
      {success && (
        <div style={{ 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          padding: '10px 15px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          border: '1px solid #c3e6cb'
        }}>
          Registro realizado com sucesso! Redirecionando para o login...
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="userType" style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: "#555" }}>
            Tipo de Conta
          </label>
          <select 
            id="userType" 
            name="userType" 
            value={formData.userType}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '4px', 
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
            required
          >
            <option value="gamer">Gamer</option>
            <option value="developer">Desenvolvedor</option>
            <option value="investor">Investidor</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: "#555" }}>
            Nome de Usuário
          </label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={formData.username}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '4px', 
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="nome" style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: "#555" }}>
            Nome Completo
          </label>
          <input 
            type="text" 
            id="nome" 
            name="nome" 
            value={formData.nome}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '4px', 
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: "#555" }}>
            E-mail
          </label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '4px', 
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
            required
          />
        </div>
        
        {formData.userType === 'investor' && (
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="cnpj" style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: "#555" }}>
              CNPJ
            </label>
            <input 
              type="text" 
              id="cnpj" 
              name="cnpj" 
              value={formData.cnpj}
              onChange={handleChange}
              placeholder="00.000.000/0000-00"
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '4px', 
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
              required={formData.userType === 'investor'}
            />
          </div>
        )}
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="senha" style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: "#555" }}>
            Senha
          </label>
          <input 
            type="password" 
            id="senha" 
            name="senha" 
            value={formData.senha}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '4px', 
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="confirmarSenha" style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: "#555" }}>
            Confirmar Senha
          </label>
          <input 
            type="password" 
            id="confirmarSenha" 
            name="confirmarSenha" 
            value={formData.confirmarSenha}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '4px', 
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
            required
          />
        </div>
        
        <div>
          <button 
            type="submit" 
            disabled={loading || success}
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: '#A48AD4', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              fontSize: '16px',
              cursor: loading || success ? 'not-allowed' : 'pointer',
              opacity: loading || success ? '0.7' : '1'
            }}
          >
            {loading ? 'Processando...' : 'Criar Conta'}
          </button>
        </div>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
        Já tem uma conta? <Link to="/login" style={{ color: '#b39cdb', textDecoration: 'none' }}>Faça login</Link>
      </div>
    </div>
  );
};

export default Register;
