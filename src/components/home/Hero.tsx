'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden flex flex-col items-center">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-full">
            Discover & Book
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-8 leading-[1.1]">
            Experience Unforgettable <br /> 
            <span className="text-primary italic font-serif">Moments</span> Together.
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted leading-relaxed mb-12">
            Uventer is your premium gateway to the most exclusive events. From intimate workshops to grand festivals, find your next story here.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/add-event">
            <button className="bg-primary text-white h-14 px-8 rounded-full font-bold flex items-center gap-2 hover:bg-primary/90 transition-all group">
              Submit Your Event
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
            <input 
              type="text" 
              placeholder="Search for events..."
              className="w-full h-14 pl-12 pr-6 rounded-full border border-accent bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
