import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export function Tooltip({ content, children, showIcon = true }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative inline-flex items-center" ref={ref}>
      {children}
      {showIcon && (
        <button
          type="button"
          className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-slate-500 text-xs font-bold hover:bg-blue-100 hover:text-blue-600 transition-colors"
          onClick={() => setVisible(v => !v)}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          aria-label="More information"
        >
          ?
        </button>
      )}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 bg-slate-800 text-white text-xs rounded-lg p-2.5 shadow-lg leading-relaxed pointer-events-none">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
}
