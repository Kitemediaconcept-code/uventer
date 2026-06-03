'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    event_name: string;
    price: number;
    one_day_price?: number;
    full_event_price?: number;
    payment_link?: string;
  };
}

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function BookingModal({ isOpen, onClose, event }: BookingModalProps) {
  const [showBetaNote, setShowBetaNote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    occupation: ''
  });
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'standard' | 'one_day' | 'full_event'>(
    event.one_day_price ? 'one_day' : (event.full_event_price ? 'full_event' : 'standard')
  );

  const getActivePrice = () => {
    if (selectedTier === 'one_day' && event.one_day_price) return event.one_day_price;
    if (selectedTier === 'full_event' && event.full_event_price) return event.full_event_price;
    return event.price;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const ticketId = Math.random().toString(36).substring(2, 8).toUpperCase();
      setBookingId(ticketId);

      const { error } = await supabase.from('bookings').insert({
        event_id: event.id,
        user_name: formData.name,
        user_email: formData.email,
        user_phone: formData.phone,
        occupation: formData.occupation,
        amount_paid: getActivePrice(),
        payment_status: event.payment_link ? 'lead' : 'pending',
        stripe_session_id: ticketId,
        ticket_type: selectedTier // Optional: if you have this column
      });

      if (error) throw error;
      setShowSuccess(true);
    } catch (err) {
      console.error('Booking error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBetaClose = () => {
    router.push('/');
    onClose();
  };

  if (showSuccess) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-md rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl p-8 sm:p-10 text-center max-h-[90vh] overflow-y-auto"
          >
            <div className="h-20 w-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <ShieldCheck size={36} />
            </div>
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Booking Recorded!</h2>
            <p className="text-muted text-lg mb-8">
              Your Ticket ID is: <span className="text-primary font-black text-2xl">{bookingId}</span>
            </p>

            <div className="space-y-4">
              {!event.payment_link ? (
                <button
                  onClick={() => {
                    const message = `Hello! I just booked a ticket for ${event.event_name}.\n\n🎟️ Ticket ID: ${bookingId}\n👤 Name: ${formData.name}\n📞 Phone: ${formData.phone}\n\nPlease confirm my booking.`;
                    window.open(`https://wa.me/919562630135?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className="w-full h-14 bg-[#25D366] text-white rounded-2xl font-bold hover:bg-[#25D366]/90 transition-all flex items-center justify-center gap-3 shadow-md shadow-green-500/10"
                >
                  <Phone size={18} />
                  Connect on WhatsApp
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsRedirecting(true);
                    setTimeout(() => {
                      window.location.href = event.payment_link!;
                    }, 1500);
                  }}
                  className="w-full h-14 bg-primary text-black rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-md shadow-primary/10"
                >
                  Proceed to Payment
                  <ArrowRight size={18} />
                </button>
              )}
              
              <button
                onClick={onClose}
                className="w-full h-14 bg-secondary text-muted rounded-2xl font-bold hover:bg-secondary/80 transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (isRedirecting) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center p-6 bg-black/90 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-primary">
                <ShieldCheck size={24} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-3">Securing your spot...</h2>
            <p className="text-neutral-400 font-medium max-w-sm text-lg">Redirecting you securely to our official ticketing partner.</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative p-6 sm:p-8 md:p-12 overflow-y-auto">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 md:top-8 md:right-8 text-muted hover:text-foreground transition-colors z-10 bg-white/80 rounded-full p-1 backdrop-blur-sm"
              >
                <X size={24} />
              </button>

              <div className="mb-10">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Book Your Ticket</h2>
                <p className="text-muted">Fill in your details to proceed to payment for <span className="text-primary font-bold">{event.event_name}</span></p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
                    <User size={12} className="text-primary" /> YOUR NAME
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full h-14 px-6 rounded-2xl border border-accent bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
                      <Phone size={12} className="text-primary" /> PHONE NUMBER
                    </label>
                    <input
                      required
                      type="tel"
                      className="w-full h-14 px-6 rounded-2xl border border-accent bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      placeholder="+91 00000 00000"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
                      <Mail size={12} className="text-primary" /> EMAIL ADDRESS
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full h-14 px-6 rounded-2xl border border-accent bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
                    <Briefcase size={12} className="text-primary" /> WHAT DO YOU DO?*
                  </label>
                  <select
                    required
                    className="w-full h-14 px-6 rounded-2xl border border-accent bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none cursor-pointer"
                    value={formData.occupation}
                    onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                  >
                    <option value="" disabled>Select your occupation</option>
                    <option value="Entrepreneur">Entrepreneur</option>
                    <option value="Employee">Employee</option>
                    <option value="Student">Student</option>
                    <option value="Professional">Professional</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                {(event.one_day_price || event.full_event_price) && (
                  <div className="space-y-3 pt-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted flex items-center gap-2">
                      <ShieldCheck size={12} className="text-primary" /> SELECT TICKET TYPE
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {event.one_day_price && (
                        <div 
                          onClick={() => setSelectedTier('one_day')}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedTier === 'one_day' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-accent bg-transparent hover:border-primary/20'}`}
                        >
                          <p className="text-[10px] font-black uppercase tracking-wider text-muted mb-1">One Day Pass</p>
                          <p className="text-xl font-bold text-black">₹{event.one_day_price}</p>
                        </div>
                      )}
                      {event.full_event_price && (
                        <div 
                          onClick={() => setSelectedTier('full_event')}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedTier === 'full_event' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-accent bg-transparent hover:border-primary/20'}`}
                        >
                          <p className="text-[10px] font-black uppercase tracking-wider text-muted mb-1">Full Event Pass</p>
                          <p className="text-xl font-bold text-black">₹{event.full_event_price}</p>
                        </div>
                      )}
                      {(!event.one_day_price && !event.full_event_price) && (
                        <div 
                          onClick={() => setSelectedTier('standard')}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedTier === 'standard' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-accent bg-transparent hover:border-primary/20'}`}
                        >
                          <p className="text-[10px] font-black uppercase tracking-wider text-muted mb-1">Standard Entry</p>
                          <p className="text-xl font-bold text-black">₹{event.price}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-6">
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full h-16 bg-primary text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
                    ) : (
                      <>
                        Pay ₹{getActivePrice()} & Book Ticket
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
