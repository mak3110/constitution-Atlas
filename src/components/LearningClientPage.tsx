'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Flame, CheckCircle2, Bookmark, ArrowRight, Play, Award } from 'lucide-react';

interface Lesson {
  id: string;
  roleTarget: string;
  dayNumber: number;
  title: string;
  content: string;
}

interface User {
  id: string;
  name: string;
  role: string;
  streakCount: number;
}

interface LearningClientPageProps {
  user: User;
  lessons: Lesson[];
  completedCount: number;
}

export function LearningClientPage({ user, lessons, completedCount }: LearningClientPageProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const handleCompleteLesson = (lessonId: string) => {
    setCompletedLessons(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  };

  const getRoleFriendlyName = (role: string) => {
    switch (role) {
      case 'STUDENT': return 'Student Curriculum';
      case 'CITIZEN': return 'Civic Citizen Track';
      case 'EXAM_ASPIRANT': return 'Competitive Exam Aspirant';
      case 'RESEARCHER': return 'Constitutional Researcher';
      case 'JOURNALIST': return 'Press & Media Guide';
      default: return 'General Study Path';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 h-32 w-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            {getRoleFriendlyName(user.role)}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Welcome back, {user.name}!
          </h1>
          <p className="text-zinc-400 text-sm max-w-md">
            Your structured learning track is custom-tailored for your profile. Learn daily lessons and practice revision tests.
          </p>
        </div>

        {/* Streak & Achievements dashboard */}
        <div className="flex gap-4">
          <div className="glass-card p-4 rounded-xl text-center min-w-[120px] bg-amber-500/5 border-amber-500/10">
            <Flame className="h-6 w-6 text-amber-500 mx-auto animate-pulse" />
            <span className="text-2xl font-black text-white block mt-1">
              {user.streakCount}
            </span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              Learning Streak
            </span>
          </div>

          <div className="glass-card p-4 rounded-xl text-center min-w-[120px] bg-emerald-500/5 border-emerald-500/10">
            <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto" />
            <span className="text-2xl font-black text-white block mt-1">
              {completedCount + completedLessons.size}
            </span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              Items Finished
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Left Column: Lesson checklist timeline */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-zinc-850 pb-3">
            <BookOpen className="h-4 w-4 text-indigo-400" />
            <span>Daily Lesson Checklist</span>
          </h3>

          <div className="space-y-3">
            {lessons.map((lesson) => {
              const isChecked = completedLessons.has(lesson.id);
              return (
                <div 
                  key={lesson.id}
                  className={`glass-card p-4 rounded-xl flex items-center justify-between border hover:border-zinc-700 transition ${
                    selectedLesson?.id === lesson.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-zinc-850'
                  }`}
                >
                  <div 
                    onClick={() => setSelectedLesson(lesson)}
                    className="flex-1 cursor-pointer pr-4"
                  >
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">
                      Day {lesson.dayNumber}
                    </span>
                    <h4 className="font-bold text-white text-sm leading-tight group-hover:text-indigo-400">
                      {lesson.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => handleCompleteLesson(lesson.id)}
                    className={`p-1.5 rounded-lg border transition cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }`}
                    title={isChecked ? 'Mark Incomplete' : 'Mark Complete'}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Lesson Viewer */}
        <div className="md:col-span-2">
          {selectedLesson ? (
            <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6 shadow-xl relative">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Day {selectedLesson.dayNumber} Lesson Content
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                {selectedLesson.title}
              </h2>

              <div className="text-zinc-300 text-sm md:text-base leading-relaxed space-y-4 whitespace-pre-wrap border-t border-zinc-850 pt-6">
                {selectedLesson.content}
              </div>

              {/* Revision trigger & custom quiz builder callouts */}
              <div className="grid md:grid-cols-2 gap-4 border-t border-zinc-850 pt-6">
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-850 space-y-3">
                  <Bookmark className="h-5 w-5 text-amber-500" />
                  <h4 className="text-sm font-bold text-white leading-tight">Practice Revision Test</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Test your memory immediately on the concepts covered in this lesson.
                  </p>
                  <Link
                    href={`/quiz?topic=Fundamental+Rights`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-450 hover:text-indigo-350 transition"
                  >
                    <span>Launch Quiz</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-850 space-y-3">
                  <Award className="h-5 w-5 text-emerald-500" />
                  <h4 className="text-sm font-bold text-white leading-tight">Complete & Streak</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Finished reading the lesson? Mark it complete to earn point awards and update streaks.
                  </p>
                  <button
                    onClick={() => handleCompleteLesson(selectedLesson.id)}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-450 hover:text-emerald-350 transition cursor-pointer bg-transparent border-0"
                  >
                    <span>{completedLessons.has(selectedLesson.id) ? 'Mark Incomplete' : 'Complete Lesson'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-zinc-500 rounded-2xl">
              Select a lesson from the checklist on the left to begin your daily learning!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
