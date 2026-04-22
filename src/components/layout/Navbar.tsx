'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-accent"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="relative h-10 w-32 flex items-center">
          <Image
            src="/uventer-logo.png"
            alt="Uventer Logo"
            width={140}
            height={50}
            className="object-contain"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/#events" className="text-sm font-medium hover:text-primary transition-colors">
            Events
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/add-event">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
            >
              <Plus size={18} />
              <span>Add Event</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
