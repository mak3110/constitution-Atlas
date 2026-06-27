'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Book, ShieldAlert, Award, FileText, Sparkles, Smile, Landmark, Heart } from 'lucide-react';

interface Article {
  id: string;
  articleNumber: string;
  title: string;
  originalText: string;
  simplifiedExplanation: string;
  childFriendlyExplanation: string;
  realLifeExample: string;
  keyTakeaways: string;
  topic: string;
}

interface Amendment {
  id: string;
  title: string;
  year: string;
  description: string;
  detail: string;
}

interface Country {
  id: string;
  name: string;
  code: string;
  flagUrl: string;
  overview: string;
  governmentStructure: string;
  fundamentalRights: string;
  history: string;
  articles: Article[];
  amendments: Amendment[];
}

interface CountryClientPageProps {
  country: Country;
  initialSelectedArticleId: string | null;
}

export function CountryClientPage({ country, initialSelectedArticleId }: CountryClientPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'amendments'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [explanationStyle, setExplanationStyle] = useState<'original' | 'simplified' | 'child' | 'example' | 'takeaways'>('simplified');

  // Set initial selected article from query param if available
  useEffect(() => {
    if (initialSelectedArticleId) {
      const art = country.articles.find(a => a.id === initialSelectedArticleId);
      if (art) {
        setSelectedArticle(art);
        setActiveTab('articles');
      }
    } else if (country.articles.length > 0 && !selectedArticle) {
      setSelectedArticle(country.articles[0]);
    }
  }, [initialSelectedArticleId, country.articles]);

  // Filter articles based on search
  const filteredArticles = country.articles.filter(art => {
    const query = searchQuery.toLowerCase();
    return (
      art.articleNumber.toLowerCase().includes(query) ||
      art.title.toLowerCase().includes(query) ||
      art.originalText.toLowerCase().includes(query) ||
      art.topic.toLowerCase().includes(query)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
      {/* Title Header */}
      <div className="flex items-center space-x-4 border-b border-zinc-850 pb-6">
        <span className="text-5xl md:text-6xl">{country.flagUrl}</span>
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">{country.name} Constitution</h1>
          <p className="text-zinc-400 text-sm md:text-base mt-1">
            Explore articles, structure, and amendments in plain, readable English.
          </p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex space-x-2 border-b border-zinc-850 p-1 max-w-md">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-center rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex-1 py-2 text-center rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'articles'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Provisions ({country.articles.length})
        </button>
        <button
          onClick={() => setActiveTab('amendments')}
          className={`flex-1 py-2 text-center rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'amendments'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Amendments ({country.amendments.length})
        </button>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="glass-card p-6 md:p-8 rounded-xl space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                <span>Constitutional Summary</span>
              </h2>
              <div className="text-zinc-300 leading-relaxed text-sm md:text-base space-y-4 whitespace-pre-wrap">
                {country.overview}
              </div>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-xl space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <Landmark className="h-5 w-5 text-indigo-500" />
                <span>Government Structure</span>
              </h2>
              <div className="text-zinc-300 leading-relaxed text-sm md:text-base space-y-4 whitespace-pre-wrap">
                {country.governmentStructure}
              </div>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-xl space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <Heart className="h-5 w-5 text-indigo-500" />
                <span>Rights & Freedoms</span>
              </h2>
              <div className="text-zinc-300 leading-relaxed text-sm md:text-base space-y-4 whitespace-pre-wrap">
                {country.fundamentalRights}
              </div>
            </div>
          </div>

          {/* History Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-bold text-white">Historical Context</h3>
              <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                {country.history}
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-bold text-white">Quick Tasks</h3>
              <div className="grid gap-3">
                <Link
                  href={`/quiz?c=${country.code}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-850 text-sm transition"
                >
                  <span className="text-zinc-200">Take a Practice Quiz</span>
                  <span className="text-indigo-400 font-bold">→</span>
                </Link>
                <Link
                  href={`/compare?c1=${country.code}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-850 text-sm transition"
                >
                  <span className="text-zinc-200">Compare with USA/India</span>
                  <span className="text-indigo-400 font-bold">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles / Provisions Tab Content */}
      {activeTab === 'articles' && (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Article Selector Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg glass-input text-white text-sm"
              />
            </div>

            <div className="glass-card rounded-xl overflow-hidden max-h-[600px] overflow-y-auto divide-y divide-zinc-850">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => {
                      setSelectedArticle(art);
                      setExplanationStyle('simplified');
                    }}
                    className={`w-full text-left p-4 hover:bg-zinc-800/30 transition block cursor-pointer ${
                      selectedArticle?.id === art.id ? 'bg-indigo-600/10 border-l-2 border-indigo-500' : ''
                    }`}
                  >
                    <span className="text-xs font-semibold text-indigo-400 block mb-1 uppercase">
                      {art.topic}
                    </span>
                    <h4 className="text-white font-bold text-sm truncate">
                      {art.articleNumber}: {art.title}
                    </h4>
                    <p className="text-zinc-400 text-xs truncate mt-0.5">
                      {art.originalText}
                    </p>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-zinc-500 text-sm">No articles match your search.</div>
              )}
            </div>
          </div>

          {/* Plain Language Explanations Area */}
          <div className="md:col-span-2">
            {selectedArticle ? (
              <div className="glass-card p-6 md:p-8 rounded-xl space-y-6">
                <div>
                  <span className="text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded uppercase">
                    {selectedArticle.topic}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
                    {selectedArticle.articleNumber}: {selectedArticle.title}
                  </h2>
                </div>

                {/* Plain Language Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-zinc-850 pb-3">
                  <button
                    onClick={() => setExplanationStyle('original')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      explanationStyle === 'original'
                        ? 'bg-zinc-800 text-white border border-zinc-700'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    ⚖️ Original Text
                  </button>
                  <button
                    onClick={() => setExplanationStyle('simplified')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      explanationStyle === 'simplified'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    ✨ Simplified
                  </button>
                  <button
                    onClick={() => setExplanationStyle('child')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      explanationStyle === 'child'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    👶 Child-Friendly
                  </button>
                  <button
                    onClick={() => setExplanationStyle('example')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      explanationStyle === 'example'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    💡 Real-Life Example
                  </button>
                  <button
                    onClick={() => setExplanationStyle('takeaways')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      explanationStyle === 'takeaways'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    📌 Key Takeaways
                  </button>
                </div>

                {/* Explanation Content Box */}
                <div className="min-h-[220px] bg-zinc-950/60 border border-zinc-850 p-6 rounded-xl relative overflow-hidden">
                  {explanationStyle === 'original' && (
                    <div className="space-y-4">
                      <h4 className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Official Constitutional Text</h4>
                      <p className="text-zinc-200 text-base italic leading-relaxed whitespace-pre-wrap font-serif">
                        "{selectedArticle.originalText}"
                      </p>
                    </div>
                  )}

                  {explanationStyle === 'simplified' && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-indigo-400">
                        <Sparkles className="h-4 w-4" />
                        <h4 className="text-xs uppercase font-bold tracking-wider">Simplified Interpretation</h4>
                      </div>
                      <p className="text-zinc-200 text-base leading-relaxed whitespace-pre-wrap">
                        {selectedArticle.simplifiedExplanation}
                      </p>
                    </div>
                  )}

                  {explanationStyle === 'child' && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <Smile className="h-4 w-4" />
                        <h4 className="text-xs uppercase font-bold tracking-wider">Analogy for 13-Year-Olds</h4>
                      </div>
                      <p className="text-zinc-200 text-base leading-relaxed whitespace-pre-wrap">
                        {selectedArticle.childFriendlyExplanation}
                      </p>
                    </div>
                  )}

                  {explanationStyle === 'example' && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-amber-400">
                        <Landmark className="h-4 w-4" />
                        <h4 className="text-xs uppercase font-bold tracking-wider">Real-Life Application</h4>
                      </div>
                      <p className="text-zinc-200 text-base leading-relaxed whitespace-pre-wrap bg-amber-500/5 border border-amber-500/10 p-4 rounded-lg">
                        {selectedArticle.realLifeExample}
                      </p>
                    </div>
                  )}

                  {explanationStyle === 'takeaways' && (
                    <div className="space-y-4">
                      <h4 className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Essential Takeaways</h4>
                      <ul className="grid gap-3">
                        {selectedArticle.keyTakeaways.split('\n').map((takeaway, idx) => (
                          <li key={idx} className="flex items-start space-x-3 text-zinc-200 text-sm bg-purple-500/5 border border-purple-500/10 p-3 rounded-lg">
                            <span className="flex-shrink-0 h-5 w-5 bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center rounded text-xs font-bold">
                              {idx + 1}
                            </span>
                            <span>{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 rounded-xl text-center text-zinc-500">
                Select an article from the list to view translations and explanations.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Amendments Tab Content */}
      {activeTab === 'amendments' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Constitutional Amendments</h2>
            <p className="text-zinc-400 text-sm">
              Constitutions are not set in stone. They change as society progresses. Here are the major reforms made to the constitution of {country.name}.
            </p>
          </div>

          <div className="grid gap-6">
            {country.amendments.length > 0 ? (
              country.amendments.map((amend) => (
                <div key={amend.id} className="glass-card p-6 rounded-xl space-y-4 hover:border-indigo-500/30 transition">
                  <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                    <h3 className="text-xl font-bold text-white">{amend.title}</h3>
                    <span className="px-3 py-1 rounded bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
                      Year: {amend.year}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {amend.description}
                  </p>
                  <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-lg space-y-1">
                    <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider block">Simplified Detail</span>
                    <p className="text-zinc-400 text-xs leading-relaxed whitespace-pre-wrap">
                      {amend.detail}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card p-12 text-center text-zinc-500 rounded-xl">
                No major historical amendments logged for {country.name} in this MVP version.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
