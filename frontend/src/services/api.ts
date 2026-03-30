import axios, { AxiosError } from 'axios';
import { GenerateResponse, ErrorResponse } from '../types';

const API_BASE = '/api';

class SecretSantaService {
  /**
   * Generate secret santa assignments
   */
  async generateAssignments(
    employeesFile: File,
    previousAssignmentsFile?: File
  ): Promise<GenerateResponse> {
    const formData = new FormData();
    formData.append('employees', employeesFile);

    if (previousAssignmentsFile) {
      formData.append('previousAssignments', previousAssignmentsFile);
    }

    try {
      const response = await axios.post<GenerateResponse>(
        `${API_BASE}/assignments/generate`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(
        axiosError.response?.data?.error || 'Failed to generate assignments'
      );
    }
  }

  /**
   * Download assignment CSV file
   */
  downloadAssignments(downloadUrl: string): void {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'secret-santa-assignments.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default new SecretSantaService();
