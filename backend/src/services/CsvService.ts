import fs from 'fs';
import csv from 'csv-parser';
import { Employee } from '../models/Employee';
import { SecretSantaAssignment, ISecretSantaAssignment } from '../models/SecretSantaAssignment';

/**
 * Service for parsing and writing CSV files
 */
export class CsvService {
  /**
   * Parse employees from CSV file
   * Expected columns: Employee_Name, Employee_EmailID
   */
  async parseEmployeesFromCsv(filePath: string): Promise<Employee[]> {
    return new Promise((resolve, reject) => {
      const employees: Employee[] = [];
      const errors: string[] = [];
      let rowNumber = 0;

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          rowNumber++;
          try {
            const name = this.getColumnValue(row, 'Employee_Name', rowNumber);
            const emailId = this.getColumnValue(row, 'Employee_EmailID', rowNumber);

            const employee = new Employee(name, emailId);
            employees.push(employee);
          } catch (error) {
            errors.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : String(error)}`);
          }
        })
        .on('end', () => {
          if (errors.length > 0) {
            reject(new Error(`CSV parsing errors:\n${errors.join('\n')}`));
          } else if (employees.length === 0) {
            reject(new Error('No valid employees found in CSV file'));
          } else {
            // Check for duplicate emails
            const emailSet = new Set<string>();
            for (const emp of employees) {
              if (emailSet.has(emp.emailId)) {
                errors.push(`Duplicate email found: ${emp.emailId}`);
              }
              emailSet.add(emp.emailId);
            }

            if (errors.length > 0) {
              reject(new Error(`Validation errors:\n${errors.join('\n')}`));
            } else {
              resolve(employees);
            }
          }
        })
        .on('error', (error) => {
          reject(new Error(`Failed to read CSV file: ${error.message}`));
        });
    });
  }

  /**
   * Parse previous year's assignments from CSV
   */
  async parsePreviousAssignmentsFromCsv(filePath: string): Promise<ISecretSantaAssignment[]> {
    return new Promise((resolve, reject) => {
      const assignments: ISecretSantaAssignment[] = [];
      const errors: string[] = [];
      let rowNumber = 0;

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          rowNumber++;
          try {
            const employeeName = this.getColumnValue(row, 'Employee_Name', rowNumber);
            const employeeEmailId = this.getColumnValue(row, 'Employee_EmailID', rowNumber);
            const secretChildName = this.getColumnValue(row, 'Secret_Child_Name', rowNumber);
            const secretChildEmailId = this.getColumnValue(row, 'Secret_Child_EmailID', rowNumber);

            const assignment = new SecretSantaAssignment(
              employeeName,
              employeeEmailId,
              secretChildName,
              secretChildEmailId
            );
            assignments.push(assignment);
          } catch (error) {
            errors.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : String(error)}`);
          }
        })
        .on('end', () => {
          if (errors.length > 0) {
            // Log errors but don't fail - previous assignments are optional
            console.warn(`Warnings parsing previous assignments:\n${errors.join('\n')}`);
          }
          resolve(assignments);
        })
        .on('error', (error) => {
          reject(new Error(`Failed to read previous assignments CSV: ${error.message}`));
        });
    });
  }

  /**
   * Write assignments to CSV file
   */
  async writeAssignmentsToCsv(
    assignments: SecretSantaAssignment[],
    outputPath: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (assignments.length === 0) {
          reject(new Error('No assignments to write'));
          return;
        }

        const headers = [
          'Employee_Name',
          'Employee_EmailID',
          'Secret_Child_Name',
          'Secret_Child_EmailID',
        ];

        const csvContent = [
          headers.join(','),
          ...assignments.map((assignment) =>
            [
              this.escapeCsvField(assignment.employeeName),
              this.escapeCsvField(assignment.employeeEmailId),
              this.escapeCsvField(assignment.secretChildName),
              this.escapeCsvField(assignment.secretChildEmailId),
            ].join(',')
          ),
        ].join('\n');

        fs.writeFileSync(outputPath, csvContent, 'utf-8');
        resolve();
      } catch (error) {
        reject(new Error(`Failed to write CSV file: ${error instanceof Error ? error.message : String(error)}`));
      }
    });
  }

  /**
   * Get column value from row, checking multiple possible column name formats
   */
  private getColumnValue(row: Record<string, string>, columnName: string, rowNumber: number): string {
    // Try exact match first
    if (row[columnName] !== undefined) {
      return row[columnName];
    }

    // Try lowercase version
    const lowerKey = Object.keys(row).find(
      (key) => key.toLowerCase() === columnName.toLowerCase()
    );

    if (lowerKey) {
      return row[lowerKey];
    }

    throw new Error(`Missing required column: ${columnName}`);
  }

  /**
   * Escape CSV field values
   */
  private escapeCsvField(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
