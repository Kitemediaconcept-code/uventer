'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface EventCardProps {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  imageUrl: string;
  price: number;
  paymentLink?: string;
  isPastEvent?: boolean;
}

const EventCard = ({ id, title, category, date, location, imageUrl, price, paymentLink, isPastEvent }: EventCardProps) => {
  const parsedDate = new Date(date);
  const isInvalid = isNaN(parsedDate.getTime());
  const dayStr = isInvalid ? date : parsedDate.getDate().toString();
  const monthLong = isInvalid ? '' : parsedDate.toLocaleString('default', { month: 'long' });
  const monthAbbr = monthLong.substring(0, 3);
  const monthRest = monthLong.substring(3);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white border border-neutral-200 hover:border-neutral-300 transition-colors duration-300 flex flex-col h-full overflow-hidden rounded-2xl"
    >
      {/* Top Content Area */}
      <div className="p-5 md:p-7 flex flex-col flex-grow">
        {/* Category & FOMO Badges */}
        <div className="mb-3 flex justify-between items-start">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-neutral-100 text-neutral-600 group-hover:bg-[#e0e02a]/10 group-hover:text-black transition-colors duration-300">
            {category}
          </span>
          {!isPastEvent && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Selling Fast
            </motion.span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[16px] md:text-[18px] font-bold text-gray-900 leading-snug tracking-tight mb-2 md:mb-3 min-h-[40px] md:min-h-[50px] line-clamp-2 group-hover:text-black transition-colors duration-300">
          {title}
        </h3>

        {/* Location Info */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-6 group-hover:text-gray-600 transition-colors duration-300">
          <MapPin size={12} className="shrink-0 text-gray-400 group-hover:text-[#e0e02a] transition-colors duration-300" />
          <span className="truncate">{location}</span>
        </div>

        {/* Big Date & Price Section */}
        <div className="flex items-end justify-between mt-auto pt-4 border-t border-neutral-100/80">
          <div className="flex items-center gap-2">
            <span className="text-[42px] md:text-[54px] font-light leading-none text-gray-950 tracking-tighter">
              {dayStr}
            </span>
            <div className="text-[10px] leading-[1.1] text-gray-500 uppercase tracking-widest font-black flex flex-col">
              <span>{monthAbbr}</span>
              <span>{monthRest}</span>
            </div>
          </div>

          <div className="flex flex-col items-end text-right pb-1">
            <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Entry From</span>
            <span className="text-[18px] font-black text-gray-950 leading-none">₹{price}</span>
          </div>
        </div>
      </div>

      {/* Image Block - Edge to Edge */}
      <div className="relative w-full aspect-[2/1] md:aspect-[16/10] overflow-hidden shrink-0 border-t border-neutral-100/60">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
        {/* Subtle dark gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      </div>

      {/* Minimal Action Footer */}
      <div className="w-full bg-transparent flex border-t border-neutral-200 text-[11px] font-bold tracking-widest uppercase shrink-0 text-neutral-500">
        {!isPastEvent ? (
          <>
            <Link
              href={`/events/${id}?book=true`}
              className="flex-grow py-[16px] text-center hover:text-black hover:bg-neutral-50 transition-colors duration-300 border-r border-neutral-200 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              Register
            </Link>
            <Link
              href={`/events/${id}`}
              className="flex-grow py-[16px] text-center hover:text-black hover:bg-neutral-50 transition-colors duration-300 cursor-pointer"
            >
              Details
            </Link>
          </>
        ) : (
          <Link
            href={`/events/${id}`}
            className="w-full py-[16px] text-center hover:text-black hover:bg-neutral-50 transition-colors duration-300 cursor-pointer"
          >
            View Memories
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;
