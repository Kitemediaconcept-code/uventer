import React from 'react';

export default function DeleteAccountPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight text-foreground">Account Deletion Request</h1>
      
      <div className="space-y-8 text-lg text-foreground/80 leading-relaxed">
        <section>
          <p>
            At <strong>Uventer</strong>, we respect your right to control your data. If you wish to delete your account and all associated personal information from our systems, please follow the steps below.
          </p>
        </section>

        <section className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
          <h2 className="text-2xl font-bold mb-4 text-foreground">How to Request Deletion</h2>
          <p className="mb-4">Please send an email from the address associated with your Uventer account to:</p>
          <p className="text-2xl font-black text-primary">support@uventer.com</p>
          <p className="mt-4 text-sm font-medium">Subject: Account Deletion Request - [Your Name]</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground tracking-tight">What data will be deleted?</h2>
          <p className="mb-4">Upon processing your request, the following information will be permanently removed from our active databases:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Your personal profile (Name, Email, Phone)</li>
            <li>Your booking history and ticket records</li>
            <li>Your preferences and saved events</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-foreground tracking-tight">Important Notes</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Timeframe:</strong> Requests are typically processed within 7-10 business days.</li>
            <li><strong>Financial Records:</strong> Some transaction data may be retained for a limited period as required by law or for tax and accounting purposes.</li>
            <li><strong>Permanent Action:</strong> Once an account is deleted, it cannot be recovered.</li>
          </ul>
        </section>

        <p className="pt-10 text-sm text-muted">
          For more information on how we handle your data, please see our <a href="/privacy" className="text-primary underline font-bold">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
