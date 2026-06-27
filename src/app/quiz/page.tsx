'use client';

import { useState, useTransition } from 'react';
import { getQuizQuestionsAction, submitQuizScoreAction } from '@/app/actions/quiz';
import { Trophy, HelpCircle, ArrowRight, Play, RotateCcw, Flame } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  type: string;
  country: string;
}

export default function QuizPage() {
  const [topic, setTopic] = useState('Fundamental Rights');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');
  const [type, setType] = useState<'MCQ' | 'TF' | 'BLANK' | 'SCENARIO'>('MCQ');
  const [countryCode, setCountryCode] = useState('IN');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [blankInput, setBlankInput] = useState('');
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizState, setQuizState] = useState<'setup' | 'playing' | 'results'>('setup');
  const [newStreak, setNewStreak] = useState<number | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleStartQuiz = () => {
    startTransition(async () => {
      const res = await getQuizQuestionsAction(topic, difficulty, type);
      if (res.success && res.questions && res.questions.length > 0) {
        setQuestions(res.questions as Question[]);
        setScore(0);
        setCurrentIdx(0);
        setSelectedAnswer(null);
        setBlankInput('');
        setIsAnswerChecked(false);
        setNewStreak(null);
        setQuizState('playing');
      } else {
        alert('No questions found for this topic/configuration. Try a different topic or difficulty.');
      }
    });
  };

  const handleCheckAnswer = () => {
    if (isAnswerChecked) return;

    let correct = false;
    const currentQ = questions[currentIdx];

    if (currentQ.type === 'BLANK') {
      correct = blankInput.trim().toLowerCase() === currentQ.correctAnswer.toLowerCase();
    } else {
      correct = selectedAnswer === currentQ.correctAnswer;
    }

    if (correct) {
      setScore(s => s + 1);
    }
    setIsAnswerChecked(true);
  };

  const handleNext = async () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(c => c + 1);
      setSelectedAnswer(null);
      setBlankInput('');
      setIsAnswerChecked(false);
    } else {
      // Quiz complete
      setQuizState('results');
      // Submit score to track streak
      const res = await submitQuizScoreAction(score + (isAnswerChecked && isCurrentCorrect() ? 1 : 0), countryCode, topic);
      if (res.success && res.newStreak) {
        setNewStreak(res.newStreak);
      }
    }
  };

  const isCurrentCorrect = () => {
    const currentQ = questions[currentIdx];
    if (currentQ.type === 'BLANK') {
      return blankInput.trim().toLowerCase() === currentQ.correctAnswer.toLowerCase();
    }
    return selectedAnswer === currentQ.correctAnswer;
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Title */}
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-white flex items-center justify-center space-x-3">
          <Trophy className="h-9 w-9 text-indigo-500" />
          <span>Quiz Arena</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto">
          Test your constitutional knowledge. Accumulate streaks and unlock achievements.
        </p>
      </div>

      {/* Setup screen */}
      {quizState === 'setup' && (
        <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <h2 className="text-xl font-bold text-white border-b border-zinc-850 pb-3">Quiz Settings</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Target Country</label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg glass-input text-white bg-zinc-900 text-sm cursor-pointer"
              >
                <option value="IN">🇮🇳 India</option>
                <option value="US">🇺🇸 United States</option>
                <option value="UK">🇬🇧 United Kingdom</option>
                <option value="FR">🇫🇷 France</option>
                <option value="JP">🇯🇵 Japan</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Constitutional Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg glass-input text-white bg-zinc-900 text-sm cursor-pointer"
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

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Question Format</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-lg glass-input text-white bg-zinc-900 text-sm cursor-pointer"
              >
                <option value="MCQ">Multiple Choice Questions (MCQ)</option>
                <option value="TF">True / False</option>
                <option value="BLANK">Fill in the Blanks</option>
                <option value="SCENARIO">Scenario-Based Case Studies</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Difficulty Rating</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-lg glass-input text-white bg-zinc-900 text-sm cursor-pointer"
              >
                <option value="EASY">🟢 Easy</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="HARD">🔴 Hard (Advanced)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={isPending}
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/15 flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isPending ? (
              <span>Preparing Quiz Questions...</span>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>Begin Test Arena</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Playing Quiz screen */}
      {quizState === 'playing' && questions.length > 0 && (
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Topic: <b className="text-zinc-200">{topic}</b></span>
            <span>Question {currentIdx + 1} of {questions.length}</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
            />
          </div>

          {/* Active Question Card */}
          <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6 shadow-xl relative">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
              Question Context: {questions[currentIdx].country}
            </span>
            <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">
              {questions[currentIdx].question}
            </h3>

            {/* Answer Selector Box */}
            <div className="space-y-3">
              {questions[currentIdx].type === 'BLANK' ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={blankInput}
                    onChange={(e) => setBlankInput(e.target.value)}
                    disabled={isAnswerChecked}
                    placeholder="Type your answer here..."
                    className="w-full px-4 py-3 rounded-lg glass-input text-white text-sm"
                  />
                </div>
              ) : (
                questions[currentIdx].options.map((option, idx) => {
                  let btnStyle = 'border-zinc-850 hover:bg-zinc-800/40 text-zinc-300';
                  
                  if (isAnswerChecked) {
                    if (option === questions[currentIdx].correctAnswer) {
                      btnStyle = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400';
                    } else if (selectedAnswer === option) {
                      btnStyle = 'border-red-500/40 bg-red-500/10 text-red-400';
                    } else {
                      btnStyle = 'border-zinc-850 text-zinc-600 opacity-60';
                    }
                  } else if (selectedAnswer === option) {
                    btnStyle = 'border-indigo-500 bg-indigo-500/5 text-white';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !isAnswerChecked && setSelectedAnswer(option)}
                      disabled={isAnswerChecked}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition font-medium block cursor-pointer ${btnStyle}`}
                    >
                      {option}
                    </button>
                  );
                })
              )}
            </div>

            {/* Checker / Explanator box */}
            {isAnswerChecked && (
              <div className={`p-5 rounded-xl border transition-all ${
                isCurrentCorrect()
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/5 border-red-500/20 text-red-400'
              }`}>
                <div className="flex items-center space-x-2 font-bold mb-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>{isCurrentCorrect() ? 'Correct!' : 'Incorrect'}</span>
                </div>
                <p className="text-zinc-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                  {questions[currentIdx].explanation}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end pt-4 border-t border-zinc-850">
              {!isAnswerChecked ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={questions[currentIdx].type === 'BLANK' ? !blankInput.trim() : !selectedAnswer}
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Check Answer</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>{currentIdx + 1 === questions.length ? 'Show Results' : 'Next Question'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results screen */}
      {quizState === 'results' && (
        <div className="glass-card p-8 rounded-2xl text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-36 w-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="h-16 w-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-500 text-2xl animate-bounce">
            🏆
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Quiz Finished!</h2>
            <p className="text-zinc-400 text-sm">
              You completed the quiz on <span className="font-semibold text-zinc-200">{topic}</span>.
            </p>
          </div>

          <div className="max-w-[200px] mx-auto p-4 bg-zinc-900 border border-zinc-850 rounded-xl space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Your Score</span>
            <span className="text-3xl font-black text-white">{score} / {questions.length}</span>
            <span className="text-[10px] text-zinc-400 block pt-1 font-semibold">
              ({Math.round((score / questions.length) * 100)}% Accuracy)
            </span>
          </div>

          {/* New streak announcement */}
          {newStreak !== null && (
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-4 py-2 rounded-xl text-sm font-bold mx-auto">
              <Flame className="h-5 w-5 fill-amber-500 animate-pulse" />
              <span>Streak Incremented! 🔥 {newStreak} Days Active</span>
            </div>
          )}

          <div className="flex justify-center gap-4 pt-4 border-t border-zinc-850">
            <button
              onClick={() => setQuizState('setup')}
              className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition flex items-center space-x-1.5 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Configure New Quiz</span>
            </button>
            <a
              href="/learning"
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center space-x-1.5"
            >
              <span>Back to Lessons</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
