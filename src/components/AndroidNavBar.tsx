import React from 'react';

interface AndroidNavBarProps {
  onBack?: () => void;
  onHome?: () => void;
  onRecents?: () => void;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({
  onBack,
  onHome,
  onRecents,
}) => {
  return (
    <div className="w-full h-12 bg-black/90 flex items-center justify-around text-white/50 px-8 select-none border-t border-white/5">
      {/* Recents (left) */}
      <button
        onClick={onRecents}
        className="p-2 hover:text-white transition active:scale-90 focus:outline-none"
        aria-label="Recent apps"
      >
        <div className="w-3.5 h-3.5 rounded-[3px] border-2 border-current" />
      </button>

      {/* Home (center ring circle) */}
      <button
        onClick={onHome}
        className="p-2 hover:text-white transition active:scale-90 focus:outline-none"
        aria-label="Home"
      >
        <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
        </div>
      </button>

      {/* Back (right arrow triangle) */}
      <button
        onClick={onBack}
        className="p-2 hover:text-white transition active:scale-90 focus:outline-none"
        aria-label="Back"
      >
        <svg
          className="w-3.5 h-3.5 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
    </div>
  );
};
