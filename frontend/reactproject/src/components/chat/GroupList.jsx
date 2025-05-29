import { useState } from 'react';

const GroupList = ({ groups, selectedGroup, onSelectGroup }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="groups">
            <div className="groups-header">
                <h1>Grupos</h1>
                <i className="fas fa-ellipsis-v options-icon"></i>
            </div>

            <div className="search-bar">
                <i className="fas fa-search search-icon"></i>
                <input
                    type="text"
                    placeholder="Pesquisar grupos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="group-list">
                {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                        <div
                            key={group.id}
                            className={`group-item ${selectedGroup?.id === group.id ? 'active' : ''}`}
                            onClick={() => onSelectGroup(group)}
                        >
                            <div className="group-avatar">{group.avatar}</div>
                            <div className="group-info">
                                <div className="group-name">{group.name}</div>
                                <div className="group-last-msg">{group.lastMessage}</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-message">Nenhum grupo encontrado.</div>
                )}
            </div>
        </div>
    );
};

export default GroupList;
