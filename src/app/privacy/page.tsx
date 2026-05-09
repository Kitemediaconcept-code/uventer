import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-foreground">Privacy Policy</h1>
      <p className="text-muted mb-12 font-medium">Last updated: May 9, 2026</p>

      <div className="space-y-12">
        <section>
          <p className="text-lg leading-relaxed text-foreground/80 font-medium italic">
            Welcome to Uventer — an event booking and event management platform where users can discover events, book tickets, and plan events from start to finish.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-foreground/80">
            At Uventer, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use the Uventer mobile application.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-6 text-foreground tracking-tight">1. Information We Collect</h2>
          <p className="mb-4 text-foreground/80">When you use Uventer, we may collect the following information:</p>
          
          <div className="space-y-6 pl-4 border-l-2 border-primary/20">
            <div>
              <h3 className="text-lg font-bold text-foreground">Personal Information</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-foreground/70">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Profile information</li>
                <li>Event booking details</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-foreground">Device Information</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-foreground/70">
                <li>Device type</li>
                <li>Operating system</li>
                <li>App version</li>
                <li>IP address</li>
                <li>Mobile network information</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground">Payment Information</h3>
              <p className="mt-2 text-foreground/70">
                For ticket bookings or event services, payments may be processed through secure third-party payment gateways. Uventer does not store your complete card or banking details.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-6 text-foreground tracking-tight">2. How We Use Your Information</h2>
          <p className="mb-4 text-foreground/80">We use collected information to:</p>
          <ul className="list-disc list-inside space-y-2 text-foreground/70">
            <li>Provide event booking services</li>
            <li>Manage and execute events</li>
            <li>Process ticket reservations</li>
            <li>Improve app performance and user experience</li>
            <li>Send booking confirmations and updates</li>
            <li>Provide customer support</li>
            <li>Prevent fraud and misuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-6 text-foreground tracking-tight">3. Ticketing & Event Services</h2>
          <p className="mb-4 text-foreground/80">Uventer provides:</p>
          <ul className="list-disc list-inside space-y-2 text-foreground/70">
            <li>Event discovery</li>
            <li>Ticket booking</li>
            <li>Event planning support</li>
            <li>A-to-Z event execution services</li>
          </ul>
          <p className="mt-4 text-foreground/70 font-medium">
            User information may be used only for event-related communication and service delivery.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-6 text-foreground tracking-tight">4. Data Sharing</h2>
          <p className="text-foreground/80 mb-4 font-bold">We do not sell personal information to third parties.</p>
          <p className="mb-4 text-foreground/80">We may share limited information with:</p>
          <ul className="list-disc list-inside space-y-2 text-foreground/70">
            <li>Event organizers</li>
            <li>Payment service providers</li>
            <li>Technical service partners</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-6 text-foreground tracking-tight">5. Children's Privacy</h2>
          <p className="text-foreground/80">
            Uventer is not intended for children under the age of 13. We do not knowingly collect personal information from children. If we discover that a child has provided personal data, we will remove it immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-6 text-foreground tracking-tight">6. Data Security</h2>
          <p className="text-foreground/80">
            We use reasonable security measures to protect user data from unauthorized access, misuse, or disclosure. However, no online platform can guarantee complete security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-6 text-foreground tracking-tight">7. User Rights</h2>
          <p className="mb-4 text-foreground/80">Users may:</p>
          <ul className="list-disc list-inside space-y-2 text-foreground/70">
            <li>Request access to their data</li>
            <li>Request correction of information</li>
            <li>Request deletion of their account and data</li>
          </ul>
          <p className="mt-4 text-foreground/80">For requests, contact us using the details below.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-6 text-foreground tracking-tight">8. Third-Party Services</h2>
          <p className="text-foreground/80 mb-4">The app may use third-party services such as:</p>
          <ul className="list-disc list-inside space-y-2 text-foreground/70">
            <li>Payment gateways</li>
            <li>Analytics tools</li>
            <li>Notification services</li>
          </ul>
          <p className="mt-4 text-foreground/80">
            These services may collect information according to their own privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-6 text-foreground tracking-tight">9. Changes to This Policy</h2>
          <p className="text-foreground/80">
            We may update this Privacy Policy from time to time. Updated versions will be posted within the app or store listing.
          </p>
        </section>

        <section className="pt-10 border-t border-primary/10">
          <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight">10. Contact Us</h2>
          <div className="bg-primary/5 p-8 rounded-3xl">
            <p className="text-foreground/80 mb-2">If you have questions about this Privacy Policy, contact:</p>
            <p className="text-xl font-black text-foreground">Uventer Support</p>
            <p className="text-primary font-bold text-lg mt-2">Email: support@uventer.com</p>
          </div>
        </section>
      </div>
    </div>
  );
}
