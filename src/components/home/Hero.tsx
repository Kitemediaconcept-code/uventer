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
    <section className="w-full bg-white pt-8 pb-12 px-6 lg:pt-32 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#28347b] rounded-[35px] p-8 md:p-12 lg:p-16 overflow-hidden flex flex-col justify-center min-h-[450px] lg:min-h-[600px] group"
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
              <button className="bg-primary text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10">
                Plan Your Event
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Right Card - Featured Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[35px] overflow-hidden flex flex-col min-h-[450px] lg:min-h-[600px] group shadow-2xl cursor-pointer"
          onClick={scrollToEvents}
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/featuredeventcard.jpeg"
              alt="Featured Events"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover transition-transform duration-[3s] group-hover:scale-110"
            />
          </div>

          {/* Invisible overlay to maintain consistent hover effects if desired, or just the button */}
          <div className="absolute top-10 right-10 z-10">
            <div className="bg-[#28347b] w-14 h-14 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <ArrowDown size={24} className="text-white" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
