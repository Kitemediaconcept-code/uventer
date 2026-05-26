'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Plus, Search, ArrowRight } from 'lucide-react';
import MobileTicketCard from '@/components/booking/MobileTicketCard';
import Link from 'next/link';

interface Booking {
  id: string;
  user_name: string;
  events: {
    event_name: string;
    event_date: string;
    time_slot: string;
    price: number;
    image_url: string;
  };
}

export default function MyTicketsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [ticketIdInput, setTicketIdInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setNeedsAuth(true);
        setLoading(false);
        return;
      }

      const email = session.user.email;

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id, 
          user_name,
          events (
            event_name,
            event_date,
            time_slot,
            price,
            image_url
          )
        `)
        .eq('user_email', email)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBookings(data as any);
      }
      setLoading(false);
    };

    fetchTickets();
  }, [router]);

  const handleTicketLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketIdInput.trim()) {
      router.push(`/tickets/${ticketIdInput.trim()}`);
    }
  };

  // Split bookings into two columns for masonry layout
  const col1 = bookings.filter((_, i) => i % 2 === 0);
  const col2 = bookings.filter((_, i) => i % 2 !== 0);

  if (needsAuth) {
    return (
      <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 flex flex-col items-center justify-center p-5">
        <style dangerouslySetInnerHTML={{ __html: `
          body { background-color: black !important; }
        `}} />
        <div className="w-full max-w-md bg-[#111] p-8 rounded-3xl border border-white/10 text-center">
          <div className="w-16 h-16 bg-[#e0e02a]/10 text-[#e0e02a] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Search size={32} />
          </div>
          <h1 className="text-3xl font-black mb-2 tracking-tight">Find Your Ticket</h1>
          <p className="text-white/50 text-sm font-medium mb-8">
            Enter your unique Ticket ID from your confirmation email to view your pass. No login required.
          </p>
          
          <form onSubmit={handleTicketLookup} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="e.g. 123e4567-e89b..."
              value={ticketIdInput}
              onChange={(e) => setTicketIdInput(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 outline-none focus:border-[#e0e02a] transition-colors font-mono text-sm"
              required
            />
            <button 
              type="submit"
              className="w-full bg-[#e0e02a] text-black font-bold text-sm px-5 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#d4d420] transition-colors"
            >
              View Ticket <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-white/50 text-sm mb-4">Have an account?</p>
            <Link href="/login?redirect_to=/tickets">
              <button className="w-full border border-white/20 text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-white/5 transition-colors">
                Log In to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 font-sans selection:bg-white/20">
      {/* Dynamic override of global bg */}
      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: black !important; }
      `}} />

      <div className="px-5 pt-12 max-w-md mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[52px] font-black leading-[0.9] tracking-tighter">
              {loading ? '-' : bookings.length}
              <br />
              Tickets
            </h1>
          </div>
          <Link href="/events">
            <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Plus size={24} />
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-sm shrink-0">
            All Collection
          </button>
          <button className="px-5 py-2.5 rounded-full border border-white/20 text-white font-bold text-sm shrink-0 hover:bg-white/10 transition-colors">
            Viewed
          </button>
          <button className="px-5 py-2.5 rounded-full border border-white/20 text-white font-bold text-sm shrink-0 hover:bg-white/10 transition-colors">
            Reserve
          </button>
        </div>

        {/* Tickets Masonry Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-white/50">
            <p className="mb-4">You have no tickets yet.</p>
            <Link href="/events" className="text-white underline">Browse Events</Link>
          </div>
        ) : (
          <div className="flex gap-4 items-start">
            {/* Column 1 */}
            <div className="flex flex-col gap-4 flex-1">
              {col1.map((booking, i) => (
                <Link key={booking.id} href={`/tickets/${booking.id}`}>
                  <MobileTicketCard
                    bookingId={booking.id}
                    eventName={booking.events.event_name}
                    eventDate={booking.events.event_date}
                    timeSlot={booking.events.time_slot}
                    price={booking.events.price}
                    userName={booking.user_name}
                    imageUrl={booking.events.image_url}
                    index={i * 2}
                  />
                </Link>
              ))}
            </div>
            
            {/* Column 2 */}
            <div className="flex flex-col gap-4 flex-1 mt-8">
              {col2.map((booking, i) => (
                <Link key={booking.id} href={`/tickets/${booking.id}`}>
                  <MobileTicketCard
                    bookingId={booking.id}
                    eventName={booking.events.event_name}
                    eventDate={booking.events.event_date}
                    timeSlot={booking.events.time_slot}
                    price={booking.events.price}
                    userName={booking.user_name}
                    imageUrl={booking.events.image_url}
                    index={i * 2 + 1}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
