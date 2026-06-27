import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { Compass, BookOpen, MessageSquare, BarChart2, Award, ShieldAlert, GitFork, User as UserIcon, LogOut } from 'lucide-react';
import { logoutUser } from '@/app/actions/auth';

export async function Navbar() {
  const user = await getSessionUser();

  return (
    <nav className="glass-card sticky top-0 z-50 w-full border-b border-zinc-850 px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 text-xl font-bold tracking-tight text-white hover:opacity-90">
          <Compass className="h-6 w-6 text-indigo-500" />
          <span className="text-gradient-primary">Constitution Atlas AI</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-1 text-sm font-medium text-zinc-300">
          <Link href="/" className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-zinc-800/50 hover:text-white transition">
            <Compass className="h-4 w-4" />
            <span>Atlas</span>
          </Link>
          <Link href="/compare" className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-zinc-800/50 hover:text-white transition">
            <GitFork className="h-4 w-4" />
            <span>Compare</span>
          </Link>
          <Link href="/chat" className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-zinc-800/50 hover:text-white transition">
            <MessageSquare className="h-4 w-4" />
            <span>AI Assistant</span>
          </Link>
          <Link href="/mindmap" className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-zinc-800/50 hover:text-white transition">
            <BarChart2 className="h-4 w-4" />
            <span>Mind Maps</span>
          </Link>
          <Link href="/quiz" className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-zinc-800/50 hover:text-white transition">
            <Award className="h-4 w-4" />
            <span>Quiz Arena</span>
          </Link>
          <Link href="/learning" className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-zinc-800/50 hover:text-white transition">
            <BookOpen className="h-4 w-4" />
            <span>Learning</span>
          </Link>
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-red-950/20 text-red-400 hover:text-red-300 border border-red-900/30 transition">
              <ShieldAlert className="h-4 w-4" />
              <span>Admin CMS</span>
            </Link>
          )}
        </div>

        {/* User profile / Login */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex flex-col text-right text-xs">
                <span className="font-semibold text-zinc-200">{user.name}</span>
                <span className="text-zinc-400 text-[10px] uppercase tracking-wider">{user.role}</span>
              </div>
              
              {/* Streak info */}
              {user.streakCount > 0 && (
                <div className="flex items-center space-x-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-1 rounded-lg text-xs font-semibold">
                  <span>🔥</span>
                  <span>{user.streakCount} Day Streak</span>
                </div>
              )}

              {/* Logout Button */}
              <form action={logoutUser} className="inline">
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
            >
              <UserIcon className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
