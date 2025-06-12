import ContactList from './ContactList';
import ChatArea from './ChatArea';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ChatApp.css';
import { getContacts, getUsers, getMessages, createMessage, createContact } from '../../config/api';
import ErrorNotification from './ErrorNotification';

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

  const getFriendlyErrorMessage = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400: return 'Dados inválidos. Verifique as informações.';
        case 401: return 'Sessão expirada. Faça login novamente.';
        case 403: return 'Você não tem permissão para esta ação.';
        case 404: return 'Recurso não encontrado.';
        case 500: return 'Erro no servidor. Tente novamente mais tarde.';
        default: return error.response.data?.error || 'Erro na operação.';
      }
    } else if (error.message.includes('Network Error')) {
      return 'Sem conexão com o servidor. Verifique sua internet.';
    } else if (error.message.includes('timeout')) {
      return 'A operação demorou muito. Tente novamente.';
    } else {
      return error.message || 'Ocorreu um erro inesperado.';
    }
  };

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
      setError(getFriendlyErrorMessage(err));
      setSearchResults([]);
    } finally {
      setLoading(prev => ({ ...prev, search: false }));
    }
  };

  const handleAddContact = async (contact) => {
    if (!usuario?.id || !contact?.id) {
      setError('Não foi possível adicionar o contato. Dados incompletos.');
      return;
    }

    try {
      const newContact = {
        user_id: usuario.id,
        contact_id: contact.id,
      };

      const newContactMetadata = await createContact(newContact);

      if (!newContactMetadata?.id) {
        throw new Error('Dados inválidos ao criar contato');
      }

      setError(null);
      setMergedContacts(prev => [...prev, {
        ...contact,
        contact_metadata: newContactMetadata
      }]);
      setShowAddContact(false);
      setSearchContact('');
      setSearchResults([]);
      
    } catch (error) {
      setError(getFriendlyErrorMessage(error));
    }
  };

  const handleSendMessage = async (msgText) => {
    if (!selectedContact || !msgText.trim() || !selectedContact.contact_metadata?.id) return;

    try {
      const newMsg = {
        contact_id: selectedContact.contact_metadata.id,
        remetente_id: usuario.id,
        destinatario_id: selectedContact.id,
        conteudo: msgText
      };

      const savedMsg = await createMessage(newMsg);
      setMessages(prev => [...prev, savedMsg]);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setError(getFriendlyErrorMessage(err));
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  const loadMessages = async (contact) => {
    if (!contact || !contact.contact_metadata?.id) return;

    try {
      setLoading(prev => ({ ...prev, messages: true }));
      const chatMessages = await getMessages(contact.contact_metadata.id);
      const filteredMessages = chatMessages.filter(
        msg => msg.contact_id === contact.contact_metadata.id
      );
      setMessages(filteredMessages);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
      setError(getFriendlyErrorMessage(err));
      setMessages([]);
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  };

  useEffect(() => {
    if (selectedContact) {
      loadMessages(selectedContact);
    }
  }, [selectedContact]);

  const loadContacts = async () => {
    if (!usuario?.id) return;

    try {
      setLoading(prev => ({ ...prev, contacts: true }));
      const [usersData, contactsData] = await Promise.all([
        getUsers(),
        getContacts(usuario.id)
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
      setError(getFriendlyErrorMessage(err));
      setMergedContacts([]);
    } finally {
      setLoading(prev => ({ ...prev, contacts: false }));
    }
  };

  useEffect(() => {
    loadContacts();
  }, [usuario]);

  return (
    <div className="app-container">
      {error && (
        <ErrorNotification 
          error={error}
          onDismiss={() => setError(null)}
          onRetry={() => {
            if (error.includes('carregar mensagens')) {
              loadMessages(selectedContact);
            } else if (error.includes('carregar contatos')) {
              loadContacts();
            }
          }}
        />
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