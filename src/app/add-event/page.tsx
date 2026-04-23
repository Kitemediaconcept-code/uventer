'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Upload, Send, Calendar, User, Tag, Phone, DollarSign, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// ── Success Modal ─────────────────────────────────────────────────────────────
function SuccessModal({ eventName, onClose }: { eventName: string; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: '#fff',
            borderRadius: '28px',
            padding: '48px 40px',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 40px 80px rgba(0,0,0,0.2)',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: '#f5f5f5', border: 'none', borderRadius: '50%',
              width: '32px', height: '32px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#666',
            }}
          >
            <X size={16} />
          </button>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
            style={{
              width: '80px', height: '80px',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 12px 30px rgba(34,197,94,0.35)',
            }}
          >
            <CheckCircle size={40} color="#fff" strokeWidth={2.5} />
          </motion.div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
            Event Submitted! 🎉
          </h2>
          <p style={{ color: '#555', fontSize: '15px', margin: '0 0 8px', lineHeight: 1.6 }}>
            <strong style={{ color: '#111' }}>{eventName}</strong> has been submitted successfully.
          </p>
          <p style={{ color: '#888', fontSize: '14px', margin: '0 0 28px', lineHeight: 1.6 }}>
            Our team has been notified and will review your event within 24 hours.
          </p>

          {/* Info pill */}
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: '12px', padding: '12px 16px',
            marginBottom: '28px', fontSize: '13px', color: '#166534',
          }}>
            📧 Confirmation sent to <strong>digital@kitemediaconcept.com</strong>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '15px',
              background: '#111', color: '#fff',
              border: 'none', borderRadius: '14px',
              fontSize: '15px', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Back to Home →
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AddEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedEventName, setSubmittedEventName] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    event_name: '',
    contact_details: '',
    event_date: '',
    price: '',
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login?redirect_to=/add-event');
      } else {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';

      // Upload image (non-blocking)
      if (image) {
        try {
          const fileExt = image.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
          const filePath = `event_images/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('events')
            .upload(filePath, image);

          if (!uploadError) {
            const { data: urlData } = supabase.storage.from('events').getPublicUrl(filePath);
            imageUrl = urlData.publicUrl;
          }
        } catch (_) {}
      }

      const { data: { session } } = await supabase.auth.getSession();

      const eventData: Record<string, any> = {
        name: formData.name,
        event_name: formData.event_name,
        contact_details: formData.contact_details,
        event_date: formData.event_date,
        price: parseFloat(formData.price),
        image_url: imageUrl,
        status: 'pending',
      };

      if (session?.user?.id) {
        eventData.user_id = session.user.id;
      }

      const { error: dbError } = await supabase.from('events').insert(eventData);
      if (dbError) throw dbError;

      // Send email notification (non-blocking, fire-and-forget)
      fetch('/api/notify-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          event_name: formData.event_name,
          contact_details: formData.contact_details,
          event_date: formData.event_date,
          price: formData.price,
          image_url: imageUrl,
        }),
      }).catch(() => {}); // silently ignore email errors

      // Show beautiful success modal
      setSubmittedEventName(formData.event_name);
      setShowSuccess(true);

    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push('/');
  };

  return (
    <>
      {showSuccess && (
        <SuccessModal eventName={submittedEventName} onClose={handleSuccessClose} />
      )}

      <div className="min-h-screen bg-secondary/30 pb-20">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-primary transition-colors mb-12"
          >
            <ChevronLeft size={16} />
            Back to Events
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-accent shadow-sm overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                  Submit Your <span className="text-primary italic font-serif">Event</span>
                </h1>
                <p className="text-muted">
                  Share your experience with the community. Our team will review and publish it within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted">Thumbnail Image</label>
                  <div
                    className={`relative h-64 w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center
                      ${preview ? 'border-primary' : 'border-accent hover:border-primary/50'}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload className="text-primary" size={24} />
                        </div>
                        <p className="text-sm font-medium text-muted">Click to upload event thumbnail</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                      <User size={14} className="text-primary" /> Your Name
                    </label>
                    <input
                      required type="text"
                      className="w-full h-14 px-6 rounded-xl border border-accent bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                      <Tag size={14} className="text-primary" /> Event Name
                    </label>
                    <input
                      required type="text"
                      className="w-full h-14 px-6 rounded-xl border border-accent bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="e.g. Summer Music Fest"
                      value={formData.event_name}
                      onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                      <Phone size={14} className="text-primary" /> Contact Details
                    </label>
                    <input
                      required type="text"
                      className="w-full h-14 px-6 rounded-xl border border-accent bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Email or Phone Number"
                      value={formData.contact_details}
                      onChange={(e) => setFormData({ ...formData, contact_details: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                      <Calendar size={14} className="text-primary" /> Date
                    </label>
                    <input
                      required type="date"
                      className="w-full h-14 px-6 rounded-xl border border-accent bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                      <DollarSign size={14} className="text-primary" /> Entry Price
                    </label>
                    <input
                      required type="number"
                      className="w-full h-14 px-6 rounded-xl border border-accent bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full h-16 bg-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send size={20} />
                        Submit Event for Review
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
