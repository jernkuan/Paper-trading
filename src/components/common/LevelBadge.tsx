import React from 'react';
import { SkillLevel, LEVEL_LABELS } from '../../types';

interface LevelBadgeProps {
  level: SkillLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const LEVEL_STYLES: Record<SkillLevel, string> = {
  novice: 'bg-slate-100 text-slate-600 border-slate-200',
  apprentice: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  trader: 'bg-blue-100 text-blue-700 border-blue-200',
  analyst: 'bg-purple-100 text-purple-700 border-purple-200',
  pro: 'bg-amber-100 text-amber-700 border-amber-200',
};

const SIZE_STYLES = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function LevelBadge({ level, size = 'md', showLabel = true }: LevelBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold border ${LEVEL_STYLES[level]} ${SIZE_STYLES[size]}`}>
      {level === 'novice' && '⭐'}
      {level === 'apprentice' && '⭐⭐'}
      {level === 'trader' && '🔷'}
      {level === 'analyst' && '💎'}
      {level === 'pro' && '👑'}
      {showLabel && <span>{LEVEL_LABELS[level]}</span>}
    </span>
  );
}
