/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TicketData } from './types';
import { DEFAULT_TICKET } from './data/sampleTickets';
import { ExpandingTicketCard } from './components/ExpandingTicketCard';
import { OrderDetails } from './components/OrderDetails';
import { NeedHelpSection } from './components/NeedHelpSection';
import { BillModal } from './components/BillModal';
import { EnlargedQRModal } from './components/EnlargedQRModal';
import { MapModal } from './components/MapModal';
import { SupportModal } from './components/SupportModal';
import { ShareModal } from './components/ShareModal';
import { CustomizerModal } from './components/CustomizerModal';
import {
  Settings,
  Check,
  ArrowLeft,
  MoreVertical,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'district_ticket_custom_data_v1';

export default function App() {
  const [ticket, setTicket] = useState<TicketData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.movieTitle) {
          return {
            ...DEFAULT_TICKET,
            ...parsed,
            billBreakdown: {
              ...DEFAULT_TICKET.billBreakdown,
              ...(parsed.billBreakdown || {}),
            },
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load saved ticket from localStorage', e);
    }
    return DEFAULT_TICKET;
  });

  // Permanently save to localStorage whenever ticket changes
  React.useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ticket));
    } catch (e) {
      console.error('Failed to persist ticket data to localStorage', e);
    }
  }, [ticket]);

  const handleUpdateTicket = (newTicket: TicketData) => {
    setTicket(newTicket);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTicket));
    } catch (e) {
      console.error('Failed to persist ticket data to localStorage', e);
    }
  };

  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Expanded state: false = Front Page (compact bar), true = Ticket Pass (expanded card)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  // Scrolled state: true when scrolled down from top
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Modals state
  const [isBillOpen, setIsBillOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportMode, setSupportMode] = useState<'chat' | 'cancellation' | 'resend'>('chat');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  const handleBackNavigation = () => {
    if (isExpanded) {
      // Smoothly collapse back to Front Page
      setIsExpanded(false);
    } else {
      showToast('Navigating back to movies...');
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const st = e.currentTarget.scrollTop;
    // When user scrolls down even slightly, trigger instant switch
    setIsScrolled(st > 8);
  };

  return (
    <div className="min-h-screen bg-[#070908] text-white flex flex-col items-center justify-start relative select-none antialiased">
      {/* Top Header with very tiny settings icon */}
      <header className="w-full max-w-[412px] px-4 py-1.5 flex items-center justify-end z-40">
        <button
          onClick={() => setIsCustomizerOpen(true)}
          className="w-5 h-5 rounded-full bg-white/[0.04] hover:bg-white/10 active:scale-90 border border-white/[0.08] text-white/50 hover:text-white/90 flex items-center justify-center transition-all shadow-sm backdrop-blur-md"
          title="Customize ticket"
          aria-label="Customize ticket"
        >
          <Settings className="w-2.5 h-2.5" />
        </button>
      </header>

      {/* Main Container Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-start p-0 sm:py-4 sm:px-4 overflow-hidden">
        {/* Device Wrapper */}
        <div
          className={`w-full transition-all duration-300 relative flex flex-col ${
            isPhoneFrame
              ? 'max-w-[412px] h-[min(880px,calc(100vh-64px))] sm:rounded-[44px] sm:border-[10px] sm:border-[#222428] sm:shadow-[0_25px_80px_rgba(0,0,0,0.85)] sm:ring-1 sm:ring-white/10 overflow-hidden'
              : 'max-w-md h-[calc(100vh-50px)] overflow-hidden'
          }`}
        >
          {/* Background Ambient Dark Green Radial Glow matching screenshot and video */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#091e14] via-[#0d1211] to-[#0a0c0e] pointer-events-none" />
          <div
            className="absolute top-0 inset-x-0 h-96 pointer-events-none opacity-90"
            style={{
              background:
                'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(18, 77, 44, 0.45) 0%, rgba(10, 24, 16, 0.15) 50%, transparent 100%)',
            }}
          />

          {/* Device Screen Content */}
          <div className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
            {/* Pinned Top Bar: Morphs between Front Page and "Booking Confirmed" on scroll or expand */}
            <header
              className={`shrink-0 z-30 px-3 pt-2.5 pb-2.5 flex items-center justify-between border-b transition-all duration-150 relative ${
                isScrolled || isExpanded
                  ? 'bg-[#091e14]/95 backdrop-blur-md border-white/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.35)]'
                  : 'bg-transparent border-transparent'
              }`}
            >
              {/* Left Back button */}
              <button
                onClick={handleBackNavigation}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/95 hover:bg-white/10 active:scale-95 transition-all focus:outline-none shrink-0"
                aria-label="Back"
                title={isExpanded ? 'Collapse back to front page' : 'Back'}
              >
                <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
              </button>

              {/* Title from video: "Booking Confirmed" (with Capital C)
                  Appears in top bar instantly when user scrolls down OR when pass is expanded */}
              <div className="flex-1 min-w-0 pl-2 text-left overflow-hidden">
                <h1
                  className={`text-[19px] sm:text-[20px] font-bold tracking-tight text-white select-none whitespace-nowrap truncate transition-all duration-150 ${
                    isScrolled || isExpanded
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 -translate-y-1 pointer-events-none'
                  }`}
                >
                  Booking Confirmed
                </h1>
              </div>

              {/* Actions on right: Share + MoreVertical */}
              <div className="flex items-center gap-0.5 shrink-0">
                {/* Share button from screenshot and video */}
                <button
                  onClick={() => setIsShareOpen(true)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white/95 hover:bg-white/10 active:scale-95 transition-all focus:outline-none"
                  aria-label="Share ticket"
                  title="Share booking"
                >
                  <svg
                    className="w-6 h-6 stroke-[1.9] text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </button>

                {/* More options button (visible on front page and pass) */}
                <button
                  onClick={() => showToast('Options menu: Booking saved in District')}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white/95 hover:bg-white/10 active:scale-95 transition-all focus:outline-none"
                  aria-label="More options"
                  title="More options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Scrollable Screen Body with generous bottom space matching video (pb-[520px]) */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 px-4 pt-1 pb-[520px] overflow-y-auto no-scrollbar scroll-smooth"
            >
              {/* Hero Checkmark: Visible on Front page at top, disappears when scrolled down or expanded */}
              <div
                className={`transition-all duration-200 ease-out overflow-hidden ${
                  isExpanded
                    ? 'max-h-0 opacity-0 -translate-y-4 mb-0 pointer-events-none'
                    : isScrolled
                    ? 'opacity-0 -translate-y-2 pointer-events-none mb-3 pt-1 pb-2'
                    : 'max-h-40 opacity-100 translate-y-0 mb-3 pt-1 pb-2'
                }`}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-[58px] h-[58px] rounded-full bg-[#25d366] flex items-center justify-center shadow-[0_0_24px_rgba(37,211,102,0.35)] mb-3 transition-transform hover:scale-105">
                    <Check className="w-7 h-7 text-[#06180e] stroke-[3.5]" />
                  </div>
                  <h1 className="text-[25px] font-bold text-white tracking-tight leading-snug">
                    Booking confirmed
                  </h1>
                </div>
              </div>

              {/* Expanding Ticket Bar: That bar expands directly into full Ticket Pass when clicked! */}
              <ExpandingTicketCard
                ticket={ticket}
                isExpanded={isExpanded}
                onExpand={() => setIsExpanded(true)}
                onEnlargeQR={() => setIsQROpen(true)}
                onOpenMap={() => setIsMapOpen(true)}
                onToast={showToast}
              />

              {/* Order Details & Bill Preview */}
              <OrderDetails
                ticket={ticket}
                onOpenBill={() => setIsBillOpen(true)}
                onToast={showToast}
              />

              {/* Need help with booking Section */}
              <NeedHelpSection
                onOpenSupport={() => {
                  setSupportMode('chat');
                  setIsSupportOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-8 z-50 px-4 py-2.5 rounded-full bg-[#1b1c1e]/95 border border-white/20 text-white text-xs font-medium shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals & Drawers */}
      <BillModal
        isOpen={isBillOpen}
        onClose={() => setIsBillOpen(false)}
        ticket={ticket}
        onToast={showToast}
      />

      <EnlargedQRModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        ticket={ticket}
      />

      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        ticket={ticket}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        ticket={ticket}
        initialMode={supportMode}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        ticket={ticket}
        onToast={showToast}
      />

      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currentTicket={ticket}
        onUpdateTicket={handleUpdateTicket}
        onToast={showToast}
      />
    </div>
  );
}
