import { useEffect, useState } from "react";
import { getUsers, deleteUser } from '../../config/api';
import UserForm from './UserForm';
import UserList from './UserList';
import '../styles/UserManagement.css';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userType, setUserType] = useState('gamer'); // Default user type

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsers(userType);
            setUsers(response);
            setError(null);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [userType]);

    const handleView = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (username) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(username);
                alert('User deleted successfully');
                await fetchUsers();
                setIsModalOpen(false);
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Error deleting user');
            }
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedUser) {
                // Update existing user
                await updateUser(userType, selectedUser.username, formData);
            } else {
                // Create new user
                await createUser(userType, formData);
            }
            await fetchUsers();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Error saving user');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="user-management">
            <div className="user-type-selector">
                <select 
                    value={userType} 
                    onChange={(e) => setUserType(e.target.value)}
                    className="user-type-select"
                >
                    <option value="gamer">Gamers</option>
                    <option value="developer">Developers</option>
                    <option value="investor">Investors</option>
                    <option value="admin">Admins</option>
                </select>
            </div>

            <div className="user-management-header">
                <h1>{userType.charAt(0).toUpperCase() + userType.slice(1)} Management</h1>
                <button onClick={handleAdd} className="add-button">
                    Add New {userType.charAt(0).toUpperCase() + userType.slice(1)}
                </button>
            </div>

            <UserList 
                users={users}
                onView={handleView}
                onDelete={handleDelete}
                userType={userType}
            />

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <UserForm
                            user={selectedUser}
                            userType={userType}
                            onSubmit={handleSubmit}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement; 
