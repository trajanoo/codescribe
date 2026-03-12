'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Github, Twitter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CTAFooter() {
  const router = useRouter();

  const handleStartForFree = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push('/auth');
      return;
    }

    router.push('/dashboard');
  };
  return (
    <>
      {/* CTA Section */}
      <section id="cta" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#07070f]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] bg-violet-600/8 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-violet-300/80">Free to start — no credit card needed</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.05]">
              Ready to let your
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                code speak?
              </span>
            </h2>

            <p className="mt-6 text-lg text-white/35 max-w-lg mx-auto font-light leading-relaxed">
              Paste a GitHub link. Get a README and LinkedIn post. 
              It's that simple.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleStartForFree}
                className="group flex items-center gap-2.5 px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-medium text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/25 hover:scale-[1.02]"
              >
                Start for free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            <p className="mt-6 text-xs text-white/20">
              Join 2,000+ developers already using codescribe.io
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#050510] border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">

              <span className="text-white/60 font-medium text-sm">
                codescribe<span className="text-violet-400/60">.io</span>
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a href="#" className="text-white/25 hover:text-white/50 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="text-white/25 hover:text-white/50 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-white/25 hover:text-white/50 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            <p className="text-xs text-white/15">
              © 2026 codescribe.io. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

function Linkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}