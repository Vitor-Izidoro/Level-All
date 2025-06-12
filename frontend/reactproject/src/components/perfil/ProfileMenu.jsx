import React, { useState, useRef, useEffect } from "react";
import "../../index.css";

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="profile-menu-container" ref={menuRef}>
      <button
        className="profile-icon"
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir menu de perfil"
      >
        <span role="img" aria-label="Perfil">👤</span>
      </button>
      <div className={`profile-dropdown${open ? " open" : ""}`}>
        <button className="profile-dropdown-btn">Acessar perfil</button>
        <button className="profile-dropdown-btn">Acessibilidade visual</button>
      </div>
    </div>
  );
}

export default ProfileMenu;