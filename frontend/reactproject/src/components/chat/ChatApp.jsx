import Sidebar from './Sidebar';
import ContactList from './ContactList';
import ChatArea from './ChatArea';
import { useEffect, useState } from 'react';
import './ChatApp.css';

function ChatApp() {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);

    useEffect(() => {
        // Simulando carregamento de contatos
        setContacts([
            { id: 1, name: "Alice", avatar: "🧑‍🦰", lastMessage: "Oi, tudo bem?", status: "online" },
            { id: 2, name: "Bob", avatar: "🧑‍🦱", lastMessage: "Vamos almoçar?", status: "offline" },
            { id: 3, name: "Carol", avatar: "👩", lastMessage: "Preciso falar com você.", status: "online" },
        ]);
    }, []);

    return (
        <div className="app-container">
            <Sidebar />
            <ContactList
                contacts={contacts}
                selectedContact={selectedContact}
                onSelectContact={setSelectedContact}
            />
            <ChatArea contact={selectedContact} />
        </div>
    );
}

export default ChatApp;
