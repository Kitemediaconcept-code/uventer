'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        {/* Left: Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="relative h-10 w-32 flex items-center">
            <Image
              src="/uventerlogo.png"
              alt="Uventer Logo"
              width={120}
              height={40}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center justify-center gap-10 absolute left-1/2 -translate-x-1/2 h-full">
          <Link href="/" className="text-[15px] font-medium text-gray-700 hover:text-black transition-colors">
            Home
          </Link>
          <Link href="/#events" className="text-[15px] font-medium text-gray-700 hover:text-black transition-colors">
            Events
          </Link>
          <Link href="/calendar" className="text-[15px] font-medium text-gray-700 hover:text-black transition-colors">
            Calendar
          </Link>
          <AnimatePresence>
            {session && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <Link href="/dashboard" className="text-[15px] font-bold text-primary flex items-center gap-2">
                  <User size={16} />
                  Dashboard
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex justify-end items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <Link href="/add-event">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-black px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
                >
                  <Plus size={18} />
                  <span>Add Event</span>
                </motion.button>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button 
                className="bg-primary text-black px-8 py-2.5 rounded-full text-sm font-bold hover:brightness-95 transition-all shadow-sm"
              >
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
