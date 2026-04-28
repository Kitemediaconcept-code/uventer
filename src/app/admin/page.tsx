'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Clock, ExternalLink, ShieldCheck, ChevronLeft, Search, RotateCcw, TrendingUp, CheckCircle, Download, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Event {
  id: string;
  name: string;
  event_name: string;
  contact_details: string;
  event_date: string;
  start_date: string;
  end_date: string;
  time_slot: string;
  budget: number;
  price: number;
  location: string;
  vision_requirements: string;
  image_url: string;
  status: string;
}

interface Booking {
  id: string;
  event_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  occupation: string;
  amount_paid: number;
  payment_status: string;
  created_at: string;
  events?: {
    event_name: string;
  };
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'bookings'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ pending: 0, approved: 0, bookings: 0 });
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
        if (activeTab === 'bookings') {
          fetchBookings();
        } else {
          fetchEvents(activeTab);
        }
        fetchStats();
      }
    };
    checkAuth();
  }, [router, activeTab]);

  const fetchStats = async () => {
    const { data: pendingData } = await supabase.from('events').select('id', { count: 'exact' }).eq('status', 'pending');
    const { data: approvedData } = await supabase.from('events').select('id', { count: 'exact' }).eq('status', 'approved');
    const { data: bookingsData } = await supabase.from('bookings').select('id', { count: 'exact' }).eq('payment_status', 'completed');
    
    setStats({
      pending: pendingData?.length || 0,
      approved: approvedData?.length || 0,
      bookings: bookingsData?.length || 0
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

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*, events(event_name)')
      .eq('payment_status', 'completed')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setBookings(data);
    }
    setLoading(false);
  };

  const exportBookingsCSV = () => {
    if (bookings.length === 0) return;
    
    const headers = ['Booking ID', 'Event Name', 'Attendee Name', 'Email', 'Phone', 'Occupation', 'Amount', 'Date'];
    const rows = bookings.map(b => [
      b.id,
      b.events?.event_name || 'N/A',
      b.user_name,
      b.user_email,
      b.user_phone,
      b.occupation,
      `₹${b.amount_paid}`,
      new Date(b.created_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uventer-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
                <div className="flex items-center gap-2 border-r border-accent pr-4">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="font-bold text-sm">{stats.approved} Live</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-primary" />
                  <span className="font-bold text-sm">{stats.bookings} Bookings</span>
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
                    ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`flex-1 md:w-40 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'approved' 
                    ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex-1 md:w-40 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'bookings' 
                    ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Bookings
              </button>
            </div>

            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={20} />
              <input
                type="text"
                placeholder={activeTab === 'bookings' ? "Search by attendee or event..." : "Search by event or submitter name..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-14 pr-6 rounded-2xl border border-accent bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            {activeTab === 'bookings' && (
              <button
                onClick={exportBookingsCSV}
                className="h-14 px-8 bg-white border border-accent rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-secondary transition-all shadow-sm"
              >
                <Download size={18} />
                Export CSV
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (activeTab !== 'bookings' && filteredEvents.length === 0) || (activeTab === 'bookings' && bookings.length === 0) ? (
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
                ? `We couldn't find any results matching "${searchQuery}"`
                : activeTab === 'pending' 
                  ? 'No pending events to review right now.'
                  : activeTab === 'approved'
                    ? 'No approved events yet.'
                    : 'No bookings found yet.'}
            </p>
          </motion.div>
        ) : activeTab === 'bookings' ? (
          <div className="bg-white rounded-[2rem] border border-accent overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-secondary/50 border-b border-accent">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Attendee</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Event</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Occupation</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Amount</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-accent">
                  {bookings
                    .filter(b => 
                      b.user_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      b.events?.event_name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((booking) => (
                    <tr key={booking.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-bold text-foreground">{booking.user_name}</p>
                        <p className="text-xs text-muted">{booking.user_email}</p>
                        <p className="text-[10px] text-muted font-mono">{booking.user_phone}</p>
                      </td>
                      <td className="px-8 py-6 font-bold text-sm">{booking.events?.event_name}</td>
                      <td className="px-8 py-6 text-sm">
                        <span className="px-3 py-1 bg-secondary rounded-full text-[10px] font-bold uppercase tracking-wider text-muted">
                          {booking.occupation}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-black text-primary">₹{booking.amount_paid}</td>
                      <td className="px-8 py-6 text-xs font-bold text-muted">{new Date(booking.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1.5 bg-primary/10 rounded-full">
                            📅 {event.start_date || (event as any).event_date} - {event.end_date}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted px-3 py-1.5 bg-secondary rounded-full">
                            ⏰ {event.time_slot}
                          </span>
                        </div>
                        <span className="text-2xl font-black text-foreground">₹{event.budget || event.price}</span>
                      </div>
                      
                      <h2 className="text-2xl font-extrabold mb-3 tracking-tight">{event.event_name}</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm mb-6">
                        <p className="text-muted"><span className="font-bold text-foreground">📍 Location:</span> {event.location || 'Not specified'}</p>
                        <p className="text-muted"><span className="font-bold text-foreground">👤 Submitter:</span> {event.name}</p>
                        <p className="text-muted"><span className="font-bold text-foreground">📞 Contact:</span> {event.contact_details}</p>
                      </div>

                      {event.vision_requirements && (
                        <div className="bg-secondary/20 p-5 rounded-2xl border border-accent mb-6">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2">Vision & Requirements</span>
                          <p className="text-sm text-foreground/80 leading-relaxed italic">"{event.vision_requirements}"</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-8">
                      {event.status === 'pending' ? (
                        <button
                          onClick={() => approveEvent(event.id)}
                          className="flex-1 h-14 bg-primary text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
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
