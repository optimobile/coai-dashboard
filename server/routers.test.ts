import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
}));

// Mock the LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: {
        content: JSON.stringify({
          vote: "approve",
          confidence: 0.85,
          reasoning: "Test reasoning"
        })
      }
    }]
  }),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(authenticated: boolean = false): TrpcContext {
  const user: AuthenticatedUser | null = authenticated ? {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  } : null;

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user-123",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("Auth Router", () => {
  it("returns null for unauthenticated user", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user for authenticated user", async () => {
    const ctx = createMockContext(true);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect(result?.email).toBe("test@example.com");
  });

  it("clears cookie on logout", async () => {
    const ctx = createMockContext(true);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(ctx.res.clearCookie).toHaveBeenCalled();
  });
});

describe("Watchdog Router", () => {
  it("returns empty array when database is not available", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.watchdog.list();
    expect(result).toEqual([]);
  });

  it("returns null for non-existent report", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.watchdog.getById({ id: 999 });
    expect(result).toBeNull();
  });
});

describe("Applications Router", () => {
  it("returns zero count when database is not available", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.applications.getCount();
    expect(result).toEqual({ count: 0 });
  });
});

describe("Council Router", () => {
  it("returns empty array when database is not available", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.council.list();
    expect(result).toEqual([]);
  });

  it("returns default stats when database is not available", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.council.getStats();
    expect(result).toEqual({
      totalSessions: 0,
      consensusReached: 0,
      escalatedToHuman: 0,
      pendingReview: 0
    });
  });

  it("returns null for non-existent session", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.council.getSession({ id: 999 });
    expect(result).toBeNull();
  });
});

describe("Compliance Router", () => {
  it("returns default frameworks when database is not available", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.compliance.getFrameworks();
    expect(result).toHaveLength(3);
    expect(result[0].code).toBe("EU_AI_ACT");
    expect(result[1].code).toBe("NIST_AI_RMF");
    expect(result[2].code).toBe("TC260");
  });
});

describe("AI Systems Router", () => {
  it("returns empty array when database is not available", async () => {
    const ctx = createMockContext(true);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.aiSystems.list();
    expect(result).toEqual([]);
  });

  it("returns null for non-existent system", async () => {
    const ctx = createMockContext(true);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.aiSystems.getById({ id: 999 });
    expect(result).toBeNull();
  });
});

describe("Dashboard Router", () => {
  it("returns mock stats when database is not available", async () => {
    const ctx = createMockContext(true);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.dashboard.getStats();
    expect(result).toHaveProperty("totalSystems");
    expect(result).toHaveProperty("complianceScore");
    expect(result).toHaveProperty("watchdogReports");
    expect(result).toHaveProperty("loiCount");
  });
});

// ============================================
// TRAINING ROUTER TESTS
// ============================================
describe("Training Router", () => {
  it("returns empty array for modules when database is not available", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.training.getModules();
    expect(result).toEqual([]);
  });

  it("returns null for non-existent module", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.training.getModule({ id: 999 });
    expect(result).toBeNull();
  });

  it("returns empty array for progress when database is not available", async () => {
    const ctx = createMockContext(true);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.training.getProgress();
    expect(result).toEqual([]);
  });
});

// ============================================
// CERTIFICATION ROUTER TESTS
// ============================================
describe("Certification Router", () => {
  it("returns empty array for tests when database is not available", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.certification.getTests();
    expect(result).toEqual([]);
  });

  it("returns empty array for certificates when database is not available", async () => {
    const ctx = createMockContext(true);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.certification.getMyCertificates();
    expect(result).toEqual([]);
  });

  it("returns empty array for attempts when database is not available", async () => {
    const ctx = createMockContext(true);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.certification.getMyAttempts();
    expect(result).toEqual([]);
  });
});

// ============================================
// WORKBENCH ROUTER TESTS
// ============================================
describe("Workbench Router", () => {
  it("returns empty array for cases when user is not analyst", async () => {
    const ctx = createMockContext(true);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.workbench.getMyCases();
    expect(result).toEqual([]);
  });

  it("returns null for performance when database is not available", async () => {
    const ctx = createMockContext(true);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.workbench.getMyPerformance();
    expect(result).toBeNull();
  });

  it("returns empty array for leaderboard when database is not available", async () => {
    const ctx = createMockContext(false);
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.workbench.getLeaderboard();
    expect(result).toEqual([]);
  });
});
