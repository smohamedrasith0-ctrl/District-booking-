import React, { useState } from 'react';
import { TicketData } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { Check, Copy } from 'lucide-react';

interface TicketCardProps {
  ticket: TicketData;
  onEnlargeQR: () => void;
  onOpenMap: () => void;
  onToast: (msg: string) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onEnlargeQR,
  onOpenMap,
  onToast,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    onToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="w-full bg-[#1b1c1e] border border-white/5 rounded-[28px] p-5 pt-6 pb-6 shadow-[0_12px_40px_rgba(0,0,0,0.55)] transition-all">
      {/* Movie Title */}
      <h2 className="text-[22px] font-bold text-center text-white tracking-tight leading-snug">
        {ticket.movieTitle}
      </h2>

      {/* Language, Format, Rating tag */}
      <p className="text-[13.5px] text-[#8e95a2] font-medium text-center mt-1 mb-5 tracking-wide">
        {ticket.language} <span className="text-white/20 mx-1">|</span> {ticket.format} <span className="text-white/20 mx-1">|</span> {ticket.certification}
      </p>

      {/* Centered QR code with glowing neon purple frame */}
      <div className="flex justify-center my-3">
        <QRCodeDisplay
          payload={ticket.qrPayload}
          onEnlarge={onEnlargeQR}
          size={140}
        />
      </div>

      {/* Ticket Details List */}
      <div className="mt-5 space-y-4 text-left">
        {/* Date and time */}
        <div>
          <span className="text-[12.5px] text-[#8e95a2] block font-normal tracking-wide">
            Date and time
          </span>
          <p className="text-[14.5px] text-[#f1f3f5] font-medium mt-0.5 leading-relaxed">
            {ticket.dateTimeText}
          </p>
        </div>

        {/* Seat details */}
        <div>
          <span className="text-[12.5px] text-[#8e95a2] block font-normal tracking-wide">
            Seat details
          </span>
          <p className="text-[14.5px] text-white font-semibold mt-0.5 uppercase tracking-wide">
            {ticket.screenName}
          </p>
          <p className="text-[14px] text-[#f1f3f5] font-normal mt-0.5">
            {ticket.seatInfo}
          </p>
        </div>

        {/* Address with Navigation Direction icon */}
        <div>
          <span className="text-[12.5px] text-[#8e95a2] block font-normal tracking-wide">
            Address
          </span>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <p className="text-[14.5px] text-[#f1f3f5] font-medium leading-snug flex-1">
              {ticket.theaterAddress}
            </p>
            {/* Diamond direction turn-right icon from screenshot */}
            <button
              onClick={onOpenMap}
              className="p-2 -mr-1 rounded-full text-white/90 hover:text-white hover:bg-white/10 active:scale-95 transition-all flex-shrink-0"
              title="Get directions to cinema"
              aria-label="Directions"
            >
              <svg
                className="w-5 h-5 text-white stroke-[2]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Rounded diamond shape */}
                <rect x="3" y="3" width="18" height="18" rx="4" transform="rotate(45 12 12)" />
                {/* Turn right arrow inside diamond */}
                <path d="M10 14.5V11a2 2 0 0 1 2-2h3.5" />
                <path d="M13 6.5l3 2.5-3 2.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Booking Code and Booking ID footer */}
      <div className="mt-7 pt-2 flex flex-col items-center gap-1">
        <button
          onClick={() => copyToClipboard(ticket.bookingCode, 'Booking code')}
          className="text-[12.5px] text-[#8e95a2] hover:text-white transition flex items-center gap-1.5 group font-mono"
        >
          <span>Booking code: <strong className="text-[#a1a8b5] group-hover:text-white font-sans font-medium">{ticket.bookingCode}</strong></span>
          {copiedField === 'Booking code' ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </button>

        <button
          onClick={() => copyToClipboard(ticket.bookingId, 'Booking ID')}
          className="text-[12.5px] text-[#8e95a2] hover:text-white transition flex items-center gap-1.5 group font-mono"
        >
          <span>Booking ID: <span className="text-[#a1a8b5] group-hover:text-white font-sans">{ticket.bookingId}</span></span>
          {copiedField === 'Booking ID' ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </button>
      </div>
    </div>
  );
};
