import React, { useState, useEffect } from "react";
import SidebarToggle from './SidebarToggle';
import { useNavigate } from 'react-router-dom';
import { logout } from '../config/api';
import { useAuth } from '../context/AuthContext';

function Perfil() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { usuario, setAutenticado, setUsuario } = useAuth();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    setAutenticado(false);
    setUsuario(null);
    navigate('/login');
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
              
              <button 
                onClick={handleLogout}
                style={{
                  marginTop: "20px",
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
          )}
        </div>
      </main>
    </div>
  );
}

export default Perfil;