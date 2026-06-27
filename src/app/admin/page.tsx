import { prisma } from '@/lib/db';
import { AdminClientDashboard } from '@/components/AdminClientDashboard';

export default async function AdminPage() {
  const countries = await prisma.country.findMany({
    orderBy: { name: 'asc' }
  });
  
  const articles = await prisma.article.findMany({
    include: { country: true },
    orderBy: { articleNumber: 'asc' }
  });

  const quizzes = await prisma.quizQuestion.findMany({
    include: { country: true }
  });

  const prompts = await prisma.promptConfig.findMany();

  return (
    <AdminClientDashboard 
      initialCountries={countries} 
      initialArticles={articles}
      initialQuizzes={quizzes}
      initialPrompts={prompts}
    />
  );
}
