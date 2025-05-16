import { useState } from 'react';
import DataList from './components/DataList';
import UserForm from './components/UserForm';
import { createUser, updateUser as updateUserApi, deleteUser as deleteUserApi } from './config/api';
import './App.css';

function App(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isAddMode, setIsAddMode] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);

    function viewUser(user){
        if (!user) {
            // adicionar novo usuário (modal de adição)
            setIsAddMode(true);
            setIsUpdateMode(false);
            setIsViewMode(false);
            setSelectedUser(null);
        } else if (typeof user === 'object') {
            // ver um usuário (modal de visualização)
            setSelectedUser(user);
            setIsUpdateMode(false);
            setIsAddMode(false);
            setIsViewMode(true);
        }
        setIsModalOpen(true);
    }
    
    function updateUser(user) {
        setSelectedUser(user);
        setIsUpdateMode(true);
        setIsAddMode(false);
        setIsViewMode(false);
        setIsModalOpen(true);
    }

    
    async function deleteUser(id) {
        // função de exclusão é tratada diretamente no DataList
        console.log("Deletar usuário através do App:", id);
    }

    async function submitUser(userData) {
        try {
            if (isAddMode) {
                // criar novo usuário
                await createUser(userData);
                alert('Usuário adicionado com sucesso');
                closeModal();
                window.location.reload();
            } else if (isUpdateMode) {
                // atualizar usuário existente
                await updateUserApi(selectedUser.id, userData);
                alert('Usuário atualizado com sucesso');
                closeModal();
                window.location.reload();
            }
        } catch (error) {
            console.error('Erro ao processar usuário:', error);
            alert('Erro ao processar usuário');
        }
    }

    function closeModal(){
        setIsModalOpen(false);
        setIsAddMode(false);
        setIsUpdateMode(false);
        setIsViewMode(false);
        setSelectedUser(null);
    }

    return(
        <div>
            {isModalOpen && isViewMode && selectedUser ? (
                <div className="modal-container">
                    <div className="user-detail-modal">
                        <h2>Detalhes do usuário</h2>
                        <div className="user-detail-content">
                            <p><strong>Nome:</strong> {selectedUser.nome}</p>
                            <p><strong>Gênero:</strong> {selectedUser.genero}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Telefone:</strong> {selectedUser.telefone}</p>
                            <p><strong>Endereço:</strong> {selectedUser.endereco}</p>
                            <p><strong>Filme favorito:</strong> {selectedUser.filmeFav}</p>
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => updateUser(selectedUser)} className="update-button">
                                Editar Usuário
                            </button>
                            <button onClick={closeModal} className="cancel-button">
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            ) : isModalOpen && (isAddMode || isUpdateMode) ? (
                <UserForm 
                    user={selectedUser} 
                    isAddMode={isAddMode}
                    onSubmit={submitUser}
                    onCancel={closeModal}
                />
            ) : (
                <DataList 
                    viewUser={viewUser}
                    updateUser={updateUser}
                    deleteUser={deleteUser}
                    isModalOpen={isModalOpen} 
                    selectedUser={selectedUser} 
                    closeModal={closeModal} 
                />
            )}
        </div>
    );
}

export default App;
