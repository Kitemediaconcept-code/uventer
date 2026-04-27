import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-[60vh]">
      <h1 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight">Terms of Service</h1>
      <div className="prose prose-lg max-w-none text-muted leading-relaxed">
        <p className="text-xl font-medium text-foreground mb-6">
          By using our event app, you agree to our services for event booking, event submissions, and collaboration opportunities.
        </p>
        <p className="mb-6">
          Users can explore featured events, book tickets, and connect with us for event partnerships and promotions. All bookings and collaborations are subject to availability and confirmation.
        </p>
      </div>
    </div>
  );
}
