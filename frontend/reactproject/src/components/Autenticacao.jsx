import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarToggle from './SidebarToggle';

function Autenticacao() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [arquivos, setArquivos] = useState({
    residencia: null,
    identidade: null,
  });
  const [dadosBancarios, setDadosBancarios] = useState({
    banco: '',
    agencia: '',
    conta: '',
    tipo: '',
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [comunidadeContext, setComunidadeContext] = useState(null);

  useEffect(() => {
    // Verificar se veio da criação de comunidade
    if (location.state?.comunidadeId) {
      setComunidadeContext({
        id: location.state.comunidadeId,
        nome: location.state.comunidadeNome
      });
    }
  }, [location]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setArquivos(prev => ({
      ...prev,
      [name]: files[0] || null,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDadosBancarios(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    if (!arquivos.residencia || !arquivos.identidade ||
        !dadosBancarios.banco || !dadosBancarios.agencia ||
        !dadosBancarios.conta || !dadosBancarios.tipo) {
      setErro('Todos os campos são obrigatórios.');
      return;
    }

    // Pegando usuário do localStorage
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
      user = null;
    }

    if (!user || !user.id || !user.userType) {
      setErro('Usuário não autenticado. Faça login novamente.');
      setLoading(false);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('residencia', arquivos.residencia);
    formData.append('identidade', arquivos.identidade);
    formData.append('banco', dadosBancarios.banco);
    formData.append('agencia', dadosBancarios.agencia);
    formData.append('conta', dadosBancarios.conta);
    formData.append('tipo', dadosBancarios.tipo);
    formData.append('original_id', user.id);
    formData.append('original_type', user.userType);

    // Se veio da criação de comunidade, adiciona o contexto
    if (comunidadeContext) {
      formData.append('comunidade_id', comunidadeContext.id);
    }

    try {
      const response = await fetch('http://localhost:3000/api/autenticacao', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setMensagem('Dados enviados com sucesso!');
        setArquivos({ residencia: null, identidade: null });
        setDadosBancarios({ banco: '', agencia: '', conta: '', tipo: '' });
        
        // Se veio da criação de comunidade, redireciona de volta
        if (comunidadeContext) {
          setTimeout(() => {
            navigate('/comunidades');
          }, 2000);
        }
      } else {
        setErro('Erro ao enviar dados. Tente novamente.');
      }
    } catch (err) {
      setErro('Erro de conexão com o servidor.');
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
        <div className="goto-users-fixed"></div>
      </aside>

      <SidebarToggle isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <header className="main-header">
          <input className="search-bar" placeholder="Pesquisar..." />
        </header>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 40 }}>
          <div style={{
            maxWidth: '450px',
            padding: '30px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ddd'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#333', textAlign: 'center' }}>
              {comunidadeContext 
                ? `Autenticação para Comunidade: ${comunidadeContext.nome}`
                : 'Autenticação de Documentos'}
            </h2>
            {comunidadeContext && (
              <p style={{ 
                marginBottom: '20px', 
                color: '#666', 
                textAlign: 'center',
                fontSize: '14px'
              }}>
                Para criar uma comunidade monetizada, precisamos verificar seus documentos.
              </p>
            )}
            <form onSubmit={handleSubmit}>
              {/* Comprovante de residência */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                  Comprovante de Residência*:
                </label>
                <input
                  type="file"
                  name="residencia"
                  accept="image/*,application/pdf"
                  required
                  onChange={handleFileChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '16px',
                    backgroundColor: '#fff'
                  }}
                />
              </div>
              {/* Dados bancários */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: '500', color: '#333' }}>Dados Bancários*:</label>
                <input
                  type="text"
                  name="banco"
                  placeholder="Banco"
                  value={dadosBancarios.banco}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', margin: '5px 0', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input
                  type="text"
                  name="agencia"
                  placeholder="Agência"
                  value={dadosBancarios.agencia}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', margin: '5px 0', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input
                  type="text"
                  name="conta"
                  placeholder="Conta"
                  value={dadosBancarios.conta}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', margin: '5px 0', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <input
                  type="text"
                  name="tipo"
                  placeholder="Tipo de Conta"
                  value={dadosBancarios.tipo}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', margin: '5px 0', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
              {/* Documento de identidade */}
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                  Documento de Identidade (RG)*:
                </label>
                <input
                  type="file"
                  name="identidade"
                  accept="image/*,application/pdf"
                  required
                  onChange={handleFileChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '16px',
                    backgroundColor: '#fff'
                  }}
                />
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
                {loading ? 'Enviando...' : 'Enviar Dados'}
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

export default Autenticacao;