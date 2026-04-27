import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-[60vh]">
      <h1 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none text-muted leading-relaxed">
        <p className="text-xl font-medium text-foreground mb-6">
          We value your privacy and are committed to protecting your personal information.
        </p>
        <p>
          Our event app collects only the necessary details required for event bookings, collaborations, and communication. Your data is kept secure and is never shared without your consent.
        </p>
      </div>
    </div>
  );
}
