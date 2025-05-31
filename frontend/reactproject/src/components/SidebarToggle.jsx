import React from 'react';

const SidebarToggle = ({ isOpen, toggleSidebar }) => {
  return (
    <button 
      onClick={toggleSidebar} 
      className="sidebar-toggle"
      aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
    >
      {isOpen ? '✕' : '☰'}
    </button>
  );
};

export default SidebarToggle;
