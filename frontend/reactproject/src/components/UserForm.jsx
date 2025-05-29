import { useState, useEffect } from 'react';
import '../styles/UserForm.css';

function UserForm({ user, userType, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        username: '',
        nome: '',
        email: '',
        senha: '',
        ...getTypeSpecificInitialState(userType)
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                nome: user.nome || '',
                email: user.email || '',
                senha: '', // Don't pre-fill password for security
                ...getTypeSpecificInitialState(userType, user)
            });
        }
    }, [user, userType]);

    function getTypeSpecificInitialState(type, existingUser = null) {
        switch (type) {
            case 'gamer':
                return {
                    nivel: existingUser?.nivel || 1,
                    pontos: existingUser?.pontos || 0,
                    avatar_url: existingUser?.avatar_url || '',
                    bio: existingUser?.bio || ''
                };
            case 'developer':
                return {
                    empresa: existingUser?.empresa || '',
                    cargo: existingUser?.cargo || '',
                    portfolio_url: existingUser?.portfolio_url || '',
                    bio: existingUser?.bio || ''
                };
            case 'investor':
                return {
                    cnpj: existingUser?.cnpj || '',
                    empresa: existingUser?.empresa || '',
                    portfolio_url: existingUser?.portfolio_url || '',
                    bio: existingUser?.bio || ''
                };
            case 'admin':
                return {
                    nivel_acesso: existingUser?.nivel_acesso || 'admin'
                };
            default:
                return {};
        }
    }

    const validateForm = () => {
        const newErrors = {};
        
        // Common validations
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.nome) newErrors.nome = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!user && !formData.senha) newErrors.senha = 'Password is required';
        if (formData.senha && formData.senha.length < 6) {
            newErrors.senha = 'Password must be at least 6 characters';
        }
        if (formData.email && !formData.email.includes('@')) {
            newErrors.email = 'Invalid email format';
        }

        // Type-specific validations
        switch (userType) {
            case 'investor':
                if (!formData.cnpj) newErrors.cnpj = 'CNPJ is required';
                if (formData.cnpj && !/^\d{14}$/.test(formData.cnpj)) {
                    newErrors.cnpj = 'CNPJ must be 14 digits';
                }
                break;
            case 'developer':
                if (!formData.empresa) newErrors.empresa = 'Company is required';
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const renderTypeSpecificFields = () => {
        switch (userType) {
            case 'gamer':
                return (
                    <>
                        <div className="form-group">
                            <label htmlFor="nivel">Level:</label>
                            <input
                                type="number"
                                id="nivel"
                                name="nivel"
                                value={formData.nivel}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pontos">Points:</label>
                            <input
                                type="number"
                                id="pontos"
                                name="pontos"
                                value={formData.pontos}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="avatar_url">Avatar URL:</label>
                            <input
                                type="url"
                                id="avatar_url"
                                name="avatar_url"
                                value={formData.avatar_url}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bio">Bio:</label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>
                    </>
                );
            case 'developer':
                return (
                    <>
                        <div className="form-group">
                            <label htmlFor="empresa">Company:</label>
                            <input
                                type="text"
                                id="empresa"
                                name="empresa"
                                value={formData.empresa}
                                onChange={handleChange}
                                required
                            />
                            {errors.empresa && <span className="error">{errors.empresa}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="cargo">Position:</label>
                            <input
                                type="text"
                                id="cargo"
                                name="cargo"
                                value={formData.cargo}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="portfolio_url">Portfolio URL:</label>
                            <input
                                type="url"
                                id="portfolio_url"
                                name="portfolio_url"
                                value={formData.portfolio_url}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bio">Bio:</label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>
                    </>
                );
            case 'investor':
                return (
                    <>
                        <div className="form-group">
                            <label htmlFor="cnpj">CNPJ:</label>
                            <input
                                type="text"
                                id="cnpj"
                                name="cnpj"
                                value={formData.cnpj}
                                onChange={handleChange}
                                required
                            />
                            {errors.cnpj && <span className="error">{errors.cnpj}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="empresa">Company:</label>
                            <input
                                type="text"
                                id="empresa"
                                name="empresa"
                                value={formData.empresa}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="portfolio_url">Portfolio URL:</label>
                            <input
                                type="url"
                                id="portfolio_url"
                                name="portfolio_url"
                                value={formData.portfolio_url}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bio">Bio:</label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>
                    </>
                );
            case 'admin':
                return (
                    <div className="form-group">
                        <label htmlFor="nivel_acesso">Access Level:</label>
                        <select
                            id="nivel_acesso"
                            name="nivel_acesso"
                            value={formData.nivel_acesso}
                            onChange={handleChange}
                        >
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                        </select>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="user-form">
                <h2>{user ? 'Edit User' : 'Add New User'}</h2>
                
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={!!user}
                    />
                    {errors.username && <span className="error">{errors.username}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="nome">Name:</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                    />
                    {errors.nome && <span className="error">{errors.nome}</span>}
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
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="senha">Password:</label>
                    <input
                        type="password"
                        id="senha"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        required={!user}
                    />
                    {errors.senha && <span className="error">{errors.senha}</span>}
                </div>

                {renderTypeSpecificFields()}

                <div className="form-buttons">
                    <button type="submit" className="submit-button">
                        {user ? 'Update User' : 'Add User'}
                    </button>
                    <button type="button" className="cancel-button" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UserForm; 
