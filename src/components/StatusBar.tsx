import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

interface StatusBarProps {
  fixedTime?: string;
  isRealTime?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  fixedTime = '11:38',
  isRealTime = false,
}) => {
  const [time, setTime] = useState(fixedTime);

  useEffect(() => {
    if (!isRealTime) {
      setTime(fixedTime);
      return;
    }
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [isRealTime, fixedTime]);

  return (
    <div className="w-full pt-3 pb-2 px-5 flex items-center justify-between text-white/90 text-[13px] font-medium tracking-tight select-none">
      {/* Time */}
      <span className="font-semibold text-[13.5px] text-white/95">{time}</span>

      {/* Camera punch hole indicator in mockup */}
      <div className="w-3.5 h-3.5 rounded-full bg-black/80 border border-white/10 hidden sm:block mx-auto opacity-70" />

      {/* Network & Battery details from screenshot: 0.57 KB/s, VoLTE, 4G, 30% battery */}
      <div className="flex items-center gap-1.5 text-[11px] font-sans">
        <span className="text-[10px] text-white/80 font-mono tracking-tighter">0.57 <span className="text-[9px]">KB/s</span></span>

        {/* VoLTE badge */}
        <div className="flex flex-col leading-[8px] text-[8px] font-bold text-white/90 px-0.5 border border-white/40 rounded-[2px]">
          <span>Vo</span>
          <span>LTE</span>
        </div>

        {/* 4G icon */}
        <span className="font-bold text-[10px] text-white/90">4G</span>

        {/* Signal bars */}
        <div className="flex items-end gap-[1.5px] h-3 px-0.5">
          <div className="w-[2.5px] h-1.5 bg-white/90 rounded-[0.5px]" />
          <div className="w-[2.5px] h-2 bg-white/90 rounded-[0.5px]" />
          <div className="w-[2.5px] h-2.5 bg-white/90 rounded-[0.5px]" />
          <div className="w-[2.5px] h-3 bg-white/90 rounded-[0.5px]" />
        </div>

        {/* Battery with percentage inside or adjacent */}
        <div className="flex items-center gap-1 ml-1">
          {/* Battery pill */}
          <div className="relative w-5 h-2.5 rounded-[3px] border border-white/80 p-[1px] flex items-center">
            <div className="h-full w-[30%] bg-[#f59e0b] rounded-[1.5px]" />
            <div className="absolute -right-1 w-[2px] h-1 bg-white/80 rounded-r-[1px]" />
          </div>
          <span className="text-[11px] font-semibold text-white/90">30%</span>
        </div>
      </div>
    </div>
  );
};
