'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Calendar, 
  MapPin, 
  IndianRupee, 
  User, 
  Phone, 
  Share2, 
  ArrowRight,
  Clock,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import BookingModal from '@/components/booking/BookingModal';

interface Event {
  id: string;
  name: string;
  event_name: string;
  contact_details: string;
  event_date: string;
  price: number;
  image_url: string;
  status: string;
  created_at: string;
}

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Error fetching event:', error);
        router.push('/');
        return;
      }

      setEvent(data);
      setLoading(false);
    };

    fetchEvent();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <Image
          src={event.image_url || '/heroimg.png'}
          alt={event.event_name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute top-10 left-6 right-6 flex justify-between items-center z-20">
          <Link 
            href="/" 
            className="h-12 w-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/20"
          >
            <ChevronLeft size={24} />
          </Link>
          <button className="h-12 w-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/20">
            <Share2 size={20} />
          </button>
        </div>

        <div className="absolute bottom-12 left-6 right-6 z-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6 inline-block">
              Confirmed Event
            </span>
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              {event.event_name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-primary" />
                <span className="font-bold">{new Date(event.event_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                <span className="font-bold">Online / Global Access</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-6">About the Event</h2>
            <p className="text-xl text-muted leading-relaxed font-medium">
              Join us for an unforgettable experience at {event.event_name}. This event is specially curated to provide premium value and networking opportunities for the community. Submitted by {event.name}, it represents our commitment to high-quality local and global gatherings.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-secondary/30 rounded-[2.5rem] border border-accent/50 group hover:border-primary/20 transition-all">
              <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-primary">
                <User size={24} />
              </div>
              <h4 className="font-bold text-lg mb-2">Organizer</h4>
              <p className="text-muted font-medium">{event.name}</p>
            </div>
            <div className="p-8 bg-secondary/30 rounded-[2.5rem] border border-accent/50 group hover:border-primary/20 transition-all">
              <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-primary">
                <Phone size={24} />
              </div>
              <h4 className="font-bold text-lg mb-2">Contact Info</h4>
              <p className="text-muted font-medium">{event.contact_details}</p>
            </div>
          </div>

          <section className="p-10 bg-primary/5 rounded-[3rem] border border-primary/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-2xl font-bold">Verified Submission</h3>
            </div>
            <p className="text-muted font-medium leading-relaxed">
              This event has been thoroughly reviewed and approved by the Uventer admin team. We ensure that all event details are accurate and that the organizers are responsive to the community's needs.
            </p>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-32 p-10 bg-white rounded-[3rem] border border-accent shadow-2xl shadow-primary/5">
            <div className="mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2">Entry Fee</span>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-bold text-foreground">₹{event.price}</span>
                <span className="text-muted mb-2 font-bold">/ person</span>
              </div>
            </div>

            <button 
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full h-16 bg-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 mb-6"
            >
              Book Tickets Now
              <ArrowRight size={20} />
            </button>

            <p className="text-center text-xs text-muted font-bold uppercase tracking-widest px-4">
              Limited spots available for this event
            </p>

            <div className="mt-10 pt-10 border-t border-accent space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center text-primary">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest">Added On</p>
                  <p className="text-sm font-bold">{new Date(event.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center text-primary">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest">Venue</p>
                  <p className="text-sm font-bold">Virtual Event Link</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        event={{
          id: event.id,
          event_name: event.event_name,
          price: event.price
        }}
      />
    </div>
  );
}
