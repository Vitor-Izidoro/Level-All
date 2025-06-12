import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Componente para proteger rotas que exigem autenticação
const RotaProtegida = ({ children }) => {
  const { autenticado, carregando } = useAuth();
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Se não estiver autenticado e não estiver carregando, mostra o alerta
    if (!autenticado && !carregando) {
      setMostrarAlerta(true);
      // Esconde o alerta após 3 segundos
      const timer = setTimeout(() => {
        setMostrarAlerta(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [autenticado, carregando]);

  // Se ainda estiver carregando, exibe um indicador de loading 
  if (carregando) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '20px' }}>Carregando...</div>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '5px solid #a48ad4',
          borderRadius: '50%',
          borderTopColor: 'transparent',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login com alerta
  if (!autenticado) {
    return (
      <>
        {mostrarAlerta && (
          <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '10px 20px',
            borderRadius: '5px',
            zIndex: 1000,
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}>
            Você precisa estar logado para acessar esta página.
          </div>
        )}
        <Navigate to="/login" state={{ from: location }} replace />
      </>
    );
  }

  // Se estiver autenticado, renderiza o conteúdo da rota
  return children;
};

export default RotaProtegida;
