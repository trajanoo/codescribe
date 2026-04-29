"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const LAST_UPDATED = "April 2025";
const APP_NAME = "Codescribe";
const CONTACT_EMAIL = "hello@codescribe.dev";

const sections = [
    {
      id: "acceptance",
      title: "01 — Acceptance of Terms",
      content: `By accessing or using ${APP_NAME}, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service. These terms apply to all visitors, users, and others who access or use the platform.`,
    },
    {
      id: "description",
      title: "02 — Description of Service",
      content: `${APP_NAME} is an AI-powered platform that analyzes GitHub repositories and generates professional README files and LinkedIn posts. The service uses third-party AI models (OpenAI) and integrates with GitHub's API to access repository data you provide.`,
    },
    {
      id: "accounts",
      title: "03 — User Accounts",
      content: `You may register using email/password or GitHub OAuth. You are responsible for maintaining the security of your account credentials. You must not share your account or use another person's account. We reserve the right to terminate accounts that violate these terms or remain inactive for extended periods.`,
    },
    {
      id: "acceptable-use",
      title: "04 — Acceptable Use",
      content: `You agree not to use ${APP_NAME} to: (a) submit repositories containing illegal content; (b) attempt to reverse-engineer or exploit the platform; (c) use the service to generate spam or misleading content at scale; (d) circumvent any rate limits or access controls; (e) violate GitHub's Terms of Service when providing repository URLs.`,
    },
    {
      id: "ip",
      title: "05 — Intellectual Property",
      content: `The content you generate using ${APP_NAME} belongs to you. You retain all rights to the original code and repositories you submit. ${APP_NAME}'s platform, design, and underlying technology remain the intellectual property of the service operators. You grant us a limited license to process your repository data solely to provide the service.`,
    },
    {
      id: "third-party",
      title: "06 — Third-Party Services",
      content: `${APP_NAME} relies on third-party services including GitHub API, OpenAI, and Supabase. We are not responsible for the availability, accuracy, or actions of these services. Your use of GitHub OAuth is also governed by GitHub's own Terms of Service and Privacy Policy.`,
    },
    {
      id: "payments",
      title: "07 — Payments & Credits",
      content: `${APP_NAME} offers one-time credit purchases (Core and Pro plans) processed securely by Stripe. Credits are added to your account balance upon successful payment confirmation via Stripe webhook. Credits are non-refundable and non-transferable once purchased. They do not expire but are tied to your account — if your account is terminated for violations of these terms, unused credits are forfeited. We reserve the right to change pricing at any time; changes do not affect credits already purchased.`,
    },
    {
      id: "disclaimers",
      title: "08 — Disclaimers & Liability",
      content: `The service is provided "as is" without warranties of any kind. AI-generated content may contain errors or inaccuracies — you are responsible for reviewing and editing all generated content before publishing. To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the service.`,
    },
    {
      id: "termination",
      title: "09 — Termination",
      content: `We reserve the right to suspend or terminate your access at any time for violations of these terms. You may delete your account at any time. Upon termination, your stored data will be removed within 30 days.`,
    },
    {
      id: "changes",
      title: "10 — Changes to Terms",
      content: `We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the revised terms. We will make reasonable efforts to notify users of significant changes via email or in-app notification.`,
    },
    {
      id: "contact",
      title: "11 — Contact",
      content: `For questions about these Terms of Service, contact us at ${CONTACT_EMAIL}.`,
    },
  ];

export default function TermsPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    getUser();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#07070f] text-white overflow-x-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/3 w-[700px] h-[700px] bg-violet-600/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Navbar — exact same as Navbar.tsx */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <span className="text-white font-semibold text-lg tracking-tight">
              codescribe<span className="text-violet-400">.ink</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/privacy"
              className="text-sm text-white/50 hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href={user ? "/dashboard" : "/auth"}
              className="block text-center text-sm font-medium px-5 py-2.5 rounded-full bg-violet-600 text-white hover:bg-violet-500 transition-colors"
            >
              {user ? "My Workspace" : "Get Started"}
            </Link>
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
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden bg-[#0a0a1a]/95 backdrop-blur-xl border-b border-white/5 px-6 pb-6"
          >
            <Link
              href="/privacy"
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm text-white/60 hover:text-white border-b border-white/5"
            >
              Privacy Policy
            </Link>
            <Link
              href={user ? "/dashboard" : "/auth"}
              onClick={() => setMobileOpen(false)}
              className="mt-4 block text-center text-sm font-medium px-5 py-2.5 rounded-full bg-violet-600 text-white"
            >
              {user ? "My Workspace" : "Get Started"}
            </Link>
          </motion.div>
        )}
      </motion.nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-28 pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 mb-8"
          >
            <span className="text-xs font-medium text-violet-300 tracking-wide">LEGAL</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-[0.95] mb-5">
            Terms of <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">Service</span>
          </h1>
          <p className="text-white/25 text-xs font-mono tracking-widest">
            LAST UPDATED — {LAST_UPDATED.toUpperCase()}
          </p>
        </motion.div>

        {/* Intro card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-12 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm"
        >
          <p className="text-white/45 text-sm leading-relaxed">
            Please read these terms carefully before using {APP_NAME}. By continuing to use the service, you agree to be bound by the following conditions.
          </p>
        </motion.div>

        {/* Sections */}
        <div>
          {sections.map((section, i) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 + i * 0.045 }}
              className="border-b border-white/[0.05] py-8 last:border-0"
            >
              <p className="text-[11px] font-mono text-violet-400/70 tracking-widest mb-2">
                {section.title.split("—")[0].trim()}
              </p>
              <h2 className="text-sm font-semibold text-white/75 mb-3">
                {section.title.split("—")[1]?.trim()}
              </h2>
              <p className="text-white/40 text-sm leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-white/[0.05] flex items-center justify-between"
        >
          <span className="text-white/20 text-xs font-mono">
            © {new Date().getFullYear()} codescribe<span className="text-violet-400/40">.ink</span>
          </span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-white/25 hover:text-violet-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href={user ? "/dashboard" : "/auth"} className="text-xs text-white/25 hover:text-white/50 transition-colors">
              {user ? "Dashboard" : "Sign in"}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}