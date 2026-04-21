'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative w-full bg-white pt-24 md:pt-32 min-h-[90vh] overflow-hidden flex flex-col items-center">
      {/* Content Section */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-5 py-1.5 mb-8 text-[11px] font-black uppercase tracking-[0.2em] text-[#008080] bg-[#008080]/5 rounded-full">
            Discover & Book
          </span>
          <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tight text-[#1D1D1F] mb-8 leading-[1.05]">
            Experience Unforgettable <br /> 
            <span className="text-[#008080] italic font-serif">Moments</span> Together.
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-[#6E6E73] font-medium leading-relaxed mb-12">
            Uventer is your premium gateway to the most exclusive events. <br className="hidden md:block" />
            From intimate workshops to grand festivals, find your next story here.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/add-event">
            <button className="bg-[#121212] text-white h-16 px-12 rounded-full font-bold text-lg flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-black/10 group">
              Submit Your Event
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <button className="bg-white text-[#121212] border-2 border-[#F5F5F7] h-16 px-12 rounded-full font-bold text-lg hover:bg-[#F5F5F7] transition-all">
            Explore Communities
          </button>
        </motion.div>
      </div>

      {/* Hero Image Section - Anchored to the bottom and filling the width */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full mt-auto"
      >
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[1600px] relative">
            <Image
              src="/herosectionimg.png"
              alt="Uventer Community"
              width={1600}
              height={800}
              className="w-full h-auto object-contain select-none pointer-events-none"
              priority
            />
          </div>
        </div>
        {/* Subtle Bottom Fade to White for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </motion.div>
    </section>
  );
};

export default Hero;
