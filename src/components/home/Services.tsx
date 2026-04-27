'use client';

import React from 'react';
import { 
  Briefcase, 
  Mic, 
  Rocket, 
  Users, 
  Zap, 
  GraduationCap, 
  Layout, 
  Settings, 
  MapPin 
} from 'lucide-react';

const services = [
  { icon: <Briefcase size={18} />, title: 'Corporate Events' },
  { icon: <Mic size={18} />, title: 'Business Conferences' },
  { icon: <Rocket size={18} />, title: 'Product Launches' },
  { icon: <Users size={18} />, title: 'Networking Events' },
  { icon: <Zap size={18} />, title: 'Brand Activations' },
  { icon: <GraduationCap size={18} />, title: 'Seminars & Workshops' },
  { icon: <Layout size={18} />, title: 'Exhibitions' },
  { icon: <Settings size={18} />, title: 'Event Execution' },
  { icon: <MapPin size={18} />, title: 'Venue & Vendor Management' },
];

const Services = () => {
  return (
    <section className="w-full bg-white py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-[13px] tracking-[6px] uppercase text-gray-500 font-medium mb-8">
            WHAT WE DO
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-[1.1] max-w-2xl">
            A complete suite of event <br /> services.
          </h2>
        </div>

        <div className="max-w-6xl border border-gray-200 rounded-[18px] overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-white">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`
                h-[105px] flex items-center gap-5 px-8 transition-colors hover:bg-gray-50
                border-gray-200
                ${(index + 1) % 3 !== 0 ? 'lg:border-r' : ''}
                ${(index + 1) % 2 !== 0 ? 'md:border-r lg:border-r-0' : ''}
                ${index < services.length - 1 ? 'border-b' : ''}
                ${index < services.length - 3 ? 'lg:border-b' : 'lg:border-b-0'}
              `}
            >
              <div className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 text-black">
                {service.icon}
              </div>
              <span className="text-sm font-semibold text-black uppercase tracking-tight">
                {service.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
