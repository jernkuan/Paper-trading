import React from 'react';
import { useStore } from '../../store';
import { Notification } from '../../types';

function Toast({ notification }: { notification: Notification }) {
  const removeNotification = useStore(s => s.removeNotification);

  const styles: Record<Notification['type'], string> = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    achievement: 'bg-amber-50 border-amber-200 text-amber-800',
    levelup: 'bg-purple-50 border-purple-200 text-purple-800',
  };

  const icons: Record<Notification['type'], string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    achievement: '🏆',
    levelup: '🎉',
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${styles[notification.type]} animate-fade-in`}>
      <span className="text-lg flex-shrink-0">{icons[notification.type]}</span>
      <span className="text-sm font-medium flex-1 leading-snug">{notification.message}</span>
      <button
        onClick={() => removeNotification(notification.id)}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}

export function NotificationToast() {
  const notifications = useStore(s => s.notifications);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80 pointer-events-none">
      {notifications.map(n => (
        <div key={n.id} className="pointer-events-auto">
          <Toast notification={n} />
        </div>
      ))}
    </div>
  );
}
