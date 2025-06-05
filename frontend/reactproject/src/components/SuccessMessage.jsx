import React from 'react';

// Componente para exibir uma mensagem de sucesso
const SuccessMessage = ({ message }) => {
  return (
    <div style={{ 
      padding: "15px", 
      backgroundColor: "#e8f5e9", 
      color: "#2e7d32", 
      borderRadius: "4px", 
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <div style={{ marginRight: "10px" }}>✅</div>
      <div>{message}</div>
    </div>
  );
};

export default SuccessMessage;
