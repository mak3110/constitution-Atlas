'use server';

import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { generateQuizAI } from '@/lib/ai';

export async function getQuizQuestionsAction(topic: string, difficulty: 'EASY' | 'MEDIUM' | 'HARD', type: 'MCQ' | 'TF' | 'BLANK' | 'SCENARIO') {
  try {
    const questions = await generateQuizAI(topic, difficulty, type);
    return { success: true, questions };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitQuizScoreAction(score: number, countryCode: string, topic: string) {
  const user = await getSessionUser();
  if (!user) return { success: false, error: 'Sign in to save your score' };

  try {
    const country = await prisma.country.findUnique({
      where: { code: countryCode }
    });

    if (!country) return { success: false, error: 'Country not found' };

    // Log progress
    await prisma.userProgress.create({
      data: {
        userId: user.id,
        countryId: country.id,
        quizScore: score
      }
    });

    // Update user streak & active timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastActive: new Date(),
        streakCount: user.streakCount === 0 ? 1 : user.streakCount + 1
      }
    });

    return { success: true, newStreak: user.streakCount === 0 ? 1 : user.streakCount + 1 };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
