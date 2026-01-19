import { Employee } from '../models/Employee';
import { SecretSantaAssignment, ISecretSantaAssignment } from '../models/SecretSantaAssignment';

/**
 * Service for assigning secret children to employees
 * Implements the Secret Santa assignment algorithm using derangement
 * A derangement is a permutation where no element appears in its original position
 */
export class SecretSantaAssigner {
  private static readonly MAX_ATTEMPTS = 1000;

  /**
   * Assign secret children to employees based on constraints
   * Uses a backtracking algorithm with constraint satisfaction
   * @param employees List of employees
   * @param previousAssignments Previous year's assignments (optional)
   * @returns List of secret santa assignments
   * @throws Error if assignment is impossible
   */
  public assignSecretChildren(
    employees: Employee[],
    previousAssignments: ISecretSantaAssignment[] = []
  ): SecretSantaAssignment[] {
    this.validateInput(employees);

    const previousMap = this.createPreviousAssignmentMap(previousAssignments);
    const availableReceivers = new Map<string, Set<string>>(
      this.initializeAvailableReceivers(employees, previousMap)
    );

    const result: SecretSantaAssignment[] = [];
    const givers = [...employees];

    // Attempt to find a valid assignment
    if (this.backtrackAssignment(givers, 0, availableReceivers, result)) {
      return result;
    }

    // If backtracking fails, try random attempts
    return this.randomAssignment(employees, previousMap);
  }

  /**
   * Backtracking algorithm for constraint satisfaction
   */
  private backtrackAssignment(
    givers: Employee[],
    index: number,
    availableReceivers: Map<string, Set<string>>,
    result: SecretSantaAssignment[]
  ): boolean {
    // Base case: all givers have been assigned
    if (index === givers.length) {
      return true;
    }

    const giver = givers[index];
    const possibleReceivers = availableReceivers.get(giver.emailId) || new Set();

    // Try each possible receiver
    for (const receiverEmail of possibleReceivers) {
      // Find the receiver employee
      const receiver = givers.find((e) => e.emailId === receiverEmail);
      if (!receiver) continue;

      // Make assignment
      result.push(
        new SecretSantaAssignment(
          giver.name,
          giver.emailId,
          receiver.name,
          receiver.emailId
        )
      );

      // Remove this receiver from available receivers for all other givers
      const backupAvailable = new Map<string, Set<string>>();
      for (const [key, value] of availableReceivers) {
        backupAvailable.set(key, new Set(value));
      }

      for (const [, receivers] of availableReceivers) {
        receivers.delete(receiverEmail);
      }

      // Check if next giver has valid options
      if (index + 1 < givers.length) {
        const nextGiver = givers[index + 1];
        const nextReceivers = availableReceivers.get(nextGiver.emailId);
        if (!nextReceivers || nextReceivers.size === 0) {
          // Backtrack
          result.pop();
          for (const [key, value] of backupAvailable) {
            availableReceivers.set(key, value);
          }
          continue;
        }
      }

      // Recurse
      if (this.backtrackAssignment(givers, index + 1, availableReceivers, result)) {
        return true;
      }

      // Backtrack
      result.pop();
      for (const [key, value] of backupAvailable) {
        availableReceivers.set(key, value);
      }
    }

    return false;
  }

  /**
   * Random assignment algorithm with retries
   */
  private randomAssignment(
    employees: Employee[],
    previousMap: Map<string, string>
  ): SecretSantaAssignment[] {
    for (let attempt = 0; attempt < SecretSantaAssigner.MAX_ATTEMPTS; attempt++) {
      const shuffled = this.shuffleArray([...employees]);
      const assignments: SecretSantaAssignment[] = [];
      let valid = true;

      for (let i = 0; i < employees.length; i++) {
        const giver = employees[i];
        const receiver = shuffled[i];

        // Check constraints
        if (
          receiver.emailId === giver.emailId ||
          previousMap.get(giver.emailId) === receiver.emailId
        ) {
          valid = false;
          break;
        }

        assignments.push(
          new SecretSantaAssignment(
            giver.name,
            giver.emailId,
            receiver.name,
            receiver.emailId
          )
        );
      }

      if (valid) {
        return assignments;
      }
    }

    throw new Error(
      'Unable to generate valid Secret Santa assignments after multiple attempts. ' +
        'The constraints may be impossible to satisfy.'
    );
  }

  /**
   * Initialize available receivers for each giver
   */
  private initializeAvailableReceivers(
    employees: Employee[],
    previousMap: Map<string, string>
  ): Map<string, Set<string>> {
    const available = new Map<string, Set<string>>();

    for (const giver of employees) {
      const receiverSet = new Set<string>();
      for (const receiver of employees) {
        // Cannot assign to self
        if (receiver.emailId === giver.emailId) {
          continue;
        }
        // Cannot assign same as previous year
        if (previousMap.get(giver.emailId) === receiver.emailId) {
          continue;
        }
        receiverSet.add(receiver.emailId);
      }
      available.set(giver.emailId, receiverSet);
    }

    return available;
  }

  /**
   * Create a map of previous assignments for quick lookup
   */
  private createPreviousAssignmentMap(assignments: ISecretSantaAssignment[]): Map<string, string> {
    const map = new Map<string, string>();
    for (const assignment of assignments) {
      map.set(assignment.employeeEmailId, assignment.secretChildEmailId);
    }
    return map;
  }

  /**
   * Fisher-Yates shuffle algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Validate input
   */
  private validateInput(employees: Employee[]): void {
    if (!employees || employees.length === 0) {
      throw new Error('At least one employee is required');
    }

    if (employees.length === 1) {
      throw new Error('At least two employees are required for Secret Santa');
    }

    // Check for duplicate emails
    const emailSet = new Set<string>();
    for (const emp of employees) {
      if (emailSet.has(emp.emailId)) {
        throw new Error(`Duplicate email found: ${emp.emailId}`);
      }
      emailSet.add(emp.emailId);
    }
  }
}
