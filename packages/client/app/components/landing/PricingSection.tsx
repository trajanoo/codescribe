'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Minus, Zap, Sparkles, Flame, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const plans = [
  {
    icon: Zap,
    name: 'Free',
    price: '$0',
    billingNote: '4 credits / month — resets monthly',
    description: 'Try it out. No credit card required.',
    cta: 'Get started free',
    ctaStyle: 'border border-white/10 text-white/70 hover:border-white/20 hover:text-white',
    highlight: false,
    features: [
      { text: 'LinkedIn post generation', included: true },
      { text: 'README generation', included: true },
      { text: 'Reddit post + subreddit picks', included: true },
      { text: 'Custom tone & length', included: false },
      { text: 'Download files', included: false },
    ],
  },
  {
    icon: Sparkles,
    name: 'Core',
    price: '$9.99',
    billingNote: '15 credits — never expire',
    description: 'For developers who ship regularly.',
    cta: 'Buy 15 credits',
    ctaStyle: 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20',
    highlight: true,
    features: [
      { text: 'LinkedIn post generation', included: true },
      { text: 'README generation', included: true },
      { text: 'Reddit post + subreddit picks', included: true },
      { text: 'Custom tone & length', included: true },
      { text: 'Download files', included: true },
    ],
  },
  {
    icon: Flame,
    name: 'Pro',
    price: '$19.99',
    billingNote: '40 credits — never expire',
    description: 'Buy in bulk. Use whenever.',
    cta: 'Buy 40 credits',
    ctaStyle: 'border border-white/10 text-white/70 hover:border-white/20 hover:bg-violet-600 hover:text-white',
    highlight: false,
    features: [
      { text: 'LinkedIn post generation', included: true },
      { text: 'README generation', included: true },
      { text: 'Reddit post + subreddit picks', included: true },
      { text: 'Custom tone & length', included: true },
      { text: 'Download files', included: true },
    ],
  },
];

export default function PricingSection() {
  const router = useRouter();
  const [purchasingPlan, setPurchasingPlan] = useState<'core' | 'pro' | null>(null);

  async function handleFreeCta() {
    const { data: { session } } = await supabase.auth.getSession();
    router.push(session ? '/dashboard' : '/auth');
  }

  async function handlePurchase(plan: 'core' | 'pro') {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/auth');
      return;
    }

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

  return (
    <section id="pricing" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#07070f]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-violet-600/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-[0.2em] text-violet-400/80 uppercase mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Credits that don't expire.
            <br />
            <span className="text-white/30">Pay once. Use whenever.</span>
          </h2>
          <p className="mt-4 text-white/40 text-sm max-w-sm mx-auto">
          No subscriptions. No monthly pressure. Credits are there when you ship your next project.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl p-7 flex flex-col ${
                plan.highlight
                  ? 'bg-white/[0.04] border border-violet-500/30'
                  : 'bg-white/[0.02] border border-white/[0.06]'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-600 rounded-b-lg text-xs font-semibold text-white tracking-wide">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${plan.highlight ? 'bg-violet-500/20' : 'bg-white/[0.04]'}`}>
                  <plan.icon
                    className={`${plan.highlight ? 'text-violet-400' : 'text-white/50'}`}
                    style={{ width: '18px', height: '18px' }}
                  />
                </div>
                <h3 className="text-white font-semibold">{plan.name}</h3>
              </div>

              <div className="mb-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
              </div>

              <p className={`text-xs mb-1 font-medium ${plan.highlight ? 'text-violet-400' : 'text-white/40'}`}>
                {plan.billingNote}
              </p>

              <p className="text-white/35 text-sm mb-7 mt-2">{plan.description}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f.text}
                    className={`flex items-start gap-2.5 text-sm ${f.included ? 'text-white/60' : 'text-white/20'}`}
                  >
                    {f.included ? (
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Minus className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/20" />
                    )}
                    {f.text}
                  </li>
                ))}
              </ul>

              {plan.name === 'Free' ? (
                <button
                  onClick={handleFreeCta}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-300 text-center cursor-pointer ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </button>
              ) : (
                <button
                  onClick={() => handlePurchase(plan.name.toLowerCase() as 'core' | 'pro')}
                  disabled={purchasingPlan !== null}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${plan.ctaStyle}`}
                >
                  {purchasingPlan === plan.name.toLowerCase() ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    plan.cta
                  )}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-white/20 text-xs mt-8"
        >
          1 credit = 1 generation. LinkedIn, README, and Reddit are billed separately.
        </motion.p>
      </div>
    </section>
  );
}
