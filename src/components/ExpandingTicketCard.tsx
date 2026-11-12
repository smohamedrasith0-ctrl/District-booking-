import React, { useState } from 'react';
import { TicketData } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { Check, Copy, Maximize2 } from 'lucide-react';

interface ExpandingTicketCardProps {
  ticket: TicketData;
  isExpanded: boolean;
  onExpand: () => void;
  onEnlargeQR: () => void;
  onOpenMap: () => void;
  onToast: (msg: string) => void;
}

const formatCompactHeader = (ticketCount: number, dateTimeText: string) => {
  const count = Math.max(1, Number(ticketCount) || 1);
  const ticketLabel = `${count} ${count === 1 ? 'ticket' : 'tickets'}`;

  // Try to match date (e.g. "04 Oct" or "12 Nov")
  const dateMatch = dateTimeText.match(/(\d{1,2}\s+[A-Za-z]{3,4})/);
  const dateStr = dateMatch ? dateMatch[1] : '04 Oct';

  // Try to match start time (e.g. "from 12:00" or "06:30 PM")
  const timeMatch =
    dateTimeText.match(/from\s*(\d{1,2}:\d{2})/i) ||
    dateTimeText.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);

  let timeStr = '12:00 PM';
  if (timeMatch) {
    timeStr = timeMatch[1].trim();
    if (!/AM|PM/i.test(timeStr)) {
      const ampm = dateTimeText.match(/(AM|PM)/i);
      timeStr = `${timeStr} ${ampm ? ampm[1].toUpperCase() : 'PM'}`;
    }
  }

  return `${ticketLabel} • ${dateStr}, ${timeStr}`;
};

export const ExpandingTicketCard: React.FC<ExpandingTicketCardProps> = ({
  ticket,
  isExpanded,
  onExpand,
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
    <div
      onClick={!isExpanded ? onExpand : undefined}
      className={`w-full border border-white/5 rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.55)] transition-all duration-500 cubic-bezier(0.16,1,0.3,1) relative overflow-hidden select-none ${
        !isExpanded
          ? 'bg-[#1c1d20] hover:bg-[#232428] active:bg-[#18191b] p-4 cursor-pointer group active:scale-[0.99]'
          : 'bg-[#1b1c1e] p-5 pt-6 pb-6 cursor-default'
      }`}
      title={!isExpanded ? 'Tap to expand ticket pass' : undefined}
    >
      {/* =========================================================================
          VIEW 1: COMPACT TICKET BAR (Front page state)
          Displays compact QR on left, showtime & movie title on right
          ========================================================================= */}
      <div
        className={`transition-all duration-300 ${
          !isExpanded
            ? 'opacity-100 scale-100 block'
            : 'opacity-0 scale-95 pointer-events-none hidden'
        }`}
      >
        <div className="flex items-center gap-3.5">
          {/* Compact QR with revolving electric violet border beam */}
          <div className="relative shrink-0 transition-transform group-hover:scale-105 duration-200">
            <QRCodeDisplay
              size={48}
              showHoverTooltip={false}
              payload={ticket.qrPayload}
            />
          </div>

          {/* Ticket Information on right matching video test_frame_1 */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[12px] sm:text-[12.5px] text-[#9ca3af] font-normal tracking-wide">
                {formatCompactHeader(ticket.ticketCount, ticket.dateTimeText)}
              </span>
              <Maximize2 className="w-3.5 h-3.5 text-[#8e95a2] group-hover:text-white transition-colors shrink-0 ml-1.5" />
            </div>

            <h2 className="text-[20px] font-bold text-white tracking-tight leading-snug truncate mt-0.5">
              {ticket.movieTitle}
            </h2>

            <p className="text-[13px] text-[#8e95a2] truncate mt-0.5 font-normal">
              {ticket.theaterAddress}
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW 2: FULL DETAILED TICKET PASS (Expanded state)
          Displays 140px QR in center, theater screen, seat details, address, codes
          ========================================================================= */}
      <div
        className={`transition-all duration-400 ease-out ${
          isExpanded
            ? 'opacity-100 translate-y-0 block animate-in fade-in zoom-in-95 duration-400'
            : 'opacity-0 translate-y-4 pointer-events-none hidden'
        }`}
      >
        {/* Movie Title */}
        <h2 className="text-[22px] font-bold text-center text-white tracking-tight leading-snug">
          {ticket.movieTitle}
        </h2>

        {/* Language, Format, Rating tag */}
        <p className="text-[13.5px] text-[#8e95a2] font-medium text-center mt-1 mb-5 tracking-wide">
          {ticket.language} <span className="text-white/20 mx-1">|</span> {ticket.format} <span className="text-white/20 mx-1">|</span> {ticket.certification}
        </p>

        {/* Centered QR code with glowing electric violet rotating frame (140px) */}
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
                  <rect x="3" y="3" width="18" height="18" rx="4" transform="rotate(45 12 12)" />
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
    </div>
  );
};
