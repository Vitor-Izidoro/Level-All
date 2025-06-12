import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config/api';

const ServerStatus = () => {
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'online', 'offline'
  
  useEffect(() => {    const checkServerStatus = async () => {
      try {
        // Usando AbortController para implementar timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        // Primeiro tenta a rota de saúde mais leve
        const healthResponse = await fetch(`${API_URL}/health`, { 
          mode: 'cors',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (healthResponse.ok) {
          setServerStatus('online');
          return; // Se o servidor estiver online, não precisamos verificar o banco de dados
        }
        
        // Se a rota de saúde falhar, tenta a rota do banco de dados como backup
        const dbController = new AbortController();
        const dbTimeoutId = setTimeout(() => dbController.abort(), 3000);
        
        const dbResponse = await fetch(`${API_URL}/test-db`, {
          mode: 'cors',
          signal: dbController.signal
        });
        
        clearTimeout(dbTimeoutId);
        
        if (dbResponse.ok) {
          setServerStatus('online');
        } else {
          setServerStatus('offline');
        }
      } catch (error) {
        console.error('Erro ao verificar servidor:', error);
        setServerStatus('offline');
      }
    };

    checkServerStatus();
    
    // Verificar o status do servidor a cada 30 segundos
    const interval = setInterval(checkServerStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (serverStatus === 'checking') {
    return null; // Não mostrar nada enquanto verifica
  }
  
  if (serverStatus === 'online') {
    return null; // Não mostrar nada quando online
  }
  
  // Mostrar aviso quando offline
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '10px 15px',
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      <div style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: '#dc3545',
      }}></div>
      Servidor offline. O sistema pode não funcionar corretamente.
    </div>
  );
};

export default ServerStatus;
