import { useState } from "react";
import { Link } from "react-router-dom";
import "../index.css";

function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState("");
  const [feed, setFeed] = useState([
    {
      user: "Cryslayne Farias",
      handle: "@acryslayneoficial",
      text: "GENTEEEEEE e esse jogo que trouxe uma narração super acessível pra quem tem deficiência visual???? Simplesmente perfeito, parabéns aos sound engenieers!!!",
      hashtags: "#deficientevisual #blind #acessibilidade",
      image: "/image.png" 
    }
  ]);
  const [logo, setLogo] = useState(null);

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
            <li>
              <Link to="/" className="sidebar-btn animated">
                <span role="img" aria-label="Página Inicial">🏠</span> Página Inicial
              </Link>
            </li>
            <li>
              <Link to="/explorar" className="sidebar-btn animated">
                <span role="img" aria-label="Explorar">#</span> Explorar
              </Link>
            </li>
            <li>
              <Link to="/tags" className="sidebar-btn animated">
                <span role="img" aria-label="Suas tags">🏷️</span> Suas tags
              </Link>
            </li>
            <li>
              <Link to="/mensagens" className="sidebar-btn animated">
                <span role="img" aria-label="Mensagens">💬</span> Mensagens
              </Link>
            </li>
            <li>
              <Link to="/notificacoes" className="sidebar-btn animated">
                <span role="img" aria-label="Notificações">🔔</span> Notificações
              </Link>
            </li>
            <li>
              <Link to="/perfil" className="sidebar-btn animated">
                <span role="img" aria-label="Perfil">👤</span> Perfil
              </Link>
            </li>
            <li>
              <Link to="/comunidades" className="sidebar-btn animated">
                <span role="img" aria-label="Comunidades">👥</span> Comunidades
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-btn animated">
            <span role="img" aria-label="Configurações">⚙️</span> Configurações
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <input className="search-bar" placeholder="Pesquisar..." />
          <div className="profile-icon">👤</div>
        </header>
        <div className="publish-section">
          <button
            className="publish-btn big-publish-btn"
            onClick={() => setIsModalOpen(true)}
          >
            + PUBLICAR NO FEED
          </button>
        </div>
        {/* Modal de publicação */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Publicar no Feed</h2>
              <textarea
                value={postText}
                onChange={e => setPostText(e.target.value)}
                placeholder="Digite sua mensagem..."
                rows={4}
                style={{ width: "100%", marginBottom: 12 }}
              />
              <div
                className="dropzone"
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = ev => setPostImage(ev.target.result);
                    reader.readAsDataURL(file);
                  }
                }}
                onClick={() => document.getElementById("fileInput").click()}
              >
                {postImage ? (
                  <img src={postImage} alt="Preview" className="feed-image" style={{ maxHeight: 180, margin: 8 }} />
                ) : (
                  <span>
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
                      const reader = new FileReader();
                      reader.onload = ev => setPostImage(ev.target.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  id="fileInput"
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button onClick={() => setIsModalOpen(false)} className="goto-users-btn" style={{ background: "#ccc", color: "#333" }}>
                  Cancelar
                </button>
                <button onClick={handlePublish} className="goto-users-btn">
                  Publicar
                </button>
              </div>
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
      <button className="profile-reddit-btn">
        <img src="/logo.jpeg" alt="Perfil" className="profile-reddit-img" />
        <span className="profile-reddit-name">SeuNome</span>
        <svg width="18" height="18" style={{marginLeft: 6}} viewBox="0 0 20 20" fill="none">
          <path d="M6 8l4 4 4-4" stroke="#a48ad4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
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
        }
        .modal-content {
          background: #fff;
          padding: 32px 24px;
          border-radius: 16px;
          min-width: 340px;
          max-width: 90vw;
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
        }
      `}</style>
    </div>
  );
}

export default LandingPage;