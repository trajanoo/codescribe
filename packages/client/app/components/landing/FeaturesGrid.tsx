 'use client';

import { motion } from 'framer-motion';
import { FileText, Linkedin, Wand2, Languages, Eye, Zap } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'AI-Generated READMEs',
    description: 'Complete documentation with description, tech stack, features, setup instructions, and project goals.',
    span: 'md:col-span-2',
    bg: 'bg-gradient-to-br from-violet-500/5 to-transparent',
  },
  {
    icon: Linkedin,
    title: 'LinkedIn Posts',
    description: 'Engagement-optimized posts with hooks, storytelling, CTAs, and hashtags.',
    span: '',
    bg: 'bg-gradient-to-br from-blue-500/5 to-transparent',
  },
  {
    icon: Wand2,
    title: 'Tone Rewriting',
    description: 'Switch between technical, casual, marketing, or personal tones with one click.',
    span: '',
    bg: 'bg-gradient-to-br from-emerald-500/5 to-transparent',
  },
  {
    icon: Eye,
    title: 'Live Preview & Edit',
    description: 'Inline editor with real-time markdown preview. Full control before publishing.',
    span: 'md:col-span-2',
    bg: 'bg-gradient-to-br from-cyan-500/5 to-transparent',
  },
  {
    icon: Languages,
    title: 'Multi-format Output',
    description: 'Get content formatted for GitHub, LinkedIn, and other platforms simultaneously.',
    span: '',
    bg: 'bg-gradient-to-br from-orange-500/5 to-transparent',
  },
  {
    icon: Zap,
    title: 'Instant Generation',
    description: 'From repo link to polished content in under 30 seconds. No signup required to try.',
    span: 'md:col-span-2',
    bg: 'bg-gradient-to-br from-yellow-500/5 to-transparent',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#07070f]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-xs font-semibold tracking-[0.2em] text-violet-400/80 uppercase mb-4">Features</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Everything you need,
            <br />
            <span className="text-white/40">nothing you don't</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`group relative ${feature.span}`}
            >
              <div className={`h-full p-7 rounded-2xl border border-white/[0.06] hover:border-white/[0.1] transition-all duration-500 ${feature.bg}`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.06] transition-colors">
                    <feature.icon className="w-5 h-5 text-white/60" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1.5 tracking-tight">{feature.title}</h3>
                    <p className="text-white/30 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}