'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="w-full bg-white pt-24 pb-12 px-6 lg:pt-32 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#141EC2] rounded-[35px] p-8 md:p-12 lg:p-16 overflow-hidden flex flex-col justify-center min-h-[400px] lg:min-h-[550px] group"
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

        {/* Right Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#FFFFFF] rounded-[35px] p-8 md:p-12 lg:p-16 overflow-hidden flex flex-col justify-start border-2 border-[#F5F5F7] min-h-[400px] lg:min-h-[550px] group"
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
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#1D1D1F] leading-[1.1] tracking-tight">
              Featured Events
            </h2>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
