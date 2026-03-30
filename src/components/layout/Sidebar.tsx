import React from 'react';
import { useStore } from '../../store';
import { LevelBadge } from '../common/LevelBadge';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'trade', label: 'Trade', icon: '📈' },
  { id: 'learn', label: 'Learn', icon: '📚' },
  { id: 'journal', label: 'Journal', icon: '📝' },
  { id: 'achievements', label: 'Achievements', icon: '🏆' },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { activeTab, setActiveTab, user } = useStore();

  function navigate(tab: string) {
    setActiveTab(tab);
    onClose?.();
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-100">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
          <span className="font-bold text-slate-800 text-lg">PaperTrade</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Learn to trade risk-free</p>
      </div>

      {/* User summary */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
            {user.name ? user.name[0].toUpperCase() : '?'}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 leading-tight">{user.name || 'Trader'}</p>
            <p className="text-xs text-slate-400">{user.xp} XP total</p>
          </div>
        </div>
        <LevelBadge level={user.level} size="sm" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-100">
        <p className="text-xs text-slate-400 text-center">All prices are simulated</p>
        <p className="text-xs text-slate-300 text-center">No real money involved</p>
      </div>
    </div>
  );
}
