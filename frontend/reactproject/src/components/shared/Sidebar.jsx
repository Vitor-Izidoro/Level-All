import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../../assets/logos/002.png';
import Icon from "../../assets/icons/icons";

export default function Sidebar({ sidebarOpen, toggleSidebar }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { to: "/", label: "Página Inicial", icon: "pagina" },
    { to: "/comunidades", label: "Comunidades", icon: "comunidade" },
    { to: "/tags", label: "Suas tags", icon: "tags" },
    { to: "/mensagens", label: "Mensagens", icon: "mensagens" },
    { to: "/notificacoes", label: "Notificações", icon: "notificacoes" },
    { to: "/perfil", label: "Perfil", icon: "perfil" },
  ];

  return (
    <>
      <aside className={`sidebar${sidebarOpen ? "" : " closed"}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo Level All" className="logo-img" />
          <span className="sidebar-title">LEVEL ALL</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.to} className="sidebar-item">
                <Link
                  to={item.to}
                  className={`sidebar-btn animated ${
                    currentPath === item.to ? "active" : ""
                  }`}
                >
                  <span>
                    <Icon nome={item.icon} />
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-btn animated">
            <span role="img" aria-label="Configurações">
              <Icon nome="configuracoes" />
            </span>{" "}
            Configurações
          </button>
        </div>
      </aside>

      <button
        className="sidebar-toggle"
        aria-label="Abrir/fechar menu lateral"
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: 430,
          left: sidebarOpen ? 210 : 10,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "left 0.3s",
        }}
      >
        <span style={{ fontSize: 28, lineHeight: 1 }}>☰</span>
      </button>
    </>
  );
}
