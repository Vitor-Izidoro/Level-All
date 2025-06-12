import React from 'react';

// Componente modal de confirmação
const ConfirmModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#3a3341',
        padding: '20px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
      }}>
        <h3 style={{ marginTop: 0 }}>Confirmação</h3>
        <p>{message || "Deseja salvar as alterações?"}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 15px",
              backgroundColor: "#e0e0e0",
              color: "#333",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 15px",
              backgroundColor: "#673ab7",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
