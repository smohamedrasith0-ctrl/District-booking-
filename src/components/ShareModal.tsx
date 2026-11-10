import React from 'react';
import { X, Copy, Calendar, MessageCircle, Share2, Check } from 'lucide-react';
import { TicketData } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketData;
  onToast: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onToast,
}) => {
  if (!isOpen) return null;

  const shareText = `🎟️ Movie Ticket for ${ticket.movieTitle} (${ticket.language} - ${ticket.format})
📍 Theater: ${ticket.theaterAddress}
🕒 Time: ${ticket.dateTimeText}
💺 Seat: ${ticket.screenName} - ${ticket.seatInfo}
🎫 Booking Code: ${ticket.bookingCode}`;

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareText);
    onToast('Ticket details copied to clipboard!');
  };

  const whatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `Movie: ${ticket.movieTitle}`
  )}&dates=20261004T063000Z/20261004T092700Z&details=${encodeURIComponent(
    `Seat: ${ticket.seatInfo} at ${ticket.screenName}\nBooking Code: ${ticket.bookingCode}`
  )}&location=${encodeURIComponent(ticket.theaterAddress)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#161719] border border-white/10 rounded-t-[28px] sm:rounded-[28px] p-6 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-bold text-white tracking-tight">
            Share Booking
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-2.5">
          {/* WhatsApp */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center gap-3.5 transition group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Share on WhatsApp</p>
              <p className="text-xs text-[#8e95a2]">Send movie & seat details to companions</p>
            </div>
          </a>

          {/* Google Calendar */}
          <a
            href={calUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center gap-3.5 transition group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Add to Google Calendar</p>
              <p className="text-xs text-[#8e95a2]">Set reminder 30 mins before showtime</p>
            </div>
          </a>

          {/* Copy link/text */}
          <button
            onClick={handleCopyShare}
            className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center gap-3.5 transition group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Copy className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Copy Ticket Details</p>
              <p className="text-xs text-[#8e95a2]">Copy booking code and timings</p>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-2 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
