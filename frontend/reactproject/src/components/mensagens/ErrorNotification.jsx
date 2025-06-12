import { useEffect } from 'react';
import './ChatApp.css';

function ErrorNotification({ error, onDismiss, onRetry }) {
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => onDismiss(), 5000);
    return () => clearTimeout(timer);
  }, [error, onDismiss]);

  if (!error) return null;

  return (
    <div className="error-notification">
      <div>
        <strong>Ops! Algo deu errado</strong>
        <div className="error-details">{error}</div>
      </div>
      <div className="error-actions">
        <button 
          onClick={onDismiss} 
          aria-label="Fechar notificação"
          className="error-action-btn"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default ErrorNotification;