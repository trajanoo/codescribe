'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Github, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Auth() {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

    useEffect(() => {
        async function checkUser() {
          const { data } = await supabase.auth.getUser();
      
          if (data.user) {
            window.location.href = "/dashboard";
          }
        }
      
        checkUser();
      }, []);

    async function SignIn() {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
        
          if (error) {
            console.error(error.message);
            return;
          }
        
          window.location.href = "/dashboard";
    }

    async function signUp() {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if(error) {
            console.error(error.message);
            return
        }

        alert("Check your email to confirm your account.");
    }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(isLogin) {
        await SignIn();
    } else {
        await signUp();
    }
  };

  return (
    <div className="min-h-screen bg-[#07070f] flex overflow-hidden relative">
      {/* Animated background orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[140px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"
      />

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative">
        <div>
          <a href="/" className="inline-flex items-center gap-2.5 group">
            <span className="text-white font-semibold text-lg tracking-tight">
              codescribe<span className="text-violet-400">.io</span>
            </span>
          </a>
        </div>

        <div className="space-y-8 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              Turn repositories
              <br />
              into{' '}
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                compelling stories
              </span>
            </h1>
            <p className="text-white/40 text-lg leading-relaxed">
              Professional READMEs and LinkedIn posts generated in seconds.
              Your code deserves better presentation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-3 text-sm"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 border-2 border-[#07070f] flex items-center justify-center text-white text-xs font-medium"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-white/30">
              Join <span className="text-white font-medium">2,000+</span> developers
            </p>
          </motion.div>
        </div>

        <div className="text-white/20 text-xs">
          © 2026 codescribe.io
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-12 text-center">
            <a href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <Code2 className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">
                codescribe<span className="text-violet-400">.io</span>
              </span>
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                {isLogin ? 'Welcome back' : 'Get started'}
              </h2>
              <p className="text-white/40 text-sm">
                {isLogin ? 'Continue to your dashboard' : 'Create your account in seconds'}
              </p>
            </div>

            {/* GitHub Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="group relative w-full h-14 rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-blue-600/10 to-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-[1px] bg-[#0a0a1a] rounded-2xl flex items-center justify-center gap-3">
                <Github className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Continue with GitHub</span>
              </div>
              <div className="absolute inset-0 border border-white/10 group-hover:border-white/20 rounded-2xl transition-colors" />
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-xs text-white/30 bg-[#07070f]">or</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login' : 'signup'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/60 tracking-wide uppercase">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="you@example.com"
                        className="w-full h-12 px-4 bg-white/[0.02] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none transition-all"
                      />
                      {focusedField === 'email' && (
                        <motion.div
                          layoutId="focus-ring"
                          className="absolute inset-0 border-2 border-violet-500/30 rounded-xl pointer-events-none"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-white/60 tracking-wide uppercase">
                        Password
                      </label>
                      {isLogin && (
                        <a href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                          Forgot?
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="••••••••••"
                        className="w-full h-12 px-4 bg-white/[0.02] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none transition-all"
                      />
                      {focusedField === 'password' && (
                        <motion.div
                          layoutId="focus-ring"
                          className="absolute inset-0 border-2 border-violet-500/30 rounded-xl pointer-events-none"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="relative w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium overflow-hidden group mt-8"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center justify-center gap-2">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </span>
              </motion.button>
            </form>

            {/* Toggle */}
            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-white/40 hover:text-white transition-colors"
              >
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <span className="text-violet-400 font-medium">
                  {isLogin ? 'Sign up' : 'Log in'}
                </span>
              </button>
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-white/20 leading-relaxed">
              By continuing, you agree to our{' '}
              <a href="#" className="text-white/40 hover:text-white/60 transition-colors">
                Terms
              </a>{' '}
              and{' '}
              <a href="#" className="text-white/40 hover:text-white/60 transition-colors">
                Privacy Policy
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}