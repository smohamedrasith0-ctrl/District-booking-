import React from 'react';
import { X, Download, ShieldCheck, CreditCard } from 'lucide-react';
import { TicketData } from '../types';

interface BillModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketData;
  onToast: (msg: string) => void;
}

export const BillModal: React.FC<BillModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onToast,
}) => {
  if (!isOpen) return null;

  const handleDownloadInvoice = () => {
    onToast(`Tax Invoice #${ticket.orderId}.pdf downloaded!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#161719] border border-white/10 rounded-t-[28px] sm:rounded-[28px] p-6 shadow-2xl overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Bill Summary
            </h3>
            <p className="text-xs text-[#8e95a2] mt-0.5">
              Order ID: {ticket.orderId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/80 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Itemized list */}
        <div className="py-4 space-y-3.5 text-sm">
          {/* Movie Ticket Base */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Ticket Price</p>
              <p className="text-xs text-[#8e95a2]">
                {ticket.ticketCount} × {ticket.seatInfo.split(',')[1]?.trim() || ticket.seatInfo}
              </p>
            </div>
            <span className="font-semibold text-white">
              {ticket.currency}{ticket.billBreakdown.baseTicketPrice.toFixed(2)}
            </span>
          </div>

          {/* Integrated Convenience Fee */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90">Convenience fee</p>
              <p className="text-xs text-[#8e95a2]">Base fee</p>
            </div>
            <span className="text-white/90 font-medium">
              {ticket.currency}{ticket.billBreakdown.convenienceFee.toFixed(2)}
            </span>
          </div>

          {/* Integrated GST */}
          <div className="flex items-center justify-between text-xs text-[#8e95a2] pl-2 border-l-2 border-white/10">
            <span>Central GST (CGST @ 9%)</span>
            <span>{ticket.currency}{ticket.billBreakdown.cgst.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#8e95a2] pl-2 border-l-2 border-white/10">
            <span>State GST (SGST @ 9%)</span>
            <span>{ticket.currency}{ticket.billBreakdown.sgst.toFixed(2)}</span>
          </div>

          {/* Divider */}
          <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
            <div>
              <span className="text-base font-bold text-white">Total Amount Paid</span>
              <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Paid successfully
              </p>
            </div>
            <span className="text-xl font-bold text-white">
              {ticket.currency}{ticket.totalBill.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment mode card */}
        <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-[#8e95a2] space-y-1">
          <div className="flex items-center gap-2 text-white font-medium">
            <CreditCard className="w-4 h-4 text-purple-400" />
            <span>{ticket.billBreakdown.paymentMethod}</span>
          </div>
          <p className="font-mono text-[11px] truncate">
            Ref: {ticket.billBreakdown.transactionId}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={handleDownloadInvoice}
            className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm flex items-center justify-center gap-2 transition active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            Download Tax Invoice
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
