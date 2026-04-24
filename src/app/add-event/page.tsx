'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Upload, Send, Calendar, User, Tag, Phone, DollarSign, CheckCircle, X, Clock } from 'lucide-react';
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
          <p style={{ color: '#555', fontSize: '15px', margin: '0 0 20px', lineHeight: 1.6 }}>
            <strong style={{ color: '#111' }}>{eventName}</strong> has been submitted successfully.
          </p>

          {/* Steps */}
          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ minWidth: '28px', height: '28px', borderRadius: '50%', background: '#008080', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px' }}>1</div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#111' }}>Confirmation Email Sent</p>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#666', lineHeight: 1.5 }}>
                  A confirmation email has been sent to{' '}
                  <strong style={{ color: '#008080' }}>digital@kitemediaconcept.com</strong>.
                  Open it to view the full event details.
                </p>
              </div>
            </div>
            {/* Step 2 */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ minWidth: '28px', height: '28px', borderRadius: '50%', background: '#008080', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px' }}>2</div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#111' }}>Admin Review</p>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#666', lineHeight: 1.5 }}>
                  Click <strong>"Review"</strong> in the email to access the Admin Dashboard and confirm the event.
                </p>
              </div>
            </div>
            {/* Note */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px 14px', fontSize: '12px', color: '#166534', lineHeight: 1.6 }}>
              🔒 The Admin Dashboard is accessible only to <strong>digital@kitemediaconcept.com</strong>
            </div>
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
    start_date: '',
    end_date: '',
    time_slot: '',
    budget: '',
    location: '',
    vision_requirements: '',
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
        event_name: formData.event_name || 'Untitled Event',
        contact_details: formData.contact_details,
        event_date: formData.start_date, // Keeping legacy field for compatibility
        start_date: formData.start_date,
        end_date: formData.end_date,
        time_slot: formData.time_slot,
        budget: parseFloat(formData.budget) || 0,
        price: parseFloat(formData.budget) || 0, // Keeping legacy field
        location: formData.location,
        vision_requirements: formData.vision_requirements,
        image_url: imageUrl,
        status: 'pending',
      };

      if (session?.user?.id) {
        eventData.user_id = session.user.id;
      }

      const { error: dbError } = await supabase.from('events').insert(eventData);
      if (dbError) throw dbError;

      // Send email notification
      fetch('/api/notify-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image_url: imageUrl,
        }),
      }).catch(() => {});

      setSubmittedEventName(formData.event_name || 'Your Event');
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
        <div className="max-w-4xl mx-auto px-6 py-12">
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
            className="bg-white rounded-[2.5rem] border border-accent shadow-sm overflow-hidden"
          >
            <div className="p-8 md:p-14">
              <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                  Submit Your <span className="text-primary italic font-serif">Event</span>
                </h1>
                <p className="text-muted text-lg">
                  Share your experience with the community. Our team will review and publish it within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Image Upload */}
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-muted">Thumbnail Image</label>
                  <div
                    className={`relative h-72 w-full rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center
                      ${preview ? 'border-primary' : 'border-accent hover:border-primary/50 bg-secondary/10'}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-8">
                        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <Upload className="text-primary" size={28} />
                        </div>
                        <p className="text-sm font-bold text-foreground mb-1">Click to upload event thumbnail</p>
                        <p className="text-xs text-muted">Recommended: 1200 x 800px (JPG/PNG)</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  {/* Basic Info */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted flex items-center gap-2">
                      <User size={14} className="text-primary" /> YOUR NAME
                    </label>
                    <input
                      required type="text"
                      className="w-full h-16 px-6 rounded-2xl border border-accent bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted flex items-center gap-2">
                      <Tag size={14} className="text-primary" /> EVENT NAME
                    </label>
                    <input
                      type="text"
                      className="w-full h-16 px-6 rounded-2xl border border-accent bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      placeholder="e.g. Annual Tech Symposium"
                      value={formData.event_name}
                      onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted flex items-center gap-2">
                      <Phone size={14} className="text-primary" /> CONTACT DETAILS
                    </label>
                    <input
                      required type="text"
                      className="w-full h-16 px-6 rounded-2xl border border-accent bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      placeholder="Email or Phone Number"
                      value={formData.contact_details}
                      onChange={(e) => setFormData({ ...formData, contact_details: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted flex items-center gap-2">
                      <Send size={14} className="text-primary" /> CITY / LOCATION
                    </label>
                    <input
                      required type="text"
                      className="w-full h-16 px-6 rounded-2xl border border-accent bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      placeholder="Enter city or specific venue"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  {/* Dates */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted flex items-center gap-2">
                      <Calendar size={14} className="text-primary" /> START DATE
                    </label>
                    <input
                      required type="date"
                      className="w-full h-16 px-6 rounded-2xl border border-accent bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted flex items-center gap-2">
                      <Calendar size={14} className="text-primary" /> END DATE
                    </label>
                    <input
                      required type="date"
                      className="w-full h-16 px-6 rounded-2xl border border-accent bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>

                  {/* Slot & Budget */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted flex items-center gap-2">
                      <Clock size={14} className="text-primary" /> PREFERRED TIME SLOT
                    </label>
                    <select
                      required
                      className="w-full h-16 px-6 rounded-2xl border border-accent bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
                      value={formData.time_slot}
                      onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                    >
                      <option value="">Select a slot</option>
                      <option value="Morning (9 AM – 12 PM)">Morning (9 AM – 12 PM)</option>
                      <option value="Afternoon (12 PM – 4 PM)">Afternoon (12 PM – 4 PM)</option>
                      <option value="Evening (4 PM – 8 PM)">Evening (4 PM – 8 PM)</option>
                      <option value="Full Day">Full Day</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted flex items-center gap-2">
                      <DollarSign size={14} className="text-primary" /> ENTRY PRICE (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-foreground">₹</span>
                      <input
                        required type="number"
                        className="w-full h-16 pl-12 pr-6 rounded-2xl border border-accent bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        placeholder="0.00"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted flex items-center gap-2">
                    VISION & REQUIREMENTS
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full p-6 rounded-3xl border border-accent bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                    placeholder="Describe your event goals, audience, and specific needs..."
                    value={formData.vision_requirements}
                    onChange={(e) => setFormData({ ...formData, vision_requirements: e.target.value })}
                  />
                </div>

                <div className="pt-6">
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full h-20 bg-primary text-white rounded-[1.25rem] font-bold text-xl flex items-center justify-center gap-4 hover:bg-primary/90 transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send size={24} />
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
