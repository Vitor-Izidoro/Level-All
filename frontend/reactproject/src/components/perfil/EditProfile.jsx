import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import SidebarToggle from '../shared/SidebarToggle';
import Sidebar from "../shared/Sidebar";
import SuccessMessage from '../shared/SuccessMessage';
import ErrorMessage from '../shared/ErrorMessage';
import ConfirmModal from '../shared/ConfirmModal';
import PasswordTips from '../auth/PasswordTips';
import UsernameTips from './UsernameTips';

function EditProfile() {
  const navigate = useNavigate();
  const { usuario, setUsuario } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);  const [formData, setFormData] = useState({
    username: '',
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cnpj: ''
  });
  const [usernameChanged, setUsernameChanged] = useState(false);

  useEffect(() => {
    if (usuario) {
      setFormData({
        username: usuario.username || '',
        nome: usuario.nome || '',
        email: usuario.email || '',
        senha: '',
        confirmarSenha: '',
        cnpj: usuario.cnpj || ''
      });
    }
  }, [usuario]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Verificar se o nome de usuário está sendo alterado
    if (name === 'username' && usuario && value !== usuario.username) {
      setUsernameChanged(true);
    } else if (name === 'username' && usuario && value === usuario.username) {
      setUsernameChanged(false);
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    // Mostrar modal de confirmação antes de salvar
    setShowConfirm(true);
  };
  
  const saveChanges = async () => {
    setShowConfirm(false);
    setLoading(true);    // Validações básicas
    if (!formData.username || !formData.nome || !formData.email) {
      setError('Nome de usuário, nome completo e email são campos obrigatórios');
      setLoading(false);
      return;
    }
    
    // Validar nome de usuário
    if (formData.username.length < 3) {
      setError('Nome de usuário deve ter pelo menos 3 caracteres');
      setLoading(false);
      return;
    }
    
    // Verificar se o nome de usuário foi alterado
    const usernameChanged = formData.username !== usuario.username;
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Formato de email inválido');
      setLoading(false);
      return;
    }// Se a senha foi informada, fazer validações
    if (formData.senha) {
      // Verificar se a confirmação confere
      if (formData.senha !== formData.confirmarSenha) {
        setError('As senhas não coincidem');
        setLoading(false);
        return;
      }
      
      // Verificar complexidade da senha
      if (formData.senha.length < 8) {
        setError('A senha deve ter pelo menos 8 caracteres');
        setLoading(false);
        return;
      }
      
      // Verificar se tem letras, números e caracteres especiais
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!passwordRegex.test(formData.senha)) {
        setError('A senha deve conter pelo menos uma letra e um número');
        setLoading(false);
        return;
      }
    }

    // Se for investidor, verificar se tem CNPJ
    if (usuario.userType === 'investor' && !formData.cnpj) {
      setError('CNPJ é obrigatório para investidores');
      setLoading(false);
      return;    }    
    
    try {
      // Preparar dados para atualização
      const dadosAtualizacao = {
        username: formData.username,
        nome: formData.nome,
        email: formData.email
      };
      
      // Só incluímos a senha se for fornecida uma nova
      if (formData.senha && formData.senha.trim() !== '') {
        dadosAtualizacao.senha = formData.senha;
      }
      // Não enviamos a senha se estiver vazia

      // Adicionar CNPJ se for investidor
      if (usuario.userType === 'investor') {
        dadosAtualizacao.cnpj = formData.cnpj;
      }      // Log para depuração
      console.log('Dados enviados para atualização:', dadosAtualizacao);
      
      // Chamar a API para atualizar o perfil
      const dadosAtualizados = await updateProfile(
        usuario.id,
        dadosAtualizacao,
        usuario.userType
      );

      // Atualizar o estado do usuário no contexto
      setUsuario({
        ...usuario,
        ...dadosAtualizados
      });

      setSuccess(true);
      setLoading(false);
      
      // Mostrar mensagem de sucesso e depois redirecionar para o perfil
      setTimeout(() => {
        navigate('/perfil');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erro ao atualizar perfil');
      setLoading(false);
    }
  };

  if (!usuario) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="landing-root">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            
      {/* Botão de toggle para sidebar em dispositivos móveis */}
      <SidebarToggle isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <header className="main-header">
          <input className="search-bar" placeholder="Pesquisar..." />
        </header>
        
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
          <h2 style={{ color: "#3a3341" }}>Editar Perfil</h2>
          
          <div style={{ 
            width: "80%", 
            maxWidth: "600px", 
            padding: "20px", 
            marginTop: "20px", 
            border: "1px solid #ddd", 
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            {error && (
              <ErrorMessage message={error} />
            )}
            
            {success && (
              <SuccessMessage message="Perfil atualizado com sucesso! Redirecionando..." />
            )}
            
            <form onSubmit={handleSubmit}>              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Nome de Usuário
                </label>                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange}
                  style={{ 
                    width: "100%", 
                    padding: "8px", 
                    borderRadius: "4px", 
                    border: usernameChanged ? "1px solid #0099ff" : "1px solid #ccc",
                    backgroundColor: usernameChanged ? "#e6f7ff" : "white"
                  }}
                />
                {usernameChanged && (
                  <small style={{ color: "#0099ff", display: "block", marginTop: "5px" }}>
                    <strong>Atenção:</strong> Após salvar, você terá que usar o novo nome de usuário para fazer login.
                  </small>
                )}<small style={{ color: "#666" }}>Você pode alterar seu nome de usuário</small>
                <UsernameTips />
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Nome Completo*
                </label>
                <input 
                  type="text" 
                  name="nome" 
                  value={formData.nome} 
                  onChange={handleChange}
                  required
                  style={{ 
                    width: "100%", 
                    padding: "8px", 
                    borderRadius: "4px", 
                    border: "1px solid #ccc" 
                  }}
                />
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Email*
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  required
                  style={{ 
                    width: "100%", 
                    padding: "8px", 
                    borderRadius: "4px", 
                    border: "1px solid #ccc" 
                  }}
                />
              </div>
              
              {usuario.userType === 'investor' && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    CNPJ*
                  </label>
                  <input 
                    type="text" 
                    name="cnpj" 
                    value={formData.cnpj} 
                    onChange={handleChange}
                    required
                    style={{ 
                      width: "100%", 
                      padding: "8px", 
                      borderRadius: "4px", 
                      border: "1px solid #ccc" 
                    }}
                  />
                </div>
              )}
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Nova Senha
                </label>                <input 
                  type="password" 
                  name="senha" 
                  value={formData.senha} 
                  onChange={handleChange}
                  placeholder="Deixe em branco para manter a senha atual"
                  style={{ 
                    width: "100%", 
                    padding: "8px", 
                    borderRadius: "4px", 
                    border: "1px solid #ccc" 
                  }}
                />
                <small style={{ color: "#666", display: "block", marginTop: "5px" }}>
                  Se você deixar este campo em branco, sua senha atual será mantida.
                </small>
                <PasswordTips />
              </div>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Confirmar Nova Senha
                </label>
                <input 
                  type="password" 
                  name="confirmarSenha" 
                  value={formData.confirmarSenha} 
                  onChange={handleChange}
                  placeholder="Confirme a nova senha"
                  style={{ 
                    width: "100%", 
                    padding: "8px", 
                    borderRadius: "4px", 
                    border: "1px solid #ccc" 
                  }}
                />
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button 
                  type="button" 
                  onClick={() => navigate('/perfil')}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#e0e0e0",
                    color: "#333",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Cancelar
                </button>
                
                <button 
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#673ab7",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
        {/* Modal de confirmação */}
      <ConfirmModal 
        isOpen={showConfirm}
        onConfirm={saveChanges}
        onCancel={() => setShowConfirm(false)}
        message={usernameChanged 
          ? "Atenção: Você está alterando seu nome de usuário e precisará usar o novo nome para fazer login. Deseja continuar?" 
          : "Tem certeza que deseja salvar as alterações no seu perfil?"}
      />
    </div>
  );
}

export default EditProfile;
