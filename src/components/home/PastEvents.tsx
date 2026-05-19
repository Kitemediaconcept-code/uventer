'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import EventCard from './EventCard';

const PastEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchPastEvents = async () => {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .lt('event_date', today)
        .order('event_date', { ascending: false });

      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchPastEvents();
  }, []);

  if (!isClient || loading || events.length === 0) {
    return null; // Don't show the section if loading or no past events or not client
  }

  return (
    <section id="past-events" className="max-w-7xl mx-auto px-6 py-[100px] border-t border-accent/30">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-[28px] md:text-[42px] font-bold tracking-tight mb-4">
            Past <span className="text-muted">Experiences</span>
          </h2>
          <p className="text-muted max-w-md">
            Memories from our previous successful events and gatherings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-80 transition-opacity hover:opacity-100">
        {events.map((event) => (
          <div key={event.id} className="relative grayscale-[0.5] hover:grayscale-0 transition-all duration-500">
            <EventCard
              id={event.id}
              title={event.event_name}
              category={event.category || "Past Experience"}
              date={new Date(event.event_date).toLocaleDateString()}
              location={event.location || 'Concluded'}
              imageUrl={event.image_url}
              price={event.price || 0}
              paymentLink={undefined} // No booking for past events
            />
            <div className="absolute top-4 right-4 bg-muted/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              Completed
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PastEvents;
