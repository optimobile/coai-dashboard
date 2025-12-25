import type { QuizQuestion } from '@/types/quiz';
import { euAiActModule1Quiz } from './eu-ai-act-module-1';
import { euAiActModule2Quiz } from './eu-ai-act-module-2';
import { euAiActModule3Quiz } from './eu-ai-act-module-3';
import { euAiActModule4Quiz } from './eu-ai-act-module-4';
import { euAiActModule5Quiz } from './eu-ai-act-module-5';
import { euAiActModule6Quiz } from './eu-ai-act-module-6';
import { euAiActModule7Quiz } from './eu-ai-act-module-7';
import { euAiActModule8Quiz } from './eu-ai-act-module-8';

// Quiz mapping: courseId -> moduleIndex -> quiz questions
const quizMap: Record<number, Record<number, QuizQuestion[]>> = {
  // EU AI Act Fundamentals (courseId: 1, assuming this is the ID from database)
  1: {
    0: euAiActModule1Quiz,
    1: euAiActModule2Quiz,
    2: euAiActModule3Quiz,
    3: euAiActModule4Quiz,
    4: euAiActModule5Quiz,
    5: euAiActModule6Quiz,
    6: euAiActModule7Quiz,
    7: euAiActModule8Quiz,
  },
};

/**
 * Get quiz questions for a specific course module
 * @param courseId - The ID of the course
 * @param moduleIndex - The index of the module (0-based)
 * @returns Quiz questions array, or undefined if no quiz exists
 */
export function getModuleQuiz(
  courseId: number,
  moduleIndex: number
): QuizQuestion[] | undefined {
  return quizMap[courseId]?.[moduleIndex];
}

/**
 * Check if a quiz exists for a specific course module
 * @param courseId - The ID of the course
 * @param moduleIndex - The index of the module (0-based)
 * @returns True if a quiz exists, false otherwise
 */
export function hasModuleQuiz(courseId: number, moduleIndex: number): boolean {
  return !!quizMap[courseId]?.[moduleIndex];
}
