/**
 * Secret Santa assignment model
 */
export interface ISecretSantaAssignment {
  id?: string;
  employeeName: string;
  employeeEmailId: string;
  secretChildName: string;
  secretChildEmailId: string;
  year?: number;
}

export class SecretSantaAssignment implements ISecretSantaAssignment {
  id: string;
  employeeName: string;
  employeeEmailId: string;
  secretChildName: string;
  secretChildEmailId: string;
  year: number;

  constructor(
    employeeName: string,
    employeeEmailId: string,
    secretChildName: string,
    secretChildEmailId: string,
    year: number = new Date().getFullYear(),
    id?: string
  ) {
    if (!employeeName || !employeeEmailId || !secretChildName || !secretChildEmailId) {
      throw new Error('All assignment fields are required');
    }

    this.id = id || this.generateId();
    this.employeeName = employeeName;
    this.employeeEmailId = employeeEmailId;
    this.secretChildName = secretChildName;
    this.secretChildEmailId = secretChildEmailId;
    this.year = year;
  }

  private generateId(): string {
    return `assign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toJSON(): ISecretSantaAssignment {
    return {
      id: this.id,
      employeeName: this.employeeName,
      employeeEmailId: this.employeeEmailId,
      secretChildName: this.secretChildName,
      secretChildEmailId: this.secretChildEmailId,
      year: this.year,
    };
  }
}
