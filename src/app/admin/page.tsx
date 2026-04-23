'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Clock, ExternalLink, ShieldCheck, ChevronLeft, Search, RotateCcw, TrendingUp, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Event {
  id: string;
  name: string;
  event_name: string;
  contact_details: string;
  event_date: string;
  price: number;
  image_url: string;
  status: string;
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ pending: 0, approved: 0 });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const adminEmail = 'digital@kitemediaconcept.com';
      
      if (!session) {
        // If not logged in, send to login with redirect back here
        router.push('/login?redirect_to=/admin');
      } else if (session.user.email !== adminEmail) {
        // If logged in but not an admin, redirect to home page
        router.push('/');
      } else {
        // Authorized admin
        setAuthChecked(true);
        fetchEvents(activeTab);
        fetchStats();
      }
    };
    checkAuth();
  }, [router, activeTab]);

  const fetchStats = async () => {
    const { data: pendingData } = await supabase.from('events').select('id', { count: 'exact' }).eq('status', 'pending');
    const { data: approvedData } = await supabase.from('events').select('id', { count: 'exact' }).eq('status', 'approved');
    
    setStats({
      pending: pendingData?.length || 0,
      approved: approvedData?.length || 0
    });
  };

  const fetchEvents = async (status: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const approveEvent = async (id: string) => {
    const { error } = await supabase
      .from('events')
      .update({ status: 'approved' })
      .eq('id', id);

    if (!error) {
      setEvents(events.filter(e => e.id !== id));
      fetchStats();
      alert('Event approved and live!');
    }
  };

  const unapproveEvent = async (id: string) => {
    const { error } = await supabase
      .from('events')
      .update({ status: 'pending' })
      .eq('id', id);

    if (!error) {
      setEvents(events.filter(e => e.id !== id));
      fetchStats();
      alert('Event moved back to pending.');
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (!error) {
      setEvents(events.filter(e => e.id !== id));
      fetchStats();
    }
  };

  const filteredEvents = events.filter(event => 
    event.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!authChecked) return null;

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-primary transition-colors mb-4"
              >
                <ChevronLeft size={16} />
                Back to Site
              </Link>
              <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
                Admin <span className="text-primary italic font-serif">Panel</span>
                <ShieldCheck className="text-primary" size={28} />
              </h1>
              <p className="text-muted mt-2">Manage and oversee all event submissions</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-white px-6 py-3 rounded-2xl border border-accent flex items-center gap-4 shadow-sm">
                <div className="flex items-center gap-2 border-r border-accent pr-4">
                  <Clock size={16} className="text-yellow-500" />
                  <span className="font-bold text-sm">{stats.pending} Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="font-bold text-sm">{stats.approved} Live</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex bg-white p-1.5 rounded-2xl border border-accent shadow-sm w-full md:w-auto">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 md:w-40 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'pending' 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`flex-1 md:w-40 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'approved' 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Approved
              </button>
            </div>

            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={20} />
              <input
                type="text"
                placeholder="Search by event or submitter name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-14 pr-6 rounded-2xl border border-accent bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-[2rem] border border-accent p-12 text-center"
          >
            <div className="h-20 w-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-muted">
              {searchQuery ? <Search size={32} /> : <Clock size={32} />}
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {searchQuery ? 'No Results Found' : 'All Caught Up!'}
            </h3>
            <p className="text-muted">
              {searchQuery 
                ? `We couldn't find any events matching "${searchQuery}"`
                : activeTab === 'pending' 
                  ? 'No pending events to review right now.'
                  : 'No approved events yet.'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2rem] border border-accent overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row"
                >
                  <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
                    <img 
                      src={event.image_url || '/heroimg.png'} 
                      alt={event.event_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full">
                          {event.event_date}
                        </span>
                        <span className="text-xl font-bold text-foreground">${event.price}</span>
                      </div>
                      <h2 className="text-2xl font-bold mb-2">{event.event_name}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <p className="text-muted"><span className="font-bold text-foreground">Submitted by:</span> {event.name}</p>
                        <p className="text-muted"><span className="font-bold text-foreground">Contact:</span> {event.contact_details}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-8">
                      {event.status === 'pending' ? (
                        <button
                          onClick={() => approveEvent(event.id)}
                          className="flex-1 h-14 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        >
                          <Check size={18} />
                          Approve Event
                        </button>
                      ) : (
                        <button
                          onClick={() => unapproveEvent(event.id)}
                          className="flex-1 h-14 bg-secondary text-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent transition-all border border-accent"
                        >
                          <RotateCcw size={18} />
                          Move to Pending
                        </button>
                      )}
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="h-14 px-6 bg-red-50 text-red-500 rounded-xl font-bold flex items-center justify-center hover:bg-red-100 transition-all border border-red-100"
                        title="Delete Permanently"
                      >
                        <Trash2 size={18} />
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
