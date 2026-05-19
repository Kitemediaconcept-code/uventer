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
    <section className="w-full bg-white py-[100px] px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6">
        {/* Left Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#28347b] rounded-[24px] lg:rounded-[28px] p-6 md:p-10 lg:p-12 overflow-hidden flex flex-col justify-center min-h-[240px] lg:min-h-[450px] group"
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
            <h2 className="text-[32px] md:text-[48px] lg:text-[64px] font-bold text-white mb-4 leading-[1.1] tracking-tight">
              We execute events that matter.
            </h2>
            <p className="text-white/80 text-[16px] md:text-[18px] mb-6 max-w-md font-medium leading-[1.7]">
              Corporate events, business experiences, and professional execution—delivered with precision.
            </p>
            <Link href="/add-event">
              <button className="bg-primary text-black px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold text-[16px] hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10">
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
          className="relative rounded-[24px] lg:rounded-[28px] overflow-hidden flex flex-col min-h-[240px] lg:min-h-[450px] group shadow-2xl cursor-pointer"
          onClick={scrollToEvents}
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            {/* Desktop Image */}
            <div className="hidden md:block absolute inset-0">
              <Image
                src="/featuredeventcarddesktop.png"
                alt="Featured Events"
                fill
                priority
                className="object-cover object-top transition-transform duration-[3s] group-hover:scale-110"
              />
            </div>
            {/* Mobile Image */}
            <div className="block md:hidden absolute inset-0">
              <Image
                src="/featuredeventcard.jpeg"
                alt="Featured Events"
                fill
                priority
                className="object-cover object-top transition-transform duration-[3s] group-hover:scale-110"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
