import React from 'react';
import { UsersRound, ChevronRight } from 'lucide-react';

interface NeedHelpSectionProps {
  onOpenSupport: () => void;
}

export const NeedHelpSection: React.FC<NeedHelpSectionProps> = ({
  onOpenSupport,
}) => {
  return (
    <div className="w-full mt-7 mb-6 text-left">
      {/* Section Header */}
      <h3 className="text-[17px] font-bold text-white tracking-tight mb-3">
        Need help with booking
      </h3>

      {/* Chat with support row - matching original screenshot */}
      <div
        onClick={onOpenSupport}
        className="w-full bg-[#1b1c1e] hover:bg-[#222427] active:bg-[#1f2023] border border-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all shadow-md group"
      >
        <div className="flex items-center gap-3.5">
          <UsersRound className="w-5 h-5 text-[#8e95a2] group-hover:text-white transition-colors stroke-[1.8]" />
          <span className="text-[15.5px] font-medium text-white tracking-tight">
            Chat with support
          </span>
        </div>

        <ChevronRight className="w-5 h-5 text-[#8e95a2] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
};
