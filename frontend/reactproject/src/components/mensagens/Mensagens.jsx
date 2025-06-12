import React, { useState } from "react";
import ChatApp from "./ChatApp";
import SidebarToggle from '../shared/SidebarToggle';
import Sidebar from "../shared/Sidebar";

function Mensagens() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (    <div className="landing-root">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            
      {/* Botão de toggle para sidebar em dispositivos móveis */}
      <SidebarToggle isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        < ChatApp />
      </main>
    </div>
  );
}

export default Mensagens;