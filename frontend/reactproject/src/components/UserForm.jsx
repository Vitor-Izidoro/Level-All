import { useState, useEffect } from 'react';
import '../App.css';

function UserForm({ user, isAddMode, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        nome: '',
        genero: '',
        email: '',
        telefone: '',
        endereco: '',
        filmeFav: ''
    });

    useEffect(() => {
        if (user && !isAddMode) {
            setFormData({
                nome: user.nome || '',
                genero: user.genero || '',
                email: user.email || '',
                telefone: user.telefone || '',
                endereco: user.endereco || '',
                filmeFav: user.filmeFav || ''
            });
        } else {
            // Reset form when adding a new user
            setFormData({
                nome: '',
                genero: '',
                email: '',
                telefone: '',
                endereco: '',
                filmeFav: ''
            });
        }
    }, [user, isAddMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="user-form">
                <h2>{isAddMode ? 'Adicionar Novo Usuário' : 'Atualizar Usuário'}</h2>
                
                <div className="form-group">
                    <label htmlFor="nome">Nome:</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="genero">Gênero:</label>
                    <input
                        type="text"
                        id="genero"
                        name="genero"
                        value={formData.genero}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="telefone">Telefone:</label>
                    <input
                        type="text"
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="endereco">Endereço:</label>
                    <textarea
                        id="endereco"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        rows="3"
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="filmeFav">Filme favorito:</label>
                    <input
                        type="text"
                        id="filmeFav"
                        name="filmeFav"
                        value={formData.filmeFav}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-buttons">
                    <button type="submit" className="submit-button">
                        {isAddMode ? 'Adicionar Usuário' : 'Atualizar Usuário'}
                    </button>
                    <button type="button" className="cancel-button" onClick={onCancel}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UserForm; 