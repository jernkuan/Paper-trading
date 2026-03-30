import React from 'react';
import { useStore } from '../../store';
import { LevelBadge } from '../common/LevelBadge';
import { formatCurrency } from '../../utils/calculations';
import { getNextLevelXP, LEVEL_THRESHOLDS } from '../../types';
import { ProgressBar } from '../common/ProgressBar';

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, positions, prices } = useStore();

  const investedValue = positions.reduce((sum, pos) => {
    const price = prices[pos.symbol] ?? pos.currentPrice;
    return sum + pos.quantity * price;
  }, 0);
  const totalValue = user.cashBalance + investedValue;

  const { nextLevel, xpNeeded, xpForNext } = getNextLevelXP(user.xp);
  const currentLevelXP = LEVEL_THRESHOLDS[user.level];
  const xpProgress = nextLevel
    ? ((user.xp - currentLevelXP) / (xpForNext - currentLevelXP)) * 100
    : 100;

  return (
    <header className="bg-white border-b border-slate-100 px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">P</div>
          <span className="font-bold text-slate-800">PaperTrade</span>
        </div>

        <div className="flex-1" />

        {/* Portfolio stats */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-400">Cash</p>
            <p className="text-sm font-semibold text-slate-700">{formatCurrency(user.cashBalance)}</p>
          </div>
          <div className="w-px h-8 bg-slate-100" />
          <div className="text-right">
            <p className="text-xs text-slate-400">Portfolio</p>
            <p className="text-sm font-semibold text-slate-800">{formatCurrency(totalValue)}</p>
          </div>
          <div className="w-px h-8 bg-slate-100" />
        </div>

        {/* Level + XP */}
        <div className="flex items-center gap-2">
          <LevelBadge level={user.level} size="sm" />
          {nextLevel && (
            <div className="hidden md:block w-24">
              <ProgressBar value={xpProgress} color="bg-blue-500" height="h-1.5" />
              <p className="text-xs text-slate-400 mt-0.5 text-center">{xpNeeded} XP to {nextLevel}</p>
            </div>
          )}
          {!nextLevel && (
            <span className="hidden md:inline text-xs text-amber-600 font-medium">Max Level!</span>
          )}
        </div>
      </div>
    </header>
  );
}
