import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { appRouter } from '../routers';
import type { TrpcContext } from '../_core/context';
import { getDb } from '../db';
const db = getDb();
import { students, cohorts } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

function createTestContext(): TrpcContext {
  return {
    user: {
      id: 1,
      email: 'admin@test.com',
      name: 'Admin User',
      role: 'admin',
      openId: 'test_admin',
      brand: 'councilof.ai',
      password: null,
      loginMethod: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastSignedIn: new Date().toISOString(),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionTier: 'free',
      subscriptionStatus: 'none',
      foundingMember: 0,
      referralCode: null,
      payoutFrequency: 'monthly',
      lastPayoutDate: null,
      stripeConnectAccountId: null,
    },
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext['res'],
  };
}

describe('Students Router', () => {
  const ctx = createTestContext();
  const caller = appRouter.createCaller(ctx);
  let testStudentId: number;
  let testCohortId: number;

  beforeAll(async () => {
    // Clean up any existing test data
    await db.delete(students).where(eq(students.email, 'test-student@example.com'));
    await db.delete(cohorts).where(eq(cohorts.code, 'STU-TEST-2026'));
    
    // Create a test cohort
    const [cohort] = await db.insert(cohorts).values({
      name: 'Student Test Cohort',
      code: 'STU-TEST-2026',
      description: 'Test cohort for student testing',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      capacity: 50,
      status: 'active',
    }).returning();
    
    testCohortId = cohort.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (testStudentId) {
      await db.delete(students).where(eq(students.id, testStudentId));
    }
    if (testCohortId) {
      await db.delete(cohorts).where(eq(cohorts.id, testCohortId));
    }
  });

  describe('create', () => {
    it('should create a new student', async () => {
      const result = await caller.students.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test-student@example.com',
        studentNumber: 'STU-TEST-001',
        status: 'active',
        cohortId: testCohortId,
      });

      expect(result).toBeDefined();
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.email).toBe('test-student@example.com');
      expect(result.status).toBe('active');
      expect(result.cohortId).toBe(testCohortId);
      
      testStudentId = result.id;
    });

    it('should fail to create student with duplicate email', async () => {
      await expect(
        caller.students.create({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'test-student@example.com', // Same email
          studentNumber: 'STU-TEST-002',
          status: 'active',
        })
      ).rejects.toThrow();
    });
  });

  describe('list', () => {
    it('should list all students', async () => {
      const result = await caller.students.list({});

      expect(result).toBeDefined();
      expect(result.students).toBeInstanceOf(Array);
      expect(result.total).toBeGreaterThan(0);
      
      const testStudent = result.students.find(s => s.email === 'test-student@example.com');
      expect(testStudent).toBeDefined();
    });

    it('should filter students by status', async () => {
      const result = await caller.students.list({ status: 'active' });

      expect(result.students.every(s => s.status === 'active')).toBe(true);
    });

    it('should filter students by cohort', async () => {
      const result = await caller.students.list({ cohortId: testCohortId });

      expect(result.students.every(s => s.cohortId === testCohortId)).toBe(true);
    });

    it('should search students by name', async () => {
      const result = await caller.students.list({ search: 'John Doe' });

      expect(result.students.length).toBeGreaterThan(0);
      expect(result.students.some(s => 
        s.firstName.includes('John') || s.lastName.includes('Doe')
      )).toBe(true);
    });
  });

  describe('getById', () => {
    it('should get student by id', async () => {
      const result = await caller.students.getById({ id: testStudentId });

      expect(result).toBeDefined();
      expect(result.id).toBe(testStudentId);
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.email).toBe('test-student@example.com');
    });

    it('should throw error for non-existent student', async () => {
      await expect(
        caller.students.getById({ id: 999999 })
      ).rejects.toThrow('Student not found');
    });
  });

  describe('update', () => {
    it('should update student details', async () => {
      const result = await caller.students.update({
        id: testStudentId,
        firstName: 'Jonathan',
        status: 'graduated',
      });

      expect(result).toBeDefined();
      expect(result.firstName).toBe('Jonathan');
      expect(result.status).toBe('graduated');
      expect(result.lastName).toBe('Doe'); // Unchanged
    });
  });

  describe('bulkUpdateStatus', () => {
    it('should update status for multiple students', async () => {
      const result = await caller.students.bulkUpdateStatus({
        studentIds: [testStudentId],
        status: 'active',
      });

      expect(result.success).toBe(true);
      expect(result.count).toBe(1);
      
      // Verify status was updated
      const updatedStudent = await db.query.students.findFirst({
        where: eq(students.id, testStudentId),
      });
      
      expect(updatedStudent?.status).toBe('active');
    });
  });

  describe('exportToCSV', () => {
    it('should export students to CSV format', async () => {
      const result = await caller.students.exportToCSV({
        cohortId: testCohortId,
      });

      expect(result).toBeDefined();
      expect(result.csv).toContain('Student Number,First Name,Last Name,Email');
      expect(result.csv).toContain('STU-TEST-001');
      expect(result.csv).toContain('Jonathan');
      expect(result.csv).toContain('test-student@example.com');
    });
  });

  describe('delete', () => {
    it('should delete student', async () => {
      const result = await caller.students.delete({ id: testStudentId });

      expect(result.success).toBe(true);
      
      // Verify student was deleted
      await expect(
        caller.students.getById({ id: testStudentId })
      ).rejects.toThrow('Student not found');
      
      testStudentId = 0; // Prevent cleanup from trying to delete again
    });
  });
});
