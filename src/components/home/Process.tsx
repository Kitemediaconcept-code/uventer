'use client';

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Understand',
    description: 'We learn your goals, audience, and vision.'
  },
  {
    number: '02',
    title: 'Plan',
    description: 'We build a structured, end-to-end roadmap.'
  },
  {
    number: '03',
    title: 'Design',
    description: 'We craft the experience down to every detail.'
  },
  {
    number: '04',
    title: 'Execute',
    description: 'We coordinate every moving part on the ground.'
  },
  {
    number: '05',
    title: 'Deliver',
    description: 'We deliver a seamless, memorable event.'
  }
];

const Process = () => {
  return (
    <section className="w-full bg-white py-[100px] px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-[13px] tracking-[6px] uppercase text-gray-500 font-medium mb-[35px]">
          HOW WE WORK
        </p>
        <h2 className="text-[42px] md:text-[64px] font-bold text-black leading-[1.1] max-w-[800px] mb-[60px] tracking-tight">
          A clear process.<br />Five steady steps.
        </h2>

        <div className="border border-black rounded-[30px] overflow-hidden bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ backgroundColor: '#f7f7f7', y: -5 }}
              className={`p-10 transition-all cursor-pointer ${
                index !== steps.length - 1 ? 'lg:border-r border-black' : ''
              } ${
                index % 2 !== 0 && index !== steps.length - 1 ? 'md:border-r-0 lg:border-r' : ''
              } border-b border-black lg:border-b-0 last:border-b-0`}
            >
              <div className="text-[14px] font-bold tracking-[2px] mb-8 text-gray-500">
                {step.number}
              </div>
              <h3 className="text-[34px] font-bold mb-5 tracking-tight text-black">
                {step.title}
              </h3>
              <p className="text-[18px] leading-[1.7] text-gray-600 font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
