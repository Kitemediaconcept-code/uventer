'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
  Search,
  Palette,
  Smartphone,
  Send,
  PenTool,
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

const steps = [
  {
    number: '01',
    title: 'Understand',
    duration: '1-2 Days',
    icon: <Search size={20} />,
    description: 'We explore your goals and audience pain points to uncover what people truly need.',
    color: '#e0e02a',
    delay: 0
  },
  {
    number: '02',
    title: 'Plan',
    duration: '1 Week',
    icon: <PenTool size={20} />,
    description: 'We build a clean, energetic strategy with easy navigation and motivating visuals.',
    color: '#10B981',
    delay: 0.2
  },
  {
    number: '03',
    title: 'Design',
    duration: '1-2 Weeks',
    icon: <Palette size={20} />,
    description: 'We craft the experience down to every detail, making sure the app feels smooth.',
    color: '#3B82F6',
    delay: 0.4
  },
  {
    number: '04',
    title: 'Execute',
    duration: '2-4 Weeks',
    icon: <Smartphone size={20} />,
    description: 'We run multiple test rounds to refine the experience and ensure it is enjoyable.',
    color: '#8B5CF6',
    delay: 0.6
  },
  {
    number: '05',
    title: 'Deliver',
    duration: 'Final Day',
    icon: <Send size={20} />,
    description: 'We wrap it all up with a polished presentation that demonstrates the app value.',
    color: '#F59E0B',
    delay: 0.8
  }
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

        {/* How We Work Section - Redesigned Staggered Layout */}
        <div className="max-w-[1100px] mx-auto mt-32 mb-32 relative">
          <div className="flex flex-col items-center text-center mb-20">
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-6 h-px bg-[#e0e02a]" />
              <p className="text-[12px] tracking-[5px] uppercase text-gray-500 font-black">
                HOW WE WORK
              </p>
              <span className="block w-6 h-px bg-[#e0e02a]" />
            </div>
            <h2 className="text-[40px] md:text-[54px] font-black text-black leading-[1.1] tracking-tight">
              A clear process. <span className="text-[#e0e02a]">Five steady steps.</span>
            </h2>
          </div>

          <div className="relative space-y-12 md:space-y-0 md:h-[1200px]">
            {/* Dotted Connection Lines (Visible on Desktop) */}
            <div className="hidden md:block absolute top-0 left-1/2 w-full h-full -translate-x-1/2 pointer-events-none opacity-20">
              <svg width="100%" height="100%" viewBox="0 0 1000 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M250 150 Q 500 150 500 300 T 750 450" stroke="black" strokeWidth="2" strokeDasharray="8 8" />
                <path d="M750 450 Q 500 450 500 600 T 250 750" stroke="black" strokeWidth="2" strokeDasharray="8 8" />
                <path d="M250 750 Q 500 750 500 900 T 750 1050" stroke="black" strokeWidth="2" strokeDasharray="8 8" />
              </svg>
            </div>

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: step.delay }}
                className={`relative md:absolute w-full md:w-[450px] group ${
                  index % 2 === 0 ? 'md:left-0' : 'md:right-0'
                }`}
                style={{
                  top: `${index * 220}px`
                }}
              >
                <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-sm hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2 flex gap-8">
                  {/* Vertical Pill Duration */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-10 h-32 rounded-full flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: '#1a1a1a' }}
                    >
                      <span className="text-[10px] text-white font-black uppercase tracking-widest -rotate-90 whitespace-nowrap">
                        {step.duration}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-[#e0e02a]/10 p-2 rounded-lg text-[#1a2e8f]">
                        {step.icon}
                      </div>
                      <span className="text-gray-400 font-bold text-xs">{step.number} {step.title}</span>
                    </div>
                    
                    <p className="text-[15px] leading-[1.6] text-gray-600 font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Number Float (Visible on hover) */}
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#e0e02a] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-xl shadow-[#e0e02a]/20 scale-50 group-hover:scale-100">
                  <span className="text-black font-black text-xl italic">{step.number}</span>
                </div>
              </motion.div>
            ))}
          </div>
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
