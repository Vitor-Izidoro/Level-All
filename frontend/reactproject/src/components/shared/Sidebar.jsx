import React from "react";
import { Link } from "react-router-dom";

import Icon from "../../assets/icons/icons";// Ajuste o caminho se for diferente

export default function Sidebar({ sidebarOpen, toggleSidebar }) {
  return (
    <>
      <aside className={`sidebar${sidebarOpen ? "" : " closed"}`}>
        <div className="sidebar-header">
          <div className="logo-circle">
            <img src="/logo.jpeg" alt="Logo Level All" className="logo-img" />
          </div>
          <span className="sidebar-title">LEVEL ALL</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/" className="sidebar-btn animated">
                <span>
                  <Icon nome="pagina" />
                </span>
                Página Inicial
              </Link>
            </li>
            <li>
              <Link to="/comunidades" className="sidebar-btn animated">
                <span role="img" aria-label="Comunidades">
                  <Icon nome="comunidade" />
                </span>{" "}
                Comunidades
              </Link>
            </li>
            <li>
              <Link to="/tags" className="sidebar-btn animated">
                <span role="img" aria-label="Suas tags">
                  <Icon nome="tags" />
                </span>{" "}
                Suas tags
              </Link>
            </li>
            <li>
              <Link to="/mensagens" className="sidebar-btn animated">
                <span role="img" aria-label="Mensagens">
                  <Icon nome="mensagens" />
                </span>{" "}
                Mensagens
              </Link>
            </li>
            <li>
              <Link to="/notificacoes" className="sidebar-btn animated">
                <span role="img" aria-label="Notificações">
                  <Icon nome="notificacoes" />
                </span>{" "}
                Notificações
              </Link>
            </li>
            <li>
              <Link to="/perfil" className="sidebar-btn animated">
                <span role="img" aria-label="Perfil">
                  <Icon nome="perfil" />
                </span>{" "}
                Perfil
              </Link>
            </li>
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
