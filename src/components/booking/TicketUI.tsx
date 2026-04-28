'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, MapPin, Clock, User, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';

interface TicketProps {
  booking: {
    id: string;
    user_name: string;
    created_at: string;
  };
  event: {
    event_name: string;
    event_date: string;
    location: string;
    time_slot: string;
  };
}

export default function TicketUI({ booking, event }: TicketProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const downloadTicket = async () => {
    if (ticketRef.current) {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `uventer-ticket-${booking.id.slice(0, 8)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        ref={ticketRef}
        className="w-full max-w-[400px] bg-white rounded-[2.5rem] border-2 border-accent overflow-hidden shadow-2xl relative"
      >
        {/* Ticket Header */}
        <div className="bg-primary p-8 text-black text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShieldCheck size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Verified Ticket</span>
          </div>
          <h2 className="text-3xl font-black tracking-tighter leading-none mb-2">UVENTER</h2>
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Premium Event Access</p>
        </div>

        {/* Ticket Body */}
        <div className="p-8 md:p-10 space-y-8">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2">Event</span>
            <h3 className="text-2xl font-black leading-tight tracking-tight text-foreground">{event.event_name}</h3>
          </div>

          <div className="grid grid-cols-2 gap-8 py-8 border-y border-dashed border-accent">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted">Attendee</span>
              <p className="text-sm font-bold text-foreground truncate">{booking.user_name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted">Ticket ID</span>
              <p className="text-sm font-bold text-foreground font-mono">#{booking.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted">Date</span>
              <p className="text-sm font-bold text-foreground">{new Date(event.event_date).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted">Time</span>
              <p className="text-sm font-bold text-foreground">{event.time_slot || 'See Event Details'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-primary mt-0.5" />
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-muted block">Location</span>
                <p className="text-xs font-bold text-foreground">{event.location || 'Online / Global Access'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Design */}
        <div className="flex items-center gap-1 overflow-hidden opacity-10 py-4 px-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-6 w-1 bg-black rounded-full" />
          ))}
        </div>
      </motion.div>

      <button
        onClick={downloadTicket}
        className="flex items-center gap-3 h-14 px-8 bg-secondary text-foreground rounded-2xl font-bold hover:bg-accent transition-all border border-accent"
      >
        <Download size={18} />
        Download Ticket (PNG)
      </button>
    </div>
  );
}
