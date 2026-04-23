'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Upload, Send, Calendar, User, Tag, Phone, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AddEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
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

      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `event_images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('events')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('events').getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }

      const { data: { session } } = await supabase.auth.getSession();

      const { error: dbError } = await supabase.from('events').insert({
        name: formData.name,
        event_name: formData.event_name,
        contact_details: formData.contact_details,
        event_date: formData.event_date,
        price: parseFloat(formData.price),
        image_url: imageUrl,
        status: 'pending',
        user_id: session?.user?.id,
      });

      if (dbError) throw dbError;

      // --- NOTIFICATION LOGIC ---
      const ADMIN_WHATSAPP = "919946266898"; // Admin WhatsApp
      const ADMIN_EMAIL = "digital@kitemediaconcept.com, ajmaloffical04@gmail.com"; // Admin Emails

      const message = `
🌟 *New Event Submission* 🌟
----------------------------
👤 *Submitter:* ${formData.name}
📅 *Event:* ${formData.event_name}
📞 *Contact:* ${formData.contact_details}
📆 *Date:* ${formData.event_date}
💰 *Price:* $${formData.price}
🖼️ *Image:* ${imageUrl || 'No image uploaded'}
----------------------------
Please review and approve in the Supabase Dashboard.
      `;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMessage}`;

      // We'll alert first, then redirect to WhatsApp
      alert('Event submitted successfully! Redirecting to WhatsApp for final confirmation...');
      window.open(whatsappUrl, '_blank');

      router.push('/');
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
                    required
                    type="text"
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
                    required
                    type="text"
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
                    required
                    type="text"
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
                    required
                    type="date"
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
                    required
                    type="number"
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
  );
}
