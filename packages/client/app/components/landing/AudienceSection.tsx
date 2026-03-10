 'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Code2, Rocket, Users } from 'lucide-react';

const audiences = [
  {
    icon: GraduationCap,
    title: 'Students',
    quote: '"I spent 3 hours writing a README for my class project. Now it takes 30 seconds."',
    benefit: 'Present coursework and personal projects like a pro — impress professors and recruiters.',
    gradient: 'from-violet-500/20 to-violet-500/0',
  },
  {
    icon: Code2,
    title: 'Developers',
    quote: '"I finally started sharing my side projects. The LinkedIn posts practically write themselves."',
    benefit: 'Showcase your technical skills without spending hours on documentation and copywriting.',
    gradient: 'from-blue-500/20 to-blue-500/0',
  },
  {
    icon: Rocket,
    title: 'Indie Hackers',
    quote: '"Launched my project on LinkedIn and got 50+ reactions. The hook was AI-generated."',
    benefit: 'Build in public with polished content that drives engagement and early users.',
    gradient: 'from-emerald-500/20 to-emerald-500/0',
  },
  {
    icon: Users,
    title: 'Team Leads',
    quote: '"Our open-source repos finally have consistent, high-quality documentation."',
    benefit: 'Standardize documentation across your team\'s repositories effortlessly.',
    gradient: 'from-cyan-500/20 to-cyan-500/0',
  },
];

export default function AudienceSection() {
  return (
    <section id="audience" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#07070f]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-xs font-semibold tracking-[0.2em] text-violet-400/80 uppercase mb-4">Built for builders</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Less time writing.
            <br />
            <span className="text-white/40">More time coding.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {audiences.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <div className="relative h-full p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-500 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-b ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white/60" />
                    </div>
                    <h3 className="text-white font-semibold tracking-tight">{item.title}</h3>
                  </div>

                  <p className="text-white/50 text-sm italic leading-relaxed mb-4">
                    {item.quote}
                  </p>

                  <p className="text-white/30 text-sm leading-relaxed">
                    {item.benefit}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}