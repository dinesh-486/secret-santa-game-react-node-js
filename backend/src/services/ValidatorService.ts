/**
 * Service for validating data
 */
export class ValidatorService {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Validate name format
   */
  static isValidName(name: string): boolean {
    const trimmed = name.trim();
    return trimmed.length >= 2 && trimmed.length <= 100;
  }

  /**
   * Validate CSV file structure
   */
  static validateEmployeesData(
    data: Record<string, string>[]
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data || data.length === 0) {
      return { valid: false, errors: ['No employees found in file'] };
    }

    if (data.length < 2) {
      return { valid: false, errors: ['At least 2 employees required'] };
    }

    const emailSet = new Set<string>();

    data.forEach((row, index) => {
      const name = row['Employee_Name'];
      const email = row['Employee_EmailID'];

      if (!name || !name.trim()) {
        errors.push(`Row ${index + 1}: Employee name is required`);
      } else if (!this.isValidName(name)) {
        errors.push(`Row ${index + 1}: Employee name must be between 2 and 100 characters`);
      }

      if (!email || !email.trim()) {
        errors.push(`Row ${index + 1}: Email is required`);
      } else if (!this.isValidEmail(email)) {
        errors.push(`Row ${index + 1}: Invalid email format: ${email}`);
      } else {
        const trimmedEmail = email.trim().toLowerCase();
        if (emailSet.has(trimmedEmail)) {
          errors.push(`Row ${index + 1}: Duplicate email: ${email}`);
        }
        emailSet.add(trimmedEmail);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
