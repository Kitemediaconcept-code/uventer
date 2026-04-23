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
  DollarSign
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Event {
  id: string;
  event_name: string;
  event_date: string;
  price: number;
  image_url: string;
  status: string;
  created_at: string;
}

export default function UserDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login?redirect_to=/dashboard');
      } else {
        setAuthChecked(true);
        fetchMyEvents(session.user.id);
      }
    };
    checkAuth();
  }, [router]);

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
            <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
              My <span className="text-primary italic font-serif">Dashboard</span>
              <LayoutDashboard className="text-primary" size={28} />
            </h1>
            <p className="text-muted mt-2">Track and manage your event submissions</p>
          </div>
          
          <Link href="/add-event">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white h-14 px-8 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <Plus size={20} />
              Submit New Event
            </motion.button>
          </Link>
        </div>

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
                        <DollarSign size={14} className="text-primary" />
                        <span className="text-xs font-bold">${event.price}</span>
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
