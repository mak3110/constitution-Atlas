import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Search, Globe, Shield, Scale, HelpCircle } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ q?: string; c?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const countryFilter = params.c || '';

  // Fetch all countries for the filtering tabs & cards
  const countries = await prisma.country.findMany({
    orderBy: { name: 'asc' }
  });

  // Search logic if query is present
  let searchResults: any[] = [];
  if (query || countryFilter) {
    searchResults = await prisma.article.findMany({
      where: {
        AND: [
          countryFilter ? { country: { code: countryFilter } } : {},
          query ? {
            OR: [
              { articleNumber: { contains: query } },
              { title: { contains: query } },
              { originalText: { contains: query } },
              { simplifiedExplanation: { contains: query } },
              { topic: { contains: query } },
            ]
          } : {}
        ]
      },
      include: { country: true },
      take: 20
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
          Explore the World's Constitutions in <span className="text-gradient-primary">Plain English</span>
        </h1>
        <p className="mx-auto max-w-2xl text-zinc-400 text-lg">
          We translate complex constitutional jargon into simplified, child-friendly explanations, examples, and key takeaways.
        </p>
      </div>

      {/* Search Section */}
      <div className="glass-card p-6 md:p-8 rounded-2xl mb-16 shadow-xl">
        <form action="/" method="GET" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search by article number, keyword (e.g. equality, speech, president)..."
                className="w-full pl-12 pr-4 py-3 rounded-xl glass-input text-white text-base"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                name="c"
                defaultValue={countryFilter}
                className="px-4 py-3 rounded-xl glass-input text-zinc-300 text-sm font-semibold bg-zinc-900 cursor-pointer"
              >
                <option value="">All Countries</option>
                {countries.map(c => (
                  <option key={c.id} value={c.code}>
                    {c.flagUrl} {c.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Popular Searches */}
        <div className="mt-4 flex flex-wrap gap-2 items-center text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300">Try searching:</span>
          <Link href="/?q=Article+21" className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:text-white transition">Article 21 (India)</Link>
          <Link href="/?q=speech" className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:text-white transition">Freedom of Speech</Link>
          <Link href="/?q=equality" className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:text-white transition">Equality</Link>
          <Link href="/?q=Magna+Carta" className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:text-white transition">Magna Carta (UK)</Link>
          <Link href="/?q=Article+9" className="px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:text-white transition">Article 9 (Japan)</Link>
        </div>
      </div>

      {/* Search Results */}
      {(query || countryFilter) && (
        <div className="mb-16 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
            <h2 className="text-2xl font-bold text-white">Search Results</h2>
            <span className="text-zinc-400 text-sm">{searchResults.length} match(es) found</span>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid gap-6">
              {searchResults.map((art) => (
                <div key={art.id} className="glass-card p-6 rounded-xl hover:translate-x-1 transition duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded uppercase">
                      {art.topic}
                    </span>
                    <Link href={`/countries/${art.country.code}`} className="flex items-center space-x-2 text-sm text-zinc-400 hover:text-white font-medium">
                      <span>{art.country.flagUrl}</span>
                      <span>{art.country.name}</span>
                    </Link>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {art.articleNumber}: {art.title}
                  </h3>
                  <p className="text-zinc-400 text-sm line-clamp-3 mb-4">
                    {art.originalText}
                  </p>
                  <Link
                    href={`/countries/${art.country.code}?article=${art.id}`}
                    className="inline-flex items-center space-x-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"
                  >
                    <span>Read Plain Language Explanations</span>
                    <span>→</span>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-zinc-900/20 border border-zinc-850 rounded-xl">
              <p className="text-zinc-400">No results found for your search criteria. Try a different search keyword.</p>
            </div>
          )}
        </div>
      )}

      {/* Countries Showcase */}
      <div className="space-y-6 mb-16">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2 border-b border-zinc-850 pb-4">
          <Globe className="h-6 w-6 text-indigo-500" />
          <span>Explore Countries</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((c) => (
            <Link
              key={c.id}
              href={`/countries/${c.code}`}
              className="glass-card p-6 rounded-xl block hover:-translate-y-1 transition duration-300 relative group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{c.flagUrl}</span>
                <span className="text-zinc-500 group-hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider">
                  View →
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {c.name}
              </h3>
              <p className="text-zinc-400 text-sm line-clamp-3 mb-4">
                {c.overview}
              </p>
              
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-zinc-850 pt-4 text-zinc-500">
                <div>
                  <span className="font-semibold text-zinc-400">System:</span>
                  <p className="truncate">{c.name === 'USA' ? 'Federal Republic' : 'Parliamentary'}</p>
                </div>
                <div>
                  <span className="font-semibold text-zinc-400">Type:</span>
                  <p>{c.code === 'UK' ? 'Uncodified' : 'Written'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Educational Portal Teaser */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl space-y-3">
          <Shield className="h-8 w-8 text-indigo-500" />
          <h3 className="text-lg font-bold text-white">Compare Constitutions</h3>
          <p className="text-zinc-400 text-sm">
            Analyze differences side-by-side between rights, executive powers, and judiciary branches of multiple nations.
          </p>
          <Link href="/compare" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition block pt-2">
            Try Comparison Tool →
          </Link>
        </div>

        <div className="glass-card p-6 rounded-xl space-y-3">
          <Scale className="h-8 w-8 text-amber-500" />
          <h3 className="text-lg font-bold text-white">Interactive Mind Maps</h3>
          <p className="text-zinc-400 text-sm">
            Visualize federalism, speech freedoms, and judicial reviews as structured SVG diagram maps with pan & zoom controls.
          </p>
          <Link href="/mindmap" className="text-sm font-semibold text-amber-400 hover:text-amber-300 transition block pt-2">
            Open Map Builder →
          </Link>
        </div>

        <div className="glass-card p-6 rounded-xl space-y-3">
          <HelpCircle className="h-8 w-8 text-emerald-500" />
          <h3 className="text-lg font-bold text-white">Constitutional Quizzes</h3>
          <p className="text-zinc-400 text-sm">
            Self-test your knowledge using easy, medium, or hard quiz questionnaires comprising MCQs, True/False, and scenario cases.
          </p>
          <Link href="/quiz" className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition block pt-2">
            Enter Quiz Arena →
          </Link>
        </div>
      </div>
    </div>
  );
}
