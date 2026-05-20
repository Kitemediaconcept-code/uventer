'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CalendarPlus, MapPin, ArrowUpRight, Clock, Search, Filter } from 'lucide-react';

interface EventData {
  id: string;
  event_name: string;
  event_date: string;
  event_time?: string;
  location?: string;
  description?: string;
  category?: string;
  image_url: string;
  price: number;
  payment_link?: string;
  status: string;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const year = date.getFullYear();
  return { day, month, year };
};

const isToday = (dateStr: string) => {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
};

const EventsPage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
  const [pastEvents, setPastEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // Fetch upcoming events
      const { data: upcoming } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .gte('event_date', today)
        .order('event_date', { ascending: true });

      // Fetch past events
      const { data: past } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .lt('event_date', today)
        .order('event_date', { ascending: false });

      if (upcoming) setUpcomingEvents(upcoming);
      if (past) setPastEvents(past);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const displayEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;
  const filteredEvents = displayEvents.filter(event =>
    event.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddToCalendar = (event: EventData) => {
    const startDate = new Date(event.event_date);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 3);

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.event_name)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&location=${encodeURIComponent(event.location || '')}&details=${encodeURIComponent(event.description || '')}`;
    window.open(googleCalUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f0f1f5] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-[40px] md:text-[56px] font-black text-black leading-[1.05] tracking-tight mb-3">
            Events
          </h1>
          <p className="text-gray-500 text-[15px] font-medium max-w-md">
            Discover upcoming experiences and explore our past events.
          </p>
        </motion.div>

        {/* Tabs & Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-1 p-1 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === 'upcoming'
                  ? 'bg-[#1a1a1a] text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Upcoming ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === 'past'
                  ? 'bg-[#1a1a1a] text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Past ({pastEvents.length})
            </button>
          </div>

          <div className="relative w-full sm:w-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#e0e02a]/30 focus:border-[#e0e02a] transition-all"
            />
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#e0e02a]" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white rounded-[32px] border border-gray-100"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarPlus size={24} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {searchQuery ? 'No matching events' : `No ${activeTab} events`}
            </h3>
            <p className="text-gray-400 text-sm">
              {searchQuery ? 'Try a different search term.' : activeTab === 'upcoming' ? 'Check back soon for new events.' : 'No past events to show.'}
            </p>
          </motion.div>
        )}

        {/* Events Timeline */}
        {!loading && filteredEvents.length > 0 && (
          <div className="space-y-4">
            {filteredEvents.map((event, index) => {
              const { day, month } = formatDate(event.event_date);
              const today = isToday(event.event_date);
              const isPast = activeTab === 'past';

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className={`group bg-white rounded-[24px] border border-neutral-100 hover:border-neutral-200/80 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${isPast ? 'opacity-75 hover:opacity-100' : ''}`}
                >
                  <div className="flex items-stretch">
                    {/* Date Column */}
                    <div className="flex-shrink-0 w-[100px] md:w-[120px] flex flex-col items-center justify-center border-r border-neutral-100/60 p-4 md:p-6">
                      {today ? (
                        <span className="text-[10px] font-black tracking-widest uppercase text-[#e0e02a] bg-[#e0e02a]/10 px-3 py-1 rounded-full mb-2">
                          TODAY
                        </span>
                      ) : (
                        <span className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-1">
                          {month}
                        </span>
                      )}
                      <span className="text-[32px] md:text-[40px] font-black text-black leading-none">
                        {day}
                      </span>
                    </div>
 
                    {/* Event Image */}
                    <div className="hidden sm:block flex-shrink-0 w-[100px] md:w-[130px] h-[100px] md:h-[120px] my-auto ml-2 overflow-hidden rounded-2xl relative">
                      <Image
                        src={event.image_url}
                        alt={event.event_name}
                        width={130}
                        height={120}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                    </div>
 
                    {/* Event Details */}
                    <div className="flex-1 p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          {event.category && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-neutral-100 text-neutral-600 group-hover:bg-[#e0e02a]/10 group-hover:text-black transition-colors duration-300">
                              {event.category}
                            </span>
                          )}
                        </div>
                        <h3 className="text-[17px] md:text-[19px] font-bold text-gray-900 leading-snug mb-1.5 group-hover:text-black transition-colors duration-300">
                          {event.event_name}
                        </h3>
                        <p className="text-[13px] text-gray-400 font-medium leading-relaxed line-clamp-2">
                          {event.description || `Join us for ${event.event_name}, a premium event experience curated by Uventer.`}
                        </p>
                        {event.location && (
                          <div className="flex items-center gap-1.5 mt-2 text-gray-400 group-hover:text-gray-600 transition-colors duration-300">
                            <MapPin size={12} className="shrink-0 text-gray-400 group-hover:text-[#e0e02a] transition-colors duration-300" />
                            <span className="text-[11px] font-medium">{event.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {!isPast && (
                          <button
                            onClick={() => handleAddToCalendar(event)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-[12px] font-bold text-gray-500 hover:border-[#1a1a1a] hover:text-black hover:bg-[#1a1a1a] hover:text-white transition-all duration-300"
                          >
                            <CalendarPlus size={14} />
                            <span className="hidden sm:inline">Add to calendar</span>
                          </button>
                        )}
                        <Link
                          href={`/events/${event.id}`}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1a1a1a] text-white text-[12px] font-bold hover:bg-black transition-all duration-300 shadow-sm"
                        >
                          {isPast ? 'View' : event.payment_link ? 'Book Now' : 'Details'}
                          <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Stats Footer */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-8 text-center"
          >
            <div>
              <p className="text-[28px] font-black text-black">{upcomingEvents.length}</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Upcoming</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-[28px] font-black text-black">{pastEvents.length}</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Completed</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
