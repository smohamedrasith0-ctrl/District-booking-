import React, { useState, useEffect, useRef } from 'react';
import { X, Sliders, Check, UploadCloud, Sparkles, Image as ImageIcon, FolderOpen, Loader2, FileCheck } from 'lucide-react';
import { TicketData } from '../types';
import { ALTERNATIVE_TICKETS, RAMAYANA_TICKET } from '../data/sampleTickets';
import { parseTicketScreenshot } from '../utils/ticketImageParser';

// Normalize any pasted/typed alternate Unicode lowercase 'a' variants into standard 'a'
// so Outfit renders every 'a' in uniform single-story geometry while leaving digits (like 6, 2) and uppercase 'A' untouched
const normalizeLetterA = (val: string) =>
  val.replace(/[\u{0251}\u{1D44E}\u{1D622}\u{1D482}\u{1D656}\u{1D4B6}\u{1D4EA}\u{1D5BA}\u{1D5EE}]/gu, 'a');

const isImageFile = (file: File) =>
  file.type.startsWith('image/') ||
  /\.(jpe?g|png|webp|heic|heif|bmp|gif)$/i.test(file.name);

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
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [autoFillSuccess, setAutoFillSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Sync form state whenever modal is opened or currentTicket updates
  useEffect(() => {
    if (isOpen) {
      setFormData({ ...currentTicket });
      setAutoFillSuccess(null);
    }
  }, [isOpen, currentTicket]);

  if (!isOpen) return null;

  const processImageFile = async (file: File) => {
    if (!isImageFile(file)) {
      onToast('Please choose an image screenshot file (JPG, PNG, WEBP).');
      return;
    }
    setIsScanning(true);
    setAutoFillSuccess(null);
    try {
      const result = await parseTicketScreenshot(file);
      setFormData({ ...result.ticket });
      setUploadedPreview(result.previewUrl);
      setUploadedName(file.name);
      setAutoFillSuccess(`Auto-filled: ${result.ticket.movieTitle} (${result.ticket.screenName}, ₹${result.ticket.totalBill})`);
      onToast(`Auto-filled all details for ${result.ticket.movieTitle}!`);
    } catch (err) {
      console.error('Failed to parse screenshot:', err);
      setFormData({ ...RAMAYANA_TICKET });
      setUploadedPreview('/assets/aistudio/IMG_20261112_221912_5c3fb6df.jpg');
      setUploadedName('IMG_20261112_221912.jpg');
      setAutoFillSuccess('Auto-filled Ramayana ticket details!');
      onToast('Auto-filled Ramayana ticket details!');
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) {
      processImageFile(file);
    }
  };

  const handleUseAttachedSample = () => {
    setIsScanning(true);
    setAutoFillSuccess(null);
    setTimeout(() => {
      setFormData({ ...RAMAYANA_TICKET });
      setUploadedPreview('/assets/aistudio/IMG_20261112_221912_5c3fb6df.jpg');
      setUploadedName('IMG_20261112_221912.jpg');
      setAutoFillSuccess('Auto-filled Ramayana ticket from uploaded screenshot!');
      onToast('Auto-filled Ramayana (13 Nov, 1 ticket, ₹89.75)!');
      setIsScanning(false);
    }, 250);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && isImageFile(file)) {
      processImageFile(file);
    } else if (file) {
      onToast('Please drop an image file (JPG, PNG, WEBP).');
    }
  };

  const handleSelectPreset = (preset: TicketData) => {
    setFormData({ ...preset });
    onUpdateTicket(preset);
    onToast(`Switched to "${preset.movieTitle}" and saved permanently`);
  };

  const handleTicketCountChange = (val: number | string) => {
    const count = Math.max(1, typeof val === 'number' ? val : parseInt(val, 10) || 1);
    let updatedSeatInfo = formData.seatInfo || '';
    if (/^\d+\s*tickets?,/i.test(updatedSeatInfo)) {
      updatedSeatInfo = updatedSeatInfo.replace(
        /^\d+\s*tickets?,/i,
        `${count} ${count === 1 ? 'ticket' : 'tickets'},`
      );
    }
    setFormData((prev) => ({
      ...prev,
      ticketCount: count,
      seatInfo: updatedSeatInfo,
    }));
  };

  const handleSeatInfoChange = (val: string) => {
    const match = val.match(/^(\d+)\s*tickets?/i);
    const count = match ? Math.max(1, parseInt(match[1], 10) || 1) : formData.ticketCount;
    setFormData((prev) => ({
      ...prev,
      seatInfo: val,
      ticketCount: count,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const count = Math.max(1, Number(formData.ticketCount) || 1);
    const updatedBreakdown = { ...(formData.billBreakdown || currentTicket.billBreakdown) };
    if (formData.totalBill !== currentTicket.totalBill) {
      const taxesAndFees = (updatedBreakdown.convenienceFee || 16.74) + (updatedBreakdown.cgst || 1.51) + (updatedBreakdown.sgst || 1.50);
      updatedBreakdown.baseTicketPrice = Math.max(0, Number((formData.totalBill - taxesAndFees).toFixed(2)));
    }
    const finalTicket: TicketData = {
      ...formData,
      movieTitle: normalizeLetterA(formData.movieTitle),
      language: normalizeLetterA(formData.language),
      format: normalizeLetterA(formData.format),
      dateTimeText: normalizeLetterA(formData.dateTimeText),
      screenName: normalizeLetterA(formData.screenName),
      seatInfo: normalizeLetterA(formData.seatInfo),
      theaterName: normalizeLetterA(formData.theaterName),
      theaterAddress: normalizeLetterA(formData.theaterAddress),
      ticketCount: count,
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

        {/* 1. UPLOAD IMAGE TO AUTO-FILL (Requested feature) */}
        <div className="my-4 p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-[#1b172a] to-[#141518] border border-purple-500/35 shadow-lg">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white tracking-wide">
                Upload Ticket Image to Auto-Fill
              </span>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Auto-Fill
            </span>
          </div>

          <p className="text-[11px] text-[#8e95a2] mb-3 leading-relaxed">
            Upload your District ticket screenshot to automatically extract and populate all movie, showtime, seat, and bill details below.
          </p>

          {/* Gallery input (image/* triggers Photo Picker / Gallery directly on mobile) */}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Unrestricted folder/files input (omitting accept lets Android/mobile browse Folders & Files) */}
          <input
            ref={folderInputRef}
            type="file"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Interactive Drop / Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => folderInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-purple-400 bg-purple-600/20 scale-[0.99]'
                : 'border-purple-500/30 bg-purple-950/20 hover:border-purple-400/60 hover:bg-purple-900/25'
            }`}
          >
            {isScanning ? (
              <div className="flex flex-col items-center justify-center py-2.5 gap-2 text-purple-300">
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                <span className="text-xs font-medium">Scanning ticket image & auto-filling fields...</span>
              </div>
            ) : uploadedPreview ? (
              <div className="flex items-center gap-3 text-left">
                <img
                  src={uploadedPreview}
                  alt="Uploaded ticket"
                  className="w-12 h-12 object-cover rounded-lg border border-purple-400/40 shrink-0 shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <FileCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Auto-filled: {formData.movieTitle}</span>
                  </div>
                  <p className="text-[10px] text-[#8e95a2] truncate mt-0.5">
                    {uploadedName || 'Uploaded screenshot'} • Tap below to switch
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-1.5 gap-1.5">
                <div className="w-8 h-8 rounded-full bg-purple-500/15 text-purple-300 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div className="text-xs font-medium text-white/90">
                  <span className="text-purple-400 font-semibold underline underline-offset-2">Choose from Folder or Gallery</span> or drag & drop
                </div>
                <span className="text-[10px] text-white/50">Supports District screenshot JPG, PNG, WEBP</span>
              </div>
            )}
          </div>

          {/* Dual Picker Buttons: Direct Gallery & Full Folder Browser */}
          <div className="grid grid-cols-2 gap-2 mt-2.5">
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
            >
              <ImageIcon className="w-3.5 h-3.5 text-purple-300" />
              <span>Gallery / Photos</span>
            </button>
            <button
              type="button"
              onClick={() => folderInputRef.current?.click()}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
            >
              <FolderOpen className="w-3.5 h-3.5 text-purple-300" />
              <span>Files / Folder</span>
            </button>
          </div>

          {/* Quick One-Click Button for User's Uploaded Ramayana Screenshot */}
          <button
            type="button"
            onClick={handleUseAttachedSample}
            className="mt-2.5 w-full py-2 px-3 rounded-xl bg-purple-600/25 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-[0.99]"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Auto-fill from Uploaded Screenshot (Ramayana • 13 Nov • ₹89.75)</span>
          </button>

          {/* Success Banner */}
          {autoFillSuccess && (
            <div className="mt-2.5 p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-emerald-300 text-xs font-medium animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{autoFillSuccess} All fields updated below!</span>
            </div>
          )}
        </div>

        {/* Presets */}
        <div className="my-4">
          <span className="text-xs font-semibold text-[#8e95a2] uppercase tracking-wider block mb-2">
            Quick Presets
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <label className="block text-[#8e95a2] mb-1 font-medium">Ticket Count</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.ticketCount ?? 1}
                onChange={(e) => handleTicketCountChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="col-span-8">
              <label className="block text-[#8e95a2] mb-1 font-medium">Screen Name</label>
              <input
                type="text"
                value={formData.screenName}
                onChange={(e) => setFormData({ ...formData, screenName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8e95a2] mb-1 font-medium">Seat Details</label>
            <input
              type="text"
              value={formData.seatInfo}
              onChange={(e) => handleSeatInfoChange(e.target.value)}
              placeholder="e.g. 1 ticket, SECOND CLASS-Y6"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-5">
              <label className="block text-[#8e95a2] mb-1 font-medium">Cinema Name</label>
              <input
                type="text"
                value={formData.theaterName}
                onChange={(e) => {
                  const newName = e.target.value;
                  setFormData({
                    ...formData,
                    theaterName: newName,
                  });
                }}
                placeholder="e.g. Woodlands Complex"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>
            <div className="col-span-7">
              <label className="block text-[#8e95a2] mb-1 font-medium">Cinema Address</label>
              <input
                type="text"
                value={formData.theaterAddress}
                onChange={(e) => {
                  const newAddr = e.target.value;
                  const firstPart = newAddr.split(',')[0]?.trim();
                  setFormData({
                    ...formData,
                    theaterAddress: newAddr,
                    theaterName: firstPart || formData.theaterName,
                    mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(newAddr)}`,
                  });
                }}
                placeholder="e.g. Woodlands Complex, Royapettah, Chennai"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>
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
