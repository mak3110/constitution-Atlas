'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { sendMessageAction } from '@/app/actions/chat';
import { Send, MessageSquare, BookOpen, Compass, HelpCircle, ArrowRight } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Source {
  country: string;
  flag: string;
  articleNumber: string;
  title: string;
  originalText: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [isPending, startTransition] = useTransition();
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isPending) return;

    const userMessage = text.trim();
    setInput('');
    
    // Add user message to UI
    const updatedMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);

    // Call server action
    startTransition(async () => {
      const result = await sendMessageAction(userMessage, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: result.response }]);
      if (result.sources && result.sources.length > 0) {
        setSources(result.sources as Source[]);
        setSelectedSource(result.sources[0] as Source);
      } else {
        setSources([]);
        setSelectedSource(null);
      }
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const suggestedQuestions = [
    'What is Article 21 of India?',
    'What is the First Amendment of the USA?',
    'How does the UK constitution work?',
    'Does Japan protect freedom of speech?'
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 h-[88vh] flex flex-col md:flex-row gap-6">
      {/* Left Column: Chat Container */}
      <div className="flex-1 flex flex-col glass-card rounded-2xl overflow-hidden h-full shadow-xl">
        {/* Chat Header */}
        <div className="bg-zinc-900/80 border-b border-zinc-850 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-indigo-600/10 border border-indigo-500/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">AI Constitutional Assistant</h2>
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                Retrieval-Augmented Generation (RAG)
              </span>
            </div>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
              <Compass className="h-16 w-16 text-indigo-500 animate-pulse-slow" />
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Ask anything about Constitutions</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Ask questions about fundamental rights, speech, court reviews, or articles of India, US, UK, France, and Japan. I refer to original documents to answer without hallucinations.
                </p>
              </div>

              {/* Suggestions */}
              <div className="grid gap-2 w-full">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="w-full text-left p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-850 text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-between group transition cursor-pointer"
                  >
                    <span>{q}</span>
                    <ArrowRight className="h-3 w-3 text-indigo-400 group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/10'
                      : 'bg-zinc-900 border border-zinc-850 text-zinc-100 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {isPending && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 border border-zinc-850 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center space-x-1.5">
                <div className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleFormSubmit} className="bg-zinc-900/60 border-t border-zinc-850 p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question (e.g. How does UK constitution work?)..."
              disabled={isPending}
              className="flex-1 px-4 py-2.5 rounded-lg glass-input text-white text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || isPending}
              className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 text-white rounded-lg transition cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Right Column: References/Sources drawer */}
      {sources.length > 0 && (
        <div className="w-full md:w-80 flex flex-col gap-4 h-full">
          <div className="glass-card rounded-2xl p-5 shadow-xl flex-1 flex flex-col overflow-hidden max-h-[88vh]">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-zinc-850 pb-3 mb-4">
              <BookOpen className="h-4 w-4 text-indigo-500" />
              <span>Context Citations ({sources.length})</span>
            </h3>

            {/* List of Sources */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {sources.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSource(s)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition cursor-pointer ${
                    selectedSource?.articleNumber === s.articleNumber && selectedSource?.country === s.country
                      ? 'bg-indigo-600/10 border-indigo-500/30'
                      : 'bg-zinc-900/50 border-zinc-850 hover:bg-zinc-800/45'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <span>{s.flag}</span>
                    <span className="font-bold text-zinc-300">{s.country}</span>
                  </div>
                  <h4 className="font-extrabold text-white truncate">{s.articleNumber}</h4>
                  <p className="text-zinc-500 truncate mt-0.5">{s.title}</p>
                </button>
              ))}
            </div>

            {/* Display Selected Source Details */}
            {selectedSource && (
              <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 space-y-2.5 overflow-y-auto max-h-[40%] flex-shrink-0">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Original Source Document Text
                </span>
                <h4 className="font-bold text-white text-xs leading-snug">
                  {selectedSource.articleNumber}: {selectedSource.title}
                </h4>
                <p className="text-zinc-400 text-xs italic leading-relaxed whitespace-pre-wrap font-serif">
                  "{selectedSource.originalText}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
