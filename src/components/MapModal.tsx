import React from 'react';
import { X, MapPin, Navigation, Car, Bike, Info, ExternalLink } from 'lucide-react';
import { TicketData } from '../types';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketData;
}

export const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, ticket }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#161719] border border-white/10 rounded-t-[28px] sm:rounded-[28px] p-6 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Cinema Location & Directions
              </h3>
              <p className="text-xs text-[#8e95a2]">{ticket.theaterName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/80 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulated Map Card with dark styling */}
        <div className="relative my-4 h-36 w-full rounded-2xl overflow-hidden border border-white/10 bg-[#1c2128] flex flex-col justify-end p-4">
          {/* Map Grid background visual */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Road grid lines */}
          <div className="absolute inset-0">
            <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="40" x2="400" y2="40" stroke="#94a3b8" strokeWidth="6" />
              <line x1="120" y1="0" x2="120" y2="200" stroke="#94a3b8" strokeWidth="8" />
              <line x1="0" y1="110" x2="400" y2="110" stroke="#94a3b8" strokeWidth="4" />
              <line x1="280" y1="0" x2="280" y2="200" stroke="#94a3b8" strokeWidth="6" />
            </svg>
          </div>

          {/* Pin */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
            <div className="px-2.5 py-1 rounded-full bg-purple-600 text-white text-[10px] font-bold shadow-lg">
              {ticket.screenName}
            </div>
            <div className="w-3 h-3 bg-purple-600 rotate-45 -mt-1 rounded-xs" />
          </div>

          <div className="relative z-10 bg-black/75 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
            <p className="text-xs font-semibold text-white truncate">{ticket.theaterAddress}</p>
            <p className="text-[10px] text-emerald-400 font-medium">Approx. 15 mins away • Light traffic</p>
          </div>
        </div>

        {/* Address details */}
        <div className="space-y-3 text-xs text-[#9ca3af]">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <p className="text-white/80">
              Landmark: Located near Royapettah High Road & Westcott Road junction, Royapettah, Chennai.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
              <Bike className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[11px] font-medium text-white block">2-Wheeler Parking</span>
                <span className="text-[10px] text-emerald-400">Available</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-[11px] font-medium text-white block">Car Parking</span>
                <span className="text-[10px] text-emerald-400">Paid valet inside</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA to open Google Maps */}
        <div className="mt-5 flex gap-2">
          <a
            href={ticket.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition active:scale-[0.98]"
          >
            <Navigation className="w-4 h-4" />
            Start Navigation
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>
    </div>
  );
};
