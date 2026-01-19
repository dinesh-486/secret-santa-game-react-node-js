import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { AssignmentsList } from './components/AssignmentsList';
import { ErrorAlert } from './components/ErrorAlert';
import { SuccessAlert } from './components/SuccessAlert';
import secretSantaService from './services/api';
import { Assignment } from './types';
import './App.css';

function App() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [assignmentCount, setAssignmentCount] = useState(0);

  const handleFilesSelected = async (
    employeesFile: File,
    previousFile?: File
  ) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await secretSantaService.generateAssignments(
        employeesFile,
        previousFile
      );

      setAssignments(response.assignments);
      setDownloadUrl(response.downloadUrl);
      setAssignmentCount(response.assignmentCount);
      setSuccess(response.message);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setAssignments([]);
      setDownloadUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      secretSantaService.downloadAssignments(downloadUrl);
    }
  };

  return (
    <div className="app">
      {!assignments.length ? (
        <FileUpload onFilesSelected={handleFilesSelected} isLoading={isLoading} />
      ) : (
        <>
          <AssignmentsList assignments={assignments} />
          <div className="actions">
            <button className="download-button" onClick={handleDownload}>
              📥 Download CSV
            </button>
            <button
              className="reset-button"
              onClick={() => {
                setAssignments([]);
                setDownloadUrl(null);
                setSuccess(null);
                setError(null);
              }}
            >
              ← Generate New Assignments
            </button>
          </div>
        </>
      )}

      {error && (
        <ErrorAlert
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {success && (
        <SuccessAlert
          message={success}
          assignmentCount={assignmentCount}
          onClose={() => setSuccess(null)}
        />
      )}
    </div>
  );
}

export default App;
