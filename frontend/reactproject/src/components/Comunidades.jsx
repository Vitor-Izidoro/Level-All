import React from "react";
import { Link } from "react-router-dom";

function Comunidades() {
  return (
    <div className="landing-root">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-circle">
            <img src="/logo.jpeg" alt="Logo Level All" className="logo-img" />
          </div>
          <span className="sidebar-title">LEVEL ALL</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li><Link to="/" className="sidebar-btn animated">🏠 Página Inicial</Link></li>
            <li><Link to="/explorar" className="sidebar-btn animated"># Explorar</Link></li>
            <li><Link to="/tags" className="sidebar-btn animated">🏷️ Suas tags</Link></li>
            <li><Link to="/mensagens" className="sidebar-btn animated">💬 Mensagens</Link></li>
            <li><Link to="/notificacoes" className="sidebar-btn animated">🔔 Notificações</Link></li>
            <li><Link to="/perfil" className="sidebar-btn animated">👤 Perfil</Link></li>
            <li><Link to="/comunidades" className="sidebar-btn animated">👥 Comunidades</Link></li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-btn animated">⚙️ Configurações</button>
        </div>
        <div className="goto-users-fixed">
          <Link to="/usuarios">
            <button className="goto-users-btn">Lista de Favs do Ale</button>
          </Link>
        </div>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <input className="search-bar" placeholder="Pesquisar..." />
          <div className="profile-icon">👤</div>
        </header>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 40 }}>
          <h2 style={{ color: "#3a3341" }}>Comunidades</h2>
        </div>
      </main>
    </div>
  );
}

export default Comunidades;