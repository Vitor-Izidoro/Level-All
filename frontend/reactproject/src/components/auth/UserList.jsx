import React from 'react';
import '../styles/UserList.css';

function UserList({ users, onView, onDelete, userType }) {
    const getTypeSpecificFields = (user) => {
        switch (userType) {
            case 'gamer':
                return (
                    <>
                        <div>Level: {user.nivel || 'N/A'}</div>
                        <div>Points: {user.pontos || '0'}</div>
                    </>
                );
            case 'developer':
                return (
                    <>
                        <div>Company: {user.empresa || 'N/A'}</div>
                        <div>Position: {user.cargo || 'N/A'}</div>
                    </>
                );
            case 'investor':
                return (
                    <>
                        <div>Company: {user.empresa || 'N/A'}</div>
                        <div>CNPJ: {user.cnpj || 'N/A'}</div>
                    </>
                );
            case 'admin':
                return (
                    <div>Access Level: {user.nivel_acesso || 'admin'}</div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="user-list">
            {users.map(user => (
                <div key={user.id} className="user-card">
                    <div className="user-info">
                        <h3>{user.nome}</h3>
                        <div className="user-details">
                            <div>Username: {user.username}</div>
                            <div>Email: {user.email}</div>
                            {getTypeSpecificFields(user)}
                        </div>
                    </div>
                    <div className="user-actions">
                        <button 
                            onClick={() => onView(user)}
                            className="action-button view-button"
                        >
                            View Details
                        </button>
                        <button 
                            onClick={() => onDelete(user.username)}
                            className="action-button delete-button"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default UserList; 
