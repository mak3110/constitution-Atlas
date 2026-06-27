'use server';

import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized access.');
  }
}

export async function saveArticleAction(articleId: string | null, data: any) {
  await checkAdmin();

  try {
    if (articleId) {
      await prisma.article.update({
        where: { id: articleId },
        data
      });
    } else {
      await prisma.article.create({
        data
      });
    }
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function saveQuizAction(quizId: string | null, data: any) {
  await checkAdmin();

  try {
    if (quizId) {
      await prisma.quizQuestion.update({
        where: { id: quizId },
        data
      });
    } else {
      await prisma.quizQuestion.create({
        data
      });
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function savePromptAction(promptId: string, systemPrompt: string, temperature: number) {
  await checkAdmin();

  try {
    await prisma.promptConfig.update({
      where: { id: promptId },
      data: {
        systemPrompt,
        temperature
      }
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function saveCountryAction(countryId: string | null, data: any) {
  await checkAdmin();

  try {
    if (countryId) {
      await prisma.country.update({
        where: { id: countryId },
        data
      });
    } else {
      await prisma.country.create({
        data
      });
    }
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
