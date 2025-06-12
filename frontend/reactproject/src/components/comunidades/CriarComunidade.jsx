import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarToggle from '../shared/SidebarToggle';

function CriarComunidade() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tags: '',
    monetizado: false,
    banner: null
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        banner: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    setMensagem('');

    if (!formData.nome || !formData.descricao) {
      setErro('Nome e descrição são obrigatórios.');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nome', formData.nome);
      formDataToSend.append('descricao', formData.descricao);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('monetizado', formData.monetizado);
      if (formData.banner) {
        formDataToSend.append('banner', formData.banner);
      }

      const response = await fetch('http://localhost:3000/comunidades', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        const data = await response.json();
        setMensagem('Comunidade criada com sucesso!');
        
        // Se a comunidade for monetizada, redireciona para a página de autenticação
        if (formData.monetizado) {
          navigate('/autenticacao', { 
            state: { 
              comunidadeId: data.id,
              comunidadeNome: data.nome
            }
          });
        } else {
          // Se não for monetizada, redireciona para a página de comunidades
          navigate('/comunidades');
        }
      } else {
        const error = await response.json();
        setErro(error.error || 'Erro ao criar comunidade');
      }
    } catch (err) {
      setErro('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-root">
      <aside className={`sidebar${sidebarOpen ? '' : ' closed'}`}>
        <div className="sidebar-header">
          <div className="logo-circle">
            <img src="/logo.jpeg" alt="Logo Level All" className="logo-img" />
          </div>
          <span className="sidebar-title">LEVEL ALL</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li><a href="/" className="sidebar-btn animated">🏠 Página Inicial</a></li>
            <li><a href="/comunidades" className="sidebar-btn animated">👥 Comunidades</a></li>
            <li><a href="/tags" className="sidebar-btn animated">🏷️ Suas tags</a></li>
            <li><a href="/mensagens" className="sidebar-btn animated">💬 Mensagens</a></li>
            <li><a href="/notificacoes" className="sidebar-btn animated">🔔 Notificações</a></li>
            <li><a href="/perfil" className="sidebar-btn animated">👤 Perfil</a></li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-btn animated">⚙️ Configurações</button>
        </div>
      </aside>

      <SidebarToggle isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <header className="main-header">
          <input className="search-bar" placeholder="Pesquisar..." />
        </header>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 40 }}>
          <div style={{
            maxWidth: '600px',
            padding: '30px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ddd'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#333', textAlign: 'center' }}>
              Criar Nova Comunidade
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Nome da comunidade */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                  Nome da Comunidade*:
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '16px'
                  }}
                />
              </div>

              {/* Descrição */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                  Descrição*:
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Tags */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                  Tags (separadas por vírgula):
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Ex: jogos, RPG, estratégia"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '16px'
                  }}
                />
              </div>

              {/* Banner */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                  Banner da Comunidade:
                </label>
                <input
                  type="file"
                  name="banner"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '16px'
                  }}
                />
              </div>

              {/* Monetização */}
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="monetizado"
                    checked={formData.monetizado}
                    onChange={handleInputChange}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontWeight: '500', color: '#333' }}>
                    Esta comunidade será monetizada
                  </span>
                </label>
                {formData.monetizado && (
                  <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
                    Ao marcar esta opção, você será redirecionado para a página de autenticação para fornecer os documentos necessários.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#a48ad4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'background-color 0.3s'
                }}
              >
                {loading ? 'Criando...' : 'Criar Comunidade'}
              </button>

              {erro && (
                <div style={{
                  backgroundColor: '#f8d7da',
                  color: '#721c24',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  marginTop: '20px',
                  border: '1px solid #f5c6cb'
                }}>
                  {erro}
                </div>
              )}
              {mensagem && (
                <div style={{
                  backgroundColor: '#d4edda',
                  color: '#155724',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  marginTop: '20px',
                  border: '1px solid #c3e6cb'
                }}>
                  {mensagem}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CriarComunidade; 