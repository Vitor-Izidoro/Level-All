const Sidebar = () => {
    return (
        <aside className="icon-sidebar">
            <i className="fas fa-comment-dots active" title="Mensagens">💬</i>
            <i className="fas fa-users" title="Grupos">👥</i>
            <i className="fas fa-address-book" title="Contatos">Contatos</i>
            <i className="fas fa-bell" title="Notificações">🔔</i>
            <i className="fas fa-cog" title="Configurações">⚙️</i>
            <div style={{ flex: 1 }}></div>
            <i className="fas fa-user" title="Meu Perfil">👤</i>
        </aside>
    );
};

export default Sidebar;
