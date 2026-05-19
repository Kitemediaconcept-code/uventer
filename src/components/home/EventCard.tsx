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
      className="group relative bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 flex flex-col h-full overflow-hidden shadow-sm hover:shadow-xl rounded-none"
    >
      {/* Top Content Area */}
      <div className="p-6 md:p-7 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-[16px] md:text-[18px] font-bold text-gray-900 leading-snug tracking-tight mb-3 min-h-[50px] line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Location Info */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-6">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        {/* Big Date & Price Section */}
        <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-[54px] font-light leading-none text-gray-950 tracking-tighter">
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
      <div className="relative w-full aspect-[16/10] overflow-hidden shrink-0 border-t border-gray-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
      </div>

      {/* Dark Action Footer */}
      <div className="w-full bg-[#171717] text-white flex border-t border-neutral-800 text-[12px] font-black tracking-widest uppercase shrink-0">
        {!isPastEvent ? (
          <>
            <Link
              href={`/events/${id}?book=true`}
              className="flex-grow py-4.5 text-center hover:bg-[#e0e02a] hover:text-black transition-all duration-300 border-r border-neutral-800 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              Register
            </Link>
            <Link
              href={`/events/${id}`}
              className="flex-grow py-4.5 text-center hover:bg-neutral-800 transition-all duration-300 cursor-pointer"
            >
              More info
            </Link>
          </>
        ) : (
          <Link
            href={`/events/${id}`}
            className="w-full py-4.5 text-center hover:bg-neutral-800 transition-all duration-300 cursor-pointer"
          >
            More info
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;
