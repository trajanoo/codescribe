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
      id: "overview",
      title: "01 — Overview",
      content: `${APP_NAME} is committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights. We collect only what is necessary to operate the service.`,
    },
    {
      id: "data-collected",
      title: "02 — Data We Collect",
      subsections: [
        {
          label: "Account data",
          text: "When you register, we collect your email address and a hashed password (if using email auth), or your GitHub profile name and email (if using GitHub OAuth). This is managed by Supabase Auth.",
        },
        {
          label: "Repository data",
          text: "When you submit a GitHub URL, we temporarily access that repository's public file tree, README, and selected source files via the GitHub API in order to generate content. We do not store raw source code — only the generated outputs are saved.",
        },
        {
          label: "Generated content",
          text: "READMEs and LinkedIn posts generated for your repositories are stored in our database associated with your user ID and repository URL.",
        },
        {
          label: "Usage data",
          text: "We may collect standard server logs including IP addresses, request timestamps, and browser information for security and debugging purposes.",
        },
      ],
    },
    {
      id: "how-used",
      title: "03 — How We Use Your Data",
      content: `We use your data exclusively to: (a) authenticate and identify you; (b) generate content by sending repository analysis data to OpenAI's API; (c) save and display your previously generated content on your dashboard; (d) communicate with you about your account if necessary. We do not use your data for advertising or sell it to third parties.`,
    },
    {
      id: "third-parties",
      title: "04 — Third-Party Services",
      subsections: [
        {
          label: "Supabase",
          text: "We use Supabase for user authentication and database storage. Your account data and generated content are stored in Supabase's infrastructure. Supabase is SOC 2 Type II compliant.",
        },
        {
          label: "OpenAI",
          text: "Repository analysis data (repo name, dependencies, selected file contents) is sent to OpenAI's API to generate content. We do not send personally identifiable information to OpenAI.",
        },
        {
          label: "GitHub",
          text: "If you use GitHub OAuth, your authentication is handled by GitHub. If you submit a repository URL, we access it using our own GitHub API token — your personal GitHub token is never stored or used.",
        },
        {
          label: "Stripe",
          text: "Payment processing is handled entirely by Stripe. We never receive, store, or have access to your card number or any payment credentials. When you purchase credits, Stripe notifies us via webhook with only the purchase result and your user ID — we then update your credit balance accordingly. All payment data is governed by Stripe's Privacy Policy.",
        },
      ],
    },
    {
      id: "data-retention",
      title: "05 — Data Retention",
      content: `Your account data and generated content are retained for as long as your account is active. You can delete individual projects from your dashboard at any time. If you delete your account, all associated data is removed within 30 days. Server logs are retained for up to 90 days.`,
    },
    {
      id: "payment-data",
      title: "06 — Payment Data",
      content: `We do not store any payment card information. Credit purchases are processed by Stripe, and the only payment-related data we retain is: the plan purchased (Core or Pro), the number of credits added, and a transaction record for your account history. This data is stored in our Supabase database and is used solely to manage your credit balance.`,
    },
    {
      id: "security",
      title: "07 — Security",
      content: `We implement industry-standard security practices including encrypted connections (HTTPS/TLS), hashed passwords via Supabase Auth, and row-level security policies on our database. No system is perfectly secure — please use a strong, unique password and keep your credentials private.`,
    },
    {
      id: "rights",
      title: "08 — Your Rights",
      content: `Depending on your jurisdiction, you may have the right to access, correct, or delete the personal data we hold about you. To exercise these rights, contact us at ${CONTACT_EMAIL}. EU/EEA users are covered by GDPR. California residents are covered by CCPA.`,
    },
    {
      id: "cookies",
      title: "09 — Cookies & Storage",
      content: `We use cookies and browser storage exclusively for authentication session management via Supabase. We do not use tracking cookies or third-party advertising cookies.`,
    },
    {
      id: "children",
      title: "10 — Children's Privacy",
      content: `${APP_NAME} is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us so we can delete it.`,
    },
    {
      id: "changes",
      title: "11 — Changes to This Policy",
      content: `We may update this Privacy Policy periodically. We will notify users of material changes via email or a prominent notice in the app. Continued use after changes constitutes acceptance of the updated policy.`,
    },
    {
      id: "contact",
      title: "12 — Contact",
      content: `For privacy-related questions or requests, contact us at ${CONTACT_EMAIL}.`,
    },
  ];

export default function PrivacyPage() {
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
              href="/terms"
              className="text-sm text-white/50 hover:text-white transition-colors duration-200"
            >
              Terms of Service
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
              href="/terms"
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm text-white/60 hover:text-white border-b border-white/5"
            >
              Terms of Service
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
            Privacy <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">Policy</span>
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
            Your privacy matters. This policy explains clearly what data {APP_NAME} collects, why, and how it is protected.{" "}
            <span className="text-white/60 font-medium">We do not sell your data.</span>
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
              transition={{ duration: 0.4, delay: 0.18 + i * 0.04 }}
              className="border-b border-white/[0.05] py-8 last:border-0"
            >
              <p className="text-[11px] font-mono text-violet-400/70 tracking-widest mb-2">
                {section.title.split("—")[0].trim()}
              </p>
              <h2 className="text-sm font-semibold text-white/75 mb-3">
                {section.title.split("—")[1]?.trim()}
              </h2>

              {"content" in section && section.content && (
                <p className="text-white/40 text-sm leading-relaxed">
                  {section.content}
                </p>
              )}

              {"subsections" in section && section.subsections && (
                <div className="space-y-5 mt-1">
                  {section.subsections.map((sub) => (
                    <div key={sub.label} className="pl-4 border-l border-violet-500/20">
                      <p className="text-white/65 text-xs font-mono mb-1.5">{sub.label}</p>
                      <p className="text-white/40 text-sm leading-relaxed">{sub.text}</p>
                    </div>
                  ))}
                </div>
              )}
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
            <Link href="/terms" className="text-xs text-white/25 hover:text-violet-400 transition-colors">
              Terms of Service
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