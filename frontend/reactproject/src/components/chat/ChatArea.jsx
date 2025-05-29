import React, { useState, useEffect, useRef } from 'react';

const ChatArea = ({ contact, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);

    // Carregar mensagens do backend para o contato selecionado
    useEffect(() => {
        if (contact) {
            fetch(`http://localhost:5000/messages/${contact.id}`)
                .then((res) => res.json())
                .then((data) => setMessages(data))
                .catch((err) => console.error('Erro ao carregar mensagens', err));
        } else {
            setMessages([]);
        }
    }, [contact]);

    // Enviar nova mensagem para o backend
    const handleSend = async () => {
        if (!message.trim() || !contact) return;

        const newMessage = {
            contact_id: contact.id,                // ID do contato
            remetente_id: currentUser.id,         // ID do usuário logado
            destinatario_id: contact.userId,      // ID do usuário destinatário
            conteudo: message,
        };

        try {
            const res = await fetch('http://localhost:5000/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessage),
            });

            if (!res.ok) throw new Error('Erro ao enviar mensagem.');

            const savedMessage = await res.json(); // espera receber a mensagem salva
            setMessages((prev) => [...prev, savedMessage]);
            setMessage('');
        } catch (err) {
            console.error(err);
            setError('Erro ao enviar mensagem.');
        }
    };

    // Scroll automático ao final
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!contact) {
        return <div className="chat-area empty">Selecione um contato para começar</div>;
    }

    return (
        <div className="chat-area">
            <div className="chat-header">
                <div className="contact-avatar">{contact.avatar}</div>
                <div className="chat-header-info">
                    <div className="chat-user">{contact.name}</div>
                    <div className="chat-status">{contact.status}</div>
                </div>
                <div className="chat-actions">
                    <i className="fas fa-phone-alt" title="Ligar"></i>
                    <i className="fas fa-video" title="Videochamada"></i>
                    <i className="fas fa-search" title="Pesquisar"></i>
                    <i className="fas fa-ellipsis-v" title="Mais opções"></i>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`message ${msg.remetente_id === currentUser.id ? 'sent' : 'received'}`}
                    >
                        <div className="message-content">{msg.conteudo}</div>
                        <div className="message-time">{new Date(msg.enviada_em).toLocaleTimeString()}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="message-input">
                <div className="input-container">
                    <i className="far fa-smile"></i>
                    <input
                        type="text"
                        placeholder="Digite uma mensagem..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <i className="fas fa-paperclip"></i>
                    <button className="send-button" onClick={handleSend}>
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>

            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default ChatArea;
