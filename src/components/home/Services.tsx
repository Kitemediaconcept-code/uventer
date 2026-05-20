'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
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
    category: 'Events'
  },
  {
    icon: <Mic size={22} />,
    title: 'Business Conferences',
    desc: 'High-impact conferences that bring ideas, leaders and industries together.',
    color: '#F59E0B',
    bg: '#FFFBEB',
    category: 'Events'
  },
  {
    icon: <GraduationCap size={22} />,
    title: 'Seminars & Workshops',
    desc: 'Knowledge-driven sessions that educate, engage and empower.',
    color: '#F97316',
    bg: '#FFF7ED',
    category: 'Events'
  },
  {
    icon: <Rocket size={22} />,
    title: 'Product Launches',
    desc: 'Launch experiences designed for maximum brand impact.',
    color: '#10B981',
    bg: '#ECFDF5',
    category: 'Experience'
  },
  {
    icon: <Zap size={22} />,
    title: 'Brand Activations',
    desc: 'Creative activations that engage audiences and amplify brands.',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    category: 'Experience'
  },
  {
    icon: <Layout size={22} />,
    title: 'Exhibitions',
    desc: 'Showcase your brand and products to the right audience.',
    color: '#EC4899',
    bg: '#FDF2F8',
    category: 'Experience'
  },
  {
    icon: <Users size={22} />,
    title: 'Networking Events',
    desc: 'Meaningful connections through curated networking experiences.',
    color: '#2DD4BF',
    bg: '#F0FDFA',
    category: 'Execution'
  },
  {
    icon: <Settings size={22} />,
    title: 'Event Execution',
    desc: 'End-to-end execution with precision, creativity and flawless delivery.',
    color: '#3B82F6',
    bg: '#EFF6FF',
    category: 'Execution'
  },
  {
    icon: <MapPin size={22} />,
    title: 'Venue & Vendor Mgmt',
    desc: 'Find the perfect venues and manage vendors seamlessly.',
    color: '#06B6D4',
    bg: '#ECFEFF',
    category: 'Execution'
  },
];

const categories = ['Events', 'Experience', 'Execution'];


const Services = () => {
  const [activeTab, setActiveTab] = useState('Events');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const filteredServices = services.filter(s => s.category === activeTab);

  return (
    <section className="w-full bg-white pt-6 md:pt-10 pb-[48px] md:pb-[80px] px-5 md:px-6" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-start text-left mb-10">
          <h2 className="text-[28px] md:text-[42px] font-black text-black leading-[1.1] mb-6 tracking-tight max-w-4xl">
            Our Services Impact <span className="text-gray-300">Your Event in Many Ways</span>
          </h2>

          {/* Categories Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 mb-8">
            <div className="flex items-center justify-start gap-1 p-1 bg-gray-50/50 rounded-2xl border border-gray-100 w-fit">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-5 md:px-8 py-2.5 md:py-3 rounded-xl text-[14px] md:text-[16px] font-black transition-all duration-300 ${
                    activeTab === cat 
                      ? 'bg-[#1a1a1a] text-white shadow-xl shadow-black/10' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <Link href="/how-it-works" className="hidden md:inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:border-gray-200 text-sm font-bold text-gray-700 transition-all duration-300">
              <span>How We Work</span>
              <ArrowRight size={14} className="text-[#e0e02a]" />
            </Link>
          </div>
        </div>

        {/* Services Carousel - Auto Sliding */}
        <div className="relative mb-12 overflow-hidden -mx-6">
          <div className="flex animate-scroll-left hover:[animation-play-state:paused] pl-6">
            {/* Duplicate cards for seamless loop */}
            {[...filteredServices, ...filteredServices].map((service, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative flex-shrink-0 w-[220px] md:w-[280px] mx-1.5 md:mx-2 rounded-[16px] md:rounded-[20px] overflow-hidden transition-all duration-500 cursor-pointer ${
                  hoveredIndex === index 
                    ? 'bg-[#1a1a1a] shadow-2xl scale-[1.02]' 
                    : 'bg-white border border-gray-100 hover:border-gray-200 shadow-sm'
                }`}
              >
                <div className="p-4 md:p-5 flex flex-col gap-2 md:gap-3">
                  <h3 className={`text-[16px] md:text-[18px] font-black leading-tight tracking-tighter ${
                    hoveredIndex === index ? 'text-white' : 'text-black'
                  }`}>
                    {service.title}
                  </h3>
                  
                  <p className={`text-[14px] font-medium leading-[1.7] ${
                    hoveredIndex === index ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {service.desc}
                  </p>

                  <div className="flex items-center justify-end">
                    <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                      hoveredIndex === index ? 'bg-primary text-black rotate-[-45deg]' : 'bg-gray-50 text-gray-400'
                    }`}>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes scroll-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll-left {
              animation: scroll-left 20s linear infinite;
            }
          `}} />
        </div>



        {/* CTA Footer */}
        <div className="max-w-7xl mx-auto bg-white border border-gray-100 rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-14 h-14 bg-[#e0e02a] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#e0e02a]/20">
              <span className="text-[#1a2e8f] text-2xl font-black leading-none">u</span>
            </div>
            <div className="text-left">
              <p className="font-black text-[18px] text-black leading-tight mb-1">Ready to host your next event?</p>
              <p className="text-gray-400 text-[14px] md:text-[16px] font-medium">Let&apos;s create something extraordinary together.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto flex-shrink-0">
            <Link href="/#events" className="w-full sm:w-auto">
              <button className="w-full justify-center flex items-center gap-2 px-6 md:px-8 py-3.5 rounded-full border-2 border-gray-100 text-gray-600 font-bold text-[14px] md:text-[16px] hover:border-[#1a2e8f] hover:text-[#1a2e8f] transition-all">
                Explore Events <ArrowRight size={14} />
              </button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <button className="w-full justify-center flex items-center gap-2 px-6 md:px-8 py-3.5 rounded-full bg-[#e0e02a] text-black font-bold text-[14px] md:text-[16px] hover:bg-[#d4d420] transition-all shadow-md shadow-[#e0e02a]/10 hover:shadow-lg hover:shadow-[#e0e02a]/20">
                Book a Consultation <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Services;
