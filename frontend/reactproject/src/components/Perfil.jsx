import React, { useState, useEffect } from "react";
import SidebarToggle from './SidebarToggle';
import { useNavigate } from 'react-router-dom';
import { logout, deleteUser } from '../config/api';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './ConfirmModal';

function Perfil() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { usuario, setAutenticado, setUsuario } = useAuth();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleEditProfile = () => {
    navigate('/editar-perfil');
  };
  
  const handleLogout = () => {
    logout();
    setAutenticado(false);
    setUsuario(null);
    navigate('/login');
  };
  
  const handleDeleteAccount = async () => {
    if (!usuario) return;
    
    try {
      setDeleting(true);
      await deleteUser(usuario.username);
      
      // Limpar dados do usuário e autenticação
      logout();
      setAutenticado(false);
      setUsuario(null);
      
      // Redirecionar para a página de login
      navigate('/login');
    } catch (err) {
      setError('Erro ao excluir conta. Tente novamente mais tarde.');
      console.error('Erro ao excluir conta:', err);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  return (    <div className="landing-root">
      <aside className={`sidebar${sidebarOpen ? '' : ' closed'}`}>
        <div className="sidebar-header">
          <div className="logo-circle">
            <img src="/logo.jpeg" alt="Logo Level All" className="logo-img" />
          </div>
          <span className="sidebar-title">LEVEL ALL</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li><a href="/" className="sidebar-btn animated">🏠 Página Inicial</a></li>
            <li><a href="/explorar" className="sidebar-btn animated"># Explorar</a></li>
            <li><a href="/tags" className="sidebar-btn animated">🏷️ Suas tags</a></li>
            <li><a href="/mensagens" className="sidebar-btn animated">💬 Mensagens</a></li>
            <li><a href="/notificacoes" className="sidebar-btn animated">🔔 Notificações</a></li>
            <li><a href="/perfil" className="sidebar-btn animated">👤 Perfil</a></li>
            <li><a href="/comunidades" className="sidebar-btn animated">👥 Comunidades</a></li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-btn animated">⚙️ Configurações</button>
        </div>
        <div className="goto-users-fixed">
            </div>
      </aside>
      
      {/* Botão de toggle para sidebar em dispositivos móveis */}
      <SidebarToggle isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <header className="main-header">
          <input className="search-bar" placeholder="Pesquisar..." />
          
        </header>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
          <h2 style={{ color: "#3a3341" }}>Perfil</h2>
          
          {usuario && (
            <div style={{ 
              width: "80%", 
              maxWidth: "600px", 
              padding: "20px", 
              marginTop: "20px", 
              border: "1px solid #ddd", 
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h3>Informações do Usuário</h3>
              <div style={{ marginTop: "15px" }}>
                <p><strong>Nome de Usuário:</strong> {usuario.username}</p>
                <p><strong>Nome Completo:</strong> {usuario.nome}</p>
                <p><strong>Email:</strong> {usuario.email}</p>
                <p><strong>Tipo de Usuário:</strong> {usuario.userType}</p>
              </div>
                <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px"
              }}>
                <button 
                  onClick={handleEditProfile}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#673ab7",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Editar Perfil
                </button>
                
                <button 
                  onClick={handleLogout}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#ff4d4d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Sair
                </button>
              </div>
              
              {/* Botão de excluir conta */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
                borderTop: "1px solid #ddd",
                paddingTop: "15px"
              }}>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    padding: "8px 15px",
                    backgroundColor: "#d32f2f",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                  disabled={deleting}
                >
                  {deleting ? "Excluindo..." : "Excluir Conta"}
                </button>
              </div>
                {error && (
                <div style={{
                  margin: "15px 0",
                  padding: "10px",
                  backgroundColor: "#ffebee",
                  color: "#c62828",
                  borderRadius: "4px",
                  textAlign: "center"
                }}>
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
        {/* Modal de confirmação para excluir conta */}
      <ConfirmModal 
        isOpen={showDeleteConfirm}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteConfirm(false)}
        message="Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão removidos permanentemente do sistema."
      />
    </div>
  );
}

export default Perfil;