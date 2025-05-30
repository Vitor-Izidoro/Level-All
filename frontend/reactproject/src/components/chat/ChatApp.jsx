import Sidebar from './Sidebar';
import ContactList from './ContactList';
import ChatArea from './ChatArea';
import GroupList from './GroupList';      // importe seu GroupList criado
import GroupChatArea from './GroupChatArea';  // importe seu GroupChatArea criado
import { useEffect, useState } from 'react';
import './ChatApp.css';

function ChatApp() {
    const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' ou 'groups'

    const [contacts, setContacts] = useState([]);
    const [groups, setGroups] = useState([]);

    const [selectedContact, setSelectedContact] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);

    // Carregar contatos (exemplo estático)
    useEffect(() => {
        setContacts([
            { id: 1, name: "Alice", avatar: "🧑‍🦰", lastMessage: "Oi, tudo bem?", status: "online" },
            { id: 2, name: "Bob", avatar: "🧑‍🦱", lastMessage: "Vamos almoçar?", status: "offline" },
            { id: 3, name: "Carol", avatar: "👩", lastMessage: "Preciso falar com você.", status: "online" },
        ]);
    }, []);

    // Carregar grupos (simulado ou via fetch)
    useEffect(() => {
        if (activeTab === 'groups') {
            // Pode substituir pelo fetch real:
            setGroups([
                { id: 1, name: "Equipe de Projeto", avatar: "👥", lastMessage: "Reunião amanhã às 9h" },
                { id: 2, name: "Amigos", avatar: "🎉", lastMessage: "Quem vai no rolê?" },
                { id: 3, name: "Família", avatar: "🏠", lastMessage: "Almoço no domingo" },
            ]);
        }
    }, [activeTab]);

    // Função para mudar aba, passada para Sidebar
    const handleChangeTab = (tab) => {
        setActiveTab(tab);
        // Limpar seleções para evitar inconsistência
        setSelectedContact(null);
        setSelectedGroup(null);
    };

    return (
        <div className="app-container">
            
            {activeTab === 'contacts' && (
                <ContactList
                    contacts={contacts}
                    selectedContact={selectedContact}
                    onSelectContact={setSelectedContact}
                />
            )}

            {activeTab === 'groups' && (
                <GroupList
                    groups={groups}
                    selectedGroup={selectedGroup}
                    onSelectGroup={setSelectedGroup}
                />
            )}

            {activeTab === 'contacts' && (
                <ChatArea contact={selectedContact} currentUser={{ id: 123 }} />
            )}

            {activeTab === 'groups' && (
                <GroupChatArea group={selectedGroup} currentUser={{ id: 123 }} />
            )}
        </div>
    );
}

export default ChatApp;
