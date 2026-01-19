import { SecretSantaAssigner } from '../src/services/SecretSantaAssigner';
import { Employee } from '../src/models/Employee';

describe('SecretSantaAssigner Service', () => {
  let assigner: SecretSantaAssigner;

  beforeEach(() => {
    assigner = new SecretSantaAssigner();
  });

  describe('assignSecretChildren', () => {
    it('should throw error for empty employee list', () => {
      expect(() => assigner.assignSecretChildren([])).toThrow(
        'At least one employee is required'
      );
    });

    it('should throw error for single employee', () => {
      const employees = [new Employee('John', 'john@acme.com')];
      expect(() => assigner.assignSecretChildren(employees)).toThrow(
        'At least two employees are required'
      );
    });

    it('should assign two employees correctly', () => {
      const employees = [
        new Employee('John', 'john@acme.com'),
        new Employee('Jane', 'jane@acme.com'),
      ];

      const assignments = assigner.assignSecretChildren(employees);

      expect(assignments).toHaveLength(2);
      // Each employee should be assigned to someone
      assignments.forEach((assignment) => {
        expect(assignment.employeeName).toBeDefined();
        expect(assignment.secretChildName).toBeDefined();
        // Cannot assign to themselves
        expect(assignment.employeeEmailId).not.toBe(assignment.secretChildEmailId);
      });
    });

    it('should assign multiple employees without self-assignment', () => {
      const employees = [
        new Employee('Alice', 'alice@acme.com'),
        new Employee('Bob', 'bob@acme.com'),
        new Employee('Charlie', 'charlie@acme.com'),
        new Employee('Diana', 'diana@acme.com'),
      ];

      const assignments = assigner.assignSecretChildren(employees);

      expect(assignments).toHaveLength(4);

      // Verify no self-assignments
      assignments.forEach((assignment) => {
        expect(assignment.employeeEmailId).not.toBe(assignment.secretChildEmailId);
      });

      // Verify each employee appears exactly once as giver
      const giverEmails = assignments.map((a) => a.employeeEmailId);
      expect(new Set(giverEmails).size).toBe(4);

      // Verify each employee appears exactly once as receiver
      const receiverEmails = assignments.map((a) => a.secretChildEmailId);
      expect(new Set(receiverEmails).size).toBe(4);
    });

    it('should respect previous year assignments', () => {
      const employees = [
        new Employee('Alice', 'alice@acme.com'),
        new Employee('Bob', 'bob@acme.com'),
        new Employee('Charlie', 'charlie@acme.com'),
      ];

      const previousAssignments = [
        {
          employeeName: 'Alice',
          employeeEmailId: 'alice@acme.com',
          secretChildName: 'Bob',
          secretChildEmailId: 'bob@acme.com',
        },
      ];

      const assignments = assigner.assignSecretChildren(employees, previousAssignments);

      expect(assignments).toHaveLength(3);

      // Alice should not be assigned to Bob this year
      const aliceAssignment = assignments.find((a) => a.employeeEmailId === 'alice@acme.com');
      expect(aliceAssignment?.secretChildEmailId).not.toBe('bob@acme.com');
    });

    it('should generate valid derangement with constraints', () => {
      const employees = [
        new Employee('E1', 'e1@acme.com'),
        new Employee('E2', 'e2@acme.com'),
        new Employee('E3', 'e3@acme.com'),
        new Employee('E4', 'e4@acme.com'),
        new Employee('E5', 'e5@acme.com'),
      ];

      // Run multiple times to ensure consistency
      for (let i = 0; i < 5; i++) {
        const assignments = assigner.assignSecretChildren(employees);

        // Each employee assigned exactly once as giver
        expect(
          new Set(assignments.map((a) => a.employeeEmailId)).size
        ).toBe(employees.length);

        // Each employee assigned exactly once as receiver
        expect(
          new Set(assignments.map((a) => a.secretChildEmailId)).size
        ).toBe(employees.length);

        // No self-assignments
        assignments.forEach((a) => {
          expect(a.employeeEmailId).not.toBe(a.secretChildEmailId);
        });
      }
    });
  });
});
