import React, { useState } from 'react';
import { X, Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { TicketData } from '../types';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketData;
  initialMode?: 'chat' | 'cancellation' | 'resend';
}

interface Message {
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  ticket,
  initialMode = 'chat',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: `Hello! I'm your District Booking Assistant for order #${ticket.orderId} (${ticket.movieTitle}). How can I assist you today?`,
      time: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    'Can I cancel this ticket?',
    'What is the age restriction for UA16+?',
    'Resend ticket to WhatsApp',
    'Where is Symphony screen inside?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: Message = {
      sender: 'user',
      text,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // Simulated intelligent District response
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('cancel')) {
        reply = `According to Woodlands Complex cinema policy, tickets for "${ticket.movieTitle}" cannot be cancelled within 2 hours of showtime (${ticket.dateTimeText}). However, if the screening is affected by technical issues, an automatic 100% refund of ${ticket.currency}${ticket.totalBill} will be credited to your original payment method.`;
      } else if (lower.includes('age') || lower.includes('ua16+') || lower.includes('rating')) {
        reply = `The movie "${ticket.movieTitle}" is certified UA16+. Viewers aged 16 and above are permitted. Patrons under 16 must be accompanied by an adult, and valid photo ID may be verified at the entrance.`;
      } else if (lower.includes('whatsapp') || lower.includes('resend') || lower.includes('sms')) {
        reply = `A digital copy with Booking Code ${ticket.bookingCode} and QR link has been dispatched to your registered phone number & email address. Check your WhatsApp for the District verified business badge message!`;
      } else if (lower.includes('symphony') || lower.includes('screen') || lower.includes('seat')) {
        reply = `SYMPHONY is located on Floor 1 of Woodlands Complex, Royapettah. Take the main escalators or elevator from the atrium lobby. Ushers will guide you to row Y, seat 6.`;
      } else {
        reply = `Thank you for reaching out regarding "${ticket.movieTitle}". Our customer support desk at Woodlands Complex is also available in person near Gate 2, or you can present Booking ID ${ticket.bookingId} to the manager.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: reply,
          time: 'Just now',
        },
      ]);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md h-[80vh] sm:h-[600px] flex flex-col bg-[#161719] border border-white/10 rounded-t-[28px] sm:rounded-[28px] shadow-2xl overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#1b1c1e] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">District Help Desk</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-[#8e95a2]">
                Booking: {ticket.bookingCode} • 24x7 Assistance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0 text-xs mt-1">
                  D
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-br-xs'
                    : 'bg-[#222428] text-white/90 rounded-bl-xs border border-white/5'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-[#1b1c1e]/60 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-white/5">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] bg-white/5 hover:bg-white/10 active:bg-white/15 text-white/80 whitespace-nowrap px-3 py-1.5 rounded-full border border-white/10 transition flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#1b1c1e] border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your query..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            className="w-9 h-9 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white flex items-center justify-center transition flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
