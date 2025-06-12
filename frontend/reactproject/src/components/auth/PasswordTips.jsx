import React from 'react';

// Componente para mostrar dicas de senha forte
const PasswordTips = () => {
  return (
    <div style={{ 
      padding: "10px", 
      backgroundColor: "#f5f5f5", 
      borderRadius: "4px", 
      marginTop: "5px",
      fontSize: "0.85rem" 
    }}>
      <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>Dicas para uma senha forte:</p>
      <ul style={{ margin: "0", paddingLeft: "20px" }}>
        <li>Use pelo menos 8 caracteres</li>
        <li>Combine letras maiúsculas e minúsculas</li>
        <li>Inclua números e caracteres especiais (ex: @, #, $, %)</li>
        <li>Evite informações pessoais óbvias</li>
      </ul>
    </div>
  );
};

export default PasswordTips;
