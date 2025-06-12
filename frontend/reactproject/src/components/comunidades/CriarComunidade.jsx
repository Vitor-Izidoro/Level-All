import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarToggle from '../shared/SidebarToggle';
import Sidebar from "../shared/Sidebar";

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
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <SidebarToggle isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 40 }}>
          <div style={{
            width: '30%',
            padding: '30px',
            backgroundColor: "#3a3341",
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ddd'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'white', textAlign: 'center' }}>
              Criar Nova Comunidade
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Nome da comunidade */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: 'white' }}>
                  Nome da Comunidade*:
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '97%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '16px'
                  }}
                />
              </div>

              {/* Descrição */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: 'white' }}>
                  Descrição*:
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  style={{
                    width: '97%',
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
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: 'white' }}>
                  Tags (separadas por vírgula):
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Ex: jogos, RPG, estratégia"
                  style={{
                    width: '97%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '16px'
                  }}
                />
              </div>

              {/* Banner */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: 'white' }}>
                  Banner da Comunidade:
                </label>
                <input
                  type="file"
                  name="banner"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{
                    width: '97%',
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
                  <span style={{ fontWeight: '500', color: 'white' }}>
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