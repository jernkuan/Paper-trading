import React, { useState } from 'react';
import { useStore } from '../../store';
import { LESSONS } from '../../data/lessons';
import { SkillLevel, LEVEL_LABELS, isAssetClassUnlocked } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { LevelBadge } from '../common/LevelBadge';

const LEVELS: SkillLevel[] = ['novice', 'apprentice', 'trader', 'analyst', 'pro'];

function LessonCard({ lessonId }: { lessonId: string }) {
  const { user, completedLessons, completeLesson } = useStore();
  const [expanded, setExpanded] = useState(false);

  const lesson = LESSONS.find(l => l.id === lessonId);
  if (!lesson) return null;

  const levelOrder: SkillLevel[] = ['novice', 'apprentice', 'trader', 'analyst', 'pro'];
  const isLocked = levelOrder.indexOf(user.level) < levelOrder.indexOf(lesson.minLevel);
  const isCompleted = completedLessons.includes(lesson.id);

  function handleComplete() {
    if (!lesson) return;
    if (!isCompleted) {
      completeLesson(lesson.id, lesson.xpReward);
    }
    setExpanded(false);
  }

  if (isLocked) {
    return (
      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 opacity-60">
        <div className="flex items-center gap-3">
          <span className="text-xl">🔒</span>
          <div>
            <p className="text-sm font-medium text-slate-500">{lesson.title}</p>
            <p className="text-xs text-slate-400">Unlocks at {LEVEL_LABELS[lesson.minLevel]} level</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border transition-all ${
      isCompleted
        ? 'border-emerald-200 bg-emerald-50'
        : 'border-slate-200 bg-white hover:border-blue-200'
    }`}>
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          {isCompleted ? (
            <span className="text-xl">✅</span>
          ) : (
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">
              {lesson.category[0]}
            </span>
          )}
          <div>
            <p className={`text-sm font-semibold ${isCompleted ? 'text-emerald-700' : 'text-slate-800'}`}>
              {lesson.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-400">{lesson.duration}</span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-blue-500">+{lesson.xpReward} XP</span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-slate-400">{lesson.category}</span>
            </div>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          <div className="border-t border-slate-100 pt-4">
            <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed space-y-3">
              {lesson.content.split('\n\n').map((para, i) => {
                // Handle bold text
                const parts = para.split(/(\*\*[^*]+\*\*)/g);
                return (
                  <p key={i}>
                    {parts.map((part, j) =>
                      part.startsWith('**') && part.endsWith('**')
                        ? <strong key={j}>{part.slice(2, -2)}</strong>
                        : part
                    )}
                  </p>
                );
              })}
            </div>
            {!isCompleted && (
              <button
                onClick={handleComplete}
                className="mt-4 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Mark as Complete (+{lesson.xpReward} XP)
              </button>
            )}
            {isCompleted && (
              <p className="mt-3 text-center text-sm text-emerald-600 font-medium">
                ✓ Completed — {lesson.xpReward} XP earned
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function LearningHub() {
  const { user, completedLessons } = useStore();

  const totalLessons = LESSONS.length;
  const completed = completedLessons.length;
  const progress = (completed / totalLessons) * 100;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Learning Hub</h1>
        <p className="text-sm text-slate-400">Short, practical lessons to build your trading knowledge.</p>
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-slate-700">Overall Progress</p>
            <p className="text-xs text-slate-400">{completed} of {totalLessons} lessons completed</p>
          </div>
          <LevelBadge level={user.level} />
        </div>
        <ProgressBar value={progress} color="bg-blue-500" height="h-2.5" />
      </div>

      {/* Lessons by level */}
      {LEVELS.map(level => {
        const levelLessons = LESSONS.filter(l => l.minLevel === level);
        const levelCompleted = levelLessons.filter(l => completedLessons.includes(l.id)).length;
        const levelProgress = levelLessons.length > 0 ? (levelCompleted / levelLessons.length) * 100 : 0;

        const levelOrder: SkillLevel[] = ['novice', 'apprentice', 'trader', 'analyst', 'pro'];
        const isCurrentLevel = user.level === level;
        const isLocked = levelOrder.indexOf(user.level) < levelOrder.indexOf(level);

        return (
          <div key={level} className={isLocked ? 'opacity-60' : ''}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <LevelBadge level={level} size="sm" />
                {isCurrentLevel && (
                  <span className="text-xs text-blue-500 font-medium">Current Level</span>
                )}
                {isLocked && (
                  <span className="text-xs text-slate-400">🔒 Locked</span>
                )}
              </div>
              <span className="text-xs text-slate-400">{levelCompleted}/{levelLessons.length}</span>
            </div>
            <ProgressBar
              value={levelProgress}
              color={isLocked ? 'bg-slate-300' : 'bg-blue-500'}
              height="h-1"
            />
            <div className="mt-3 space-y-2">
              {levelLessons.map(lesson => (
                <LessonCard key={lesson.id} lessonId={lesson.id} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
