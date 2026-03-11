'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Sparkles } from 'lucide-react';
import { createPageUrl } from '@/utils/index';
import { useRouter } from 'next/navigation';


const codeLines = [
  { text: 'const project = await fetch(repoUrl);', color: 'text-blue-400' },
  { text: 'const readme = ai.generate("README", project);', color: 'text-violet-400' },
  { text: 'const post = ai.generate("LinkedIn", project);', color: 'text-emerald-400' },
  { text: '// Professional content in seconds ✨', color: 'text-white/30' },
];

const outputLines = [
  '## 🚀 My Awesome Project',
  '',
  'A high-performance API built with...',
  '',
  '### Features',
  '- ⚡ Lightning fast response times',
  '- 🔒 Built-in authentication',
  '- 📊 Real-time analytics dashboard',
];



export default function HeroSection() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState('');

  const handleGenerate = () => {
    if(!repoUrl.trim()) return;

    router.push(`/project?repo=${encodeURIComponent(repoUrl.trim())}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[#07070f]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-violet-600/8 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-medium text-violet-300 tracking-wide">AI-POWERED CONTENT GENERATION</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[0.95]"
          >
            Your code
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              deserves to shine
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-7 text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Turn any GitHub repository into a professional README and
            engaging LinkedIn post — in seconds, not hours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 max-w-2xl mx-auto"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-50" />
              <div className="relative flex items-center gap-3 p-2 bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl">
                <Github className="w-5 h-5 text-white/30 ml-4" />
                <input
                 type="text"
                 value={repoUrl}
                 onChange={(e) => setRepoUrl(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                 placeholder="Paste your GitHub repository URL..."
                 className="flex-1 bg-transparent text-white placeholder:text-white/30 outline-none text-sm py-2"
                />
                  <button
                   onClick={handleGenerate}
                   className="group flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/25"
                  >
                   Generate
                   <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#how-it-works"
                className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                See how it works
              </a>
              <span className="hidden sm:block text-white/20">•</span>
              <span className="text-sm text-white/20">No signup required</span>
            </div>
          </motion.div>
        </div>

         <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-blue-600/20 to-violet-600/20 rounded-2xl blur-xl" />
            <div className="relative grid md:grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/[0.06]">
              {/* Input panel */}
              <div className="bg-[#0d0d1a] p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="ml-3 text-xs text-white/20 font-mono">input.ts</span>
                </div>
                <div className="font-mono text-sm space-y-2">
                  {codeLines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + i * 0.15 }}
                      className="flex items-start gap-3"
                    >
                      <span className="text-white/15 w-4 text-right text-xs mt-0.5 select-none">{i + 1}</span>
                      <span className={line.color}>{line.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Output panel */}
              <div className="bg-[#0a0a16] p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  <span className="text-xs text-white/20 font-mono">output — README.md</span>
                </div>
                <div className="font-mono text-sm space-y-1">
                  {outputLines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.4 + i * 0.08 }}
                      className={`${line.startsWith('##') ? 'text-white font-semibold' : line.startsWith('###') ? 'text-violet-300/80 font-medium' : line.startsWith('-') ? 'text-white/40 pl-2' : 'text-white/30'}`}
                    >
                      {line || <span>&nbsp;</span>}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        
      </div>
    </section>
  );
}