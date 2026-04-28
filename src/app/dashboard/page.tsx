'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus, 
  ChevronLeft,
  LayoutDashboard,
  ExternalLink,
  Calendar,
  IndianRupee,
  Ticket
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import TicketUI from '@/components/booking/TicketUI';
import { Suspense } from 'react';

interface Event {
  id: string;
  event_name: string;
  event_date: string;
  price: number;
  image_url: string;
  status: string;
  created_at: string;
}

function DashboardContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [userName, setUserName] = useState('there');
  const [successBooking, setSuccessBooking] = useState<any>(null);
  const [successEvent, setSuccessEvent] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login?redirect_to=/dashboard');
      } else {
        // Extract name from user metadata
        const meta = session.user.user_metadata;
        const name = meta?.full_name || meta?.name || session.user.email?.split('@')[0] || 'there';
        setUserName(name);
        setAuthChecked(true);
        fetchMyEvents(session.user.id);
      }
    };
    checkAuth();

    // Check for success booking in URL
    const bookingId = searchParams.get('booking_id');
    const isSuccess = searchParams.get('booking_success');
    if (isSuccess === 'true' && bookingId) {
      fetchBookingDetails(bookingId);
    }
  }, [router, searchParams]);

  const fetchBookingDetails = async (id: string) => {
    const { data: booking, error: bError } = await supabase
      .from('bookings')
      .select('*, events(*)')
      .eq('id', id)
      .single();
    
    if (!bError && booking) {
      setSuccessBooking(booking);
      setSuccessEvent(booking.events);
    }
  };

  const fetchMyEvents = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={14} />;
      case 'rejected':
        return <XCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  if (!authChecked) return null;

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-primary transition-colors mb-4"
            >
              <ChevronLeft size={16} />
              Back to Home
            </Link>
            {/* Personalized Greeting */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Hi, <span className="text-primary italic font-serif">{userName}</span> 👋
            </h1>
            <p className="text-muted mt-2 text-lg">Explore Events Around You</p>
          </div>
          
          <Link href="/add-event">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-black h-14 px-8 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <Plus size={20} />
              Submit New Event
            </motion.button>
          </Link>
        </div>

        {/* Success Ticket View */}
        {successBooking && successEvent && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-20 bg-primary/5 rounded-[3rem] p-12 border-2 border-primary/10 relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="h-20 w-20 bg-primary rounded-full flex items-center justify-center text-black mb-6 shadow-xl shadow-primary/30">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-black mb-2 text-center">Payment Successful!</h2>
              <p className="text-muted font-bold text-center mb-10">Your ticket for <span className="text-primary italic font-serif">{successEvent.event_name}</span> is confirmed.</p>
              
              <TicketUI booking={successBooking} event={successEvent} />
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-[2.5rem] border border-accent p-16 text-center shadow-sm"
          >
            <div className="h-24 w-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8 text-muted/50">
              <Plus size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-3">No Submissions Yet</h3>
            <p className="text-muted mb-8 max-w-sm mx-auto">
              You haven't submitted any events yet. Start sharing your experiences with the community!
            </p>
            <Link href="/add-event">
              <button className="text-primary font-bold hover:underline">
                Create your first event →
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[2rem] border border-accent overflow-hidden shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image 
                      src={event.image_url || '/heroimg.png'} 
                      alt={event.event_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <div className={`px-3 py-1.5 rounded-full border backdrop-blur-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${getStatusStyle(event.status)}`}>
                        {getStatusIcon(event.status)}
                        {event.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 line-clamp-1">{event.event_name}</h2>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-muted">
                        <Calendar size={14} className="text-primary" />
                        <span className="text-xs font-bold">{new Date(event.event_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted">
                        <IndianRupee size={14} className="text-primary" />
                        <span className="text-xs font-bold text-black">₹{event.price}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-accent flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                        Ref: {event.id.slice(0, 8)}
                      </span>
                      {event.status === 'approved' && (
                        <Link 
                          href={`/events/${event.id}`}
                          className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                        >
                          View Live <ExternalLink size={12} />
                        </Link>
                      )}
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

export default function UserDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
