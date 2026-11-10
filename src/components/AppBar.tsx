import React from 'react';
import { ArrowLeft, Share2, Upload } from 'lucide-react';

interface AppBarProps {
  onBack?: () => void;
  onShare: () => void;
}

export const AppBar: React.FC<AppBarProps> = ({ onBack, onShare }) => {
  return (
    <div className="w-full px-4 py-2.5 flex items-center justify-between z-10 select-none">
      {/* Back button */}
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-full flex items-center justify-center text-white/95 hover:bg-white/10 active:scale-95 transition-all focus:outline-none shrink-0"
        aria-label="Back"
      >
        <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
      </button>

      {/* Title from screenshot: "Booking Confirmed" - fixed & unmoving */}
      <h1 className="text-xl font-bold tracking-tight text-white flex-1 pl-3 text-left select-none whitespace-nowrap truncate">
        Booking Confirmed
      </h1>

      {/* Share button from screenshot (tray with upward arrow) */}
      <button
        onClick={onShare}
        className="w-10 h-10 rounded-full flex items-center justify-center text-white/95 hover:bg-white/10 active:scale-95 transition-all focus:outline-none shrink-0"
        aria-label="Share ticket"
      >
        {/* Custom tray share icon to match screenshot exactly */}
        <svg
          className="w-6 h-6 stroke-[1.9] text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      </button>
    </div>
  );
};
