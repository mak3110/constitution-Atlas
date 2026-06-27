'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser } from '@/app/actions/auth';
import { Shield, Sparkles, Compass } from 'lucide-react';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      let res;
      if (isRegister) {
        res = await registerUser(null, formData);
      } else {
        res = await loginUser(null, formData);
      }

      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        // Redirect to dashboard/home page
        router.push('/');
        router.refresh();
      }
    });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-2xl shadow-xl relative overflow-hidden">
        {/* Glow element */}
        <div className="absolute -top-12 -right-12 h-32 w-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Title branding */}
        <div className="flex flex-col items-center space-y-3">
          <div className="h-12 w-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
            <Compass className="h-6 w-6 text-indigo-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-zinc-400 text-xs text-center max-w-[280px]">
            {isRegister
              ? 'Join Constitution Atlas AI to track lessons and take quizzes.'
              : 'Sign in to access personalized quizzes, history, and learning tracks.'}
          </p>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3.5 rounded-lg text-center font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-zinc-400">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="John Doe"
                className="w-full px-4 py-2.5 rounded-lg glass-input text-white text-sm"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-zinc-400">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-lg glass-input text-white text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-zinc-400">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg glass-input text-white text-sm"
            />
          </div>

          {isRegister && (
            <div className="space-y-1.5">
              <label htmlFor="role" className="text-xs font-semibold text-zinc-400">Your Learning Profile</label>
              <select
                id="role"
                name="role"
                defaultValue="CITIZEN"
                className="w-full px-4 py-2.5 rounded-lg glass-input text-zinc-300 bg-zinc-900 text-sm cursor-pointer"
              >
                <option value="CITIZEN">🙋 Ordinary Citizen (Learn rights & systems)</option>
                <option value="STUDENT">📚 School/College Student (Academics & basics)</option>
                <option value="EXAM_ASPIRANT">🏅 Exam Aspirant (Competitive preparation)</option>
                <option value="RESEARCHER">🔬 Researcher (Historical & deep-dives)</option>
                <option value="JOURNALIST">📰 Journalist (Quick lookups & quotes)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-750 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/15 flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isPending ? (
              <span>Processing...</span>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                <span>{isRegister ? 'Sign Up' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Switch */}
        <div className="text-center text-xs text-zinc-500 pt-4 border-t border-zinc-850">
          {isRegister ? 'Already have an account?' : 'New to Constitution Atlas?'}{' '}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-indigo-400 hover:text-indigo-300 font-bold underline transition cursor-pointer"
          >
            {isRegister ? 'Sign In instead' : 'Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
}
