import React, { useState } from 'react';
import { useStore } from './store';
import { usePriceSimulator } from './hooks/usePriceSimulator';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { TradingPage } from './components/trading/TradingPage';
import { LearningHub } from './components/learning/LearningHub';
import { TradeJournal } from './components/journal/TradeJournal';
import { AchievementsPage } from './components/achievements/AchievementsPage';

function Onboarding() {
  const { completeOnboarding } = useStore();
  const [name, setName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) {
      completeOnboarding(name.trim());
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">P</div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome to PaperTrade</h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Learn to trade stocks, forex, options, and more — with{' '}
            <strong>zero real money at risk</strong>.
          </p>
        </div>

        <div className="space-y-4 mb-6 text-sm text-slate-600">
          <div className="flex items-start gap-3">
            <span className="text-lg">💰</span>
            <div>
              <p className="font-medium text-slate-700">$10,000 in virtual cash</p>
              <p className="text-slate-400">Practice with real market simulations</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">📈</span>
            <div>
              <p className="font-medium text-slate-700">Progressive skill levels</p>
              <p className="text-slate-400">Unlock features as you learn — no overwhelm</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">📚</span>
            <div>
              <p className="font-medium text-slate-700">Built-in lessons</p>
              <p className="text-slate-400">Short explainers that actually make sense</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">🏆</span>
            <div>
              <p className="font-medium text-slate-700">Achievements & journal</p>
              <p className="text-slate-400">Track milestones and reflect on your decisions</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              What should we call you?
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name or nickname"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              maxLength={30}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Trading →
          </button>
        </form>
        <p className="text-center text-xs text-slate-400 mt-4">
          No signup required · No real money · Just learning
        </p>
      </div>
    </div>
  );
}

function AppContent() {
  const { activeTab } = useStore();
  usePriceSimulator();

  return (
    <Layout>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'trade' && <TradingPage />}
      {activeTab === 'learn' && <LearningHub />}
      {activeTab === 'journal' && <TradeJournal />}
      {activeTab === 'achievements' && <AchievementsPage />}
    </Layout>
  );
}

export default function App() {
  const { onboardingDone } = useStore();

  if (!onboardingDone) {
    return <Onboarding />;
  }

  return <AppContent />;
}
