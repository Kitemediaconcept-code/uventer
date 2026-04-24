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
}

const EventCard = ({ id, title, category, date, location, imageUrl, price }: EventCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-[40px] overflow-hidden border border-accent hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
    >
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm text-primary">
            {category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <Link 
            href={`/events/${id}`}
            className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors"
          >
            <ArrowUpRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-muted">
            <Calendar size={16} className="text-primary" />
            <span className="text-xs font-medium">{date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <MapPin size={16} className="text-primary" />
            <span className="text-xs font-medium truncate">{location}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-accent flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-muted tracking-widest">Entry From</span>
            <span className="text-lg font-bold text-primary">₹{price}</span>
          </div>
          <Link 
            href={`/events/${id}`}
            className="text-sm font-bold text-foreground hover:text-primary transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
