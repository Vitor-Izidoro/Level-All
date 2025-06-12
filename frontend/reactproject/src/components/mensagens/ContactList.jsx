import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ContactList = ({ contacts, selectedContact, onSelectContact, onAddContact }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const { autenticado, usuario } = useAuth();

  // Corrigido: filtro para a lista principal
  const filteredContacts = contacts.filter(contact =>
    contact.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Contatos filtrados pelo nome digitado no modal
  const filteredModalContacts = contacts.filter(contact =>
    contact.username?.toLowerCase().includes(newContactName.toLowerCase())
  );

  const handleAdd = () => {
    if (onAddContact && newContactName.trim()) {
      onAddContact(newContactName.trim());
      setNewContactName('');
      setShowModal(false);
    }
  };

  const contactsWithLastMessage = contacts.map(contact => {
    const msgs = messages.filter(
      m =>
        (m.senderId === usuario.id && m.receiverId === contact.id) ||
        (m.senderId === contact.id && m.receiverId === usuario.id)
    );

    const lastMsg = msgs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

    return {
      ...contact,
      lastMessage: lastMsg ? lastMsg.text : null,
    };
  });

  return (
    <div className="contacts">
      <div className="contacts-header">
        <h1>Conversas</h1>
        <button
          style={{
            margin: '16px',
            padding: '10px 15px',            // maior área clicável
            borderRadius: '12px',            // cantos mais arredondados
            border: 'none',
            background: '#5a4a6b',
            color: '#fff',
            fontWeight: 500,                 // fonte mais forte
            fontSize: '18px',                // fonte maior
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)', // leve sombra
            transition: 'background 0.2s ease'
          }}
          onClick={() => onAddContact(true)}
        >
          + Novo Contato
        </button>

        <i className="fas fa-ellipsis-v"></i>
      </div>

      <div className="seach-bar-chat">
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Pesquisar conversas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="contact-list">
        {filteredContacts.length > 0 ? (
          filteredContacts.map(contact => (
            <div
              key={contact.id}
              className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
              onClick={() => onSelectContact(contact)}
              style={{ cursor: 'pointer' }}
            >
              {/* Mantenha todo o conteúdo interno igual */}
              <div className="contact-avatar">
                {contact.avatar || contact.username.charAt(0)}
              </div>
              <div className="contact-info">
                <div className="contact-name">{contact.username}</div>
                <div className="contact-last-msg">
                  {contact.lastMessage ? contact.lastMessage : 'Sem mensagens'}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-light)' }}>
            Nenhum contato encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactList;