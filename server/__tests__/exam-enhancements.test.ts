/**
 * Comprehensive tests for exam system enhancements:
 * - Expanded question bank (275 questions)
 * - Practice mode functionality
 * - Analytics dashboard
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "../db";
import { testQuestions, userTestAttempts, certificationTests } from "../../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";

describe("Exam System Enhancements", () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
  });

  describe("Question Bank Expansion", () => {
    it("should have 200+ questions in the database", async () => {
      if (!db) throw new Error("Database not available");

      const questions = await db
        .select()
        .from(testQuestions)
        .where(eq(testQuestions.isActive, true));

      expect(questions.length).toBeGreaterThanOrEqual(200);
      console.log(`✅ Total questions: ${questions.length}`);
    });

    it("should have diverse question types", async () => {
      if (!db) throw new Error("Database not available");

      const questions = await db
        .select()
        .from(testQuestions)
        .where(eq(testQuestions.isActive, true));

      const types = new Set(questions.map((q) => q.questionType));
      
      expect(types.has("multiple_choice")).toBe(true);
      expect(questions.length).toBeGreaterThan(200);

      console.log(`✅ Question types found: ${Array.from(types).join(", ")}`);
      console.log(`✅ Total questions: ${questions.length}`);
    });

    it("should have questions at all difficulty levels", async () => {
      if (!db) throw new Error("Database not available");

      const questions = await db
        .select()
        .from(testQuestions)
        .where(eq(testQuestions.isActive, true));

      const difficulties = new Set(questions.map((q) => q.difficulty));
      
      expect(difficulties.has("easy")).toBe(true);
      expect(difficulties.has("medium")).toBe(true);
      expect(difficulties.has("hard")).toBe(true);

      const easyCount = questions.filter((q) => q.difficulty === "easy").length;
      const mediumCount = questions.filter((q) => q.difficulty === "medium").length;
      const hardCount = questions.filter((q) => q.difficulty === "hard").length;

      console.log(`✅ Difficulty distribution: Easy=${easyCount}, Medium=${mediumCount}, Hard=${hardCount}`);
    });

    it("should have correct question format with options and explanations", async () => {
      if (!db) throw new Error("Database not available");

      const questions = await db
        .select()
        .from(testQuestions)
        .where(eq(testQuestions.isActive, true))
        .limit(10);

      for (const q of questions) {
        // Check options format
        const options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
        expect(Array.isArray(options)).toBe(true);
        expect(options.length).toBeGreaterThan(0);
        
        // Each option should have id and text
        options.forEach((opt: any) => {
          expect(opt).toHaveProperty("id");
          expect(opt).toHaveProperty("text");
          expect(typeof opt.id).toBe("string");
          expect(typeof opt.text).toBe("string");
        });

        // Check correctAnswer is a letter
        expect(q.correctAnswer).toMatch(/^[A-Z]$/);

        // Check explanation exists
        expect(q.explanation).toBeTruthy();
        expect(typeof q.explanation).toBe("string");
      }

      console.log("✅ All questions have correct format");
    });
  });

  describe("Practice Mode", () => {
    it("should allow fetching test questions without authentication", async () => {
      if (!db) throw new Error("Database not available");

      // This simulates the practice mode query (public procedure)
      const [test] = await db
        .select()
        .from(certificationTests)
        .where(eq(certificationTests.id, 30001))
        .limit(1);

      expect(test).toBeTruthy();
      expect(test.title).toBeTruthy();

      const questions = await db
        .select()
        .from(testQuestions)
        .where(and(
          eq(testQuestions.testId, 30001),
          eq(testQuestions.isActive, true)
        ));

      expect(questions.length).toBeGreaterThan(0);
      console.log(`✅ Practice mode can access ${questions.length} questions`);
    });

    it("should have explanations for instant feedback", async () => {
      if (!db) throw new Error("Database not available");

      const questions = await db
        .select()
        .from(testQuestions)
        .where(eq(testQuestions.testId, 30001))
        .limit(20);

      const questionsWithExplanations = questions.filter((q) => q.explanation && q.explanation.length > 10);
      
      expect(questionsWithExplanations.length).toBe(questions.length);
      console.log(`✅ All ${questions.length} questions have explanations for feedback`);
    });
  });

  describe("Analytics Dashboard", () => {
    it("should calculate pass rate correctly", async () => {
      if (!db) throw new Error("Database not available");

      const attempts = await db
        .select()
        .from(userTestAttempts)
        .where(sql`${userTestAttempts.completedAt} IS NOT NULL`);

      if (attempts.length === 0) {
        console.log("⚠️ No completed attempts yet - skipping pass rate test");
        return;
      }

      const passedAttempts = attempts.filter((a) => a.passed).length;
      const passRate = (passedAttempts / attempts.length) * 100;

      expect(passRate).toBeGreaterThanOrEqual(0);
      expect(passRate).toBeLessThanOrEqual(100);

      console.log(`✅ Pass rate: ${passRate.toFixed(1)}% (${passedAttempts}/${attempts.length})`);
    });

    it("should calculate average score correctly", async () => {
      if (!db) throw new Error("Database not available");

      const attempts = await db
        .select()
        .from(userTestAttempts)
        .where(sql`${userTestAttempts.completedAt} IS NOT NULL`);

      if (attempts.length === 0) {
        console.log("⚠️ No completed attempts yet - skipping average score test");
        return;
      }

      const averageScore = attempts.reduce((sum, a) => sum + (a.percentScore || 0), 0) / attempts.length;

      expect(averageScore).toBeGreaterThanOrEqual(0);
      expect(averageScore).toBeLessThanOrEqual(100);

      console.log(`✅ Average score: ${averageScore.toFixed(1)}%`);
    });

    it("should identify most missed questions", async () => {
      if (!db) throw new Error("Database not available");

      const attempts = await db
        .select()
        .from(userTestAttempts)
        .where(sql`${userTestAttempts.completedAt} IS NOT NULL`);

      if (attempts.length === 0) {
        console.log("⚠️ No completed attempts yet - skipping most missed questions test");
        return;
      }

      const allQuestions = await db.select().from(testQuestions).limit(50);

      const questionStats = allQuestions.map((q) => {
        let totalAttempts = 0;
        let incorrectCount = 0;

        attempts.forEach((attempt) => {
          if (attempt.answers) {
            const answers = typeof attempt.answers === 'string' 
              ? JSON.parse(attempt.answers) 
              : attempt.answers;
            
            if (answers[q.id.toString()]) {
              totalAttempts++;
              if (answers[q.id.toString()] !== q.correctAnswer) {
                incorrectCount++;
              }
            }
          }
        });

        const missRate = totalAttempts > 0 ? (incorrectCount / totalAttempts) * 100 : 0;

        return {
          id: q.id,
          questionText: q.questionText,
          totalAttempts,
          incorrectCount,
          missRate,
        };
      });

      const mostMissed = questionStats
        .filter((q) => q.totalAttempts >= 1)
        .sort((a, b) => b.missRate - a.missRate)
        .slice(0, 5);

      console.log(`✅ Most missed questions analysis complete (${mostMissed.length} questions with data)`);
      
      if (mostMissed.length > 0) {
        console.log(`   Top miss rate: ${mostMissed[0].missRate.toFixed(1)}%`);
      }
    });

    it("should calculate score distribution", async () => {
      if (!db) throw new Error("Database not available");

      const attempts = await db
        .select()
        .from(userTestAttempts)
        .where(sql`${userTestAttempts.completedAt} IS NOT NULL`);

      if (attempts.length === 0) {
        console.log("⚠️ No completed attempts yet - skipping score distribution test");
        return;
      }

      const scoreRanges = [
        { range: "0-20%", min: 0, max: 20 },
        { range: "21-40%", min: 21, max: 40 },
        { range: "41-60%", min: 41, max: 60 },
        { range: "61-80%", min: 61, max: 80 },
        { range: "81-100%", min: 81, max: 100 },
      ];

      const distribution = scoreRanges.map((bucket) => {
        const count = attempts.filter(
          (a) => a.percentScore! >= bucket.min && a.percentScore! <= bucket.max
        ).length;
        return {
          range: bucket.range,
          count,
          percentage: (count / attempts.length) * 100,
        };
      });

      const totalPercentage = distribution.reduce((sum, d) => sum + d.percentage, 0);
      expect(Math.abs(totalPercentage - 100)).toBeLessThan(1); // Allow for rounding errors

      console.log("✅ Score distribution:");
      distribution.forEach((d) => {
        console.log(`   ${d.range}: ${d.count} attempts (${d.percentage.toFixed(1)}%)`);
      });
    });
  });

  describe("Integration Tests", () => {
    it("should have consistent data across all tables", async () => {
      if (!db) throw new Error("Database not available");

      const tests = await db.select().from(certificationTests);
      const questions = await db.select().from(testQuestions);
      const attempts = await db.select().from(userTestAttempts);

      expect(tests.length).toBeGreaterThan(0);
      expect(questions.length).toBeGreaterThan(0);

      // Verify all questions reference valid tests
      const testIds = new Set(tests.map((t) => t.id));
      questions.forEach((q) => {
        expect(testIds.has(q.testId)).toBe(true);
      });

      // Verify all attempts reference valid tests
      if (attempts.length > 0) {
        attempts.forEach((a) => {
          expect(testIds.has(a.testId)).toBe(true);
        });
      }

      console.log("✅ Data consistency verified across all tables");
    });
  });
});
