import React, { useState } from 'react';
import { ChevronRight, Copy, Check, ReceiptText } from 'lucide-react';
import { TicketData } from '../types';

interface OrderDetailsProps {
  ticket: TicketData;
  onOpenBill: () => void;
  onToast: (msg: string) => void;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  ticket,
  onOpenBill,
  onToast,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(ticket.orderId);
    setCopied(true);
    onToast('Order ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full mt-7 text-left">
      {/* Section Header */}
      <h3 className="text-[17px] font-bold text-white tracking-tight">
        Order details
      </h3>

      {/* Order ID row with copy icon */}
      <div className="flex items-center gap-2 mt-1 mb-3.5">
        <span className="text-[13.5px] text-[#8e95a2] font-normal">
          Order ID: {ticket.orderId}
        </span>
        <button
          onClick={handleCopyOrderId}
          className="text-[#8e95a2] hover:text-white p-1 rounded hover:bg-white/5 active:scale-90 transition-all focus:outline-none"
          title="Copy Order ID"
          aria-label="Copy Order ID"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <svg
              className="w-3.5 h-3.5 stroke-[2] text-[#9ca3af] hover:text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>

      {/* Total bill interactive card */}
      <div
        onClick={onOpenBill}
        className="w-full bg-[#1b1c1e] hover:bg-[#222427] active:bg-[#1f2023] border border-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all shadow-md group"
      >
        <div className="flex items-center gap-3.5">
          {/* Bill Icon matching original screenshot */}
          <svg
            className="w-5 h-5 text-[#8e95a2] group-hover:text-white transition-colors stroke-[1.8]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="3" width="14" height="18" rx="3" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="13" x2="13" y2="13" />
          </svg>

          <div>
            <div className="text-[16px] font-semibold text-white tracking-tight">
              Total bill {ticket.currency}{ticket.totalBill.toFixed(2)}
            </div>
            <div className="text-[12.5px] text-[#8e95a2] font-normal mt-0.5">
              Incl. taxes & fees
            </div>
          </div>
        </div>

        {/* Chevron Right */}
        <ChevronRight className="w-5 h-5 text-[#8e95a2] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
};
