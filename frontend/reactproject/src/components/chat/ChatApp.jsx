import ContactList from './ContactList';
import ChatArea from './ChatArea';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ChatApp.css';
import { getContacts, getUsers, getMessages, createMessage, createContact } from '../../config/api';

function ChatApp() {
  const { autenticado, usuario } = useAuth();

  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [mergedContacts, setMergedContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [searchContact, setSearchContact] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState({
    contacts: false,
    messages: false,
    search: false
  });
  const [error, setError] = useState(null);

  // Busca usuários para adicionar como contatos
  const handleSearchContact = async () => {
    if (!searchContact.trim()) return;

    try {
      setLoading(prev => ({ ...prev, search: true }));
      const users = await getUsers(searchContact);
      const filtered = users.filter(
        user => user.id !== usuario.id &&
          !mergedContacts.some(contact => contact.id === user.id)
      );
      setSearchResults(filtered);
      setError(null);
    } catch (err) {
      console.error('Erro na busca de contatos:', err);
      setError('Erro ao buscar contatos');
      setSearchResults([]);
    } finally {
      setLoading(prev => ({ ...prev, search: false }));
    }
  };

  // Adiciona novo contato
const handleAddContact = async (contact) => {
  if (!usuario?.id || !contact?.id) {
    setError('Dados inválidos para adicionar contato');
    return;
  }

  try {
    const newContact = {
      user_id: usuario.id,
      contact_id: contact.id,
    };

    // Tenta criar o relacionamento no backend
    const newContactMetadata = await createContact(newContact);

    if (!newContactMetadata?.id) {
      throw new Error('Dados inválidos ao criar contato');
    }

    setError(''); // limpa erros
    // Aqui você pode atualizar o estado com o novo contato, exibir mensagem, etc
    console.log('Contato criado com sucesso:', newContactMetadata);
    
    setMergedContacts(prev => [...prev, newContactMetadata]);

  } catch (error) {
    // Se o erro veio da API, tenta mostrar mensagem detalhada
    if (error.response?.data?.error) {
      setError(error.response.data.error);
    } else {
      setError(error.message || 'Erro ao adicionar contato');
    }
  }
};



  // Envia mensagem
  const handleSendMessage = async (msgText) => {
    if (!selectedContact || !msgText.trim() || !selectedContact.contact_metadata?.id) return;

    try {
      const newMsg = {
        contact_id: selectedContact.contact_metadata.id, // ID do relacionamento de contato
        remetente_id: usuario.id,                      // Quem está enviando
        destinatario_id: selectedContact.id,           // ID do outro usuário
        conteudo: msgText
      };

      const savedMsg = await createMessage(newMsg);
      setMessages(prev => [...prev, savedMsg]);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setError('Erro ao enviar mensagem');
    }
  };

  // Quando seleciona um contato
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  // Carrega mensagens ao trocar de contato
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedContact || !selectedContact.contact_metadata?.id) return;

      try {
        setLoading(prev => ({ ...prev, messages: true }));
        const chatMessages = await getMessages(selectedContact.contact_metadata.id);
        
        // Filtra mensagens para garantir que pertencem a este contato
        const filteredMessages = chatMessages.filter(
          msg => msg.contact_id === selectedContact.contact_metadata.id
        );
        
        setMessages(filteredMessages);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar mensagens:', err);
        setError('Erro ao carregar mensagens');
        setMessages([]);
      } finally {
        setLoading(prev => ({ ...prev, messages: false }));
      }
    };

    loadMessages();
  }, [selectedContact]);

  // Carrega contatos e mescla dados do usuário com metadados da tabela de contatos
  useEffect(() => {
    const fetchContacts = async () => {
      if (!usuario?.id) return;

      try {
        setLoading(prev => ({ ...prev, contacts: true }));
        const [usersData, contactsData] = await Promise.all([
          getUsers(),
          getContacts(usuario.id) // Assumindo que getContacts pode filtrar por user_id
        ]);

        const mergedContactsArray = usersData
          .filter(user =>
            contactsData.some(contact => contact.contact_id === user.id)
          )
          .map(user => {
            const contactInfo = contactsData.find(
              contact => contact.contact_id === user.id
            );
            return {
              ...user,
              contact_metadata: {
                ...contactInfo
              }
            };
          });

        setMergedContacts(mergedContactsArray);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar contatos:', err);
        setError('Erro ao carregar contatos');
        setMergedContacts([]);
      } finally {
        setLoading(prev => ({ ...prev, contacts: false }));
      }
    };

    fetchContacts();
  }, [usuario]);

  return (
    <div className="app-container">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <ContactList
        contacts={mergedContacts}
        selectedContact={selectedContact}
        onSelectContact={handleSelectContact}
        onAddContact={() => setShowAddContact(true)}
        loading={loading.contacts}
      />

      <ChatArea
        contact={selectedContact}
        currentUser={usuario}
        messages={messages}
        onSendMessage={handleSendMessage}
        loading={loading.messages}
      />

      {showAddContact && (
        <div className="modal-overlay" onClick={() => setShowAddContact(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Adicionar novo contato</h3>
            <div className="search-container">
              <input
                type="text"
                placeholder="Pesquisar contato"
                value={searchContact}
                onChange={e => setSearchContact(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearchContact()}
              />
              <button
                className="search-button"
                onClick={handleSearchContact}
                disabled={loading.search}
              >
                {loading.search ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            <div className="search-results">
              {loading.search ? (
                <div className="loading">Carregando...</div>
              ) : searchResults.length > 0 ? (
                <ul className="results-list">
                  {searchResults.map(contact => (
                    <li key={contact.id} className="result-item">
                      <span>{contact.username || contact.name || 'Sem nome'}</span>
                      <button
                        className="add-button"
                        onClick={() => handleAddContact(contact)}
                      >
                        Adicionar
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-results">
                  {searchContact ? 'Nenhum contato encontrado' : 'Digite um nome para buscar'}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setShowAddContact(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatApp;