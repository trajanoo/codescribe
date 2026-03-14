'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }

    getUser();
  }, []);

  const getInitial = (email?: string) => {
    if(!email) return "?"
    return email.charAt(0).toUpperCase();
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'For whom', href: '#audience' },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <span className="text-white font-semibold text-lg tracking-tight">
            codescribe<span className="text-violet-400">.io</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-white/50 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <Link href={ user ? "/dashboard" : "/auth" } className="block text-center text-sm font-medium px-5 py-2.5 rounded-full bg-violet-600 text-white">
              { user ? "My Workspace" : "Get Started" }
              
          </Link>
          {user && (
  <div className="flex items-center gap-3">
  </div>
)}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white/70 hover:text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-[#0a0a1a]/95 backdrop-blur-xl border-b border-white/5 px-6 pb-6"
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm text-white/60 hover:text-white border-b border-white/5"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#cta"
            onClick={() => setMobileOpen(false)}
            className="mt-4 block text-center text-sm font-medium px-5 py-2.5 rounded-full bg-violet-600 text-white"
          >
            Get Started
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}