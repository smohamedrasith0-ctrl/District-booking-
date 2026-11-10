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
  // Proportions matching video frames
  const isCompact = size < 90;
  const whitePadding = isCompact ? 6 : 13;
  const whiteBoxSize = size + whitePadding * 2;
  const borderThickness = isCompact ? 3.5 : 5.0;
  const outerBoxSize = whiteBoxSize + borderThickness * 2;
  const cardRadius = isCompact ? 9 : 16;
  const outerRadius = cardRadius + borderThickness;

  return (
    <div
      onClick={onEnlarge}
      className={`relative group inline-flex items-center justify-center select-none shrink-0 ${
        onEnlarge ? 'cursor-pointer active:scale-95' : ''
      } ${className}`}
      title={onEnlarge ? 'Tap to view ticket pass' : undefined}
      style={{ width: `${outerBoxSize}px`, height: `${outerBoxSize}px` }}
    >
      {/* 1. Ambient blurred neon glow layer beneath the card matching video sampling */}
      <div
        className="absolute -inset-2.5 opacity-70 blur-md pointer-events-none transition-opacity"
        style={{
          borderRadius: `${outerRadius + 4}px`,
          background:
            'radial-gradient(circle at 50% 50%, rgba(69, 26, 248, 0.55) 0%, rgba(28, 24, 51, 0.25) 65%, transparent 100%)',
        }}
      />

      {/* 2. Outer Border Shell with 100% video-accurate rotating conic gradient */}
      <div
        className="relative w-full h-full overflow-hidden flex items-center justify-center shadow-lg"
        style={{
          borderRadius: `${outerRadius}px`,
          backgroundColor: '#1c1833',
        }}
      >
        {/* Rotating Conic Gradient Beam - continuous 2.92s clockwise revolution with radial cutoff */}
        <div
          className="absolute -inset-[65%] pointer-events-none animate-qr-conic-sweep"
          style={{
            background:
              'conic-gradient(from 0deg at 50% 50%, #471af8 0deg, #4217f0 35deg, #370ed3 80deg, #2a05b4 130deg, #2203a7 180deg, #1e038e 225deg, #1c095b 265deg, #180b4a 305deg, #1c1833 335deg, #1c1833 360deg)',
          }}
        />

        {/* High-intensity neon sheen along leading edge */}
        <div
          className="absolute -inset-[65%] pointer-events-none opacity-40 mix-blend-screen animate-qr-conic-sweep"
          style={{
            background:
              'conic-gradient(from 0deg at 50% 50%, #7c4dff 0deg, transparent 35deg, transparent 360deg)',
          }}
        />

        {/* 3. Inner White Container holding the QR code - completely static, crisp, untouched */}
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
