import React, { useState, useEffect } from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { TicketData } from '../types';
import { ALTERNATIVE_TICKETS } from '../data/sampleTickets';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTicket: TicketData;
  onUpdateTicket: (t: TicketData) => void;
  onToast: (msg: string) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  currentTicket,
  onUpdateTicket,
  onToast,
}) => {
  const [formData, setFormData] = useState<TicketData>({ ...currentTicket });

  // Sync form state whenever modal is opened or currentTicket updates
  useEffect(() => {
    if (isOpen) {
      setFormData({ ...currentTicket });
    }
  }, [isOpen, currentTicket]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: TicketData) => {
    setFormData({ ...preset });
    onUpdateTicket(preset);
    onToast(`Switched to "${preset.movieTitle}" and saved permanently`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedBreakdown = { ...(formData.billBreakdown || currentTicket.billBreakdown) };
    if (formData.totalBill !== currentTicket.totalBill) {
      const taxesAndFees = (updatedBreakdown.convenienceFee || 16.74) + (updatedBreakdown.cgst || 1.51) + (updatedBreakdown.sgst || 1.50);
      updatedBreakdown.baseTicketPrice = Math.max(0, Number((formData.totalBill - taxesAndFees).toFixed(2)));
    }
    const finalTicket = {
      ...formData,
      billBreakdown: updatedBreakdown,
    };
    onUpdateTicket(finalTicket);
    onToast('Ticket details permanently saved!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg max-h-[90vh] bg-[#161719] border border-white/10 rounded-t-[28px] sm:rounded-[28px] p-6 shadow-2xl overflow-y-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Customize Ticket Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets */}
        <div className="my-4">
          <span className="text-xs font-semibold text-[#8e95a2] uppercase tracking-wider block mb-2">
            Quick Presets
          </span>
          <div className="grid grid-cols-3 gap-2">
            {ALTERNATIVE_TICKETS.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectPreset(t)}
                className={`p-2.5 rounded-xl border text-left transition ${
                  formData.movieTitle === t.movieTitle
                    ? 'bg-purple-600/20 border-purple-500 text-white'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/80'
                }`}
              >
                <div className="text-xs font-bold truncate">{t.movieTitle}</div>
                <div className="text-[10px] text-[#8e95a2] truncate">{t.theaterName}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Edit Form */}
        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div>
            <label className="block text-[#8e95a2] mb-1 font-medium">Movie Title</label>
            <input
              type="text"
              value={formData.movieTitle}
              onChange={(e) => setFormData({ ...formData, movieTitle: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[#8e95a2] mb-1 font-medium">Language</label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[#8e95a2] mb-1 font-medium">Format</label>
              <input
                type="text"
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[#8e95a2] mb-1 font-medium">Rating</label>
              <input
                type="text"
                value={formData.certification}
                onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8e95a2] mb-1 font-medium">Date and Time</label>
            <input
              type="text"
              value={formData.dateTimeText}
              onChange={(e) => setFormData({ ...formData, dateTimeText: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[#8e95a2] mb-1 font-medium">Screen Name</label>
              <input
                type="text"
                value={formData.screenName}
                onChange={(e) => setFormData({ ...formData, screenName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[#8e95a2] mb-1 font-medium">Seat Details</label>
              <input
                type="text"
                value={formData.seatInfo}
                onChange={(e) => setFormData({ ...formData, seatInfo: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8e95a2] mb-1 font-medium">Cinema Address</label>
            <input
              type="text"
              value={formData.theaterAddress}
              onChange={(e) => setFormData({ ...formData, theaterAddress: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[#8e95a2] mb-1 font-medium">Booking Code</label>
              <input
                type="text"
                value={formData.bookingCode}
                onChange={(e) => setFormData({ ...formData, bookingCode: e.target.value, qrPayload: `DISTRICT-TKT:${e.target.value}` })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[#8e95a2] mb-1 font-medium">Total Bill Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.totalBill}
                onChange={(e) => setFormData({ ...formData, totalBill: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Check className="w-4 h-4" />
              Save Permanently
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
