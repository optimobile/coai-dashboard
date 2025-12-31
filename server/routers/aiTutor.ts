/**
 * AI Tutor Router - Real-Time Adaptive Training System
 * 
 * Provides AI-powered tutoring during practice questions:
 * - Real-time explanations when users answer questions
 * - Weakness detection and tracking
 * - Spaced repetition recommendations
 * - Learning analytics dashboard
 * 
 * This enables learning-while-practicing, which increases pass rates
 * and reduces time-to-certification compared to traditional exams.
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { testQuestions, userTestAttempts, certificationTests } from "../../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";

export const aiTutorRouter = router({
  /**
   * Get a practice question for a specific test
   * Returns questions in adaptive order based on user's weak areas
   */
  getPracticeQuestion: protectedProcedure
    .input(
      z.object({
        testId: z.number().optional(),
        difficulty: z.enum(["easy", "medium", "hard"]).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      if (!ctx.user?.id) throw new Error("User not authenticated");

      // Get user's weak areas from previous attempts
      const weakAreas = await db
        .select({
          moduleId: testQuestions.moduleId,
          correctCount: sql<number>`SUM(CASE WHEN ${userTestAttempts.passed} = 1 THEN 1 ELSE 0 END)`,
          totalCount: sql<number>`COUNT(*)`,
        })
        .from(userTestAttempts)
        .innerJoin(
          testQuestions,
          eq(userTestAttempts.testId, testQuestions.testId)
        )
        .where(eq(userTestAttempts.userId, ctx.user.id))
        .groupBy(testQuestions.moduleId);

      // Calculate accuracy per module
      const weakModules = weakAreas
        .map((area: any) => ({
          moduleId: area.moduleId,
          accuracy: area.correctCount / (area.totalCount || 1),
        }))
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 5); // Top 5 weakest modules

      // Get next question - prioritize weak areas
      let whereConditions: any[] = [eq(testQuestions.isActive, true)];
      
      if (input.testId) {
        whereConditions.push(eq(testQuestions.testId, input.testId));
      }
      if (input.difficulty) {
        whereConditions.push(eq(testQuestions.difficulty, input.difficulty));
      }

      const questions = await db
        .select()
        .from(testQuestions)
        .where(and(...whereConditions))
        .limit(100);

      // Prioritize weak modules, then randomize
      let selectedQuestion: (typeof testQuestions.$inferSelect) | null = null;

      if (weakModules.length > 0) {
        const weakModuleIds = weakModules.map((t: any) => t.moduleId).filter(Boolean);
        const weakQuestion = questions.find((q: any) =>
          weakModuleIds.includes(q.moduleId)
        );
        if (weakQuestion) {
          selectedQuestion = weakQuestion;
        }
      }

      // If no weak area question, pick random
      if (!selectedQuestion && questions.length > 0) {
        selectedQuestion = questions[Math.floor(Math.random() * questions.length)];
      }

      if (!selectedQuestion) {
        throw new Error("No questions available");
      }

      return {
        id: selectedQuestion.id,
        question: selectedQuestion.questionText,
        options: selectedQuestion.options as string[],
        difficulty: selectedQuestion.difficulty,
        moduleId: selectedQuestion.moduleId,
        // Don't return correct answer yet
      };
    }),

  /**
   * Submit a practice answer and get AI explanation
   * Returns whether answer is correct + AI-generated explanation
   */
  submitPracticeAnswer: protectedProcedure
    .input(
      z.object({
        questionId: z.number(),
        selectedAnswer: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      if (!ctx.user?.id) throw new Error("User not authenticated");

      // Get the question
      const [question] = await db
        .select()
        .from(testQuestions)
        .where(eq(testQuestions.id, input.questionId));

      if (!question) {
        throw new Error("Question not found");
      }

      // Check if answer is correct
      const isCorrect = question.correctAnswer === input.selectedAnswer;

      // Generate AI explanation using LLM
      const options = question.options as string[];
      const explanationPrompt = `
You are an expert AI compliance trainer. A user just answered a question.

Question: ${question.questionText}

Options:
${options.map((opt: string, idx: number) => `${String.fromCharCode(65 + idx)}) ${opt}`).join("\n")}

User's Answer: ${input.selectedAnswer}
Correct Answer: ${question.correctAnswer}
Is Correct: ${isCorrect ? "YES" : "NO"}

Explanation: ${question.explanation || "No explanation provided"}

Please provide:
1. A brief explanation of why the answer is ${isCorrect ? "correct" : "incorrect"} (2-3 sentences)
2. The key concept they should understand (1 sentence)
3. A practical example or application (1-2 sentences)
4. What to review next if they got it wrong (1 sentence, only if incorrect)

Format your response as JSON with keys: "whyCorrect", "keyConcept", "example", "nextReview"
`;

      let aiExplanation = {
        whyCorrect: question.explanation || "Unable to generate explanation",
        keyConcept: "",
        example: "",
        nextReview: "",
      };

      try {
        const response = await invokeLLM({ prompt: explanationPrompt });
        if (typeof response === 'string') {
          const parsed = JSON.parse(response);
          aiExplanation = {
            whyCorrect: parsed.whyCorrect || aiExplanation.whyCorrect,
            keyConcept: parsed.keyConcept || "",
            example: parsed.example || "",
            nextReview: parsed.nextReview || "",
          };
        }
      } catch (error) {
        console.error("Error generating AI explanation:", error);
        // Fallback to question's built-in explanation
      }

      return {
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: aiExplanation,
        moduleId: question.moduleId,
      };
    }),

  /**
   * Get user's learning analytics and weak areas
   */
  getLearningAnalytics: protectedProcedure
    .input(z.object({ testId: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      if (!ctx.user?.id) throw new Error("User not authenticated");

      // Get all attempts for this user
      const attempts = await db
        .select()
        .from(userTestAttempts)
        .where(eq(userTestAttempts.userId, ctx.user.id))
        .orderBy(desc(userTestAttempts.createdAt));

      if (attempts.length === 0) {
        return {
          totalAttempts: 0,
          correctAnswers: 0,
          accuracy: 0,
          weakAreas: [],
          strongAreas: [],
          recentAttempts: [],
          improvementTrend: [],
        };
      }

      // Calculate overall stats
      const totalAttempts = attempts.length;
      const correctAnswers = attempts.filter((a: any) => a.passed === 1).length;
      const accuracy = Math.round((correctAnswers / totalAttempts) * 100);

      // Recent attempts (last 10)
      const recentAttempts = attempts.slice(0, 10).map((a: any) => ({
        id: a.id,
        testId: a.testId,
        score: a.score,
        passed: a.passed === 1,
        createdAt: a.createdAt,
      }));

      // Calculate improvement trend (last 5 attempts)
      const improvementTrend = attempts.slice(0, 5).reverse().map((a: any, idx: number) => ({
        attemptNumber: idx + 1,
        score: a.score || 0,
        passed: a.passed === 1,
      }));

      return {
        totalAttempts,
        correctAnswers,
        accuracy,
        weakAreas: [], // Would need more data to calculate
        strongAreas: [], // Would need more data to calculate
        recentAttempts,
        improvementTrend,
      };
    }),

  /**
   * Get spaced repetition recommendations
   * Returns questions that should be reviewed based on forgetting curve
   */
  getSpacedRepetitionRecommendations: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    if (!ctx.user?.id) throw new Error("User not authenticated");

    // Get user's past attempts
    const attempts = await db
      .select()
      .from(userTestAttempts)
      .where(eq(userTestAttempts.userId, ctx.user.id))
      .orderBy(desc(userTestAttempts.createdAt))
      .limit(50);

    // Find questions that were answered incorrectly
    const incorrectAttempts = attempts.filter((a: any) => a.passed === 0);

    // Get unique test IDs from incorrect attempts
    const testIds = [...new Set(incorrectAttempts.map((a: any) => a.testId))];

    // Get questions from those tests
    const reviewQuestions = testIds.length > 0 ? await db
      .select()
      .from(testQuestions)
      .where(sql`${testQuestions.testId} IN (${sql.join(testIds.map((id: any) => sql`${id}`), sql`, `)})`)
      .limit(10) : [];

    return {
      questionsToReview: reviewQuestions.map((q: any) => ({
        id: q.id,
        question: q.questionText,
        difficulty: q.difficulty,
        moduleId: q.moduleId,
        reason: "Previously answered incorrectly",
      })),
      nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      totalPendingReviews: reviewQuestions.length,
    };
  }),

  /**
   * Get available tests for practice
   */
  getAvailableTests: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const tests = await db
      .select()
      .from(certificationTests)
      .where(eq(certificationTests.isActive, true));

    return tests.map((t: any) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      passingScore: t.passingScore,
      timeLimit: t.timeLimit,
      questionCount: t.questionCount,
    }));
  }),
});
