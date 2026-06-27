import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { CountryClientPage } from '@/components/CountryClientPage';

interface PageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ article?: string }>;
}

export default async function CountryPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const code = resolvedParams.code.toUpperCase();
  const selectedArticleId = resolvedSearchParams.article || null;

  // Fetch country data
  const country = await prisma.country.findUnique({
    where: { code },
    include: {
      articles: {
        orderBy: { articleNumber: 'asc' }
      },
      amendments: {
        orderBy: { year: 'asc' }
      }
    }
  });

  if (!country) {
    notFound();
  }

  return (
    <CountryClientPage 
      country={country} 
      initialSelectedArticleId={selectedArticleId} 
    />
  );
}
