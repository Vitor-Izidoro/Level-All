import React from "react";

function SuasTags() {
  return (
    <div className="landing-root">
      <aside className="sidebar">
        {/* ...mesmo conteúdo da sidebar... */}
      </aside>
      <main className="main-content">
        <header className="main-header">
          <input className="search-bar" placeholder="Pesquisar..." />
          <div className="profile-icon">👤</div>
        </header>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 40 }}>
          <h2 style={{ color: "#3a3341" }}>Suas Tags</h2>
        </div>
      </main>
    </div>
  );
}

export default SuasTags;