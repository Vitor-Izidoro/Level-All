import React from "react";

function Mensagens() {
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
      <main className="main-content">
        <header className="main-header">
          <input className="search-bar" placeholder="Pesquisar..." />
          
        </header>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 40 }}>
          <h2 style={{ color: "#3a3341" }}>Mensagens</h2>
        </div>
      </main>
    </div>
  );
}

export default Mensagens;