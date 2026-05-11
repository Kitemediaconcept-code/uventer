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
  ArrowRight,
} from 'lucide-react';

const services = [
  {
    icon: <Briefcase size={22} />,
    title: 'Corporate Events',
    desc: 'Professional events that inspire teams and drive business success.',
    color: '#6366F1',
    bg: '#EEF2FF',
  },
  {
    icon: <Mic size={22} />,
    title: 'Business Conferences',
    desc: 'High-impact conferences that bring ideas, leaders and industries together.',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    icon: <Rocket size={22} />,
    title: 'Product Launches',
    desc: 'Launch experiences designed for maximum brand impact.',
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    icon: <Users size={22} />,
    title: 'Networking Events',
    desc: 'Meaningful connections through curated networking experiences.',
    color: '#2DD4BF',
    bg: '#F0FDFA',
  },
  {
    icon: <Zap size={22} />,
    title: 'Brand Activations',
    desc: 'Creative activations that engage audiences and amplify brands.',
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    icon: <GraduationCap size={22} />,
    title: 'Seminars & Workshops',
    desc: 'Knowledge-driven sessions that educate, engage and empower.',
    color: '#F97316',
    bg: '#FFF7ED',
  },
  {
    icon: <Layout size={22} />,
    title: 'Exhibitions',
    desc: 'Showcase your brand and products to the right audience.',
    color: '#EC4899',
    bg: '#FDF2F8',
  },
  {
    icon: <Settings size={22} />,
    title: 'Event Execution',
    desc: 'End-to-end execution with precision, creativity and flawless delivery.',
    color: '#3B82F6',
    bg: '#EFF6FF',
  },
  {
    icon: <MapPin size={22} />,
    title: 'Venue & Vendor Mgmt',
    desc: 'Find the perfect venues and manage vendors seamlessly.',
    color: '#06B6D4',
    bg: '#ECFEFF',
  },
];

const Services = () => {
  return (
    <section className="w-full bg-white py-[90px] px-6" id="services">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="block w-6 h-px bg-[#e0e02a]" />
          <p className="text-[12px] tracking-[5px] uppercase text-gray-500 font-semibold">
            WHAT WE DO
          </p>
          <span className="block w-6 h-px bg-[#e0e02a]" />
        </div>

        <h2 className="text-[40px] md:text-[54px] font-black text-black leading-[1.1] max-w-[760px] mb-4 mx-auto text-center tracking-tight">
          A complete suite of{' '}
          <span className="text-[#e0e02a]">premium</span>{' '}
          <span className="italic">event services.</span>
        </h2>

        <p className="text-center text-gray-500 text-[15px] max-w-[540px] mx-auto mb-16 leading-relaxed">
          From planning to execution, we deliver experiences that connect
          people and elevate brands.
        </p>

        {/* Services Grid */}
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white border border-gray-100 rounded-[24px] p-8 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: service.bg, color: service.color }}
              >
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="text-[17px] font-black text-black leading-tight tracking-tight">
                {service.title}
              </h3>

              {/* Desc */}
              <p className="text-[13px] text-gray-500 leading-relaxed flex-1">
                {service.desc}
              </p>

              {/* Arrow */}
              <div
                className="w-7 h-7 rounded-full border flex items-center justify-center self-start transition-colors"
                style={{ borderColor: service.color, color: service.color }}
              >
                <ArrowRight size={13} />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Footer */}
        <div className="max-w-[1100px] mx-auto bg-white border border-gray-100 rounded-[24px] px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#e0e02a] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-[#1a2e8f] text-2xl font-black leading-none">u</span>
            </div>
            <div>
              <p className="font-black text-[16px] text-black">Ready to host your next event?</p>
              <p className="text-gray-400 text-[13px]">Let&apos;s create something extraordinary together.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#1a2e8f] text-[#1a2e8f] font-bold text-[13px] hover:bg-[#1a2e8f] hover:text-white transition-colors">
              Explore Events <ArrowRight size={13} />
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#e0e02a] text-black font-bold text-[13px] hover:bg-[#d4d420] transition-colors">
              Book a Consultation <ArrowRight size={13} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Services;
