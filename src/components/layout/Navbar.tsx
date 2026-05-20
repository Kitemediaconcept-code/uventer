'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, User, LogOut, Menu, X, CalendarPlus, Map, Calendar, History, Info, MessageSquare, FileText, LogIn, ChevronRight, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [session, setSession] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
          <Link href="/how-it-works" className="text-[15px] font-medium text-gray-700 hover:text-black transition-colors">
            How It Works
          </Link>
          <Link href="/events" className="text-[15px] font-medium text-gray-700 hover:text-black transition-colors">
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
          {/* Desktop Only Actions */}
          <div className="hidden md:flex items-center gap-4">
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

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="block md:hidden text-gray-700 hover:text-black p-2 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[320px] max-w-full z-50 bg-[#000000] text-white p-6 overflow-y-auto md:hidden shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-8 border-b border-neutral-900 pb-4">
                <span className="text-[12px] font-black uppercase tracking-widest text-[#e0e02a]">
                  Uventer
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-neutral-400 hover:text-white p-1.5 transition-colors focus:outline-none bg-neutral-900 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Categories & Links */}
              <div className="space-y-6 flex-grow">
                {/* GROUP 1: EVENTS */}
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-2.5 px-1">
                    Events
                  </h4>
                  <div className="bg-[#070707] border border-neutral-900 rounded-2xl overflow-hidden divide-y divide-neutral-900/50">
                    <Link
                      href="/add-event"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 hover:bg-neutral-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <CalendarPlus size={18} className="text-neutral-100" />
                        <span className="text-[15px] font-bold text-neutral-100">Create New Event</span>
                      </div>
                      <ChevronRight size={16} className="text-neutral-600" />
                    </Link>
                    <Link
                      href="/events"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 hover:bg-neutral-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Map size={18} className="text-neutral-100" />
                        <span className="text-[15px] font-bold text-neutral-100">Events Near Me</span>
                      </div>
                      <ChevronRight size={16} className="text-neutral-600" />
                    </Link>
                    <Link
                      href="/calendar"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 hover:bg-neutral-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-neutral-100" />
                        <span className="text-[15px] font-bold text-neutral-100">Calendar</span>
                      </div>
                      <ChevronRight size={16} className="text-neutral-600" />
                    </Link>
                    <Link
                      href="/#past-events"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 hover:bg-neutral-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <History size={18} className="text-neutral-100" />
                        <span className="text-[15px] font-bold text-neutral-100">Past Events</span>
                      </div>
                      <ChevronRight size={16} className="text-neutral-600" />
                    </Link>
                  </div>
                </div>

                {/* GROUP 2: SUPPORT */}
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-2.5 px-1">
                    Support
                  </h4>
                  <div className="bg-[#070707] border border-neutral-900 rounded-2xl overflow-hidden divide-y divide-neutral-900/50">
                    <Link
                      href="/#services"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 hover:bg-neutral-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Info size={18} className="text-neutral-100" />
                        <span className="text-[15px] font-bold text-neutral-100">About Us</span>
                      </div>
                      <ChevronRight size={16} className="text-neutral-600" />
                    </Link>
                    <Link
                      href="/how-it-works"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 hover:bg-neutral-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Layers size={18} className="text-[#e0e02a]" />
                        <span className="text-[15px] font-bold text-[#e0e02a]">How It Works</span>
                      </div>
                      <ChevronRight size={16} className="text-neutral-600" />
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 hover:bg-neutral-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquare size={18} className="text-neutral-100" />
                        <span className="text-[15px] font-bold text-neutral-100">Contact Us</span>
                      </div>
                      <ChevronRight size={16} className="text-neutral-600" />
                    </Link>
                  </div>
                </div>

                {/* GROUP 3: MORE */}
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-2.5 px-1">
                    More
                  </h4>
                  <div className="bg-[#070707] border border-neutral-900 rounded-2xl overflow-hidden divide-y divide-neutral-900/50">
                    <Link
                      href="/terms"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 hover:bg-neutral-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-neutral-100" />
                        <span className="text-[15px] font-bold text-neutral-100">Terms & Conditions</span>
                      </div>
                      <ChevronRight size={16} className="text-neutral-600" />
                    </Link>
                    {session ? (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-3.5 hover:bg-neutral-900/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <User size={18} className="text-[#e0e02a]" />
                            <span className="text-[15px] font-bold text-[#e0e02a]">Dashboard</span>
                          </div>
                          <ChevronRight size={16} className="text-neutral-600" />
                        </Link>
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-neutral-900/50 transition-colors text-left focus:outline-none"
                        >
                          <div className="flex items-center gap-3">
                            <LogOut size={18} className="text-red-500" />
                            <span className="text-[15px] font-bold text-red-500">Log Out</span>
                          </div>
                          <ChevronRight size={16} className="text-neutral-600" />
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3.5 hover:bg-neutral-900/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <LogIn size={18} className="text-neutral-100" />
                          <span className="text-[15px] font-bold text-neutral-100">Log In</span>
                        </div>
                        <ChevronRight size={16} className="text-neutral-600" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
