'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [focusedField, setFocusedField] = useState<'new' | 'confirm' | null>(null);
    const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});

    useEffect(() => {
        const hash = window.location.hash;
        if (hash && hash.includes('type=recovery')) {
          const params = new URLSearchParams(hash.substring(1));
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
          if (access_token && refresh_token) {
            supabase.auth.setSession({ access_token, refresh_token });
          }
        }
      }, []);

    function validate(): boolean {
        const next: typeof errors = {};
        if (newPassword.length < 8) {
            next.newPassword = 'Password must be at least 8 characters.';
        }
        if (newPassword !== confirmPassword) {
            next.confirmPassword = 'Passwords do not match.';
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!validate()) return;
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            setErrors({ newPassword: error.message });
            return;
        }
        window.location.href = '/dashboard';
    }

    return (
        <div className="min-h-screen bg-[#07070f] flex overflow-hidden relative">
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[140px]"
            />
            <motion.div
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"
            />

            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative">
                <div>
                    <a href="/" className="inline-flex items-center gap-2.5 group">
                        <span className="text-white font-semibold text-lg tracking-tight">
                            codescribe<span className="text-violet-400">.ink</span>
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
                </div>
                <div className="text-white/20 text-xs">© 2026 codescribe.ink</div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-12 text-center">
                        <a href="/" className="inline-flex items-center gap-2.5">
                            <span className="text-white font-semibold text-lg tracking-tight">
                                codescribe<span className="text-violet-400">.ink</span>
                            </span>
                        </a>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                                Set new password
                            </h2>
                            <p className="text-white/40 text-sm">
                                Choose a password at least 8 characters long.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/60 tracking-wide uppercase">
                                    New password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                                        onFocus={() => setFocusedField('new')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="••••••••••"
                                        className="w-full h-12 px-4 bg-white/[0.02] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none transition-all"
                                    />
                                    {focusedField === 'new' && (
                                        <motion.div
                                            layoutId="focus-ring"
                                            className="absolute inset-0 border-2 border-violet-500/30 rounded-xl pointer-events-none"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                                        />
                                    )}
                                </div>
                                {errors.newPassword && (
                                    <p className="text-xs text-red-400 mt-1">{errors.newPassword}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/60 tracking-wide uppercase">
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                        onFocus={() => setFocusedField('confirm')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="••••••••••"
                                        className="w-full h-12 px-4 bg-white/[0.02] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none transition-all"
                                    />
                                    {focusedField === 'confirm' && (
                                        <motion.div
                                            layoutId="focus-ring"
                                            className="absolute inset-0 border-2 border-violet-500/30 rounded-xl pointer-events-none"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                                        />
                                    )}
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                className="relative w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium overflow-hidden group mt-8"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative flex items-center justify-center gap-2">Update password</span>
                            </motion.button>
                        </form>

                        <p className="text-center text-xs text-white/20 leading-relaxed">
                            By continuing, you agree to our{' '}
                            <a href="/terms" className="text-white/40 hover:text-white/60 transition-colors">Terms</a>{' '}
                            and{' '}
                            <a href="/privacy" className="text-white/40 hover:text-white/60 transition-colors">Privacy Policy</a>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
