import { SecretSantaAssignment } from '../src/models/SecretSantaAssignment';

describe('SecretSantaAssignment Model', () => {
  describe('constructor', () => {
    it('should create a valid assignment', () => {
      const assignment = new SecretSantaAssignment(
        'John Doe',
        'john@acme.com',
        'Jane Doe',
        'jane@acme.com'
      );

      expect(assignment.employeeName).toBe('John Doe');
      expect(assignment.employeeEmailId).toBe('john@acme.com');
      expect(assignment.secretChildName).toBe('Jane Doe');
      expect(assignment.secretChildEmailId).toBe('jane@acme.com');
      expect(assignment.id).toBeDefined();
      expect(assignment.year).toBe(new Date().getFullYear());
    });

    it('should accept custom year', () => {
      const assignment = new SecretSantaAssignment(
        'John',
        'john@acme.com',
        'Jane',
        'jane@acme.com',
        2023
      );
      expect(assignment.year).toBe(2023);
    });

    it('should use provided ID if given', () => {
      const assignment = new SecretSantaAssignment(
        'John',
        'john@acme.com',
        'Jane',
        'jane@acme.com',
        2024,
        'custom-assign-id'
      );
      expect(assignment.id).toBe('custom-assign-id');
    });

    it('should throw error if any field is missing', () => {
      expect(() => new SecretSantaAssignment('', 'john@acme.com', 'Jane', 'jane@acme.com'))
        .toThrow('All assignment fields are required');
      expect(() => new SecretSantaAssignment('John', '', 'Jane', 'jane@acme.com'))
        .toThrow('All assignment fields are required');
      expect(() => new SecretSantaAssignment('John', 'john@acme.com', '', 'jane@acme.com'))
        .toThrow('All assignment fields are required');
      expect(() => new SecretSantaAssignment('John', 'john@acme.com', 'Jane', ''))
        .toThrow('All assignment fields are required');
    });
  });

  describe('toJSON', () => {
    it('should return JSON representation', () => {
      const assignment = new SecretSantaAssignment(
        'John Doe',
        'john@acme.com',
        'Jane Doe',
        'jane@acme.com',
        2024,
        'assign-001'
      );

      const json = assignment.toJSON();
      expect(json.id).toBe('assign-001');
      expect(json.employeeName).toBe('John Doe');
      expect(json.employeeEmailId).toBe('john@acme.com');
      expect(json.secretChildName).toBe('Jane Doe');
      expect(json.secretChildEmailId).toBe('jane@acme.com');
      expect(json.year).toBe(2024);
    });
  });
});
