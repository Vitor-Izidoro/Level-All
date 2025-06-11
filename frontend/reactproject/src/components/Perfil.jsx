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

  
  // Componente auxiliar para imprimir cada par rótulo/valor
  const InfoItem = ({ label, value }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: '1px dashed #e5e7eb',
      paddingBottom: 8
    }}>
      <span style={{ fontWeight: 600, color: '#f2f2ff' }}>{label}:</span>
      <span style={{ color: '#f2f2ff' }}>{value}</span>
    </div>
  );

  // Estilo base dos botões (reutilizável)
  const buttonStyle = (bg, hover) => ({
    flex: 1,
    padding: '12px 0',
    backgroundColor: bg,
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    ':hover': {
      backgroundColor: hover
    }
  });
  
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
            <li><a href="/comunidades" className="sidebar-btn animated">👥 Comunidades</a></li>
            <li><a href="/tags" className="sidebar-btn animated">🏷️ Suas tags</a></li>
            <li><a href="/mensagens" className="sidebar-btn animated">💬 Mensagens</a></li>
            <li><a href="/notificacoes" className="sidebar-btn animated">🔔 Notificações</a></li>
            <li><a href="/perfil" className="sidebar-btn animated">👤 Perfil</a></li>
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
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
          
          {usuario && (
          <div style={{
            maxWidth: 480,
            width: '100%',
            marginTop: 40,
            padding: 28,
            backgroundColor: '#7a579b',
            borderRadius: 12,
            boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
            border: '1px solid #e5e7eb',
            fontFamily: 'system-ui, sans-serif',
          }}>
            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              marginBottom: 24,
              color: '#f2f2ff',
              borderBottom: '1px solidrgb(13, 13, 13)',
              paddingBottom: 12
            }}>
              Perfil do Usuário
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <InfoItem label="Nome de Usuário" value={usuario.username} />
              <InfoItem label="Nome Completo" value={usuario.nome} />
              <InfoItem label="Email" value={usuario.email} />
              <InfoItem label="Tipo de Usuário" value={usuario.userType} />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button
                onClick={handleEditProfile}
                style={buttonStyle('#4f46e5', '#3730a3')}
              >
                Editar Perfil
              </button>
              <button
                onClick={handleLogout}
                style={buttonStyle('#ef4444', '#b91c1c')}
              >
                Sair
              </button>
            </div>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleting}
              style={{
                marginTop: 20,
                width: '100%',
                padding: '12px 0',
                backgroundColor: deleting ? '#9b1c1c' : '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 600,
                fontSize: '1rem',
                cursor: deleting ? 'not-allowed' : 'pointer',
                opacity: deleting ? 0.7 : 1,
                transition: 'background 0.3s',
              }}
            >
              {deleting ? 'Excluindo...' : 'Excluir Conta'}
            </button>

            {error && (
              <div style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                borderRadius: 6,
                fontWeight: 500,
                textAlign: 'center',
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