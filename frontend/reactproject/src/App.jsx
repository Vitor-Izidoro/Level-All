import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import DataList from './components/DataList';
import UserForm from './components/UserForm';
import { 
    createUserGamer,
    createUserDeveloper,
    createUserInvestor,
    createUserAdmin,
    updateUserGamer,
    updateUserDeveloper,
    updateUserInvestor,
    updateUserAdmin,
    deleteUser
} from './config/api';
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
                // Escolha a função de criação conforme o tipo
                if (userData.tipo === 'admin') {
                    await createUserAdmin(userData);
                } else if (userData.tipo === 'gamer') {
                    await createUserGamer(userData);
                } else if (userData.tipo === 'developer') {
                    await createUserDeveloper(userData);
                } else if (userData.tipo === 'investor') {
                    await createUserInvestor(userData);
                } else {
                    throw new Error('Tipo de usuário inválido');
                }
                alert('Usuário adicionado com sucesso');
                closeModal();
                window.location.reload();
            } else if (isUpdateMode) {
                // Escolha a função de update conforme o tipo
                if (userData.tipo === 'admin') {
                    await updateUserAdmin(selectedUser.username, userData);
                } else if (userData.tipo === 'gamer') {
                    await updateUserGamer(selectedUser.username, userData);
                } else if (userData.tipo === 'developer') {
                    await updateUserDeveloper(selectedUser.username, userData);
                } else if (userData.tipo === 'investor') {
                    await updateUserInvestor(selectedUser.username, userData);
                } else {
                    throw new Error('Tipo de usuário inválido');
                }
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
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/usuarios"
                    element={
                        <DataList
                            viewUser={viewUser}
                            updateUser={updateUser}
                            deleteUser={deleteUser}
                            isModalOpen={isModalOpen}
                            selectedUser={selectedUser}
                            closeModal={closeModal}
                        />
                    }
                />
            </Routes>
            {/* Se quiser manter o modal global, pode colocar aqui */}
            {isModalOpen && (isAddMode || isUpdateMode) && (
                <UserForm
                    user={selectedUser}
                    isAddMode={isAddMode}
                    onSubmit={submitUser}
                    onCancel={closeModal}
                />
            )}
        </Router>
    );
}

export default App;
