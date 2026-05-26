'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MobileTicketCard from '@/components/booking/MobileTicketCard';
import { ArrowLeft, Share2 } from 'lucide-react';

export default function TicketViewerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/get-ticket?id=${id}`);
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.error || 'Failed to fetch ticket');
        } else {
          setTicket(data);
        }
      } catch (err) {
        setError('A network error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Uventer Ticket',
          text: 'Check out my event ticket!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ticket link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20 font-sans selection:bg-white/20">
      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: black !important; }
      `}} />

      <div className="px-5 pt-12 max-w-md mx-auto">
        {/* Header Options */}
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={() => router.push('/tickets')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <button 
            onClick={handleShare}
            className="px-4 py-2 rounded-full border border-white/20 text-white font-bold text-sm flex items-center gap-2 hover:bg-white/10 transition-colors"
          >
            <Share2 size={16} /> Share
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e0e02a] mb-4"></div>
            <p className="text-white/50 text-sm font-bold animate-pulse">Loading secure ticket...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-black">!</span>
            </div>
            <h2 className="text-2xl font-black mb-2">Ticket Not Found</h2>
            <p className="text-white/60 mb-8 max-w-[250px] mx-auto text-sm">{error}</p>
            <Link href="/tickets">
              <button className="bg-white text-black px-6 py-3 rounded-full font-bold">
                Go to Dashboard
              </button>
            </Link>
          </div>
        ) : ticket ? (
          <div className="flex flex-col items-center">
            <MobileTicketCard
              bookingId={ticket.id}
              eventName={ticket.events.event_name}
              eventDate={ticket.events.event_date}
              timeSlot={ticket.events.time_slot}
              price={ticket.events.price}
              userName={ticket.user_name}
              imageUrl={ticket.events.image_url}
              index={0}
            />
            <p className="mt-8 text-center text-[11px] font-bold text-white/30 uppercase tracking-widest max-w-[200px]">
              Present this ticket at the entrance
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
