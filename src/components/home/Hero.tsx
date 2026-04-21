'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative w-full bg-[#FBFBFD] pt-24 md:pt-32 overflow-hidden flex flex-col items-center">
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#1D1D1F] mb-6 leading-[1.1]">
            Find Your Tribe, <br />
            Build Your Network.
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#6E6E73] font-medium leading-relaxed mb-10">
            Connect with like-minded students for fun, <br className="hidden md:block" />
            friendships, and future opportunities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/add-event">
            <button className="bg-[#121212] text-white h-14 px-10 rounded-full font-bold flex items-center gap-2 hover:bg-black transition-all group">
              Join for Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <button className="bg-white text-[#121212] border border-[#E8E8ED] h-14 px-10 rounded-full font-bold hover:bg-[#F5F5F7] transition-all">
            Explore Communities
          </button>
        </motion.div>
      </div>

      {/* Hero Image Section - Fills the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative w-full max-w-[1200px] mt-8 select-none pointer-events-none"
      >
        <Image
          src="/herosectionimg.png"
          alt="Community Members"
          width={1200}
          height={600}
          className="w-full h-auto object-contain"
          priority
        />
      </motion.div>
    </section>
  );
};

export default Hero;
