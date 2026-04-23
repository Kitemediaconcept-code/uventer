'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import EventCard from './EventCard';
import { motion } from 'framer-motion';

const EventGrid = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .order('event_date', { ascending: true });

      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="w-full py-32 text-center border-2 border-dashed border-accent rounded-3xl">
        <h3 className="text-2xl font-bold text-muted mb-2">No Approved Events Yet</h3>
        <p className="text-muted/60">Be the first to submit an event using the button above.</p>
      </div>
    );
  }

  return (
    <section id="events" className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Upcoming <span className="text-primary italic font-serif">Experiences</span>
          </h2>
          <p className="text-muted max-w-md">
            Hand-picked events verified by our team to ensure the best experience for you.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 rounded-full border border-accent font-bold text-sm bg-white hover:bg-secondary transition-colors">
            All Categories
          </button>
          <button className="px-6 py-2 rounded-full border border-accent font-bold text-sm bg-white hover:bg-secondary transition-colors">
            Trending
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event, index) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.event_name}
            category="Technology" // Placeholder for category if not in DB
            date={new Date(event.event_date).toLocaleDateString()}
            location={event.location || 'Online / TBA'}
            imageUrl={event.image_url}
            price={event.price || 0}
          />
        ))}
      </div>
    </section>
  );
};

export default EventGrid;
