import React, { useState } from 'react';
import { useStore } from '../../store';
import { JournalEntry, Mood } from '../../types';
import { Modal } from '../common/Modal';
import { formatCurrency } from '../../utils/calculations';

const MOOD_OPTIONS: { value: Mood; label: string; emoji: string; color: string }[] = [
  { value: 'confident', label: 'Confident', emoji: '😎', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'excited', label: 'Excited', emoji: '🚀', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  { value: 'nervous', label: 'Nervous', emoji: '😰', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'regretful', label: 'Regretful', emoji: '😓', color: 'bg-red-100 text-red-600 border-red-200' },
];

function EntryForm({
  onClose,
  editEntry,
  linkedTradeId,
}: {
  onClose: () => void;
  editEntry?: JournalEntry;
  linkedTradeId?: string;
}) {
  const { addJournalEntry, updateJournalEntry, trades } = useStore();
  const [title, setTitle] = useState(editEntry?.title ?? '');
  const [content, setContent] = useState(editEntry?.content ?? '');
  const [mood, setMood] = useState<Mood>(editEntry?.mood ?? 'neutral');
  const [tags, setTags] = useState(editEntry?.tags.join(', ') ?? '');
  const [tradeId, setTradeId] = useState(editEntry?.tradeId ?? linkedTradeId ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    if (editEntry) {
      updateJournalEntry(editEntry.id, { title, content, mood, tags: parsedTags, tradeId: tradeId || undefined });
    } else {
      addJournalEntry({ title, content, mood, tags: parsedTags, tradeId: tradeId || undefined });
    }
    onClose();
  }

  const recentTrades = trades.slice(0, 10);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Why I bought AAPL today"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Your thoughts</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Why did you make this trade? What was your reasoning? What do you expect to happen?"
          rows={5}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
          required
        />
        <p className="text-xs text-slate-400 mt-1">
          Tip: Journaling your reasoning helps you learn from both wins and losses.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">How are you feeling?</label>
        <div className="flex flex-wrap gap-2">
          {MOOD_OPTIONS.map(m => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(m.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                mood === m.value ? m.color + ' ring-2 ring-offset-1 ring-blue-300' : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
        <input
          type="text"
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="e.g. earnings, breakout, stop-loss"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <p className="text-xs text-slate-400 mt-1">Separate with commas</p>
      </div>

      {recentTrades.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Link to a trade (optional)</label>
          <select
            value={tradeId}
            onChange={e => setTradeId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
          >
            <option value="">No linked trade</option>
            {recentTrades.map(t => (
              <option key={t.id} value={t.id}>
                {t.side.toUpperCase()} {t.quantity}x {t.symbol} @ {formatCurrency(t.price)}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {editEntry ? 'Save Changes' : 'Save Entry'}
        </button>
      </div>
    </form>
  );
}

function EntryCard({ entry, onEdit }: { entry: JournalEntry; onEdit: () => void }) {
  const { deleteJournalEntry, trades } = useStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const mood = MOOD_OPTIONS.find(m => m.value === entry.mood);
  const linkedTrade = entry.tradeId ? trades.find(t => t.id === entry.tradeId) : null;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-800 text-sm">{entry.title}</h3>
            {mood && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${mood.color}`}>
                {mood.emoji} {mood.label}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {new Date(entry.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex gap-1 ml-2">
          <button
            onClick={onEdit}
            className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {linkedTrade && (
        <div className="mb-2 p-2 bg-blue-50 rounded-lg text-xs text-blue-700">
          Linked: {linkedTrade.side.toUpperCase()} {linkedTrade.quantity}x {linkedTrade.symbol} @ {formatCurrency(linkedTrade.price)}
        </div>
      )}

      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap line-clamp-4">
        {entry.content}
      </p>

      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {entry.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {showConfirm && (
        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
          <p className="text-sm text-red-700 mb-2">Delete this entry? This can't be undone.</p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
            >
              Keep it
            </button>
            <button
              onClick={() => deleteJournalEntry(entry.id)}
              className="flex-1 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function TradeJournal() {
  const { journalEntries, showJournalPrompt, dismissJournalPrompt, lastTradeId } = useStore();
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [editEntry, setEditEntry] = useState<JournalEntry | undefined>();
  const [filterMood, setFilterMood] = useState<Mood | 'all'>('all');

  const filtered = journalEntries.filter(e =>
    filterMood === 'all' || e.mood === filterMood
  );

  // Show journal prompt after a trade
  const showPrompt = showJournalPrompt && !showNewEntry && !editEntry;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Journal prompt after trade */}
      {showPrompt && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-2xl">📝</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-800">Want to log your reasoning?</p>
            <p className="text-sm text-blue-600 mt-0.5">
              Writing down why you made a trade is one of the best ways to learn. What was your thesis?
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => { setShowNewEntry(true); dismissJournalPrompt(); }}
                className="px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                Write Entry
              </button>
              <button
                onClick={dismissJournalPrompt}
                className="px-4 py-1.5 text-blue-600 text-sm hover:bg-blue-100 rounded-lg transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Trade Journal</h1>
          <p className="text-sm text-slate-400">
            {journalEntries.length} {journalEntries.length === 1 ? 'entry' : 'entries'} — reflect on your decisions
          </p>
        </div>
        <button
          onClick={() => setShowNewEntry(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <span>+</span> New Entry
        </button>
      </div>

      {/* Mood filter */}
      {journalEntries.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterMood('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              filterMood === 'all'
                ? 'bg-slate-800 text-white border-slate-800'
                : 'border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            All
          </button>
          {MOOD_OPTIONS.map(m => (
            <button
              key={m.value}
              onClick={() => setFilterMood(m.value)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                filterMood === m.value
                  ? m.color + ' ring-2 ring-offset-1 ring-blue-300'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Entries */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">📓</p>
          <p className="font-medium text-slate-600">No journal entries yet</p>
          <p className="text-sm mt-1">
            The best traders review their decisions. Start writing after your next trade!
          </p>
          <button
            onClick={() => setShowNewEntry(true)}
            className="mt-4 px-5 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Write Your First Entry
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(entry => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={() => setEditEntry(entry)}
            />
          ))}
        </div>
      )}

      {/* New/Edit entry modal */}
      <Modal
        isOpen={showNewEntry || !!editEntry}
        onClose={() => { setShowNewEntry(false); setEditEntry(undefined); }}
        title={editEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
      >
        <EntryForm
          onClose={() => { setShowNewEntry(false); setEditEntry(undefined); }}
          editEntry={editEntry}
          linkedTradeId={lastTradeId ?? undefined}
        />
      </Modal>
    </div>
  );
}
