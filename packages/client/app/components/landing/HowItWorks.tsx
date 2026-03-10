'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Link2, Cpu, PenLine } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: Link2,
    title: 'Paste your repo link',
    description: 'Drop in any public GitHub repository URL. We handle the rest — analyzing your code, structure, and dependencies.',
    accent: 'from-violet-500 to-blue-500',
    glow: 'bg-violet-500/10',
  },
  {
    num: '02',
    icon: Cpu,
    title: 'AI generates content',
    description: 'Our AI reads your codebase and generates a polished README and an engaging LinkedIn post tailored to your project.',
    accent: 'from-blue-500 to-cyan-500',
    glow: 'bg-blue-500/10',
  },
  {
    num: '03',
    icon: PenLine,
    title: 'Edit, refine, publish',
    description: 'Fine-tune the tone, adjust details, or ask AI to rewrite. When it\'s perfect, copy and share it with the world.',
    accent: 'from-cyan-500 to-emerald-500',
    glow: 'bg-emerald-500/10',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#07070f]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-xs font-semibold tracking-[0.2em] text-violet-400/80 uppercase mb-4">How it works</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Three steps. Zero friction.
          </h2>
          <p className="mt-5 text-white/35 text-lg max-w-xl mx-auto font-light">
            From repository to professional content — the entire workflow takes under a minute.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group relative"
            >
              <div className="relative h-full p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:bg-white/[0.03]">
                {/* Step number */}
                <span className="text-[80px] font-bold leading-none text-white/[0.03] absolute top-4 right-6 select-none">
                  {step.num}
                </span>

                <div className={`w-12 h-12 rounded-xl ${step.glow} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                  <step.icon className="w-5 h-5 text-white/80" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-white/35 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connector lines (desktop) */}
        <div className="hidden md:flex justify-center mt-8">
          <div className="flex items-center gap-0 w-2/3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-blue-500/20" />
            <div className="w-2 h-2 rounded-full bg-blue-500/30" />
            <div className="flex-1 h-px bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}