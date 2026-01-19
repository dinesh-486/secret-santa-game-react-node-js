import { Employee } from '../src/models/Employee';

describe('Employee Model', () => {
  describe('constructor', () => {
    it('should create a valid employee', () => {
      const employee = new Employee('John Doe', 'john@acme.com');
      expect(employee.name).toBe('John Doe');
      expect(employee.emailId).toBe('john@acme.com');
      expect(employee.id).toBeDefined();
    });

    it('should trim whitespace from name and email', () => {
      const employee = new Employee('  Jane Doe  ', '  jane@acme.com  ');
      expect(employee.name).toBe('Jane Doe');
      expect(employee.emailId).toBe('jane@acme.com');
    });

    it('should generate a unique ID', () => {
      const emp1 = new Employee('John', 'john@acme.com');
      const emp2 = new Employee('Jane', 'jane@acme.com');
      expect(emp1.id).not.toBe(emp2.id);
    });

    it('should use provided ID if given', () => {
      const employee = new Employee('John', 'john@acme.com', 'custom-id');
      expect(employee.id).toBe('custom-id');
    });

    it('should throw error for empty name', () => {
      expect(() => new Employee('', 'john@acme.com')).toThrow('Employee name is required');
      expect(() => new Employee('   ', 'john@acme.com')).toThrow('Employee name is required');
    });

    it('should throw error for empty email', () => {
      expect(() => new Employee('John', '')).toThrow('Employee email is required');
      expect(() => new Employee('John', '   ')).toThrow('Employee email is required');
    });

    it('should throw error for invalid email format', () => {
      expect(() => new Employee('John', 'invalid-email')).toThrow('Invalid email format');
      expect(() => new Employee('John', 'invalid@')).toThrow('Invalid email format');
      expect(() => new Employee('John', '@domain.com')).toThrow('Invalid email format');
    });
  });

  describe('toJSON', () => {
    it('should return JSON representation', () => {
      const employee = new Employee('John Doe', 'john@acme.com', 'emp-001');
      const json = employee.toJSON();

      expect(json.name).toBe('John Doe');
      expect(json.emailId).toBe('john@acme.com');
      expect(json.id).toBe('emp-001');
    });
  });
});
