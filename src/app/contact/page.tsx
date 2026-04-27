import React from 'react';
import { Phone, User, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-[60vh]">
      <h1 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
        <div className="space-y-8">
          <p className="text-xl text-muted leading-relaxed">
            For event bookings, submissions, and collaborations, feel free to contact us.
          </p>
          
          <div className="bg-secondary/30 p-8 rounded-[2rem] border border-accent/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-muted">Primary Contact</h3>
                <p className="text-2xl font-bold">Unais</p>
              </div>
            </div>
            
            <a 
              href="tel:9562630135" 
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-accent hover:border-primary transition-all group"
            >
              <div className="h-10 w-10 bg-secondary rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted uppercase tracking-widest">Phone Number</p>
                <p className="font-bold text-lg">9562630135</p>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-primary/5 p-10 rounded-[3rem] border border-primary/10 flex flex-col justify-center text-center">
          <div className="h-16 w-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
            <MessageSquare size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-4">Start a Collaboration</h3>
          <p className="text-muted font-medium mb-8">
            Looking to host an event or partner with Uventer? We're always open to new opportunities.
          </p>
          <a 
            href="https://wa.me/919562630135" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-4 bg-foreground text-white rounded-2xl font-bold hover:bg-foreground/90 transition-all"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
