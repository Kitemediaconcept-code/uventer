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
  MapPin,
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

const COLS = 3;
const total = services.length;
// Index of the first item in the last row
const lastRowStart = total - (total % COLS === 0 ? COLS : total % COLS);

const Services = () => {
  return (
    <section className="w-full bg-white py-[90px] px-[6%]">
      <div className="max-w-7xl mx-auto">
        <p className="text-[13px] tracking-[6px] uppercase text-gray-500 font-medium mb-[35px]">
          WHAT WE DO
        </p>
        <h2 className="text-[42px] md:text-[58px] font-bold text-black leading-[1.15] max-w-[650px] mb-[60px]">
          A complete suite of event<br />services.
        </h2>

        <div className="max-w-[1100px] border border-[#d8d8d8] rounded-[18px] overflow-hidden grid grid-cols-1 md:grid-cols-3 bg-white">
          {services.map((service, index) => {
            const col = index % COLS;
            const isLastCol = col === COLS - 1;
            const isLastRow = index >= lastRowStart;

            return (
              <div
                key={index}
                className={[
                  'h-[105px] flex items-center gap-[18px] px-8 transition-colors hover:bg-gray-50',
                  !isLastCol ? 'md:border-r border-[#d8d8d8]' : '',
                  !isLastRow ? 'border-b border-[#d8d8d8]' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="w-10 h-10 border border-[#d8d8d8] rounded-full flex items-center justify-center flex-shrink-0 text-black">
                  {service.icon}
                </div>
                <span className="text-[14px] font-semibold text-black">
                  {service.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
