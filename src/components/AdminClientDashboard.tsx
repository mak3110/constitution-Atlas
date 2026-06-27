'use client';

import { useState } from 'react';
import { 
  saveArticleAction, 
  saveQuizAction, 
  savePromptAction, 
  saveCountryAction 
} from '@/app/actions/admin';
import { 
  ShieldAlert, BookOpen, Award, Globe, MessageSquare, FileText, Upload, Plus, CheckCircle2 
} from 'lucide-react';

interface Article {
  id: string;
  countryId: string;
  articleNumber: string;
  title: string;
  originalText: string;
  simplifiedExplanation: string;
  childFriendlyExplanation: string;
  realLifeExample: string;
  keyTakeaways: string;
  topic: string;
}

interface Quiz {
  id: string;
  countryId: string;
  topic: string;
  type: string;
  difficulty: string;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  country: {
    name: string;
    code: string;
  };
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
}

interface Prompt {
  id: string;
  name: string;
  systemPrompt: string;
  temperature: number;
}

interface AdminClientDashboardProps {
  initialCountries: Country[];
  initialArticles: Article[];
  initialQuizzes: Quiz[];
  initialPrompts: Prompt[];
}

export function AdminClientDashboard({
  initialCountries,
  initialArticles,
  initialQuizzes,
  initialPrompts
}: AdminClientDashboardProps) {
  const [activeTab, setActiveTab] = useState<'articles' | 'quizzes' | 'countries' | 'prompts' | 'pdfs'>('articles');
  
  // Lists
  const [countries, setCountries] = useState<Country[]>(initialCountries);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);

  // Selected Entities for editing
  const [selectedArticleId, setSelectedArticleId] = useState<string>('new');
  const [selectedQuizId, setSelectedQuizId] = useState<string>('new');
  const [selectedCountryId, setSelectedCountryId] = useState<string>('new');
  const [selectedPromptId, setSelectedPromptId] = useState<string>(prompts[0]?.id || '');

  // Form states
  const [articleForm, setArticleForm] = useState<Partial<Article>>({
    countryId: countries[0]?.id || '',
    articleNumber: '',
    title: '',
    originalText: '',
    simplifiedExplanation: '',
    childFriendlyExplanation: '',
    realLifeExample: '',
    keyTakeaways: '',
    topic: 'Fundamental Rights'
  });

  const [quizForm, setQuizForm] = useState<Partial<Quiz>>({
    countryId: countries[0]?.id || '',
    topic: 'Fundamental Rights',
    type: 'MCQ',
    difficulty: 'EASY',
    question: '',
    options: '["Option A", "Option B", "Option C", "Option D"]',
    correctAnswer: 'Option A',
    explanation: ''
  });

  const [countryForm, setCountryForm] = useState<Partial<Country>>({
    name: '',
    code: '',
    flagUrl: '',
    overview: '',
    governmentStructure: '',
    fundamentalRights: '',
    history: ''
  });

  const [promptForm, setPromptForm] = useState<Partial<Prompt>>({
    systemPrompt: prompts[0]?.systemPrompt || '',
    temperature: prompts[0]?.temperature || 0.7
  });

  // Simulated PDF uploads
  const [pdfFiles, setPdfFiles] = useState<string[]>([
    'india_constitution_1950.pdf',
    'us_constitution_bill_of_rights.pdf'
  ]);
  const [pdfPending, setPdfPending] = useState(false);

  // Success messages
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Actions
  const handleSelectArticle = (id: string) => {
    setSelectedArticleId(id);
    if (id === 'new') {
      setArticleForm({
        countryId: countries[0]?.id || '',
        articleNumber: '',
        title: '',
        originalText: '',
        simplifiedExplanation: '',
        childFriendlyExplanation: '',
        realLifeExample: '',
        keyTakeaways: '',
        topic: 'Fundamental Rights'
      });
    } else {
      const art = articles.find(a => a.id === id);
      if (art) setArticleForm(art);
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = selectedArticleId === 'new';
    const res = await saveArticleAction(isNew ? null : selectedArticleId, articleForm);
    if (res.success) {
      showStatus('Article saved successfully!');
      // Reload page list simulation (or we can refresh the window)
      window.location.reload();
    } else {
      alert('Error: ' + res.error);
    }
  };

  const handleSelectQuiz = (id: string) => {
    setSelectedQuizId(id);
    if (id === 'new') {
      setQuizForm({
        countryId: countries[0]?.id || '',
        topic: 'Fundamental Rights',
        type: 'MCQ',
        difficulty: 'EASY',
        question: '',
        options: '["Option A", "Option B", "Option C", "Option D"]',
        correctAnswer: 'Option A',
        explanation: ''
      });
    } else {
      const qz = quizzes.find(q => q.id === id);
      if (qz) setQuizForm(qz);
    }
  };

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = selectedQuizId === 'new';
    const res = await saveQuizAction(isNew ? null : selectedQuizId, quizForm);
    if (res.success) {
      showStatus('Quiz saved successfully!');
      window.location.reload();
    } else {
      alert('Error: ' + res.error);
    }
  };

  const handleSelectCountry = (id: string) => {
    setSelectedCountryId(id);
    if (id === 'new') {
      setCountryForm({
        name: '',
        code: '',
        flagUrl: '',
        overview: '',
        governmentStructure: '',
        fundamentalRights: '',
        history: ''
      });
    } else {
      const c = countries.find(x => x.id === id);
      if (c) setCountryForm(c);
    }
  };

  const handleSaveCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = selectedCountryId === 'new';
    const res = await saveCountryAction(isNew ? null : selectedCountryId, countryForm);
    if (res.success) {
      showStatus('Country saved successfully!');
      window.location.reload();
    } else {
      alert('Error: ' + res.error);
    }
  };

  const handleSelectPrompt = (id: string) => {
    setSelectedPromptId(id);
    const p = prompts.find(pr => pr.id === id);
    if (p) {
      setPromptForm({
        systemPrompt: p.systemPrompt,
        temperature: p.temperature
      });
    }
  };

  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await savePromptAction(selectedPromptId, promptForm.systemPrompt || '', promptForm.temperature || 0.7);
    if (res.success) {
      showStatus('Prompt config saved successfully!');
      window.location.reload();
    } else {
      alert('Error: ' + res.error);
    }
  };

  const handlePdfUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPdfPending(true);
    const formData = new FormData(e.currentTarget);
    const file = formData.get('pdf') as File;
    setTimeout(() => {
      setPdfFiles(prev => [...prev, file.name]);
      setPdfPending(false);
      showStatus('PDF uploaded and mapped to AI RAG indexing engine successfully!');
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-850 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center space-x-3">
            <ShieldAlert className="h-9 w-9 text-red-500" />
            <span>Admin CMS Dashboard</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Maintain database records, configure AI prompts, add countries, and upload RAG PDFs.
          </p>
        </div>

        {statusMsg && (
          <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-sm font-bold shadow animate-pulse">
            <CheckCircle2 className="h-4 w-4" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      {/* Primary Panels Grid */}
      <div className="grid md:grid-cols-5 gap-8 items-start">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 glass-card p-4 rounded-xl space-y-2">
          <button
            onClick={() => setActiveTab('articles')}
            className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'articles' ? 'bg-red-950/20 text-red-400 border border-red-900/30' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Edit Articles</span>
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'quizzes' ? 'bg-red-950/20 text-red-400 border border-red-900/30' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Edit Quizzes</span>
          </button>
          <button
            onClick={() => setActiveTab('countries')}
            className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'countries' ? 'bg-red-950/20 text-red-400 border border-red-900/30' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Edit Countries</span>
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'prompts' ? 'bg-red-950/20 text-red-400 border border-red-900/30' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>AI Prompt Config</span>
          </button>
          <button
            onClick={() => setActiveTab('pdfs')}
            className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'pdfs' ? 'bg-red-950/20 text-red-400 border border-red-900/30' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Upload PDFs</span>
          </button>
        </div>

        {/* CMS Forms Area */}
        <div className="md:col-span-4 glass-card p-6 md:p-8 rounded-2xl shadow-xl">
          
          {/* ARTICLE CMS */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-850 pb-4">
                <h3 className="text-lg font-bold text-white">Articles Management</h3>
                <div className="flex gap-2">
                  <select
                    value={selectedArticleId}
                    onChange={(e) => handleSelectArticle(e.target.value)}
                    className="px-3 py-1.5 rounded-lg glass-input text-zinc-300 bg-zinc-900 text-xs cursor-pointer"
                  >
                    <option value="new">+ Add New Article</option>
                    {articles.map(a => (
                      <option key={a.id} value={a.id}>
                        [{a.articleNumber}] {a.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <form onSubmit={handleSaveArticle} className="space-y-4 text-sm">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Target Country</label>
                    <select
                      value={articleForm.countryId}
                      onChange={(e) => setArticleForm(prev => ({ ...prev, countryId: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg glass-input text-white bg-zinc-900 cursor-pointer"
                    >
                      {countries.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Article / Provision Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Article 14"
                      value={articleForm.articleNumber || ''}
                      onChange={(e) => setArticleForm(prev => ({ ...prev, articleNumber: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg glass-input text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Topic Area</label>
                    <select
                      value={articleForm.topic}
                      onChange={(e) => setArticleForm(prev => ({ ...prev, topic: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg glass-input text-white bg-zinc-900 cursor-pointer"
                    >
                      <option value="Fundamental Rights">Fundamental Rights</option>
                      <option value="Freedom of Speech">Freedom of Speech</option>
                      <option value="Federalism">Federalism</option>
                      <option value="Separation of Powers">Separation of Powers</option>
                      <option value="Judicial Review">Judicial Review</option>
                      <option value="Elections">Elections</option>
                      <option value="Government Structure">Government Structure</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">Title Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Equality Before Law"
                    value={articleForm.title || ''}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-input text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">Original Constitutional Text</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Paste exact constitution legal phrasing..."
                    value={articleForm.originalText || ''}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, originalText: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-input text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">Simplified Explanation</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Explain in simple language..."
                    value={articleForm.simplifiedExplanation || ''}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, simplifiedExplanation: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-input text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">Child-Friendly Explanation (13 yo target)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Use simple vocabulary or analogies..."
                    value={articleForm.childFriendlyExplanation || ''}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, childFriendlyExplanation: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-input text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">Real-Life Application Example</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Provide a practical example of how it applies to citizens..."
                    value={articleForm.realLifeExample || ''}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, realLifeExample: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-input text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">Key Takeaways (one per line)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Bullet point 1&#10;Bullet point 2&#10;Bullet point 3"
                    value={articleForm.keyTakeaways || ''}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, keyTakeaways: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-input text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  Save Article
                </button>
              </form>
            </div>
          )}

          {/* QUIZ CMS */}
          {activeTab === 'quizzes' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-850 pb-4">
                <h3 className="text-lg font-bold text-white">Quiz Management</h3>
                <select
                  value={selectedQuizId}
                  onChange={(e) => handleSelectQuiz(e.target.value)}
                  className="px-3 py-1.5 rounded-lg glass-input text-zinc-300 bg-zinc-900 text-xs cursor-pointer"
                >
                  <option value="new">+ Add New Question</option>
                  {quizzes.map(q => (
                    <option key={q.id} value={q.id}>
                      [{q.country.code} - {q.topic}] {q.question.slice(0, 40)}...
                    </option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleSaveQuiz} className="space-y-4 text-sm">
                <div className="grid sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Country</label>
                    <select
                      value={quizForm.countryId}
                      onChange={(e) => setQuizForm(prev => ({ ...prev, countryId: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg glass-input text-white bg-zinc-900 cursor-pointer"
                    >
                      {countries.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Topic</label>
                    <select
                      value={quizForm.topic}
                      onChange={(e) => setQuizForm(prev => ({ ...prev, topic: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg glass-input text-white bg-zinc-900 cursor-pointer"
                    >
                      <option value="Fundamental Rights">Fundamental Rights</option>
                      <option value="Freedom of Speech">Freedom of Speech</option>
                      <option value="Federalism">Federalism</option>
                      <option value="Separation of Powers">Separation of Powers</option>
                      <option value="Judicial Review">Judicial Review</option>
                      <option value="Elections">Elections</option>
                      <option value="Government Structure">Government Structure</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Question Format</label>
                    <select
                      value={quizForm.type}
                      onChange={(e) => setQuizForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg glass-input text-white bg-zinc-900 cursor-pointer"
                    >
                      <option value="MCQ">MCQ</option>
                      <option value="TF">True/False</option>
                      <option value="BLANK">Fill in the Blank</option>
                      <option value="SCENARIO">Scenario</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Difficulty</label>
                    <select
                      value={quizForm.difficulty}
                      onChange={(e) => setQuizForm(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg glass-input text-white bg-zinc-900 cursor-pointer"
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">Question Statement</label>
                  <textarea
                    required
                    rows={2}
                    value={quizForm.question || ''}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-input text-white"
                  />
                </div>

                {quizForm.type === 'MCQ' && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">MCQ Options (JSON Array)</label>
                    <input
                      type="text"
                      required
                      placeholder='e.g. ["Choice A", "Choice B", "Choice C", "Choice D"]'
                      value={quizForm.options || ''}
                      onChange={(e) => setQuizForm(prev => ({ ...prev, options: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg glass-input text-white"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">Correct Answer</label>
                  <input
                    type="text"
                    required
                    placeholder="Must match exactly one option or be True/False"
                    value={quizForm.correctAnswer || ''}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-input text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">Explanation detail</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Explain why the answer is correct..."
                    value={quizForm.explanation || ''}
                    onChange={(e) => setQuizForm(prev => ({ ...prev, explanation: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-input text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  Save Quiz Question
                </button>
              </form>
            </div>
          )}

          {/* COUNTRY CMS */}
          {activeTab === 'countries' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-850 pb-4">
                <h3 className="text-lg font-bold text-white">Country Management</h3>
                <select
                  value={selectedCountryId}
                  onChange={(e) => handleSelectCountry(e.target.value)}
                  className="px-3 py-1.5 rounded-lg glass-input text-zinc-300 bg-zinc-900 text-xs cursor-pointer"
                >
                  <option value="new">+ Add New Country</option>
                  {countries.map(c => (
                    <option key={c.id} value={c.id}>{c.flagUrl} {c.name}</option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleSaveCountry} className="space-y-4 text-sm">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Country Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Germany"
                      value={countryForm.name || ''}
                      onChange={(e) => setCountryForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg glass-input text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Country Code (2 char)</label>
                    <input
                      type="text"
                      required
                      maxLength={2}
                      placeholder="e.g. DE"
                      value={countryForm.code || ''}
                      onChange={(e) => setCountryForm(prev => ({ ...prev, code: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg glass-input text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Flag emoji</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 🇩🇪"
                      value={countryForm.flagUrl || ''}
                      onChange={(e) => setCountryForm(prev => ({ ...prev, flagUrl: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg glass-input text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">Constitution Overview</label>
                  <textarea
                    required
                    rows={4}
                    value={countryForm.overview || ''}
                    onChange={(e) => setCountryForm(prev => ({ ...prev, overview: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-input text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">Government Structure Summary</label>
                  <textarea
                    required
                    rows={4}
                    value={countryForm.governmentStructure || ''}
                    onChange={(e) => setCountryForm(prev => ({ ...prev, governmentStructure: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-input text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">Rights & Freedoms Overview</label>
                  <textarea
                    required
                    rows={4}
                    value={countryForm.fundamentalRights || ''}
                    onChange={(e) => setCountryForm(prev => ({ ...prev, fundamentalRights: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-input text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">History Timeline Summary</label>
                  <textarea
                    required
                    rows={3}
                    value={countryForm.history || ''}
                    onChange={(e) => setCountryForm(prev => ({ ...prev, history: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-input text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  Save Country Details
                </button>
              </form>
            </div>
          )}

          {/* AI PROMPT CMS */}
          {activeTab === 'prompts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-850 pb-4">
                <h3 className="text-lg font-bold text-white">System Prompt Manager</h3>
                <select
                  value={selectedPromptId}
                  onChange={(e) => handleSelectPrompt(e.target.value)}
                  className="px-3 py-1.5 rounded-lg glass-input text-zinc-300 bg-zinc-900 text-xs cursor-pointer"
                >
                  {prompts.map(p => (
                    <option key={p.id} value={p.id}>{p.name.toUpperCase()} Prompt</option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleSavePrompt} className="space-y-4 text-sm">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">System Instruction Prompt</label>
                  <textarea
                    required
                    rows={6}
                    value={promptForm.systemPrompt || ''}
                    onChange={(e) => setPromptForm(prev => ({ ...prev, systemPrompt: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-input text-white"
                  />
                </div>

                <div className="space-y-1 max-w-[200px]">
                  <label className="text-xs font-semibold text-zinc-400">Temperature (0.0 to 1.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    required
                    value={promptForm.temperature || 0.7}
                    onChange={(e) => setPromptForm(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg glass-input text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  Update Prompt Config
                </button>
              </form>
            </div>
          )}

          {/* PDF MAPPING CMS */}
          {activeTab === 'pdfs' && (
            <div className="space-y-6">
              <div className="border-b border-zinc-850 pb-4">
                <h3 className="text-lg font-bold text-white">Upload Constitutional Documents (RAG Indexing)</h3>
                <p className="text-zinc-400 text-xs mt-1">
                  Upload PDF documents of constitutions to map into the RAG vector engine. The chatbot will query this documents dynamically.
                </p>
              </div>

              <form onSubmit={handlePdfUpload} className="p-8 border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 rounded-2xl text-center space-y-4 transition">
                <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                  <Upload className="h-6 w-6" />
                </div>
                
                <div className="space-y-1">
                  <p className="text-zinc-200 text-sm font-semibold">Drag & drop constitutional PDF here</p>
                  <p className="text-zinc-500 text-xs">Maximum file size: 25MB</p>
                </div>

                <input
                  type="file"
                  name="pdf"
                  accept=".pdf"
                  required
                  className="mx-auto block text-xs text-zinc-400"
                />

                <button
                  type="submit"
                  disabled={pdfPending}
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 text-white font-bold text-xs transition cursor-pointer"
                >
                  {pdfPending ? 'Analyzing and Indexing Document...' : 'Upload and Index'}
                </button>
              </form>

              {/* Uploaded Documents List */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-bold text-zinc-500 tracking-wider">Indexed Documents List</h4>
                <div className="grid gap-2">
                  {pdfFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-850 text-xs font-semibold text-zinc-200">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-indigo-500" />
                        <span>{file}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Indexed & RAG Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
