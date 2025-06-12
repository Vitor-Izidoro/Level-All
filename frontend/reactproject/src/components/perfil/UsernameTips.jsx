import React from 'react';

// Componente para mostrar dicas sobre nome de usuário
const UsernameTips = () => {
  return (
    <div style={{ 
      padding: "10px", 
      backgroundColor: "#f8f9fa", 
      borderRadius: "4px", 
      marginTop: "5px",
      fontSize: "0.85rem",
      border: "1px solid #e9ecef"
    }}>
      <p style={{ margin: "0 0 5px 0", fontWeight: "bold", color: "#495057" }}>Dicas para o nome de usuário:</p>
      <ul style={{ margin: "0", paddingLeft: "20px", color: "#495057" }}>
        <li>Use pelo menos 3 caracteres</li>
        <li>Escolha um nome único e fácil de lembrar</li>
        <li>Evite caracteres especiais complexos</li>
        <li>Se o nome de usuário for alterado, você precisará usar o novo nome para fazer login</li>
      </ul>
    </div>
  );
};

export default UsernameTips;
