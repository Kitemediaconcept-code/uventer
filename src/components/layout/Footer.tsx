'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#e8e8e8]">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/uventerlogo.png"
                alt="Uventer"
                width={130}
                height={46}
                className="object-contain"
              />
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              The premium platform for discovering, booking, and hosting extraordinary events across India.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4 mt-8">
              {[
                { href: '#', icon: <Instagram size={18} />, label: 'Instagram' },
                { href: '#', icon: <Twitter size={18} />, label: 'Twitter' },
                { href: '#', icon: <Linkedin size={18} />, label: 'LinkedIn' },
                { href: 'mailto:hello@uventer.com', icon: <Mail size={18} />, label: 'Email' },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-[#e8e8e8] flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[4px] text-gray-400 mb-6">Platform</h4>
            <ul className="space-y-4">
              {[
                { label: 'Home', href: '/' },
                { label: 'Browse Events', href: '/#events' },
                { label: 'Add Event', href: '/add-event' },
                { label: 'Dashboard', href: '/dashboard' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-gray-600 font-medium hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[4px] text-gray-400 mb-6">Company</h4>
            <ul className="space-y-4">
              {[
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Contact Us', href: 'mailto:hello@uventer.com' },
                { label: 'Support', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-gray-600 font-medium hover:text-primary transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#e8e8e8]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-gray-400 font-medium">
            © {currentYear} Uventer. All rights reserved.
          </span>
          <span className="text-xs text-gray-400">
            Built with ♥ by{' '}
            <a href="https://kitemediaconcept.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Kite Media Concept
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
