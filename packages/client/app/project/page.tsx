'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';
import {
  Code2, ArrowLeft, RefreshCw, Copy, Check, Linkedin,
  FileText, Sparkles, ChevronDown, Wand2, Download, Share2, LayoutDashboard
} from 'lucide-react';
import RecentProjects from '../components/project/RecentProjects';
import { useSearchParams } from 'next/navigation';

type Tab = 'linkedin' | 'readme';

type Tone =
  | 'Professional'
  | 'Casual'
  | 'Excited'
  | 'Storytelling'
  | 'Technical';

type Length =
  | 'Short (150 words)'
  | 'Medium (250 words)'
  | 'Long (400 words)';

interface GenerateLinkedinRequest {
  repoUrl: string;
  tone: Tone;
  length: Length;
}

interface GenerateReadmeRequest {
  repoUrl: string;
}

interface GenerateResponse {
  content: string;
}

interface RecentRepo {
  url: string;
  addedAt: number;
}

const TONES: Tone[] = [
  'Professional',
  'Casual',
  'Excited',
  'Storytelling',
  'Technical',
];

const LENGTHS: Length[] = [
  'Short (150 words)',
  'Medium (250 words)',
  'Long (400 words)',
];

export default function Project() {

  const searchParams = useSearchParams();
  const repoUrl = searchParams.get("repo") || '';

  const [activeTab, setActiveTab] = useState<Tab>('linkedin');
  const [linkedinPost, setLinkedinPost] = useState('');
  const [readme, setReadme] = useState('');
  const [loadingTab, setLoadingTab] = useState<Tab | null>(null);
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState<Tone>('Professional');
  const [length, setLength] = useState<Length>('Medium (250 words)');
  const [showToneDropdown, setShowToneDropdown] = useState(false);
  const [showLengthDropdown, setShowLengthDropdown] = useState(false);

  const generateTab = async (tab: Tab) => {
    if(!repoUrl) return;
    setLoadingTab(tab);

    try {
        if(tab === 'linkedin') {
            const result = await generateLinkedinPost({
                repoUrl,
                tone,
                length
            });

            setLinkedinPost(result.content);
        }

        if(tab === 'readme') {
            const result = await generateReadme({repoUrl});
            setReadme(result.content)
        }

        const raw = JSON.parse(localStorage.getItem('recent_repos') || '[]');

        const normalized = raw.map((item: any) => typeof item === 'string' ? { url: item, addedAt: Date.now() } : item);

        const updated = [
            { url: repoUrl, addedAt: Date.now() },
            ...normalized.filter((p: RecentRepo) => p.url !== repoUrl),
        ].slice(0, 20);

        localStorage.setItem('recent_repos', JSON.stringify(updated));
    
    } catch(error) {
        console.error(error);
    }

    setLoadingTab(null);
  };

  useEffect(() => {
    if (repoUrl) generateTab('linkedin');
  }, [repoUrl]);

  async function generateLinkedinPost(data: GenerateLinkedinRequest): Promise<GenerateResponse> {
    const res = await fetch('http://localhost:3001/api/generatePost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if(!res.ok) {
        throw new Error('Failed to generate LinkedIn post');
    }

    return res.json();
  }

  async function generateReadme(data: GenerateReadmeRequest): Promise<GenerateResponse> {
    const res = await fetch('http://localhost:3001/api/generateREADME', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if(!res.ok) {
        throw new Error('Failed to generate README');
    }

    return res.json();
  }

  const handleCopy = () => {
    const content = activeTab === 'linkedin' ? linkedinPost : readme;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = activeTab === 'linkedin' ? linkedinPost : readme;
    const filename = activeTab === 'linkedin' ? 'linkedin-post.txt' : 'README.md';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const repoName = repoUrl.replace('https://github.com/', '').replace('http://github.com/', '');
  const currentContent = activeTab === 'linkedin' ? linkedinPost : readme;
  const isLoadingCurrent = loadingTab === activeTab;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    // Auto-generate if not yet generated for this tab
    if (tab === 'linkedin' && !linkedinPost && loadingTab !== 'linkedin') generateTab('linkedin');
    if (tab === 'readme' && !readme && loadingTab !== 'readme') generateTab('readme');
  };

  return (
    <div className="min-h-screen bg-[#07070f]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-violet-600/6 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 border-b border-white/[0.05] bg-[#07070f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href={createPageUrl('Home')} className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back
            </a>
            <a href={createPageUrl('Dashboard')} className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </a>
            <div className="h-4 w-px bg-white/10" />
            <a href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white/80 font-medium text-sm">codescribe<span className="text-violet-400">.io</span></span>
            </a>
          </div>

          {repoName && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <Code2 className="w-3.5 h-3.5 text-white/30" />
              <span className="text-white/40 text-xs font-mono truncate max-w-[300px]">{repoName}</span>
            </div>
          )}
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-5">
            {/* Options card — only relevant for linkedin tab */}
            {activeTab === 'linkedin' && (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-5">
                <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest">Options</h3>

                {/* Tone */}
                <div className="space-y-2">
                  <label className="text-xs text-white/40">Tone</label>
                  <div className="relative">
                    <button
                      onClick={() => { setShowToneDropdown(!showToneDropdown); setShowLengthDropdown(false); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] text-white/70 text-sm transition-all"
                    >
                      {tone}
                      <ChevronDown className="w-3.5 h-3.5 text-white/30" />
                    </button>
                    {showToneDropdown && (
                      <div className="absolute top-full mt-1 w-full bg-[#0f0f1f] border border-white/10 rounded-xl overflow-hidden z-30 shadow-xl">
                        {TONES.map((t) => (
                          <button
                            key={t}
                            onClick={() => { setTone(t); setShowToneDropdown(false); }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-white/[0.05] ${tone === t ? 'text-violet-400' : 'text-white/60'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Length */}
                <div className="space-y-2">
                  <label className="text-xs text-white/40">Length</label>
                  <div className="relative">
                    <button
                      onClick={() => { setShowLengthDropdown(!showLengthDropdown); setShowToneDropdown(false); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] text-white/70 text-sm transition-all"
                    >
                      {length}
                      <ChevronDown className="w-3.5 h-3.5 text-white/30" />
                    </button>
                    {showLengthDropdown && (
                      <div className="absolute top-full mt-1 w-full bg-[#0f0f1f] border border-white/10 rounded-xl overflow-hidden z-30 shadow-xl">
                        {LENGTHS.map((l) => (
                          <button
                            key={l}
                            onClick={() => { setLength(l); setShowLengthDropdown(false); }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-white/[0.05] ${length === l ? 'text-violet-400' : 'text-white/60'}`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Regenerate */}
            <button
              onClick={() => generateTab(activeTab)}
              disabled={isLoadingCurrent}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/20 text-violet-300 text-sm font-medium transition-all disabled:opacity-50"
            >
              {isLoadingCurrent ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              {isLoadingCurrent ? 'Generating...' : currentContent ? 'Regenerate' : 'Generate'}
            </button>

            <RecentProjects currentRepo={repoUrl} />

            {/* Actions card */}
            {currentContent && (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-3">
                <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest">Actions</h3>

                <button
                  onClick={handleCopy}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08] text-white/50 hover:text-white/80 text-sm transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy to clipboard'}
                </button>

                <button
                  onClick={handleDownload}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08] text-white/50 hover:text-white/80 text-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download file
                </button>

                {activeTab === 'linkedin' && (
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(repoUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-blue-600/10 border border-transparent hover:border-blue-500/20 text-white/50 hover:text-blue-400 text-sm transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    Open LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="min-w-0">
            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/[0.06] rounded-2xl w-fit mb-6">
              <button
                onClick={() => handleTabChange('linkedin')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'linkedin' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-white/40 hover:text-white/60'}`}
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn Post
              </button>
              <button
                onClick={() => handleTabChange('readme')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'readme' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-white/40 hover:text-white/60'}`}
              >
                <FileText className="w-4 h-4" />
                README
              </button>
            </div>

            {/* Editor */}
            <div className="relative">
              <div className="absolute -inset-px bg-gradient-to-r from-violet-600/10 via-transparent to-blue-600/10 rounded-2xl" />
              <div className="relative bg-[#0a0a18] border border-white/[0.07] rounded-2xl overflow-hidden">
                {/* Editor toolbar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                    </div>
                    <span className="text-white/20 text-xs font-mono">
                      {activeTab === 'linkedin' ? 'linkedin-post.txt' : 'README.md'}
                    </span>
                  </div>
                  {currentContent && (
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-white/25 text-xs">AI-generated</span>
                    </div>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isLoadingCurrent ? (
                      <div className="flex flex-col items-center justify-center h-[560px] gap-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-violet-400" />
                          </div>
                          <div className="absolute inset-0 rounded-xl border border-violet-500/30 animate-ping opacity-30" />
                        </div>
                        <p className="text-white/40 text-sm">
                          {activeTab === 'linkedin' ? 'Crafting your LinkedIn post...' : 'Generating README...'}
                        </p>
                      </div>
                    ) : (
                      <textarea
                        value={currentContent}
                        onChange={(e) => activeTab === 'linkedin' ? setLinkedinPost(e.target.value) : setReadme(e.target.value)}
                        className="w-full h-[560px] bg-transparent text-white/80 text-sm leading-relaxed font-mono p-6 resize-none outline-none placeholder:text-white/20"
                        placeholder={`Click "Generate" to create your ${activeTab === 'linkedin' ? 'LinkedIn post' : 'README'}...`}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}