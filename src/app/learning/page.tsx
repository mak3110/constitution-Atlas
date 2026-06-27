import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { LearningClientPage } from '@/components/LearningClientPage';
import { redirect } from 'next/navigation';

export default async function LearningPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch lessons for the user's role, or fall back to CITIZEN if none are role-specific
  let lessons = await prisma.learningLesson.findMany({
    where: { roleTarget: user.role },
    orderBy: { dayNumber: 'asc' }
  });

  if (lessons.length === 0) {
    lessons = await prisma.learningLesson.findMany({
      where: { roleTarget: 'CITIZEN' },
      orderBy: { dayNumber: 'asc' }
    });
  }

  // Fetch completed progress count
  const completedProgressCount = await prisma.userProgress.count({
    where: { userId: user.id }
  });

  return (
    <LearningClientPage 
      user={user} 
      lessons={lessons} 
      completedCount={completedProgressCount}
    />
  );
}
