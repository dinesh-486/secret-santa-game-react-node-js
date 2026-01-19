/**
 * Type definitions for API responses
 */

export interface Assignment {
  id?: string;
  employeeName: string;
  employeeEmailId: string;
  secretChildName: string;
  secretChildEmailId: string;
  year?: number;
}

export interface GenerateResponse {
  success: boolean;
  message: string;
  assignmentCount: number;
  assignments: Assignment[];
  downloadUrl: string;
}

export interface ErrorResponse {
  error: string;
}
