'use client';

import React from 'react';
import CalendarSection from '@/components/home/CalendarSection';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-white pb-20 pt-32">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-primary transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          Back to Home
        </Link>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Event <span className="text-primary italic font-serif">Calendar</span>
        </h1>
        <p className="text-muted mt-4 max-w-2xl text-lg">
          Browse our schedule of premium corporate events, networking sessions, and professional workshops.
        </p>
      </div>

      <div className="bg-secondary/10 py-12">
        <CalendarSection />
      </div>
    </div>
  );
}
