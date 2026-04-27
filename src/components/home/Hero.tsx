'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  const scrollToEvents = () => {
    const eventsSection = document.getElementById('events');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-white pt-24 pb-12 px-6 lg:pt-32 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#141EC2] rounded-[35px] p-8 md:p-12 lg:p-16 overflow-hidden flex flex-col justify-center min-h-[450px] lg:min-h-[600px] group"
        >
          {/* Decorative element */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-10 select-none">
            <Image 
              src="/uventerelements.png" 
              alt="" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s]" 
            />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              We execute events that matter.
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-10 max-w-md font-medium leading-relaxed">
              Corporate events, business experiences, and professional execution—delivered with precision.
            </p>
            <Link href="/add-event">
              <button className="bg-white text-[#141EC2] px-10 py-4 rounded-full font-bold text-lg hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10">
                Plan Your Event
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Right Card - Featured Events (New Design) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-black rounded-[35px] overflow-hidden flex flex-col min-h-[450px] lg:min-h-[600px] group border border-black"
        >
          {/* Top Section - Image Background */}
          <div className="relative h-[45%] w-full overflow-hidden">
            <Image 
              src="/cardeventbg.jpeg" 
              alt="Events preview" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover transition-transform duration-[3s] group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
            <div className="absolute top-8 right-8 text-right z-10">
              <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1"></p>
              <h3 className="text-white text-xl font-bold leading-tight"> <br /> </h3>
            </div>
          </div>

          {/* Bottom Section - Dark Background with Tab Cutout */}
          <div className="relative flex-1 bg-[#121212] p-8 lg:p-12 flex flex-col justify-between">
            {/* The Tab Cutout Shape */}
            <div className="absolute -top-12 left-0 h-12 w-[60%] bg-[#121212] rounded-tr-[35px] flex items-center px-8 lg:px-12">
               {/* Styling element as seen in reference */}
            </div>
            
            <div className="flex-1" /> {/* Spacer */}

            <div className="flex items-end justify-between gap-4">
              <h2 className="text-white text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
                Featured <br /> Events
              </h2>

              {/* Glassmorphism Scroll Button */}
              <button 
                onClick={scrollToEvents}
                className="relative group/btn flex items-center justify-center shrink-0 mb-2"
                aria-label="Scroll to events"
              >
                {/* Outer Ring */}
                <div className="absolute inset-0 -m-1 border border-white/20 rounded-full scale-110 group-hover/btn:scale-125 transition-transform duration-500" />
                
                {/* Main Button Body */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 w-16 h-16 rounded-full flex items-center justify-center transition-all hover:bg-white/20 hover:scale-110 active:scale-95 shadow-2xl">
                  <ArrowDown size={28} className="text-white group-hover/btn:translate-y-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
