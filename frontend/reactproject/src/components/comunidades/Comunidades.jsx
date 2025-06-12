import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SidebarToggle from '../shared/SidebarToggle';
import Sidebar from "../shared/Sidebar";
import { useAuth } from "../../context/AuthContext";

function Comunidades() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [feed, setFeed] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { autenticado, usuario } = useAuth();
  const navigate = useNavigate();
  
  const staticPages = [
    { name: "Mensagens", path: "/mensagens" },
    { name: "Notificações", path: "/notificacoes" },
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

  const fetchCommunityFeed = async () => {
    try {
      const res = await fetch('http://localhost:3000/posts/community');
      const posts = await res.json();
      
      if (Array.isArray(posts)) {
        setFeed(posts.map(post => ({
          user: post.user?.nome || "Usuário",
          handle: `@${post.user?.username || "usuario"}`,
          text: post.texto || "",
          hashtags: post.hashtags || "",
          image: post.imagem ? `http://localhost:3000/uploads/${post.imagem}` : null,
          community: post.comunidade?.nome || "Comunidade"
        })));
      } else {
        console.error("Resposta da API não é um array:", posts);
        setFeed([]);
      }
    } catch (error) {
      console.error("Erro ao buscar feed das comunidades:", error);
      setFeed([]);
    }
  };

  useEffect(() => {
    fetchCommunityFeed();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="landing-root">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Botão de toggle para sidebar em dispositivos móveis */}
      <SidebarToggle isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <header className="main-header">
          <div className="search-bar-container">
            <input
              className="search-bar"
              placeholder="Pesquisar nas comunidades..."
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
            )}
          </div>
        </header>

        <div style={{ 
          width: "100%", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginTop: 20,
          padding: "0 20px",
          maxWidth: "750px",
          margin: "20px auto 0"
        }}>
          <h2 style={{ color: "#3a3341", margin: 0 }}>Suas Comunidades</h2>
          <button
            onClick={() => navigate('/comunidades/criar')}
            style={{
              backgroundColor: '#a48ad4',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(164, 138, 212, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#9b7dc2';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(164, 138, 212, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#a48ad4';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(164, 138, 212, 0.2)';
            }}
          >
            <span style={{ fontSize: '20px' }}>+</span>
            Criar Comunidade
          </button>
        </div>

        <section className="feed-section">
          {feed.map((item, idx) => (
            <div className="feed-card" key={idx}>
              <div className="feed-header">
                <div className="avatar"></div>
                <span className="feed-user">{item.user}</span>
                <span className="feed-handle">{item.handle}</span>
                <span className="feed-community" style={{ marginLeft: 'auto', color: '#fff', fontSize: '0.9rem' }}>
                  {item.community}
                </span>
              </div>
              <div className="feed-content">
                <p className="feed-text" dangerouslySetInnerHTML={{
                  __html: search
                    ? item.text.replace(
                        new RegExp(`(${search})`, "gi"),
                        '<mark style="background:#ffe066;color:#3a3341;border-radius:4px;">$1</mark>'
                      )
                    : item.text
                }} />
                <span className="hashtags">{item.hashtags}</span>
                {item.image && (
                  <img className="feed-image" src={item.image} alt="Imagem do post" />
                )}
              </div>
            </div>
          ))}
        </section>
      </main>

      <style>{`
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

        .feed-image {
          max-width: 100%;
          max-height: 320px;
          width: auto;
          height: auto;
          display: block;
          margin: 8px auto 0 auto;
          object-fit: contain;
        }

        .search-bar-container {
          position: relative;
          width: 75%;
        }

        .search-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          list-style: none;
          padding: 8px 0;
          margin: 8px 0 0 0;
          z-index: 1000;
        }

        .search-suggestions li {
          padding: 8px 16px;
          cursor: pointer;
        }

        .search-suggestions li:hover {
          background: #f3f3f3;
        }

        .search-suggestions a {
          color: #333;
          text-decoration: none;
          display: block;
        }
      `}</style>
    </div>
  );
}

export default Comunidades;