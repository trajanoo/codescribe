'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Building2 } from 'lucide-react';
import { createPageUrl } from '@/utils';

const plans = [
  {
    icon: Zap,
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for trying it out.',
    cta: 'Get started free',
    ctaStyle: 'border border-white/10 text-white/70 hover:border-white/20 hover:text-white',
    features: [
      '5 generations per month',
      'LinkedIn post generation',
      'README generation',
      'Copy to clipboard',
    ],
    missing: ['Custom tone & length', 'Priority generation', 'Team access'],
  },
  {
    icon: Sparkles,
    name: 'Pro',
    price: { monthly: 10, yearly: 7 },
    description: 'For developers who ship regularly.',
    cta: 'Start Pro',
    ctaStyle: 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20',
    highlight: true,
    features: [
      'Unlimited generations',
      'LinkedIn post generation',
      'README generation',
      'Custom tone & length',
      'Download files',
      'Priority generation',
    ],
    missing: ['Team access'],
  },
  {
    icon: Building2,
    name: 'Enterprise',
    price: { monthly: null, yearly: null },
    description: 'For teams and organizations.',
    cta: 'Contact us',
    ctaStyle: 'border border-white/10 text-white/70 hover:border-white/20 hover:text-white',
    features: [
      'Everything in Pro',
      'Team access & collaboration',
      'Custom branding',
      'API access',
      'Dedicated support',
      'SLA guarantee',
    ],
    missing: [],
  },
];

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

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
            Simple, transparent
            <br />
            <span className="text-white/30">pricing.</span>
          </h2>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1 bg-white/[0.03] border border-white/[0.06] rounded-full">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${!yearly ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-medium transition-all ${yearly ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              Yearly
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">−25%</span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
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
                  <plan.icon className={`w-4.5 h-4.5 ${plan.highlight ? 'text-violet-400' : 'text-white/50'}`} style={{ width: '18px', height: '18px' }} />
                </div>
                <h3 className="text-white font-semibold">{plan.name}</h3>
              </div>

              <div className="mb-3">
                {plan.price.monthly === null ? (
                  <span className="text-4xl font-bold text-white">Custom</span>
                ) : plan.price.monthly === 0 ? (
                  <span className="text-4xl font-bold text-white">Free</span>
                ) : (
                  <div className="flex items-end gap-1.5">
                    <span className="text-4xl font-bold text-white">
                      ${yearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-white/30 text-sm mb-1.5">/month</span>
                  </div>
                )}
              </div>

              <p className="text-white/35 text-sm mb-7">{plan.description}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/20 line-through">
                    <div className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {plan.name === 'Pro' ? (
                <a
                  href={createPageUrl('Checkout') + `?billing=${yearly ? 'yearly' : 'monthly'}`}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-300 block text-center ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </a>
              ) : plan.name === 'Enterprise' ? (
                <a
                  href={createPageUrl('Contact')}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-300 block text-center ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </a>
              ) : (
                <button className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${plan.ctaStyle}`}>
                  {plan.cta}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}