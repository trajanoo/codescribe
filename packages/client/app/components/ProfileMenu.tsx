'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Loader2, CreditCard } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';

type PlanId = 'core' | 'pro';

const PLANS: { id: PlanId; name: string; credits: number; price: string }[] = [
  { id: 'core', name: 'Core', credits: 15, price: '$9.99' },
  { id: 'pro',  name: 'Pro',  credits: 40, price: '$19.99' },
];

interface ProfileMenuProps {
  session: Session | null;
  balance: number | null;
}

export default function ProfileMenu({ session, balance }: ProfileMenuProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [purchasingPlan, setPurchasingPlan] = useState<PlanId | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setShowPlans(false);
      return;
    }
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [isOpen]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/auth');
  }

  async function handlePurchase(plan: PlanId) {
    if (!session) return;
    setPurchasingPlan(plan);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId: session.user.id }),
      });
      const { url } = await res.json() as { url: string };
      window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
      setPurchasingPlan(null);
    }
  }

  if (!session) return null;

  const email = session.user.email ?? '';
  const initial = email[0]?.toUpperCase() ?? '?';

  const balanceColor =
    balance === null  ? 'text-white/30' :
    balance === 0     ? 'text-red-400'  :
    balance <= 3      ? 'text-amber-400': 'text-white/50';

  const balanceText =
    balance === null ? '⚡ — credits' :
    balance === 0    ? '⚡ No credits' :
    `⚡ ${balance} credits`;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-500 transition-colors flex items-center justify-center text-white text-sm font-semibold cursor-pointer flex-shrink-0"
      >
        {initial}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-64 bg-[#0e0e1a] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {/* User info */}
            <div className="px-4 py-3 space-y-1">
              <p className="text-white/50 text-xs truncate">{email}</p>
              <p className={`text-xs font-medium ${balanceColor}`}>{balanceText}</p>
            </div>

            <div className="h-px bg-white/[0.06]" />

            {/* Buy credits */}
            <div className="p-2">
              <button
                onClick={() => setShowPlans((s) => !s)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-all text-left cursor-pointer"
              >
                <CreditCard className="w-4 h-4 flex-shrink-0" />
                Buy credits
              </button>

              <AnimatePresence>
                {showPlans && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-1 space-y-0.5 px-1">
                      {PLANS.map((plan) => (
                        <button
                          key={plan.id}
                          onClick={() => handlePurchase(plan.id)}
                          disabled={purchasingPlan !== null}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <div className="text-left">
                            <span className="text-white/80 text-sm font-medium">{plan.name}</span>
                            <span className="text-white/30 text-xs ml-1.5">{plan.credits} cr</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {purchasingPlan === plan.id && (
                              <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin" />
                            )}
                            <span className="text-violet-400 font-medium text-xs">{plan.price}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-px bg-white/[0.06]" />

            {/* Sign out */}
            <div className="p-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-red-400 hover:bg-red-500/[0.08] transition-all text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
