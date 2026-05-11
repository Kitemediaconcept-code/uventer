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
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    occupation: ''
  });
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

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
        amount_paid: event.price,
        payment_status: event.payment_link ? 'lead' : 'pending',
        stripe_session_id: ticketId
      });

      if (error) throw error;
      setShowSuccess(true);
    } catch (err) {
        setShowBetaNote(true);
      }
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
            className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl p-10 text-center"
          >
            <div className="h-20 w-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <ShieldCheck size={36} />
            </div>
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Booking Recorded!</h2>
            <p className="text-muted text-lg mb-8">
              Your Ticket ID is: <span className="text-primary font-black text-2xl">{bookingId}</span>
            </p>

            <div className="space-y-4">
              <button
                onClick={() => {
                  const message = `Hello! I just booked a ticket for ${event.event_name}.\n\n🎟️ Ticket ID: ${bookingId}\n👤 Name: ${formData.name}\n📞 Phone: ${formData.phone}\n\nPlease confirm my booking.`;
                  window.open(`https://wa.me/919562630135?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="w-full h-14 bg-[#25D366] text-white rounded-2xl font-bold hover:bg-[#25D366]/90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
              >
                <Phone size={18} />
                Send Ticket to WhatsApp
              </button>

              {event.payment_link && (
                <button
                  onClick={() => window.location.href = event.payment_link!}
                  className="w-full h-14 bg-primary text-black rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative p-8 md:p-12">
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 text-muted hover:text-foreground transition-colors"
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
                        Pay ₹{event.price} & Book Ticket
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
