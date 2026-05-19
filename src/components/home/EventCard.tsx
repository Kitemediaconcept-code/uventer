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
}

const EventCard = ({ id, title, category, date, location, imageUrl, price, paymentLink }: EventCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-[40px] overflow-hidden border border-accent hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full"
    >
      <div className="relative h-64 w-full overflow-hidden shrink-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4 gap-4">
          <h3 className="text-[18px] font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <Link 
            href={`/events/${id}`}
            className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-black transition-colors"
          >
            <ArrowUpRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-muted">
            <Calendar size={16} className="text-primary" />
            <span className="text-[14px] font-medium">{date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <MapPin size={16} className="text-primary" />
            <span className="text-[14px] font-medium truncate">{location}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-accent flex items-center justify-between mt-auto gap-3">
          <div className="flex flex-col shrink-0">
            <span className="text-[10px] uppercase font-bold text-muted tracking-widest">Entry From</span>
            <span className="text-[18px] font-bold text-black">₹{price}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href={`/events/${id}`}
              className="text-[14px] sm:text-[16px] font-bold text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              Details
            </Link>
            
            {paymentLink && (
              <Link 
                href={`/events/${id}?book=true`}
                className="px-4 py-2 bg-primary text-black rounded-xl text-[10px] sm:text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 whitespace-nowrap"
                onClick={(e) => e.stopPropagation()}
              >
                Book Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
