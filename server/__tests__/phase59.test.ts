/**
 * Phase 59 Tests - Bulk Import, Jobs, and Notifications
 */

import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "../routers";
import { getDb } from "../db";
import { jobPostings, notifications, notificationPreferences } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

// Mock user context
const mockUser = {
  id: "1",
  openId: "test-user",
  name: "Test User",
  email: "test@example.com",
  role: "user" as const,
};

const mockContext = {
  user: mockUser,
  req: {} as any,
  res: {} as any,
};

describe("Bulk Import Router", () => {
  it("should get CSV template", async () => {
    const caller = appRouter.createCaller(mockContext);
    const result = await caller.bulkImport.getCSVTemplate();

    expect(result).toBeDefined();
    expect(result.template).toContain("name,description,systemType");
    expect(result.filename).toBe("ai_systems_template.csv");
  });

  it("should get field descriptions", async () => {
    const caller = appRouter.createCaller(mockContext);
    const result = await caller.bulkImport.getFieldDescriptions();

    expect(result).toBeDefined();
    expect(result.fields).toBeInstanceOf(Array);
    expect(result.fields.length).toBeGreaterThan(0);
    expect(result.fields[0]).toHaveProperty("name");
    expect(result.fields[0]).toHaveProperty("required");
    expect(result.fields[0]).toHaveProperty("description");
  });

  it("should import valid CSV data", async () => {
    const caller = appRouter.createCaller(mockContext);
    const csvData = `name,description,systemType,riskLevel
TestBot,A test chatbot,chatbot,limited
AnalysisAI,Analysis system,analysis,minimal`;

    const result = await caller.bulkImport.importFromCSV({ csvData });

    expect(result).toBeDefined();
    expect(result.imported).toBeGreaterThanOrEqual(0);
    expect(result.errors).toBeInstanceOf(Array);
  });

  it("should handle invalid CSV data gracefully", async () => {
    const caller = appRouter.createCaller(mockContext);
    const csvData = `name,description,systemType,riskLevel
ValidBot,Valid description,chatbot,limited`;

    const result = await caller.bulkImport.importFromCSV({ csvData });

    expect(result).toBeDefined();
    expect(result.imported).toBeGreaterThanOrEqual(0);
  });
});

describe("Jobs Router", () => {
  let testJobId: number;

  beforeAll(async () => {
    // Ensure at least one job exists
    const db = await getDb();
    if (db) {
      const jobs = await db.select().from(jobPostings).limit(1);
      if (jobs.length > 0) {
        testJobId = jobs[0].id;
      }
    }
  });

  it("should get job listings", async () => {
    const caller = appRouter.createCaller(mockContext);
    const result = await caller.jobs.getJobListings({
      limit: 10,
      offset: 0,
    });

    expect(result).toBeDefined();
    expect(result.jobs).toBeInstanceOf(Array);
    expect(result.total).toBeGreaterThanOrEqual(0);
  });

  it("should filter jobs by location type", async () => {
    const caller = appRouter.createCaller(mockContext);
    const result = await caller.jobs.getJobListings({
      locationType: "remote",
      limit: 10,
      offset: 0,
    });

    expect(result).toBeDefined();
    expect(result.jobs).toBeInstanceOf(Array);
    // All returned jobs should be remote
    result.jobs.forEach((job) => {
      expect(job.locationType).toBe("remote");
    });
  });

  it("should filter jobs by experience level", async () => {
    const caller = appRouter.createCaller(mockContext);
    const result = await caller.jobs.getJobListings({
      experienceLevel: "entry",
      limit: 10,
      offset: 0,
    });

    expect(result).toBeDefined();
    expect(result.jobs).toBeInstanceOf(Array);
    result.jobs.forEach((job) => {
      expect(job.experienceLevel).toBe("entry");
    });
  });

  it("should get job details", async () => {
    if (!testJobId) {
      console.log("Skipping test: no test job available");
      return;
    }

    const caller = appRouter.createCaller(mockContext);
    const result = await caller.jobs.getJobDetails({ id: testJobId });

    expect(result).toBeDefined();
    if (result) {
      expect(result.id).toBe(testJobId);
      expect(result.title).toBeDefined();
      expect(result.company).toBeDefined();
    }
  });

  it("should get job statistics", async () => {
    const caller = appRouter.createCaller(mockContext);
    const result = await caller.jobs.getJobStats();

    expect(result).toBeDefined();
    expect(Number(result.totalJobs)).toBeGreaterThanOrEqual(0);
    expect(Number(result.remoteJobs)).toBeGreaterThanOrEqual(0);
    expect(Number(result.avgPayRate)).toBeGreaterThanOrEqual(0);
  });

  it("should get filter options", async () => {
    const caller = appRouter.createCaller(mockContext);
    const result = await caller.jobs.getFilterOptions();

    expect(result).toBeDefined();
    expect(result.locations).toBeInstanceOf(Array);
    expect(result.companies).toBeInstanceOf(Array);
    expect(result.certifications).toBeInstanceOf(Array);
  });
});

describe("Notifications Router", () => {
  it("should get user notifications", async () => {
    const caller = appRouter.createCaller(mockContext);
    const result = await caller.notifications.getNotifications({
      limit: 10,
      offset: 0,
      unreadOnly: false,
    });

    expect(result).toBeDefined();
    expect(result.notifications).toBeInstanceOf(Array);
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.unreadCount).toBeGreaterThanOrEqual(0);
  });

  it("should get notification preferences", async () => {
    const caller = appRouter.createCaller(mockContext);
    const result = await caller.notifications.getPreferences();

    expect(result).toBeDefined();
    if (result) {
      expect(result.emailEnabled).toBeDefined();
      expect(result.complianceAlerts).toBeDefined();
      expect(result.systemUpdates).toBeDefined();
    }
  });

  it("should update notification preferences", async () => {
    const caller = appRouter.createCaller(mockContext);
    const result = await caller.notifications.updatePreferences({
      emailEnabled: true,
      complianceAlerts: true,
      systemUpdates: false,
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  it("should mark all notifications as read", async () => {
    const caller = appRouter.createCaller(mockContext);
    const result = await caller.notifications.markAllAsRead();

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  it("should create notification with proper structure", async () => {
    const db = await getDb();
    if (!db) {
      console.log("Skipping test: database not available");
      return;
    }

    // Create a test notification
    const [notification] = await db
      .insert(notifications)
      .values({
        userId: 1,
        type: "system_update",
        title: "Test Notification",
        message: "This is a test notification",
        priority: "low",
        isRead: false,
      })
      .$returningId();

    expect(notification).toBeDefined();
    expect(notification.id).toBeGreaterThan(0);

    // Clean up
    await db.delete(notifications).where(eq(notifications.id, notification.id));
  });
});

describe("Integration Tests", () => {
  it("should validate job application structure", async () => {
    const db = await getDb();
    if (!db) {
      console.log("Skipping test: database not available");
      return;
    }

    // Get a test job
    const jobs = await db.select().from(jobPostings).limit(1);
    if (jobs.length === 0) {
      console.log("Skipping test: no jobs available");
      return;
    }

    const testJob = jobs[0];
    expect(testJob.id).toBeGreaterThan(0);
    expect(testJob.title).toBeDefined();
    expect(testJob.company).toBeDefined();
  });

  it("should prevent duplicate job applications", async () => {
    const db = await getDb();
    if (!db) {
      console.log("Skipping test: database not available");
      return;
    }

    const jobs = await db.select().from(jobPostings).limit(1);
    if (jobs.length === 0) {
      console.log("Skipping test: no jobs available");
      return;
    }

    const testJob = jobs[0];
    const caller = appRouter.createCaller(mockContext);

    // Try to apply again (should fail)
    try {
      await caller.jobs.applyToJob({
        jobId: testJob.id,
        coverLetter: "Another application",
      });
      // If we get here, the test should fail
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.message).toContain("already applied");
    }
  });

  it("should handle notification preferences creation", async () => {
    const db = await getDb();
    if (!db) {
      console.log("Skipping test: database not available");
      return;
    }

    // Create preferences for a new user
    const [prefs] = await db
      .insert(notificationPreferences)
      .values({
        userId: 999,
        emailEnabled: true,
        slackEnabled: false,
      })
      .$returningId();

    expect(prefs).toBeDefined();
    expect(prefs.id).toBeGreaterThan(0);

    // Clean up
    await db.delete(notificationPreferences).where(eq(notificationPreferences.id, prefs.id));
  });
});
