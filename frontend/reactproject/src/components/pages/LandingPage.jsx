import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../index.css";
import ProfileMenu from '../perfil/ProfileMenu';
import SidebarToggle from '../shared/SidebarToggle';
import Sidebar from "../shared/Sidebar";
import { useAuth } from "../../context/AuthContext"

function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feed, setFeed] = useState([]);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState("");
  const [logo, setLogo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userId, setUserId] = useState(""); // ou valor padrão do usuário logado
  const [texto, setTexto] = useState("");
  const [imagem, setImagem] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { autenticado, usuario } = useAuth();
  const navigate = useNavigate();

  const staticPages = [
    { name: "Mensagens", path: "/mensagens" },
    { name: "Notificações", path: "/notificacoes" },
  //  { name: "Explorar", path: "/explorar" },
    { name: "Comunidades", path: "/comunidades" },
    { name: "Perfil", path: "/perfil" },
    { name: "Página Inicial", path: "/" }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    // Sugestões de páginas
    const pageSuggestions = staticPages.filter(page =>
      page.name.toLowerCase().includes(value.toLowerCase())
    );

    // Sugestões do feed
    const feedSuggestions = feed
      .filter(item =>
        item.text.toLowerCase().includes(value.toLowerCase())
      )
      .map(item => ({
        name: item.text,
        type: "feed"
      }));

    setSuggestions([...pageSuggestions, ...feedSuggestions]);
  };

  const handlePublish = () => {
    if (postText.trim() === "") return;
    setFeed([
      {
        user: "Você",
        handle: "@voce",
        text: postText,
        hashtags: "",
        image: postImage ? postImage : null
      },
      ...feed
    ]);
    setPostText("");
    setPostImage("");
    setIsModalOpen(false);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogo(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (postText.trim() === "") return;

    // Envie para o backend normalmente...

    // Adicione ao feed local com o usuário logado
    setFeed([
      {
        user: usuario?.nome || "Usuário",
        username: usuario?.username,
        userId: usuario?.id,
        handle: `@${usuario?.username || "voce"}`,
        text: postText,
        hashtags: "",
        image: postImage ? postImage : null
      },
      ...feed
    ]);
    setPostText("");
    setPostImage("");
    setIsModalOpen(false);
  };
  const fetchFeed = async () => {
    try {
      const res = await fetch('/api/posts');
      const posts = await res.json();
      
      // Verificar se posts é um array antes de chamar .map()
      if (Array.isArray(posts)) {
        setFeed(posts.map(post => ({
          user: post.user || "Usuário",
          username: post.username,
          userId: post.userId,
          handle: post.handle || (post.username ? `@${post.username}` : "@usuario"),
          text: post.texto || post.text || "",
          hashtags: post.hashtags || "",
          image: post.imagem
            ? `http://localhost:3000/uploads/${post.imagem}`
            : post.image || null
        })));
      } else {
        // Se não for um array, define feed como um array vazio
        console.error("Resposta da API não é um array:", posts);
        setFeed([]);
      }
    } catch (error) {
      console.error("Erro ao buscar feed:", error);
      setFeed([]);
    }
  };

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setFeed(data));
  }, []);

  const handleDeletePost = (idx) => {
    setFeed(feed => feed.filter((_, i) => i !== idx));
  };

  return (
    <div className="landing-root">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <header className="main-header">
          <div className="search-bar-container">
            <input
              className="search-bar"
              placeholder="Pesquisar..."
              value={search}
              onChange={handleSearchChange}
              onFocus={handleSearchChange}
              onBlur={() => setTimeout(() => setSuggestions([]), 100)}
              onKeyDown={e => {
                if (e.key === "Escape" || e.key === "Enter") setSuggestions([]);
              }}
              autoComplete="off"
            />
            {search && suggestions.length > 0 && (
              <ul className="search-suggestions">
                {suggestions.map((s, idx) =>
                  s.path ? (
                    <li key={idx}>
                      <Link to={s.path} onClick={() => setSearch("")}>{s.name}</Link>
                    </li>
                  ) : (
                    <li key={idx} style={{ color: "#a48ad4" }}>{s.name}</li>
                  )
                )}
              </ul>
            )}          </div>
          {autenticado ? (
            <button
              className="profile-reddit-btn"
              onClick={() => setProfileMenuOpen(v => !v)}
              onBlur={() => setTimeout(() => setProfileMenuOpen(false), 150)}
              tabIndex={0}
            >
              <img src="/logo.jpeg" alt="Perfil" className="profile-reddit-img" />
              <span className="profile-reddit-name">{usuario?.nome || "Usuário"}</span>
              <svg width="18" height="18" style={{marginLeft: 6}} viewBox="0 0 20 20" fill="none">
                <path d="M6 8l4 4 4-4" stroke="#a48ad4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className={`profile-reddit-dropdown${profileMenuOpen ? " open" : ""}`}>
                <a href="/perfil" className="profile-reddit-dropdown-item">Perfil</a>
                <a href="/configuracoes" className="profile-reddit-dropdown-item">Configurações</a>
                <a href="/autenticacao" className="profile-reddit-dropdown-item">Autenticação</a>
              </div>
            </button>          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="profile-reddit-btn" 
                onClick={() => navigate('/login')}
              >
                <span className="profile-reddit-name">LOGIN</span>
              </button>
              
            </div>
          )}
        </header>

        <div className="publish-section">
          <button
            className="publish-btn big-publish-btn"
            onClick={() => setIsModalOpen(true)}
          >
            + PUBLICAR NO FEED
          </button>
        </div>
        
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: 380, minWidth: 0, width: "100%" }}>
                <h2 style={{ color: "#555"}}>Publicar no Feed</h2>
                <form onSubmit={handleSubmit}>
            <textarea
              value={postText}
              onChange={e => setPostText(e.target.value)}
              placeholder="Digite sua mensagem..."
              rows={4}
              style={{ width: "100%", marginBottom: 12, color: "black"}}                 />
            <div
              className="dropzone"
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith("image/")) {
                  setImagem(file);
                  const reader = new FileReader();
                  reader.onload = ev => setPostImage(ev.target.result);
                  reader.readAsDataURL(file);
                }
              }}
              onClick={() => document.getElementById("fileInput").click()}
            >
              {postImage ? (
                <img src={postImage} alt="Preview" className="feed-image" style={{ maxHeight: 180, margin: 8}} />
              ) : (
                <span style={{ color: "#555"}}>
                  Arraste uma imagem{" "}
                  <span style={{ color: "#1976d2", textDecoration: "underline", cursor: "pointer" }}>
              aqui
                  </span>{" "}
                  ou clique para selecionar
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={e => {
                  const file = e.target.files[0];
                  if (file && file.type.startsWith("image/")) {
              setImagem(file);
              const reader = new FileReader();
              reader.onload = ev => setPostImage(ev.target.result);
              reader.readAsDataURL(file);
                  }
                }}
                id="fileInput"
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="goto-users-btn" style={{ background: "#ccc", color: "#333" }}>
                Cancelar
              </button>
              <button type="submit" className="goto-users-btn">
                Publicar
              </button>
            </div>
                </form>
              </div>
            </div>
          )}
          <section className="feed-section">
            {feed.map((item, idx) => (
              <div className="feed-card" key={idx}>
                <div className="feed-header">
      <div className="avatar"></div>
      <span className="feed-user">{item.user}</span>
      <span className="feed-handle">{item.handle}</span>
      {/* Botão de excluir só aparece se for o dono */}
      {usuario?.id === item.userId && (
        <button
          className="delete-post-btn"
          onClick={() => handleDeletePost(idx)}
          title="Excluir postagem"
        >
          ×
        </button>
      )}
    </div>
    <div className="feed-content">
      <p className="feed-text">{item.text}</p>
      <span className="hashtags">{item.hashtags}</span>
      {item.image && (
        <img className="feed-image" src={item.image} alt="Imagem do post" />
      )}
    </div>
  </div>
))}
          </section>
              </main>
              {/* Modal CSS */}
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }        .modal-content {
          background: #fff;
          padding: 32px 24px;
          border-radius: 16px;
          min-width: 340px;
          max-width: 90vw;
        }
        
        @media (max-width: 576px) {
          .modal-content {
            padding: 20px 15px;
            min-width: auto;
            width: 95%;
          }
        }
        .modal-content textarea {
          color: #111;
          background:rgba(228, 200, 246, 0.65);
        }
        .search-bar {
          width: 75%;
          padding: 20px 24px;
          border-radius: 20px;
          border: none;
          font-size: 18px;
          background: #f3e9fa;
          outline: none;
          margin-right: 24px;
          box-sizing: border-box;
          color: #3a3341;
          transition: 
            box-shadow 0.2s,
            background 0.2s,
            color 0.2s;
          box-shadow: 0 2px 8px rgba(164, 138, 212, 0.08);
        }

        .search-bar:focus {
          background: #fff;
          color: #fff;
          box-shadow: 0 0 0 3px #fff, 0 2px 16px #a48ad4;
          font-weight: bold;
          text-shadow: 0 0 8px #fff, 0 0 2px #fff;
          border: none;
        }

        /* Sidebar buttons: sempre visíveis, inflar ao hover/focus */
        .sidebar-btn {
          width: 90%;
          background: none;
          border: none;
          color: #fff;
          font-size: 1.35rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 18px 0;
          cursor: pointer;
          border-radius: 16px;
          transition: 
            background 0.2s,
            color 0.2s,
            transform 0.18s,
            box-shadow 0.18s;
          justify-content: flex-start;
          letter-spacing: 1px;
          box-shadow: none;
        }

        .sidebar-btn.animated:hover,
        .sidebar-btn.animated:focus {
          background: #fff;
          color: #3a3341;
          transform: scale(1.08);
          box-shadow: 0 2px 16px #a48ad4;
          outline: none;
        }

        .feed-card {
          background: #fff;
          border-radius: 24px;
          padding: 0;
          width: 750px;
          margin-bottom: 32px;
          box-shadow: 0 2px 8px rgba(60, 40, 90, 0.08);
          overflow: hidden;
          border: none;
        }

        .feed-header {
          background: #a48ad4;
          padding: 30px 30px 18px 30px;
          display: flex;
          align-items: center;
          border-top-left-radius: 24px;
          border-top-right-radius: 24px;
        }

        .feed-user {
          font-weight: bold;
          color: #111;
          font-size: 1.13rem;
          margin-left: 10px;
        }

        .feed-handle {
          color: #fff;
          font-size: 1.02rem;
          margin-left: 8px;
        }

        .feed-divider {
          border: none;
          border-top: 3px solid #a48ad4;
          margin: 0 30px;
        }

        .feed-content {
          background: #fff;
          padding: 24px 30px 30px 30px;
          border-bottom-left-radius: 24px;
          border-bottom-right-radius: 24px;
        }

        .feed-text {
          color: #111;
          font-size: 1.13rem;
          margin-bottom: 4px;
          margin-top: 0;
        }

        .hashtags {
          color: #a48ad4;
          font-size: 1.02rem;
          margin-top: 6px;
        }

        .feed-card hr {
          border: none;
          border-top: 2px solid #e0d1f3;
          margin: 0 30px;
        }

        .feed-image {
          max-width: 100%;
          max-height: 320px;
          width: auto;
          height: auto;
          display: block;
          margin: 8px auto 0 auto;
          object-fit: contain;
        }

        .profile-reddit-btn {
          display: flex;
          align-items: center;
          background: #fff;
          border: none;
          border-radius: 24px;
          padding: 12px 22px;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          font-size: 1.15rem;
          height: 80px; /* Aproxima da altura da barra de pesquisa */
        }

        .profile-reddit-btn:hover {
          background: #f3f3f3;
          transform: translateY(-2px);
        }

        .profile-reddit-img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          margin-right: 12px;
        }

        .profile-reddit-name {
          font-size: 1.08rem;
          color: #333;
          font-weight: 600;
        }

        .publish-section {
          position: static;
          top: auto;
          right: auto;
          z-index: 1000;
          width: 100%;
          max-width: 750px;
          margin: 0 auto 32px auto;
          background: transparent;
        }        .sidebar.closed {
          width: 80px;
        }

        .sidebar.closed .sidebar-header,
        .sidebar.closed .sidebar-nav,
        .sidebar.closed .sidebar-footer {
          display: none;
        }

        .profile-reddit-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          z-index: 1000;
          display: none;
        }

        .profile-reddit-dropdown.open {
          display: block;
        }

        .profile-reddit-dropdown-item {
          display: block;
          padding: 12px 24px;
          color: #333;
          text-decoration: none;
          font-size: 1rem;
          transition: background 0.2s;
        }

        .profile-reddit-dropdown-item:hover {
          background: #f3f3f3;
        }

        .login-btn {
          display: inline-block;
          padding: 12px 24px;
          background: #a48ad4;
          color: #fff;
          border: none;
          border-radius: 24px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          transition: background 0.2s, transform 0.2s;
          position: fixed;
          top: 20px;
          right: 120px;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .login-btn:hover {
          background: #9b7dc2;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

export default LandingPage;

