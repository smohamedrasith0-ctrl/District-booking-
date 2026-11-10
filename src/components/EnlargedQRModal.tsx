import React, { useState } from 'react';
import { X, Sun, ShieldCheck } from 'lucide-react';
import { TicketData } from '../types';
import { VIDEO_QR_MATRIX } from '../data/videoQRMatrix';

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
  const [scanPulse] = useState(true);

  if (!isOpen) return null;

  const modalBoxSize = 268;
  const borderThickness = 6;
  const rectSize = modalBoxSize - borderThickness; // 262
  const strokeRadius = 23;
  const whiteCardSize = modalBoxSize - borderThickness * 2; // 256

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

        {/* Large QR Container with exact rotating dark-bluish-purple border matching video */}
        <div className="my-5 relative inline-block">
          {/* Ambient blurred glow */}
          <div
            className="absolute -inset-3 rounded-[32px] opacity-60 blur-lg pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(85, 48, 235, 0.4) 0%, rgba(45, 41, 62, 0.2) 65%, transparent 100%)',
            }}
          />

          {/* Sharp Rotating Border Container */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: `${modalBoxSize}px`, height: `${modalBoxSize}px` }}
          >
            {/* SVG Perimeter Beam */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0"
              viewBox={`0 0 ${modalBoxSize} ${modalBoxSize}`}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="qrModalSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4.5" result="blur" />
                </filter>
              </defs>

              {/* Outer soft aura following the beam */}
              <rect
                x={borderThickness / 2}
                y={borderThickness / 2}
                width={rectSize}
                height={rectSize}
                rx={strokeRadius}
                fill="none"
                stroke="#5530eb"
                strokeWidth={borderThickness + 6}
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray="44 56"
                filter="url(#qrModalSoftGlow)"
                opacity="0.45"
                className="animate-qr-video-beam"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-100"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </rect>

              {/* Base dark bluish-purple track */}
              <rect
                x={borderThickness / 2}
                y={borderThickness / 2}
                width={rectSize}
                height={rectSize}
                rx={strokeRadius}
                fill="none"
                stroke="#2d293e"
                strokeWidth={borderThickness}
              />

              {/* Trailing fade of the beam */}
              <rect
                x={borderThickness / 2}
                y={borderThickness / 2}
                width={rectSize}
                height={rectSize}
                rx={strokeRadius}
                fill="none"
                stroke="#4823c0"
                strokeWidth={borderThickness}
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray="44 56"
                className="animate-qr-video-beam"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-100"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </rect>

              {/* Primary vibrant electric violet-blue beam */}
              <rect
                x={borderThickness / 2}
                y={borderThickness / 2}
                width={rectSize}
                height={rectSize}
                rx={strokeRadius}
                fill="none"
                stroke="#5530eb"
                strokeWidth={borderThickness}
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray="36 64"
                className="animate-qr-video-beam"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-100"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </rect>

              {/* Bright violet core highlight */}
              <rect
                x={borderThickness / 2}
                y={borderThickness / 2}
                width={rectSize}
                height={rectSize}
                rx={strokeRadius}
                fill="none"
                stroke="#784bf9"
                strokeWidth={borderThickness - 1.8}
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray="24 76"
                className="animate-qr-video-beam"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-100"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </rect>

              {/* Lavender inner streak */}
              <rect
                x={borderThickness / 2}
                y={borderThickness / 2}
                width={rectSize}
                height={rectSize}
                rx={strokeRadius}
                fill="none"
                stroke="#c4b5fd"
                strokeWidth={borderThickness - 3.2}
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray="12 88"
                className="animate-qr-video-beam"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-100"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </rect>

              {/* Leading white tip spark */}
              <rect
                x={borderThickness / 2}
                y={borderThickness / 2}
                width={rectSize}
                height={rectSize}
                rx={strokeRadius}
                fill="none"
                stroke="#ffffff"
                strokeWidth={1.6}
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray="4 96"
                opacity="0.95"
                className="animate-qr-video-beam"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-100"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </rect>
            </svg>

            {/* Inner White Container */}
            <div
              className="bg-white p-4 rounded-[20px] relative overflow-hidden z-10 shadow-sm"
              style={{ width: `${whiteCardSize}px`, height: `${whiteCardSize}px` }}
            >
              <svg
                viewBox="0 0 21 21"
                className="w-full h-full block"
                shapeRendering="crispEdges"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="21" height="21" fill="#ffffff" />
                {VIDEO_QR_MATRIX.map((row, r) =>
                  row.map((val, c) =>
                    val === 1 ? (
                      <rect
                        key={`${r}-${c}`}
                        x={c}
                        y={r}
                        width="1"
                        height="1"
                        fill="#000000"
                      />
                    ) : null
                  )
                )}
              </svg>

              {/* Scanning line animation */}
              {scanPulse && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_12px_#6366f1] animate-[bounce_3s_infinite]" />
              )}
            </div>
          </div>
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
