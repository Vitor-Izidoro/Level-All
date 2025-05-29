import { useState } from 'react';

const ContactList = ({ contacts, selectedContact, onSelectContact }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filtra contatos pelo nome (insensível a maiúsculas/minúsculas)
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="contacts">
            <div className="contacts-header">
                <h1>Conversas</h1>
                <i className="fas fa-ellipsis-v"></i>
            </div>

            <div className="search-bar">
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
                    filteredContacts.map((contact) => (
                        <div
                            key={contact.id}
                            className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
                            onClick={() => onSelectContact(contact)}
                        >
                            <div className="contact-avatar">{contact.avatar}</div>
                            <div className="contact-info">
                                <div className="contact-name">{contact.name}</div>
                                <div className="contact-last-msg">{contact.lastMessage}</div>
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
