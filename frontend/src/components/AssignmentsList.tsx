import React, { useState } from 'react';
import { Assignment } from '../types';
import './AssignmentsList.css';

interface AssignmentsListProps {
  assignments: Assignment[];
}

export const AssignmentsList: React.FC<AssignmentsListProps> = ({ assignments }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="assignments-container">
      <h2>Generated Assignments</h2>
      <p className="assignment-count">Total: {assignments.length} employees</p>

      <div className="assignments-grid">
        {assignments.map((assignment) => (
          <div
            key={assignment.id || assignment.employeeEmailId}
            className="assignment-card"
            onClick={() =>
              setExpandedId(
                expandedId === assignment.id ? null : assignment.id || null
              )
            }
          >
            <div className="assignment-header">
              <h3>{assignment.employeeName}</h3>
              <span className="email-badge">{assignment.employeeEmailId}</span>
            </div>

            <div className="assignment-arrow">→ Secret Child →</div>

            <div className="assignment-child">
              <h4>{assignment.secretChildName}</h4>
              <span className="email-badge">{assignment.secretChildEmailId}</span>
            </div>

            {expandedId === assignment.id && (
              <div className="assignment-details">
                <p>
                  <strong>{assignment.employeeName}</strong> will give a gift to{' '}
                  <strong>{assignment.secretChildName}</strong>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
