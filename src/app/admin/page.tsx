'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Calendar, User, Phone, MapPin, DollarSign, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchPendingEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessing(id);
    const { error } = await supabase
      .from('events')
      .update({ status: 'approved' })
      .eq('id', id);

    if (!error) {
      setEvents(events.filter(e => e.id !== id));
      alert('Event approved and pushed to live site!');
    } else {
      alert('Error approving event: ' + error.message);
    }
    setProcessing(null);
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject and delete this submission?')) return;
    
    setProcessing(id);
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (!error) {
      setEvents(events.filter(e => e.id !== id));
      alert('Event submission rejected and deleted.');
    } else {
      alert('Error rejecting event: ' + error.message);
    }
    setProcessing(null);
  };

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      {/* Admin Navbar */}
      <div className="bg-white border-b border-accent px-6 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted font-medium uppercase tracking-widest">Uventer Organizer Portal</p>
            </div>
          </div>
          <Link href="/" className="text-sm font-bold text-muted hover:text-primary transition-colors flex items-center gap-2">
            View Live Site <ExternalLink size={16} />
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Pending <span className="text-primary italic font-serif">Approvals</span>
          </h2>
          <p className="text-muted">You have {events.length} submission(s) waiting for review.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-[2rem] border-2 border-dashed border-accent py-32 text-center"
          >
            <Check size={48} className="mx-auto text-primary/30 mb-4" />
            <h3 className="text-xl font-bold text-muted">All Caught Up!</h3>
            <p className="text-muted/60">No pending submissions at the moment.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl border border-accent shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col md:flex-row"
                >
                  {/* Event Thumbnail Preview */}
                  <div className="relative w-full md:w-64 h-48 md:h-auto bg-secondary">
                    <Image
                      src={event.image_url}
                      alt={event.event_name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-grow p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-foreground">{event.event_name}</h3>
                        <span className="px-3 py-1 bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest rounded-full">
                          Pending Review
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 text-sm">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">Submitted By</label>
                          <div className="flex items-center gap-2 font-semibold">
                            <User size={16} className="text-primary" /> {event.name}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">Contact</label>
                          <div className="flex items-center gap-2 font-semibold">
                            <Phone size={16} className="text-primary" /> {event.contact_details}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">Event Date</label>
                          <div className="flex items-center gap-2 font-semibold">
                            <Calendar size={16} className="text-primary" /> {new Date(event.event_date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted block">Price</label>
                          <div className="flex items-center gap-2 font-semibold">
                            <DollarSign size={16} className="text-primary" /> ${event.price}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-6 border-t border-accent">
                      <button
                        disabled={processing === event.id}
                        onClick={() => handleApprove(event.id)}
                        className="flex-grow md:flex-grow-0 bg-primary text-white h-12 px-8 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
                      >
                        {processing === event.id ? <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" /> : <Check size={20} />}
                        Approve Submission
                      </button>
                      <button
                        disabled={processing === event.id}
                        onClick={() => handleReject(event.id)}
                        className="bg-white text-muted border border-accent h-12 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all disabled:opacity-50"
                      >
                        <X size={20} />
                        Reject
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
