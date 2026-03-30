/**
 * Employee model representing an employee in the Secret Santa game
 */
export interface IEmployee {
  id?: string;
  name: string;
  emailId: string;
}

export class Employee implements IEmployee {
  id: string;
  name: string;
  emailId: string;

  constructor(name: string, emailId: string, id?: string) {
    if (!name || name.trim() === '') {
      throw new Error('Employee name is required');
    }
    if (!emailId || emailId.trim() === '') {
      throw new Error('Employee email is required');
    }

    const trimmedName = name.trim();
    const trimmedEmail = emailId.trim();

    if (!this.isValidEmail(trimmedEmail)) {
      throw new Error(`Invalid email format: ${trimmedEmail}`);
    }

    this.name = trimmedName;
    this.emailId = trimmedEmail;
    this.id = id || this.generateId();
  }

  private generateId(): string {
    return `emp_${this.emailId.split('@')[0]}_${Date.now()}`;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toJSON(): IEmployee {
    return {
      id: this.id,
      name: this.name,
      emailId: this.emailId,
    };
  }
}
