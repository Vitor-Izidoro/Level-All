import React from 'react';

// Componente para exibir uma mensagem de erro
const ErrorMessage = ({ message }) => {
  return (
    <div style={{ 
      padding: "15px", 
      backgroundColor: "#ffebee", 
      color: "#c62828", 
      borderRadius: "4px", 
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <div style={{ marginRight: "10px" }}>❌</div>
      <div>{message}</div>
    </div>
  );
};

export default ErrorMessage;
