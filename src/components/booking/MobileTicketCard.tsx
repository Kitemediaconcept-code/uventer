'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface MobileTicketCardProps {
  bookingId: string;
  eventName: string;
  eventDate: string;
  timeSlot: string;
  price: number;
  userName: string;
  imageUrl?: string;
  index: number;
}

const MobileTicketCard = ({
  bookingId,
  eventName,
  eventDate,
  timeSlot,
  price,
  userName,
  imageUrl,
  index,
}: MobileTicketCardProps) => {
  const dateObj = new Date(eventDate);
  const formattedDate = isNaN(dateObj.getTime())
    ? eventDate
    : dateObj.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\//g, '.');

  // Randomize a base color
  const colors = ['bg-[#b23a3a]', 'bg-[#1b5e9f]', 'bg-[#2b6a4a]', 'bg-[#8a5a2a]', 'bg-[#5e3a8a]'];
  const baseColor = colors[index % colors.length];
  
  // Determine variant based on index (even indices -> text on top, odd indices -> image on top)
  const isTextTop = index % 2 === 0;

  if (isTextTop) {
    // VARIANT 1: Text Top, Image Bottom (Like "Léon" card)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: (index % 4) * 0.1 }}
        className="w-full flex flex-col relative drop-shadow-xl"
      >
        {/* Top Section - Text Only */}
        <div className={`relative w-full rounded-t-3xl pt-6 pb-6 px-5 ${baseColor} text-white`}>
          <div className="flex flex-col h-full justify-between">
            <div className="mb-6">
              <h3 className="font-serif text-[28px] font-bold leading-[1.1] mb-1">
                {eventName}
              </h3>
              <p className="text-white/70 text-[10px] font-bold tracking-widest uppercase">
                Premium Pass
              </p>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-white/90">
              <div>
                <span className="text-[9px] uppercase tracking-wider block mb-0.5 text-white/50">Price</span>
                <span className="text-sm font-bold">₹{price}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider block mb-0.5 text-white/50">Attendee</span>
                <span className="text-sm font-bold truncate block pr-2">{userName}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider block mb-0.5 text-white/50">Date</span>
                <span className="text-sm font-bold">{formattedDate}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider block mb-0.5 text-white/50">Time</span>
                <span className="text-sm font-bold">{timeSlot || 'TBA'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Cutout Divider */}
        <div className="relative w-full h-0 z-20">
          <div className="absolute left-[-10px] top-[-10px] w-5 h-5 bg-black rounded-full" />
          <div className="absolute right-[-10px] top-[-10px] w-5 h-5 bg-black rounded-full" />
          <div className="absolute left-4 right-4 top-0 border-t border-dashed border-white/20" />
        </div>

        {/* Bottom Section - Image & Barcode */}
        <div className={`relative ${baseColor} rounded-b-3xl overflow-hidden pt-5 pb-5 px-5 flex flex-col text-white`}>
          {imageUrl && (
            <div className="relative w-full h-40 mb-5 rounded-xl overflow-hidden">
              <Image
                src={imageUrl}
                alt={eventName}
                fill
                className="object-cover opacity-90 mix-blend-overlay"
              />
            </div>
          )}
          
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[9px] uppercase tracking-wider block mb-0.5 text-white/50">Ticket ID</span>
              <span className="text-xs font-bold font-mono text-white/90">{bookingId.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>

          {/* Barcode */}
          <div className="w-full flex items-center justify-between opacity-50 mt-4">
            {Array.from({ length: 25 }).map((_, i) => (
              <div 
                key={i} 
                className="h-8 bg-white rounded-full" 
                style={{ width: `${Math.max(1, Math.random() * 4)}px` }} 
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // VARIANT 2: Image Top, Text Bottom (Like "Call Me By Your Name" card)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 4) * 0.1 }}
      className="w-full flex flex-col relative drop-shadow-xl"
    >
      {/* Top Section - Image */}
      <div className={`relative w-full rounded-t-3xl overflow-hidden pt-4 pb-6 px-5 ${baseColor} min-h-[220px]`}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={eventName}
            fill
            className="object-cover opacity-80 mix-blend-overlay"
          />
        )}
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-white font-serif text-[28px] font-bold leading-tight mb-1 drop-shadow-md">
              {eventName}
            </h3>
            <p className="text-white/80 text-[10px] font-bold tracking-widest uppercase mb-8">
              Premium Entry
            </p>
          </div>
        </div>
      </div>

      {/* Ticket Cutout Divider */}
      <div className="relative w-full h-0 z-20">
        <div className="absolute left-[-10px] top-[-10px] w-5 h-5 bg-black rounded-full" />
        <div className="absolute right-[-10px] top-[-10px] w-5 h-5 bg-black rounded-full" />
        <div className="absolute left-4 right-4 top-0 border-t border-dashed border-white/20" />
      </div>

      {/* Bottom Section - Text & Barcode */}
      <div className="bg-[#b0bac3] rounded-b-3xl pt-6 pb-5 px-5 flex flex-col text-black">
        <p className="font-serif font-bold text-lg leading-tight mb-4 truncate text-black/90">
          {eventName}
        </p>
        
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4">
          <div>
            <span className="text-[9px] uppercase tracking-wider block mb-0.5 text-black/50 font-bold">Attendee</span>
            <span className="text-xs font-bold text-black/80 truncate block pr-2">{userName}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider block mb-0.5 text-black/50 font-bold">Price</span>
            <span className="text-sm font-bold text-black/80">₹{price}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider block mb-0.5 text-black/50 font-bold">Date</span>
            <span className="text-xs font-bold text-black/80">{formattedDate}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider block mb-0.5 text-black/50 font-bold">Time</span>
            <span className="text-xs font-bold text-black/80">{timeSlot || 'TBA'}</span>
          </div>
        </div>

        <div className="mt-2 mb-4">
          <span className="text-[9px] uppercase tracking-wider block mb-0.5 text-black/50 font-bold">Ticket ID</span>
          <span className="text-xs font-bold font-mono text-black/80">{bookingId.slice(0, 8).toUpperCase()}</span>
        </div>

        {/* Barcode */}
        <div className="w-full flex items-center justify-between opacity-40 mt-auto">
          {Array.from({ length: 25 }).map((_, i) => (
            <div 
              key={i} 
              className="h-8 bg-black rounded-full" 
              style={{ width: `${Math.max(1, Math.random() * 4)}px` }} 
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MobileTicketCard;
