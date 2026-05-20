'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Search,
  PenTool,
  Palette,
  Smartphone,
  Send,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Users,
  Layers,
  HelpCircle,
  Plus,
  Minus
} from 'lucide-react';

const stepsDetail = [
  {
    number: '01',
    title: 'Understand',
    duration: '1-2 Days',
    icon: <Search size={22} />,
    description: 'We explore your event goals and audience needs to uncover what attendees truly value.',
    color: '#e0e02a',
    bgLight: 'rgba(224, 224, 42, 0.08)',
    details: [
      'Discovery workshop to align on vision and high-level goals',
      'Target audience persona framing and expectation mapping',
      'Identifying key success indicators (KPIs) and event constraints',
      'Initial theme brainstorming and strategic direction setup'
    ],
    deliverables: 'Strategic Brief & Event Vision Board'
  },
  {
    number: '02',
    title: 'Plan',
    duration: '1 Week',
    icon: <PenTool size={22} />,
    description: 'We build a clean, energetic strategy with easy scheduling and motivating event flow.',
    color: '#10B981',
    bgLight: 'rgba(16, 185, 129, 0.08)',
    details: [
      'Comprehensive budget breakdown and resource allocation',
      'Timeline scheduling and critical path drafting',
      'Venue shortlisting, pricing negotiation, and initial site inspection',
      'Keynote speaker, presenter, and vendor alignment'
    ],
    deliverables: 'Comprehensive Event Blueprint & Master Schedule'
  },
  {
    number: '03',
    title: 'Design',
    duration: '1-2 Weeks',
    icon: <Palette size={22} />,
    description: 'We craft the experience down to every detail, making sure the atmosphere feels smooth.',
    color: '#3B82F6',
    bgLight: 'rgba(59, 130, 246, 0.08)',
    details: [
      'Creative visual identity design (colors, typography, logo placement)',
      'Stage backdrop, physical space layout, and seating diagrams',
      'Lighting schemes, immersive audio plans, and dynamic transitions',
      'Digital touchpoint styling (registration landing page, ticketing layouts)'
    ],
    deliverables: 'High-end 3D Visual Mockups & Spatial Design'
  },
  {
    number: '04',
    title: 'Execute',
    duration: '2-4 Weeks',
    icon: <Smartphone size={22} />,
    description: 'We run multiple test rounds to refine the guest experience and ensure it is enjoyable.',
    color: '#8B5CF6',
    bgLight: 'rgba(139, 92, 246, 0.08)',
    details: [
      'Strict technical dress rehearsals and audio/visual dry runs',
      'Seamless attendee registration, payment flow, and QR-ticketing setup',
      'Finalized catering, security, hosts, and support crew briefing',
      'Comprehensive timeline distribution to all technical staff'
    ],
    deliverables: 'Technical Cue-Sheet & Final Operations Plan'
  },
  {
    number: '05',
    title: 'Deliver',
    duration: 'Final Day',
    icon: <Send size={22} />,
    description: 'We wrap it all up with a polished execution that delivers maximum event value.',
    color: '#F59E0B',
    bgLight: 'rgba(245, 158, 11, 0.08)',
    details: [
      'Flawless live execution supervised by senior event directors',
      'On-site registration coordination and guest flow management',
      'Real-time crisis mitigation and technical queue monitoring',
      'Post-event breakdown, feedback gathering, and metric reporting'
    ],
    deliverables: 'Post-Event Performance & Attendee Feedback Report'
  }
];

const faqs = [
  {
    question: "How involved will I need to be during the 5-step process?",
    answer: "You will be closely involved during Step 1 (Understand) and Step 3 (Design Approval). Once you approve the strategy and design, our senior project managers take complete ownership of vendor coordination, testing, and execution, giving you regular weekly status updates while letting you focus entirely on your business."
  },
  {
    question: "Can steps be compressed for urgent events?",
    answer: "Absolutely. While our standard timeline ensures maximum polishing, we can deploy a fast-tracked workflow for events with tight deadlines, compression is done without compromising safety or premium styling."
  },
  {
    question: "Do you manage external vendors, or do we provide them?",
    answer: "We handle end-to-end vendor management. We have a pre-vetted roster of premium sound, lighting, catering, and staging vendors. However, if you have preferred partners, we are more than happy to coordinate with them directly."
  },
  {
    question: "What happens if there are last-minute changes to the guest list?",
    answer: "Our modern registration systems (configured in Step 4) are fully dynamic. We can accommodate seating layout revisions, dietary profile updates, and on-the-spot ticketing up to hours before the doors open."
  }
];

export default function ProcessPage() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="w-full bg-[#fafafa] text-black min-h-screen pb-20">
      {/* Premium Hero Header */}
      <section className="relative w-full bg-white border-b border-gray-100 py-16 md:py-24 px-5 md:px-6 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="block w-6 h-px bg-[#e0e02a]" />
            <p className="text-[14px] tracking-[5px] uppercase text-gray-500 font-black">
              HOW WE WORK
            </p>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[36px] md:text-[56px] font-black text-black leading-[1.1] tracking-tight mb-6"
          >
            A clear process. <br className="hidden md:block" />
            <span className="text-[#e0e02a]">Five steady steps.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-500 text-[16px] md:text-[18px] max-w-2xl leading-[1.7] font-medium"
          >
            We take the complexity out of corporate events and business conferences. 
            From initial strategy to live production day, discover how we build flawless experiences.
          </motion.p>
        </div>
      </section>

      {/* Main Process Interactive Timeline (Desktop & Mobile Layout) */}
      <section className="max-w-7xl mx-auto px-5 md:px-6 pt-16 md:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Interactive Nav (Desktop Sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-3">
            <div className="mb-6">
              <span className="text-[12px] uppercase font-black tracking-widest text-[#e0e02a] block mb-2">TIMELINE PROGRESS</span>
              <h2 className="text-2xl font-black tracking-tight">Interactive Workflow</h2>
            </div>
            
            <div className="space-y-2.5">
              {stepsDetail.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-4.5 rounded-2xl border transition-all duration-300 flex items-center gap-4 focus:outline-none cursor-pointer ${
                    activeStep === idx
                      ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white shadow-xl shadow-black/10 translate-x-2'
                      : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:text-black'
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: activeStep === idx ? '#e0e02a' : step.bgLight,
                      color: activeStep === idx ? 'black' : step.color
                    }}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold opacity-60">STEP {step.number}</span>
                      <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                        {step.duration}
                      </span>
                    </div>
                    <p className="font-black text-[15px] leading-tight mt-0.5">{step.title}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Stats card */}
            <div className="hidden lg:block bg-[#28347b] text-white p-6 rounded-3xl mt-8 relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_bottom_right,#e0e02a_0%,transparent_60%)]" />
              <p className="text-white/70 text-xs font-black uppercase tracking-wider mb-2">THE UVENTER GUARANTEE</p>
              <h4 className="text-[18px] font-black leading-tight mb-4">Precision, Accountability & Unmatched Visuals.</h4>
              <Link href="/contact" className="inline-flex items-center gap-2 text-[#e0e02a] text-sm font-bold hover:underline">
                Start Planning <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Main Detailed View (Framer Motion Staggered Cards or Active view) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Active Step Showcase */}
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-12 shadow-xl shadow-black/[0.02] relative overflow-hidden"
            >
              {/* Massive floating numbers background */}
              <div className="absolute -top-12 -right-8 text-[180px] font-black text-black/[0.02] select-none pointer-events-none italic font-serif">
                {stepsDetail[activeStep].number}
              </div>

              {/* Tag + Title */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 relative z-10">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: stepsDetail[activeStep].color }}
                >
                  {stepsDetail[activeStep].icon}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                      Step {stepsDetail[activeStep].number}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <span className="text-[12px] font-black text-[#e0e02a] uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded-md">
                      {stepsDetail[activeStep].duration}
                    </span>
                  </div>
                  <h3 className="text-[24px] md:text-[32px] font-black tracking-tight text-black mt-0.5">
                    {stepsDetail[activeStep].title}
                  </h3>
                </div>
              </div>

              <p className="text-gray-600 text-[16px] md:text-[18px] font-medium leading-[1.7] mb-8 max-w-2xl relative z-10">
                {stepsDetail[activeStep].description}
              </p>

              {/* Bullet Points Grid */}
              <div className="mb-8 relative z-10">
                <h4 className="text-[13px] font-black uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                  <Layers size={14} /> <span>Key Actions & Process Tasks</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {stepsDetail[activeStep].details.map((detail, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-100/50 p-4 rounded-2xl transition-colors duration-200"
                    >
                      <CheckCircle2 size={18} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span className="text-[14px] md:text-[15px] font-medium text-gray-700 leading-tight">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverable Badge */}
              <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-neutral-400 block mb-0.5">
                    PHASE DELIVERABLE
                  </span>
                  <p className="font-bold text-[15px] text-black">
                    {stepsDetail[activeStep].deliverables}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-black text-gray-700">
                    <CheckCircle2 size={12} className="text-[#10B981]" /> Signed Off
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Complete Horizontal Roadmap Cards (Great scroll reference) */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h3 className="text-xl font-black tracking-tight">Timeline Roadmap View</h3>
                <span className="text-xs font-bold text-gray-400">Total Duration: ~4-6 Weeks</span>
              </div>
              
              <div className="space-y-4">
                {stepsDetail.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`bg-white border p-5 rounded-3xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                      activeStep === idx 
                        ? 'border-black shadow-md ring-1 ring-black' 
                        : 'border-gray-100 hover:border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: step.color }}
                      >
                        {step.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-400">STEP {step.number}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span className="text-xs font-bold text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                            {step.duration}
                          </span>
                        </div>
                        <h4 className="font-black text-[17px] mt-0.5 text-black group-hover:text-primary transition-colors">
                          {step.title}
                        </h4>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-0 pt-3 md:pt-0 border-gray-50">
                      <span className="text-sm font-medium text-gray-400 truncate max-w-[240px] hidden sm:block">
                        {step.deliverables}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#1a1a1a] group-hover:text-white transition-colors duration-300 ml-auto">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Structured FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-5 md:px-6 pt-24 md:pt-32">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3">
            <HelpCircle size={12} />
            <span>Process FAQs</span>
          </div>
          <h2 className="text-3xl md:text-42px font-black tracking-tight">Common Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left font-bold text-[16px] md:text-[18px] text-black focus:outline-none cursor-pointer"
              >
                <span>{faq.question}</span>
                <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-500">
                  {openFaq === idx ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>
              
              <motion.div
                initial={false}
                animate={{ height: openFaq === idx ? 'auto' : 0, opacity: openFaq === idx ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 text-gray-500 text-[14px] md:text-[15px] leading-[1.7] border-t border-gray-50 font-medium">
                  {faq.answer}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* High-end CTA Section */}
      <section className="max-w-7xl mx-auto px-5 md:px-6 pt-24 md:pt-32">
        <div className="bg-[#28347b] rounded-[32px] md:rounded-[48px] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_top_left,#e0e02a_0%,transparent_60%)]" />
          
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-6">
              Let&apos;s build an extraordinary experience together.
            </h2>
            <p className="text-white/80 text-[16px] md:text-[18px] mb-10 max-w-md mx-auto font-medium leading-[1.7]">
              Ready to take the next step? Connect with our execution experts for a tailored consultation.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="w-full sm:w-auto">
                <button className="w-full justify-center inline-flex items-center gap-2 bg-[#e0e02a] text-black font-bold px-8 py-4 rounded-full text-base hover:bg-[#d4d420] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10">
                  Book a Consultation <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="/events" className="w-full sm:w-auto">
                <button className="w-full justify-center inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-white font-bold px-8 py-4 rounded-full text-base hover:bg-white/5 transition-all">
                  Browse Active Events
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
