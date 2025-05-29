const Sidebar = ({ activeTab, onChangeTab }) => {
    return (
        <aside className="icon-sidebar">
            <i
                className={`fas fa-comment-dots ${activeTab === 'contacts' ? 'active' : ''}`}
                title="Mensagens"
                onClick={() => onChangeTab('contacts')}
                style={{ cursor: 'pointer' }}
            >
                💬
            </i>

            <i
                className={`fas fa-users ${activeTab === 'groups' ? 'active' : ''}`}
                title="Grupos"
                onClick={() => onChangeTab('groups')}
                style={{ cursor: 'pointer' }}
            >
                👥
            </i>

            <i className="fas fa-address-book" title="Contatos">Contatos</i>
            <i className="fas fa-bell" title="Notificações">🔔</i>
            <i className="fas fa-cog" title="Configurações">⚙️</i>
            <div style={{ flex: 1 }}></div>
            <i className="fas fa-user" title="Meu Perfil">👤</i>
        </aside>
    );
};

export default Sidebar;
