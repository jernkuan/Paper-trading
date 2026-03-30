import React from 'react';
import { useStore } from '../../store';
import { LEVEL_LABELS, getLevelFromXP, getNextLevelXP, LEVEL_THRESHOLDS } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { LevelBadge } from '../common/LevelBadge';

const CATEGORY_ORDER = ['Trading', 'Portfolio', 'Risk Management', 'Mindset', 'Consistency', 'Learning', 'Reflection'];

export function AchievementsPage() {
  const { achievements, user } = useStore();

  const totalXP = achievements
    .filter(a => a.unlockedAt)
    .reduce((sum, a) => sum + a.xpReward, 0);

  const unlocked = achievements.filter(a => a.unlockedAt);
  const locked = achievements.filter(a => !a.unlockedAt);

  const { nextLevel, xpNeeded, xpForNext } = getNextLevelXP(user.xp);
  const currentLevelXP = LEVEL_THRESHOLDS[user.level];
  const xpProgress = nextLevel
    ? ((user.xp - currentLevelXP) / (xpForNext - currentLevelXP)) * 100
    : 100;

  const groupedByCategory = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = achievements.filter(a => a.category === cat);
    return acc;
  }, {} as Record<string, typeof achievements>);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Achievements</h1>
        <p className="text-sm text-slate-400">Earn badges by hitting milestones and improving your skills.</p>
      </div>

      {/* XP & Level summary */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <LevelBadge level={user.level} size="lg" />
            <p className="text-xs text-slate-400 mt-1">{user.xp} total XP earned</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-800">{unlocked.length}<span className="text-sm font-normal text-slate-400">/{achievements.length}</span></p>
            <p className="text-xs text-slate-400">Achievements</p>
          </div>
        </div>

        {nextLevel ? (
          <>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>{LEVEL_LABELS[user.level]}</span>
              <span>{xpNeeded} XP to {LEVEL_LABELS[nextLevel]}</span>
            </div>
            <ProgressBar value={xpProgress} color="bg-blue-500" height="h-3" />
          </>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm font-semibold text-amber-600">👑 Max level reached! You're a Pro trader.</p>
          </div>
        )}
      </div>

      {/* Recently unlocked */}
      {unlocked.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Unlocked ({unlocked.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {unlocked
              .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
              .map(ach => (
                <div
                  key={ach.id}
                  className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm text-center"
                >
                  <div className="text-3xl mb-2">{ach.icon}</div>
                  <p className="text-sm font-semibold text-slate-800 leading-tight">{ach.title}</p>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">{ach.description}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span className="text-xs text-amber-600 font-semibold">+{ach.xpReward} XP</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {new Date(ach.unlockedAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Locked by category */}
      {Object.entries(groupedByCategory).map(([category, catAchs]) => {
        const lockedInCat = catAchs.filter(a => !a.unlockedAt);
        if (lockedInCat.length === 0) return null;

        return (
          <div key={category}>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">
              {category}
              <span className="ml-2 text-xs font-normal text-slate-400">
                {catAchs.filter(a => a.unlockedAt).length}/{catAchs.length}
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {lockedInCat.map(ach => (
                <div
                  key={ach.id}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center opacity-70"
                >
                  <div className="text-3xl mb-2 grayscale">{ach.icon}</div>
                  <p className="text-sm font-semibold text-slate-500 leading-tight">{ach.title}</p>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">{ach.hint}</p>
                  <span className="text-xs text-slate-400 mt-2 inline-block">+{ach.xpReward} XP</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {locked.length === 0 && (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">🏆</p>
          <p className="font-semibold text-slate-700">All achievements unlocked!</p>
          <p className="text-sm text-slate-400 mt-1">You've mastered the art of paper trading.</p>
        </div>
      )}
    </div>
  );
}
