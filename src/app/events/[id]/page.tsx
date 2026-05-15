'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
  ShieldCheck,
  CheckCircle2,
  Info
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
  one_day_price?: number;
  full_event_price?: number;
  location: string;
  image_url: string;
  status: string;
  created_at: string;
  payment_link?: string;
  map_url?: string;
  additional_content?: string;
  faq?: { question: string; answer: string }[];
  additional_images?: string[];
}

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const formatContent = (content: string) => {
    if (!content) return null;

    const sections = content.split('\n\n');
    return sections.map((section, idx) => {
      const lines = section.split('\n');
      const isList = lines.length > 1 && lines.every(line => 
        line.trim().startsWith('•') || 
        line.trim().startsWith('-') || 
        line.trim().startsWith('*') ||
        /^[0-9]+\./.test(line.trim()) ||
        (lines.length > 2 && line.trim().length > 0 && line.trim().length < 50)
      );

      // Check if first line looks like a heading
      const firstLine = lines[0].trim();
      const isHeading = firstLine.length < 40 && !firstLine.endsWith('.') && lines.length > 1;

      if (isHeading) {
        return (
          <div key={idx} className="mb-8 last:mb-0">
            <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-3">
              <span className="h-2 w-2 bg-primary rounded-full"></span>
              {firstLine}
            </h3>
            <div className="space-y-3 pl-5">
              {lines.slice(1).map((line, lIdx) => {
                const cleanLine = line.trim().replace(/^[-•*]\s*/, '');
                if (!cleanLine) return null;
                return (
                  <div key={lIdx} className="flex gap-3 text-foreground/80 font-medium">
                    <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                    <p>{cleanLine}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      if (isList) {
        return (
          <div key={idx} className="mb-8 last:mb-0 space-y-3">
            {lines.map((line, lIdx) => {
              const cleanLine = line.trim().replace(/^[-•*]\s*/, '');
              if (!cleanLine) return null;
              return (
                <div key={lIdx} className="flex gap-3 text-foreground/80 font-medium">
                  <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                  <p>{cleanLine}</p>
                </div>
              );
            })}
          </div>
        );
      }

      return (
        <p key={idx} className="text-lg text-foreground/80 font-medium leading-relaxed mb-6 last:mb-0">
          {section}
        </p>
      );
    });
  };
  const searchParams = useSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('book') === 'true') {
      setIsBookingModalOpen(true);
    }
  }, [searchParams]);

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
            <span className="px-4 py-1.5 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-6 inline-block">
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
            <div className="space-y-6">
              <p className="text-xl text-muted leading-relaxed font-medium">
                Join us for an unforgettable experience at {event.event_name}. This event is specially curated to provide premium value and networking opportunities for the community. Submitted by {event.name}, it represents our commitment to high-quality local and global gatherings.
              </p>
              {event.additional_content && (
                <div className="pt-8 border-t border-accent/20">
                  {formatContent(event.additional_content)}
                </div>
              )}
            </div>
          </section>

          {/* Additional Images Gallery */}
          {event.additional_images && event.additional_images.length > 0 && (
            <section>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-6">Event Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.additional_images.map((img, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="relative h-64 rounded-[2rem] overflow-hidden border border-accent shadow-sm"
                  >
                    <Image 
                      src={img} 
                      alt={`Gallery ${i}`} 
                      fill 
                      className="object-cover" 
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* FAQ Section */}
          {event.faq && event.faq.length > 0 && (
            <section>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {event.faq.map((item, i) => (
                  <div key={i} className="p-8 bg-secondary/30 rounded-[2rem] border border-accent/50">
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-3">
                      <span className="h-6 w-6 bg-primary text-black rounded-full flex items-center justify-center text-[10px] shrink-0 font-black">Q</span>
                      {item.question}
                    </h4>
                    <p className="text-muted font-medium leading-relaxed pl-9">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

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
            <p className="text-muted font-medium leading-relaxed mb-6">
              This event has been thoroughly reviewed and approved by the Uventer admin team. We ensure that all event details are accurate and that the organizers are responsive to the community&apos;s needs.
            </p>
            {event.additional_content && (
              <div className="pt-8 border-t border-primary/10">
                <div className="flex items-center gap-2 mb-6">
                  <Info size={16} className="text-primary" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Important Event Highlights</h4>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {event.additional_content.split('\n').filter(l => l.trim().length > 10).slice(0, 4).map((line, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-white/50 rounded-2xl border border-primary/5 hover:border-primary/20 transition-all group">
                      <div className="h-6 w-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-black transition-all">
                        <CheckCircle2 size={14} />
                      </div>
                      <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                        {line.trim().replace(/^[-•*]\s*/, '')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {event.map_url && (
            <div className="rounded-[3rem] overflow-hidden border border-accent h-[400px] shadow-sm">
              <iframe 
                src={event.map_url}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-32 p-10 bg-white rounded-[3rem] border border-accent shadow-2xl shadow-primary/5">
            <div className="mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2">Entry Fee</span>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-bold text-black">₹{event.price}</span>
                <span className="text-muted mb-2 font-bold">/ person</span>
              </div>
            </div>

            <button 
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full h-16 bg-primary text-black rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 mb-6"
            >
              {event.payment_link ? 'Book Tickets Now' : 'Book Tickets Now'}
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
                  <p className="text-sm font-bold">{event.location}</p>
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
          price: event.price,
          one_day_price: event.one_day_price,
          full_event_price: event.full_event_price,
          payment_link: event.payment_link
        }}
      />
    </div>
  );
}
