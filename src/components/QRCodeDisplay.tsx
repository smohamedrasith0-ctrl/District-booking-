import React from 'react';
import { Maximize2 } from 'lucide-react';
import { VIDEO_QR_MATRIX } from '../data/videoQRMatrix';

interface QRCodeDisplayProps {
  payload?: string;
  onEnlarge?: () => void;
  size?: number; // Size of the inner black QR grid (default 140px for ticket, 52px for compact card)
  showHoverTooltip?: boolean;
  className?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  onEnlarge,
  size = 140,
  showHoverTooltip = size >= 100,
  className = '',
}) => {
  // Proportions matching the video and screenshots
  const isCompact = size < 90;
  const whitePadding = isCompact ? 6 : 13;
  const whiteBoxSize = size + whitePadding * 2;
  const borderThickness = isCompact ? 3.5 : 5;
  const outerBoxSize = whiteBoxSize + borderThickness * 2;
  const cardRadius = isCompact ? 9 : 15;
  const strokeRadius = cardRadius + borderThickness / 2;
  const rectSize = outerBoxSize - borderThickness;

  return (
    <div
      onClick={onEnlarge}
      className={`relative group inline-flex items-center justify-center transition-transform duration-200 active:scale-95 select-none shrink-0 ${
        onEnlarge ? 'cursor-pointer' : ''
      } ${className}`}
      title={onEnlarge ? 'Tap to view ticket pass' : undefined}
      style={{ width: `${outerBoxSize}px`, height: `${outerBoxSize}px` }}
    >
      {/* 1. Ambient blurred neon glow layer beneath the card */}
      <div
        className="absolute -inset-2 rounded-[24px] opacity-60 blur-md pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(85, 48, 235, 0.45) 0%, rgba(45, 41, 62, 0.2) 65%, transparent 100%)',
        }}
      />

      {/* 2. SVG Stroke Border: Dark bluish-purple base with electric violet traveling beam */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0"
        viewBox={`0 0 ${outerBoxSize} ${outerBoxSize}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={`qrGlow-${isCompact ? 'compact' : 'full'}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={isCompact ? 2 : 3.5} result="blur" />
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
          strokeWidth={borderThickness + (isCompact ? 3 : 5)}
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="44 56"
          filter={`url(#qrGlow-${isCompact ? 'compact' : 'full'})`}
          opacity="0.5"
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

        {/* Base dark bluish-purple track (R=45, G=41, B=62 from video) */}
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

        {/* Trailing fade of the beam (deep electric violet) */}
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

        {/* Primary vibrant electric violet-blue beam (#5530eb from video sampling) */}
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
          strokeWidth={Math.max(1.8, borderThickness - 1.5)}
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
          strokeWidth={Math.max(1.2, borderThickness - 2.8)}
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
          strokeWidth={isCompact ? 1.0 : 1.4}
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

      {/* 3. Inner White Container holding the QR code - completely static, sharp, untouched */}
      <div
        className="relative z-10 bg-white flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
        style={{
          width: `${whiteBoxSize}px`,
          height: `${whiteBoxSize}px`,
          padding: `${whitePadding}px`,
          borderRadius: `${cardRadius}px`,
        }}
      >
        {/* Exact 21x21 QR Code Vector Matrix extracted directly from the video */}
        <svg
          viewBox="0 0 21 21"
          className="block"
          style={{ width: `${size}px`, height: `${size}px` }}
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
      </div>

      {/* Subtle hover icon indicating it can be enlarged (for full card) */}
      {showHoverTooltip && (
        <div className="absolute inset-0 rounded-[20px] bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[1px] z-20">
          <div className="px-3 py-1.5 bg-black/85 rounded-full border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Tap to expand</span>
          </div>
        </div>
      )}
    </div>
  );
};
