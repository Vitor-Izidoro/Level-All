import { useState, useEffect } from 'react';
import {
    getContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
} from '../../config/api'; // ajuste o caminho se necessário

const ContactList = ({ selectedContact, onSelectContact }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [contacts, setContacts] = useState([]);

    // Buscar todos os contatos ao montar o componente
    useEffect(() => {
        fetchContacts();
    }, []);

    // Função para buscar todos os contatos
    async function fetchContacts() {
        try {
            const data = await getContacts();
            const enhancedContacts = data.map(contact => ({
                ...contact,
                name: `Usuário ${contact.contact_user_id}`,
                avatar: '👤',
                lastMessage: 'Última mensagem aqui'
            }));
            setContacts(enhancedContacts);
        } catch (error) {
            console.error('Erro ao buscar contatos', error);
        }
    }

    // Exemplo: Buscar contato por ID
    async function handleGetContactById(id) {
        try {
            const contact = await getContactById(id);
            console.log('Contato encontrado:', contact);
        } catch (error) {
            console.error('Erro ao buscar contato por ID', error);
        }
    }

    // Exemplo: Criar novo contato
    async function handleCreateContact(newContact) {
        try {
            await createContact(newContact);
            fetchContacts(); // Atualiza lista após criar
        } catch (error) {
            console.error('Erro ao criar contato', error);
        }
    }

    // Exemplo: Atualizar contato
    async function handleUpdateContact(id, updatedContact) {
        try {
            await updateContact(id, updatedContact);
            fetchContacts(); // Atualiza lista após atualizar
        } catch (error) {
            console.error('Erro ao atualizar contato', error);
        }
    }

    // Exemplo: Deletar contato
    async function handleDeleteContact(id) {
        try {
            await deleteContact(id);
            fetchContacts(); // Atualiza lista após deletar
        } catch (error) {
            console.error('Erro ao excluir contato', error);
        }
    }

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="contacts">
            <div className="contacts-header">
                <h1>Conversas</h1>
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