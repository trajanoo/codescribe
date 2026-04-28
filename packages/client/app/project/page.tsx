'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';
import {
  Code2, ArrowLeft, RefreshCw, Copy, Check, Linkedin,
  FileText, Sparkles, ChevronDown, Wand2, Download, Share2, Zap
} from 'lucide-react';
import RecentProjects from '../components/project/RecentProjects';
import RedditTab from '../components/project/RedditTab';
import ProfileMenu from '../components/ProfileMenu';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Session } from '@supabase/supabase-js';

type Tab = 'linkedin' | 'readme' | 'reddit';

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

type Language =
  | 'English'
  | 'Portuguese'
  | 'Spanish'
  | 'French'
  | 'German';

interface GenerateLinkedinRequest {
  repoUrl: string;
  tone: Tone;
  length: Length;
  language: Language;
}

interface GenerateReadmeRequest {
  repoUrl: string;
}

interface GenerateResponse {
  content: string;
}

interface RedditPost {
  title: string;
  body: string;
  subreddits: { name: string; members: number; reason?: string }[];
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

const LANGUAGES: Language[] = [
  'English',
  'Portuguese',
  'Spanish',
  'French',
  'German'
];

function ProjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get("repo") || '';

  const [activeTab, setActiveTab] = useState<Tab>('linkedin');
  const [linkedinPost, setLinkedinPost] = useState('');
  const [language, setLanguage] = useState<Language>('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [readme, setReadme] = useState('');
  const [redditPost, setRedditPost] = useState<RedditPost | null>(null);
  const [loadingTab, setLoadingTab] = useState<Tab | null>(null);
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState<Tone>('Professional');
  const [length, setLength] = useState<Length>('Medium (250 words)');
  const [showToneDropdown, setShowToneDropdown] = useState(false);
  const [showLengthDropdown, setShowLengthDropdown] = useState(false);

  useEffect(() => {
    async function getUser() {
      const [{ data }, { data: sessionData }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.auth.getSession(),
      ]);
      setUser(data.user);
      setSession(sessionData.session);

      if (data.user) {
        const { data: creditData } = await supabase
          .from('user_credits')
          .select('balance')
          .eq('user_id', data.user.id)
          .single();
        if (creditData) setBalance((creditData as { balance: number }).balance);
      }
    }

    getUser();
  }, []);

  // Read query params (from modal) and apply them to initial state
  useEffect(() => {
    const typeParam = searchParams.get('type');
    const toneParam = searchParams.get('tone');
    const lengthParam = searchParams.get('length');
    const langParam = searchParams.get('language');

    if (typeParam === 'readme' || typeParam === 'linkedin' || typeParam === 'reddit') {
      setActiveTab(typeParam as Tab);
    }

    if (toneParam && TONES.includes(toneParam as Tone)) {
      setTone(toneParam as Tone);
    }

    if (lengthParam && LENGTHS.includes(lengthParam as Length)) {
      setLength(lengthParam as Length);
    }

    if (langParam && LANGUAGES.includes(langParam as Language)) {
      setLanguage(langParam as Language);
    }
  }, [searchParams]);

  const generateTab = async (tab: Tab) => {
    if (!user) return;
    if (!repoUrl) return;
    if (balance === 0) return;
    setLoadingTab(tab);

    try {
      if (tab === 'linkedin') {
        const result = await generateLinkedinPost({
          repoUrl,
          tone,
          length,
          language
        });

        setLinkedinPost(result.content);
        await fetchBalance(user.id);

        await saveProject({
          repoUrl,
          repoName,
          linkedinPost: result.content
        });
      }

      if (tab === 'readme') {
        const result = await generateReadme({ repoUrl });
        setReadme(result.content);
        await fetchBalance(user.id);

        await saveProject({
          repoUrl,
          repoName,
          readme: result.content
        });
      }

      if (tab === 'reddit') {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch('http://localhost:3001/api/generateReddit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ repoUrl, language }),
        });

        if (res.status === 401) {
          router.push('/auth');
          setLoadingTab(null);
          return;
        }

        if (res.status === 402) {
          toast.error("You're out of credits.");
          router.push('/#pricing');
          setLoadingTab(null);
          return;
        }

        if (!res.ok) throw new Error('Failed to generate Reddit post');
        const data: RedditPost = await res.json();
        setRedditPost(data);
        await fetchBalance(user.id);
        await saveProject({ repoUrl, repoName, redditPost: data });
      }

    } catch (error) {
      console.error(error);
    }

    setLoadingTab(null);
  };

  useEffect(() => {
    if (!repoUrl && !user) return;

    async function init() {
      const exists = await loadProject(repoUrl);

      if (!exists) {
        generateTab(activeTab);
      }
    }

    init();
  }, [repoUrl, user, activeTab]);

  async function generateLinkedinPost(data: GenerateLinkedinRequest): Promise<GenerateResponse> {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('http://localhost:3001/api/generatePost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(data),
    });

    if (res.status === 401) {
      router.push('/auth');
      throw new Error('Unauthorized');
    }

    if (res.status === 402) {
      toast.error("You're out of credits.");
      router.push('/#pricing');
      throw new Error('Insufficient credits');
    }

    if (!res.ok) {
      throw new Error('Failed to generate LinkedIn post');
    }

    return res.json();
  }

  async function loadProject(repoUrl: string) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .eq('repo_url', repoUrl)
      .single();

    if (data) {
      const project = data as {
        linkedin_post?: string;
        readme?: string;
        reddit_post?: string;
      };
      setLinkedinPost(project.linkedin_post || '');
      setReadme(project.readme || '');
      if (project.reddit_post) {
        try { setRedditPost(JSON.parse(project.reddit_post)); } catch {}
      }
      return true;
    }

    return false;
  }

  async function generateReadme(data: GenerateReadmeRequest): Promise<GenerateResponse> {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('http://localhost:3001/api/generateREADME', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(data),
    });

    if (res.status === 401) {
      router.push('/auth');
      throw new Error('Unauthorized');
    }

    if (res.status === 402) {
      toast.error("You're out of credits.");
      router.push('/#pricing');
      throw new Error('Insufficient credits');
    }

    if (!res.ok) {
      throw new Error('Failed to generate README');
    }

    return res.json();
  }

  async function saveProject(data: { repoUrl: string; repoName: string; linkedinPost?: string; readme?: string; redditPost?: RedditPost }) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    await supabase
      .from("projects")
      .upsert({
        user_id: user.id,
        repo_url: data.repoUrl,
        repo_name: data.repoName,
        linkedin_post: data.linkedinPost,
        readme: data.readme,
        ...(data.redditPost !== undefined && { reddit_post: JSON.stringify(data.redditPost) }),
      }, {
        onConflict: "user_id,repo_url"
      });
  }

  async function fetchBalance(userId: string) {
    const { data } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', userId)
      .single();
    if (data) setBalance((data as { balance: number }).balance);
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
  const hasContent = activeTab === 'linkedin' ? !!linkedinPost : activeTab === 'readme' ? !!readme : !!redditPost;
  const isLoadingCurrent = loadingTab === activeTab;
  const isReddit = activeTab === 'reddit';
  const outOfCredits = balance === 0;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'linkedin' && !linkedinPost && loadingTab !== 'linkedin') generateTab('linkedin');
    if (tab === 'readme' && !readme && loadingTab !== 'readme') generateTab('readme');
    if (tab === 'reddit' && !redditPost && loadingTab !== 'reddit') generateTab('reddit');
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

            <div className="h-4 w-px bg-white/10" />
            <a href="/" className="flex items-center gap-2">
              <span className="text-white/80 font-medium text-sm">codescribe<span className="text-violet-400">.ink</span></span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            {repoName && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Code2 className="w-3.5 h-3.5 text-white/30" />
                <span className="text-white/40 text-xs font-mono truncate max-w-[300px]">{repoName}</span>
              </div>
            )}
            <a
              href="/#pricing"
              className={`text-xs font-medium transition-colors ${
                balance === null
                  ? 'text-white/30'
                  : balance === 0
                  ? 'text-red-400'
                  : balance <= 3
                  ? 'text-amber-400'
                  : 'text-white/35'
              }`}
            >
              {balance === null
                ? '⚡ — credits'
                : balance === 0
                ? '⚡ No credits'
                : `⚡ ${balance} credits`}
            </a>
            <ProfileMenu session={session} balance={balance} />
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-5">
            {/* Options card — linkedin: tone + length + language; reddit: language only */}
            {(activeTab === 'linkedin' || activeTab === 'reddit') && (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-5">
                <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest">Options</h3>

                {activeTab === 'linkedin' && (
                  <>
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
                          <div className="absolute cursor-pointer top-full mt-1 w-full bg-[#0f0f1f] border border-white/10 rounded-xl overflow-hidden z-30 shadow-xl">
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
                          <div className="absolute cursor-pointer top-full mt-1 w-full bg-[#0f0f1f] border border-white/10 rounded-xl overflow-hidden z-30 shadow-xl">
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
                  </>
                )}

                {/* Language */}
                <div className="space-y-2">
                  <label className="text-xs text-white/40">Language</label>
                  <div className="relative">
                    <button
                      onClick={() => { setShowLanguageDropdown(!showLanguageDropdown); setShowToneDropdown(false); setShowLengthDropdown(false); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] text-white/70 text-sm transition-all"
                    >
                      {language}
                      <ChevronDown className="w-3.5 h-3.5 text-white/30" />
                    </button>
                    {showLanguageDropdown && (
                      <div className="absolute cursor-pointer top-full mt-1 w-full bg-[#0f0f1f] border border-white/10 rounded-xl overflow-hidden z-30 shadow-xl">
                        {LANGUAGES.map((l) => (
                          <button
                            key={l}
                            onClick={() => { setLanguage(l); setShowLanguageDropdown(false); }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-white/[0.05] ${language === l ? 'text-violet-400' : 'text-white/60'}`}
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

            {/* Credit balance */}
            {balance !== null && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium ${
                balance === 0
                  ? 'border-red-500/20 bg-red-500/5 text-red-400'
                  : balance <= 3
                  ? 'border-amber-500/20 bg-amber-500/5 text-amber-400'
                  : 'border-white/[0.06] bg-white/[0.02] text-white/40'
              }`}>
                <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{balance} credit{balance !== 1 ? 's' : ''} remaining</span>
              </div>
            )}

            {/* Regenerate / No credits */}
            <button
              onClick={() => generateTab(activeTab)}
              disabled={isLoadingCurrent || outOfCredits}
              className={`w-full flex items-center cursor-pointer justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isReddit
                  ? 'bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/20 text-orange-300'
                  : 'bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/20 text-violet-300'
              }`}
            >
              {isLoadingCurrent ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              {isLoadingCurrent ? 'Generating...' : hasContent ? 'Regenerate' : 'Generate'}
            </button>
            {outOfCredits && (
              <p className="text-xs text-white/40 text-center">
                You&apos;re out of credits.{' '}
                <a href="/#pricing" className="text-violet-400 hover:text-violet-300 transition-colors">
                  Get more →
                </a>
              </p>
            )}

            <RecentProjects currentRepo={repoUrl} />
          </div>

          {/* Main content */}
          <div className="min-w-0">
            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/[0.06] rounded-2xl w-fit mb-6">
              <button
                onClick={() => handleTabChange('linkedin')}
                className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'linkedin' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-white/40 hover:text-white/60'}`}
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn Post
              </button>
              <button
                onClick={() => handleTabChange('readme')}
                className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'readme' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-white/40 hover:text-white/60'}`}
              >
                <FileText className="w-4 h-4" />
                README
              </button>
              <button
                onClick={() => handleTabChange('reddit')}
                className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'reddit' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-white/40 hover:text-white/60'}`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
                Reddit
              </button>
            </div>

            { activeTab === 'reddit' && (
              <RedditTab
                post={redditPost}
                onPostChange={setRedditPost}
                isLoading={isLoadingCurrent}
              />
            )}

            {/* Editor */}
            <div className="relative" style={{ display: activeTab === 'reddit' ? 'none' : undefined }}>
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
                  <div className="flex items-center gap-2 ">
                    {currentContent && (
                      <>
                        <button
                          onClick={handleCopy}
                          className="flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.02] border border-transparent hover:border-white/[0.04] text-white/50 hover:text-white/80 text-sm transition-all"
                          aria-label="Copy"
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={handleDownload}
                          className="flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.02] border border-transparent hover:border-white/[0.04] text-white/50 hover:text-white/80 text-sm transition-all"
                          aria-label="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {activeTab === 'linkedin' && (
                          <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(repoUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-blue-600/6 border border-transparent hover:border-blue-500/20 text-white/50 hover:text-blue-400 text-sm transition-all"
                          >
                            <Share2 className="w-4 h-4" />
                          </a>
                        )}
                      </>
                    )}

                    {currentContent && (
                      <div className="flex items-center gap-15 ml-2">
                        <div className='flex items-center gap-2'>
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-white/25 text-xs">AI-generated</span>
                        </div>
                      </div>
                    )}
                  </div>
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

export default function Project() {
  return (
    <Suspense fallback={null}>
      <ProjectContent />
    </Suspense>
  );
}
