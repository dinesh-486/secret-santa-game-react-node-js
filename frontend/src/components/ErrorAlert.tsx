import React from 'react';
import './ErrorAlert.css';

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss }) => {
  return (
    <div className="error-alert">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <div className="error-message">
          <h3>Error</h3>
          <p>{message}</p>
        </div>
        <button className="error-close" onClick={onDismiss}>
          ✕
        </button>
      </div>
    </div>
  );
};
