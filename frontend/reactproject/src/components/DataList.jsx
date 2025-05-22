import { useEffect, useState } from "react";
import '../App.css';
import { getUsers, deleteUser as deleteUserApi } from '../config/api';

function DataList(props) {
    const [data, setData] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const users = await getUsers();
            setData(users);
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
    }, []);

    const handleView = (user) => {
        props.viewUser(user);
        setSelectedUserId(user.id);
    };

    const handleAdd = () => {
        props.viewUser(null);
        setSelectedUserId(null);
    };

    const handleDelete = async (id, event) => {
        event.stopPropagation();
        
        if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
            try {
                await deleteUserApi(id);
                alert('Usuário deletado com sucesso');
                await fetchUsers();
                if (props.closeModal) {
                    props.closeModal();
                }
            } catch (error) {
                console.error('Erro ao deletar usuário:', error);
                alert('Erro ao deletar usuário');
            }
        }
    };

    const handleUpdate = (user) => {
        props.updateUser(user);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return(
        <div>
            <h1>Lista dos favs do Alex Menegatti Secco (CRUD para experiência criativa)</h1>
            <button onClick={handleAdd} className="list-button add-button">Adicionar</button>
            <ul className="list">
                {data.map(user => (
                    <div key={user.id}>
                        <li className="list-li">
                            <div><strong>{user.nome}</strong></div>
                            <div>{user.email}</div>
                            <div>{user.genero}</div>
                            <div className="button-group">
                                <button onClick={() => handleView(user)} className="list-button">Ver mais</button>
                                <button onClick={(e) => handleDelete(user.id, e)} className="list-button delete-button">Deletar</button>
                                <button onClick={() => handleUpdate(user)} className="list-button update-button">Atualizar</button>
                            </div>
                        </li>
                        {props.isModalOpen && props.selectedUser && props.selectedUser.id === user.id && (
                            <div className="inline-modal">
                                <div className="inline-modal-content">
                                    <h1>{props.selectedUser.nome}</h1>
                                    <p><strong>Email:</strong> {props.selectedUser.email}</p>
                                    <p><strong>Telefone:</strong> {props.selectedUser.telefone}</p>
                                    <p><strong>Endereço:</strong> {props.selectedUser.endereco}</p>
                                    <p><strong>Filme favorito:</strong> {props.selectedUser.filmeFav}</p>
                                    <button onClick={props.closeModal} className="close-button">Fechar</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </ul>
        </div>
    )
}

export default DataList;