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
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { testQuestions, userTestAttempts, users } from "../../drizzle/schema";
import { eq, and, desc, sql, gte, lte } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";

export const aiTutorRouter = router({
  /**
   * Get a practice question for a specific framework
   * Returns questions in adaptive order based on user's weak areas
   */
  getPracticeQuestion: protectedProcedure
    .input(
      z.object({
        framework: z.string(),
        level: z.enum(["fundamentals", "advanced", "specialist"]).optional(),
        topicId: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      if (!ctx.user?.id) throw new Error("User not authenticated");

      // Get user's weak areas from previous attempts
      const weakAreas = await db
        .select({
          topicId: testQuestions.topicId,
          correctCount: sql<number>`SUM(CASE WHEN ${userTestAttempts.isCorrect} = 1 THEN 1 ELSE 0 END)`,
          totalCount: sql<number>`COUNT(*)`,
        })
        .from(userTestAttempts)
        .innerJoin(
          testQuestions,
          eq(userTestAttempts.questionId, testQuestions.id)
        )
        .where(eq(userTestAttempts.userId, ctx.user.id))
        .groupBy(testQuestions.topicId);

      // Calculate accuracy per topic
      const weakTopics = weakAreas
        .map((area) => ({
          topicId: area.topicId,
          accuracy: area.correctCount / (area.totalCount || 1),
        }))
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 5); // Top 5 weakest topics

      // Get next question - prioritize weak areas
      let query = db
        .select()
        .from(testQuestions)
        .where(
          and(
            eq(testQuestions.framework, input.framework),
            input.level ? eq(testQuestions.difficulty, input.level) : undefined
          )
        );

      const questions = await query.limit(100);

      // Prioritize weak topics, then randomize
      let selectedQuestion: (typeof testQuestions.$inferSelect) | null = null;

      if (weakTopics.length > 0) {
        const weakTopicIds = weakTopics.map((t) => t.topicId).filter(Boolean);
        const weakQuestion = questions.find((q) =>
          weakTopicIds.includes(q.topicId)
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
        throw new Error("No questions available for this framework");
      }

      return {
        id: selectedQuestion.id,
        question: selectedQuestion.question,
        options: selectedQuestion.options,
        framework: selectedQuestion.framework,
        difficulty: selectedQuestion.difficulty,
        topic: selectedQuestion.topic,
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
        framework: z.string(),
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

      // Record the attempt
      await db.insert(userTestAttempts).values({
        userId: ctx.user.id,
        questionId: input.questionId,
        selectedAnswer: input.selectedAnswer,
        isCorrect: isCorrect ? 1 : 0,
        attemptedAt: new Date().toISOString(),
      });

      // Generate AI explanation using LLM
      const explanationPrompt = `
You are an expert AI compliance trainer. A user just answered a question about ${input.framework}.

Question: ${question.question}

Options:
${question.options.map((opt: string, idx: number) => `${String.fromCharCode(65 + idx)}) ${opt}`).join("\n")}

User's Answer: ${input.selectedAnswer}
Correct Answer: ${question.correctAnswer}
Is Correct: ${isCorrect ? "YES" : "NO"}

Explanation: ${question.explanation}

Please provide:
1. A brief explanation of why the answer is ${isCorrect ? "correct" : "incorrect"} (2-3 sentences)
2. The key concept they should understand (1 sentence)
3. A practical example or application (1-2 sentences)
4. What to review next if they got it wrong (1 sentence, only if incorrect)

Format your response as JSON with keys: "whyCorrect", "keyConcept", "example", "nextReview"
`;

      let aiExplanation = {
        whyCorrect: "Unable to generate explanation",
        keyConcept: "",
        example: "",
        nextReview: "",
      };

      try {
        const response = await invokeLLM(explanationPrompt);
        const parsed = JSON.parse(response);
        aiExplanation = {
          whyCorrect: parsed.whyCorrect || aiExplanation.whyCorrect,
          keyConcept: parsed.keyConcept || "",
          example: parsed.example || "",
          nextReview: parsed.nextReview || "",
        };
      } catch (error) {
        console.error("Error generating AI explanation:", error);
        // Fallback to question's built-in explanation
        aiExplanation.whyCorrect = question.explanation;
      }

      return {
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: aiExplanation,
        topic: question.topic,
      };
    }),

  /**
   * Get user's learning analytics and weak areas
   */
  getLearningAnalytics: protectedProcedure
    .input(z.object({ framework: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      if (!ctx.user?.id) throw new Error("User not authenticated");

      // Get all attempts for this framework
      const attempts = await db
        .select({
          questionId: userTestAttempts.questionId,
          isCorrect: userTestAttempts.isCorrect,
          topic: testQuestions.topic,
          difficulty: testQuestions.difficulty,
          attemptedAt: userTestAttempts.attemptedAt,
        })
        .from(userTestAttempts)
        .innerJoin(
          testQuestions,
          eq(userTestAttempts.questionId, testQuestions.id)
        )
        .where(
          and(
            eq(userTestAttempts.userId, ctx.user.id),
            eq(testQuestions.framework, input.framework)
          )
        )
        .orderBy(desc(userTestAttempts.attemptedAt));

      // Calculate statistics
      const totalAttempts = attempts.length;
      const correctAttempts = attempts.filter((a) => a.isCorrect === 1).length;
      const overallAccuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

      // Group by topic
      const byTopic = attempts.reduce(
        (acc, attempt) => {
          const topic = attempt.topic || "Unknown";
          if (!acc[topic]) {
            acc[topic] = { correct: 0, total: 0, accuracy: 0 };
          }
          acc[topic].total++;
          if (attempt.isCorrect === 1) {
            acc[topic].correct++;
          }
          acc[topic].accuracy = (acc[topic].correct / acc[topic].total) * 100;
          return acc;
        },
        {} as Record<string, { correct: number; total: number; accuracy: number }>
      );

      // Identify weak areas (< 70% accuracy)
      const weakAreas = Object.entries(byTopic)
        .filter(([_, stats]) => stats.accuracy < 70)
        .map(([topic, stats]) => ({
          topic,
          accuracy: Math.round(stats.accuracy),
          correct: stats.correct,
          total: stats.total,
        }))
        .sort((a, b) => a.accuracy - b.accuracy);

      // Calculate progress over time (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const recentAttempts = attempts.filter((a) => a.attemptedAt >= sevenDaysAgo);
      const recentAccuracy =
        recentAttempts.length > 0
          ? (recentAttempts.filter((a) => a.isCorrect === 1).length / recentAttempts.length) * 100
          : 0;

      return {
        totalAttempts,
        correctAttempts,
        overallAccuracy: Math.round(overallAccuracy),
        recentAccuracy: Math.round(recentAccuracy),
        byTopic,
        weakAreas,
        readyForExam: overallAccuracy >= 70,
      };
    }),

  /**
   * Get personalized recommendations for what to study next
   */
  getRecommendations: protectedProcedure
    .input(z.object({ framework: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      if (!ctx.user?.id) throw new Error("User not authenticated");

      // Get learning analytics
      const analytics = await db
        .select({
          topic: testQuestions.topic,
          difficulty: testQuestions.difficulty,
          isCorrect: userTestAttempts.isCorrect,
        })
        .from(userTestAttempts)
        .innerJoin(
          testQuestions,
          eq(userTestAttempts.questionId, testQuestions.id)
        )
        .where(
          and(
            eq(userTestAttempts.userId, ctx.user.id),
            eq(testQuestions.framework, input.framework)
          )
        );

      // Group by topic and calculate accuracy
      const topicStats = analytics.reduce(
        (acc, item) => {
          const topic = item.topic || "Unknown";
          if (!acc[topic]) {
            acc[topic] = { correct: 0, total: 0 };
          }
          acc[topic].total++;
          if (item.isCorrect === 1) {
            acc[topic].correct++;
          }
          return acc;
        },
        {} as Record<string, { correct: number; total: number }>
      );

      // Generate recommendations
      const recommendations = Object.entries(topicStats)
        .map(([topic, stats]) => {
          const accuracy = (stats.correct / stats.total) * 100;
          let priority = "low";
          let action = "";

          if (accuracy < 50) {
            priority = "critical";
            action = `Focus on ${topic} - you're only getting ${Math.round(accuracy)}% correct`;
          } else if (accuracy < 70) {
            priority = "high";
            action = `Review ${topic} - aim for 70%+ accuracy`;
          } else if (accuracy < 85) {
            priority = "medium";
            action = `Practice ${topic} to build confidence`;
          } else {
            priority = "low";
            action = `${topic} is solid - move to harder questions`;
          }

          return {
            topic,
            accuracy: Math.round(accuracy),
            priority,
            action,
          };
        })
        .sort((a, b) => {
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority as keyof typeof priorityOrder] -
            priorityOrder[b.priority as keyof typeof priorityOrder];
        });

      return {
        recommendations,
        nextSteps: recommendations.slice(0, 3),
        readyForExam: recommendations.every((r) => r.accuracy >= 70),
      };
    }),

  /**
   * Get practice questions for a specific topic
   */
  getPracticeQuestionsByTopic: publicProcedure
    .input(
      z.object({
        framework: z.string(),
        topic: z.string(),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const questions = await db
        .select()
        .from(testQuestions)
        .where(
          and(
            eq(testQuestions.framework, input.framework),
            eq(testQuestions.topic, input.topic)
          )
        )
        .limit(input.limit);

      return questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        topic: q.topic,
        difficulty: q.difficulty,
        // Don't return correct answer
      }));
    }),
});
