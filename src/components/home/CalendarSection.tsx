'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { clsx } from 'clsx';

const CalendarSection = () => {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    if (currentDate) {
      fetchEvents();
    }
  }, [currentDate]);

  const fetchEvents = async () => {
    if (!currentDate) return;
    setLoading(true);
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'approved')
      .gte('event_date', firstDay)
      .lte('event_date', lastDay);

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  if (loading || events.length === 0 || !currentDate) {
    return null; // Don't show the section if loading, no events, or date not set
  }

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (currentDate) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }
  };
  
  const nextMonth = () => {
    if (currentDate) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const renderDays = () => {
    const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const startDay = startDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    const days = [];

    // Padding for start of month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-accent/10 bg-secondary/10"></div>);
    }

    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(currentDate!.getFullYear(), currentDate!.getMonth(), d);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const dayEvents = events.filter(e => new Date(e.event_date).toDateString() === date.toDateString());
      const hasEvents = dayEvents.length > 0;

      days.push(
        <motion.div
          key={d}
          whileHover={{ scale: 1.02 }}
          onClick={() => setSelectedDate(date)}
          className={clsx(
            "h-24 p-2 border border-accent/20 cursor-pointer transition-all relative overflow-hidden group",
            isSelected ? "bg-primary/5 border-primary/50" : "bg-white hover:bg-secondary/50",
            isToday && !isSelected && "border-primary/30"
          )}
        >
          <span className={clsx(
            "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-1",
            isToday ? "bg-primary text-black" : "text-foreground/60"
          )}>
            {d}
          </span>
          
          {hasEvents && (
            <div className="space-y-1">
              {dayEvents.slice(0, 2).map((event, idx) => (
                <div key={idx} className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary-dark font-semibold truncate rounded">
                  {event.event_name}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-[10px] text-muted text-center font-bold">
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
          )}
          
          {isSelected && (
            <motion.div 
              layoutId="active-date"
              className="absolute inset-0 border-2 border-primary pointer-events-none"
            />
          )}
        </motion.div>
      );
    }

    return days;
  };

  const selectedDayEvents = events.filter(
    e => selectedDate && new Date(e.event_date).toDateString() === selectedDate.toDateString()
  );

  return (
    <section id="calendar" className="max-w-7xl mx-auto px-5 md:px-6 py-[64px] md:py-[100px]">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Calendar Grid */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-6">
            <div className="text-left">
              <h2 className="text-[28px] md:text-[42px] font-bold tracking-tight">
                Event <span className="text-primary italic font-serif">Calendar</span>
              </h2>
              <p className="text-muted text-sm mt-1">Plan your schedule with Uventer</p>
            </div>
            <div className="flex items-center gap-4 bg-secondary p-1 rounded-full border border-accent">
              <button onClick={prevMonth} className="p-2 hover:bg-white rounded-full transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-bold text-sm min-w-[120px] text-center">
                {currentDate && monthNames[currentDate.getMonth()]} {currentDate && currentDate.getFullYear()}
              </span>
              <button onClick={nextMonth} className="p-2 hover:bg-white rounded-full transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-accent/20 border border-accent/20 rounded-2xl overflow-hidden shadow-xl">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-secondary/50 py-3 text-center text-xs font-black uppercase tracking-widest text-muted">
                {day}
              </div>
            ))}
            {renderDays()}
          </div>
        </div>

        {/* Right: Selected Date Details */}
        <div className="w-full lg:w-96 flex flex-col">
          <div className="bg-white border border-accent/30 rounded-3xl p-8 shadow-2xl flex-1 sticky top-24">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-accent/20">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <CalendarIcon className="w-6 h-6 text-primary-dark" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {selectedDate ? selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' }) : 'Select a date'}
                  </h3>
                  <p className="text-muted text-xs font-medium">Events for this day</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {selectedDayEvents.length > 0 ? (
                  <motion.div
                    key="events-list"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {selectedDayEvents.map((event, idx) => (
                      <div key={idx} className="group cursor-pointer">
                        <div className="p-4 bg-secondary/30 rounded-2xl border border-transparent group-hover:border-primary/30 transition-all">
                          <h4 className="font-bold text-base mb-2 group-hover:text-primary-dark transition-colors">{event.event_name}</h4>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-xs text-muted font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{event.event_time || 'TBA'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted font-medium">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{event.location || 'Online / TBA'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-events"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                      <CalendarIcon className="w-8 h-8 text-muted/30" />
                    </div>
                    <p className="text-muted text-sm font-medium">No events scheduled<br/>for this date.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {selectedDayEvents.length > 0 && (
              <button className="w-full mt-8 bg-black text-white py-4 rounded-full font-bold hover:bg-primary hover:text-black transition-all shadow-lg shadow-black/5">
                Explore More
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendarSection;
