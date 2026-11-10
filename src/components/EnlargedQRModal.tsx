import React from 'react';
import { X, Sun, ShieldCheck } from 'lucide-react';
import { TicketData } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';

interface EnlargedQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketData;
}

export const EnlargedQRModal: React.FC<EnlargedQRModalProps> = ({
  isOpen,
  onClose,
  ticket,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-[#161719] border border-white/10 rounded-[32px] p-6 text-center shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security badge & brightness hint */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Live Digital Pass • Ready to Scan</span>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          {ticket.movieTitle}
        </h3>
        <p className="text-xs text-[#8e95a2] mt-0.5">
          {ticket.screenName} • {ticket.seatInfo}
        </p>

        {/* Large QR Container using exact rotating beam matching video */}
        <div className="my-5 flex items-center justify-center">
          <QRCodeDisplay
            payload={ticket.qrPayload}
            size={200}
            showHoverTooltip={false}
          />
        </div>

        {/* Booking Code Display */}
        <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
          <span className="text-xs text-[#8e95a2] uppercase tracking-wider block">
            Booking Code
          </span>
          <span className="text-2xl font-mono font-bold text-white tracking-widest">
            {ticket.bookingCode}
          </span>
        </div>

        <p className="text-xs text-white/50 mt-4 flex items-center justify-center gap-1">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          Turn brightness up for easy scanning at turnstile
        </p>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition"
        >
          Back to Ticket
        </button>
      </div>
    </div>
  );
};
