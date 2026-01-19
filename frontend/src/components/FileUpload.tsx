import React, { useState, useRef } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  onFilesSelected: (employeesFile: File, previousFile?: File) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, isLoading }) => {
  const [selectedEmployeesFile, setSelectedEmployeesFile] = useState<File | null>(null);
  const [selectedPreviousFile, setSelectedPreviousFile] = useState<File | null>(null);
  const employeesInputRef = useRef<HTMLInputElement>(null);
  const previousInputRef = useRef<HTMLInputElement>(null);

  const handleEmployeesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setSelectedEmployeesFile(files[0]);
    }
  };

  const handlePreviousChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setSelectedPreviousFile(files[0]);
    }
  };

  const handleGenerateClick = () => {
    if (selectedEmployeesFile) {
      onFilesSelected(selectedEmployeesFile, selectedPreviousFile || undefined);
    }
  };

  const handleClearEmployees = () => {
    setSelectedEmployeesFile(null);
    if (employeesInputRef.current) {
      employeesInputRef.current.value = '';
    }
  };

  const handleClearPrevious = () => {
    setSelectedPreviousFile(null);
    if (previousInputRef.current) {
      previousInputRef.current.value = '';
    }
  };

  return (
    <div className="file-upload-container">
      <h1>🎁 Secret Santa Game</h1>
      <p className="subtitle">Generate random Secret Santa assignments for your company</p>

      <div className="upload-section">
        <div className="file-input-group">
          <label htmlFor="employees-file" className="file-label">
            <span className="required">*</span> Employees CSV File
          </label>
          <p className="help-text">
            Upload a CSV file with columns: Employee_Name, Employee_EmailID
          </p>

          <div className="file-input-wrapper">
            <input
              id="employees-file"
              ref={employeesInputRef}
              type="file"
              accept=".csv"
              onChange={handleEmployeesChange}
              disabled={isLoading}
              className="file-input"
            />
            <label htmlFor="employees-file" className="file-input-button">
              Choose Employees File
            </label>
          </div>

          {selectedEmployeesFile && (
            <div className="file-selected">
              <span className="file-name">✓ {selectedEmployeesFile.name}</span>
              <button
                className="clear-button"
                onClick={handleClearEmployees}
                disabled={isLoading}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="file-input-group">
          <label htmlFor="previous-file" className="file-label">
            <span className="optional">(Optional)</span> Previous Year CSV File
          </label>
          <p className="help-text">
            Upload previous assignments to avoid repeating assignments
          </p>

          <div className="file-input-wrapper">
            <input
              id="previous-file"
              ref={previousInputRef}
              type="file"
              accept=".csv"
              onChange={handlePreviousChange}
              disabled={isLoading}
              className="file-input"
            />
            <label htmlFor="previous-file" className="file-input-button">
              Choose Previous File
            </label>
          </div>

          {selectedPreviousFile && (
            <div className="file-selected">
              <span className="file-name">✓ {selectedPreviousFile.name}</span>
              <button
                className="clear-button"
                onClick={handleClearPrevious}
                disabled={isLoading}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <button
          className={`generate-button ${!selectedEmployeesFile ? 'disabled' : ''} ${
            isLoading ? 'loading' : ''
          }`}
          onClick={handleGenerateClick}
          disabled={!selectedEmployeesFile || isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Assignments'}
        </button>
      </div>

      <div className="example-section">
        <h3>CSV File Format Example:</h3>
        <pre>
          <code>
{`Employee_Name,Employee_EmailID
John Doe,john.doe@acme.com
Jane Smith,jane.smith@acme.com
Bob Johnson,bob.johnson@acme.com`}
          </code>
        </pre>
      </div>
    </div>
  );
};
