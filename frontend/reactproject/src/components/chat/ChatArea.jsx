import React, { useState, useEffect, useRef } from 'react';

const ChatArea = ({ contact, currentUser, messages, onSendMessage }) => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll automático ao final
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Foco automático no input ao trocar de contato
    useEffect(() => {
        inputRef.current?.focus();
        setMessage('');
        setError('');
    }, [contact]);

    // Fecha dropdown ao clicar fora
    useEffect(() => {
        if (!dropdownOpen) return;
        const handleClick = (e) => {
            if (!e.target.closest('.chat-dropdown')) setDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [dropdownOpen]);

    // Limpa erro ao digitar
    useEffect(() => {
        if (error && message.trim()) setError('');
    }, [message]);

    const handleSend = () => {
        if (!contact) {
            setError('Nenhum contato selecionado.');
            return;
        }
        if (!message.trim()) {
            setError('Digite uma mensagem.');
            return;
        }

        try {
            onSendMessage && onSendMessage(message.trim());
            setMessage('');
            setError('');
        } catch (err) {
            console.error('Erro ao enviar mensagem:', err);
            setError('Erro ao enviar mensagem.');
        }
    };

    if (!contact) {
        return (
            <div className="chat-area empty" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div style={{ fontSize: 48, marginBottom: 16, color: '#bbb' }}>
                    <i className="fas fa-comments"></i>
                </div>
                <div style={{ fontSize: 20, fontWeight: 500, color: '#888' }}>
                    Nenhum contato selecionado
                </div>
                <div style={{ fontSize: 16, color: '#aaa', marginTop: 8 }}>
                    Selecione um contato na lista ao lado para começar uma conversa.
                </div>
            </div>
        );
    }

    return (
        <div className="chat-area">
            <div className="chat-header">
                <div className="contact-avatar">{contact.avatar || contact.username.charAt(0)}</div>
                <div className="chat-header-info">
                    <div className="chat-user">{contact.username}</div>
                    <div className="chat-status">{contact.status}</div>
                </div>
                <div className="chat-actions" style={{ position: 'relative' }}>
                    <i className="fas fa-phone-alt" title="Ligar"></i>
                    <i className="fas fa-video" title="Videochamada"></i>
                    <i className="fas fa-search" title="Pesquisar"></i>
                    <div className="chat-dropdown" style={{ display: 'inline-block', position: 'relative' }}>
                        <i
                            className="fas fa-ellipsis-v"
                            title="Mais opções"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setDropdownOpen((open) => !open)}
                        ></i>
                        {dropdownOpen && (
                            <div
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 24,
                                    background: '#3a3341',
                                    color: '#fff',
                                    borderRadius: 6,
                                    boxShadow: '0 2px 8px #0006',
                                    minWidth: 140,
                                    zIndex: 20,
                                    padding: '8px 0'
                                }}
                            >
                                <button
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#fff',
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '8px 16px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        alert('Em breve: Ver perfil');
                                    }}
                                >
                                    Ver perfil
                                </button>
                                <button
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#fff',
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '8px 16px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        alert('Em breve: Bloquear contato');
                                    }}
                                >
                                    Bloquear contato
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="chat-dropdown" style={{ display: 'inline-block', position: 'relative' }}>
                <svg
                    onClick={() => setDropdownOpen((open) => !open)}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="20"
                    height="20"
                    title="Mais opções"
                    style={{ cursor: 'pointer' }}
                >
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                </svg>
                {dropdownOpen && (
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 24,
                            background: '#3a3341',
                            color: '#fff',
                            borderRadius: 6,
                            boxShadow: '0 2px 8px #0006',
                            minWidth: 160,
                            zIndex: 20,
                            padding: '8px 0'
                        }}
                    >
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#fff',
                                width: '100%',
                                textAlign: 'left',
                                padding: '8px 16px',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setDropdownOpen(false);
                                alert('Em breve: Pesquisar');
                            }}
                        >
                            🔍 Pesquisar
                        </button>
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#fff',
                                width: '100%',
                                textAlign: 'left',
                                padding: '8px 16px',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setDropdownOpen(false);
                                alert('Em breve: Apagar todas as mensagens');
                            }}
                        >
                            🧹 Apagar mensagens
                        </button>
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#fff',
                                width: '100%',
                                textAlign: 'left',
                                padding: '8px 16px',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setDropdownOpen(false);
                                if (window.confirm('Tem certeza que deseja deletar este contato?')) {
                                    alert('Contato deletado (função simulada)');
                                }
                            }}
                        >
                            🗑️ Deletar contato
                        </button>
                    </div>
                )}
            </div>
            </div>

            {error && (
                <div className="error-banner">
                    <i className="fas fa-exclamation-triangle"></i> {error}
                    <button
                        style={{
                            marginLeft: 8,
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: 16,
                        }}
                        onClick={() => setError('')}
                        title="Fechar"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="chat-messages">
                {messages?.length === 0 ? (
                    <div style={{ color: '#bdb6c9', textAlign: 'center', marginTop: 32 }}>
                        Nenhuma mensagem nesta conversa.
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`message ${msg.remetente_id === currentUser.id ? 'sent' : 'received'}`}
                        >
                            <div className="message-content">{msg.conteudo}</div>
                            <div className="message-time">
                                {new Date(msg.enviada_em).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="message-input">
                <div className="input-container">
                    <i className="far fa-smile" title="Emojis"></i>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Digite uma mensagem..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        maxLength={500}
                        autoComplete="off"
                    />
                    <i className="fas fa-paperclip" title="Anexar arquivo"></i>
                    <button className="send-button" onClick={handleSend} title="Enviar">
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatArea;
