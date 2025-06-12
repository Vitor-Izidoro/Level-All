import React, { useState } from "react";
import SidebarToggle from '../shared/SidebarToggle';
import Sidebar from "../shared/Sidebar";

function SuasTags() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };  return (
    <div className="landing-root">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Botão de toggle para sidebar em dispositivos móveis */}
      <SidebarToggle isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
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