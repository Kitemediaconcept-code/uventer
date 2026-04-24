'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, Briefcase, ArrowRight } from 'lucide-react';

import { useRouter } from 'next/navigation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    event_name: string;
    price: number;
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    occupation: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const resScript = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!resScript) {
      alert('Razorpay SDK failed to load. Check your internet connection.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          eventId: event.id,
          eventName: event.event_name,
          price: event.price
        })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to create order');

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Uventer",
        description: `Ticket for ${event.event_name}`,
        image: "/uventerlogo.png",
        order_id: data.orderId,
        handler: function (response: any) {
          // Success! Redirect to dashboard with success params
          router.push(`/dashboard?booking_success=true&booking_id=${data.bookingId}&payment_id=${response.razorpay_payment_id}`);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                    className="w-full h-16 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
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
