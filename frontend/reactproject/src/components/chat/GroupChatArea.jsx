import React, { useState, useEffect, useRef } from 'react';

const GroupChatArea = ({ group, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (group) {
            fetch(`http://localhost:5000/groups/${group.id}/messages`)
                .then(res => res.json())
                .then(data => setMessages(data))
                .catch(err => {
                    console.error('Erro ao carregar mensagens do grupo', err);
                    setError('Erro ao carregar mensagens do grupo. Por favor, tente novamente.');
                });
        } else {
            setMessages([]);
        }
    }, [group]);

    const handleSend = async () => {
        if (!message.trim() || !group) return;

        const newMessage = {
            group_id: group.id,
            remetente_id: currentUser.id,
            conteudo: message,
        };

        try {
            const res = await fetch(`http://localhost:5000/groups/${group.id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessage),
            });

            if (!res.ok) throw new Error('Erro ao enviar mensagem.');

            const savedMessage = await res.json();
            setMessages(prev => [...prev, savedMessage]);
            setMessage('');
            setError(''); // Limpar erro ao enviar com sucesso
        } catch (err) {
            console.error(err);
            setError('Não foi possível enviar a mensagem. Verifique sua conexão e tente novamente.');
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!group) {
        return <div className="chat-area empty">Selecione um grupo para começar</div>;
    }

    return (
        <div className="chat-area">
            <div className="chat-header">
                <div className="group-avatar large">{group.avatar}</div>
                <div className="chat-header-info">
                    <div className="chat-user">{group.name}</div>
                </div>
                <div className="chat-actions">
                    <i className="fas fa-search action-icon" title="Pesquisar"></i>
                    <i className="fas fa-ellipsis-v action-icon" title="Mais opções"></i>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map(msg => (
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

            {error && (
                <div className="error-banner">
                    <i className="fas fa-exclamation-triangle"></i> {error}
                </div>
            )}

            <div className="message-input">
                <div className="input-container">
                    <i className="far fa-smile emoji-icon"></i>
                    <input
                        type="text"
                        placeholder="Digite uma mensagem no grupo..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <i className="fas fa-paperclip attach-icon"></i>
                    <button className="send-button" onClick={handleSend}>
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupChatArea;
