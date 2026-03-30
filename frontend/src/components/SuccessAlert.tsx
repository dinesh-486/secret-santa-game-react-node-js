import React from 'react';
import './SuccessAlert.css';

interface SuccessAlertProps {
  message: string;
  assignmentCount: number;
  onClose: () => void;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({
  message,
  assignmentCount,
  onClose,
}) => {
  return (
    <div className="success-alert">
      <div className="success-content">
        <span className="success-icon">✅</span>
        <div className="success-message">
          <h3>Success!</h3>
          <p>{message}</p>
          <p className="assignment-count">
            Generated assignments for {assignmentCount} employees
          </p>
        </div>
        <button className="success-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
};
