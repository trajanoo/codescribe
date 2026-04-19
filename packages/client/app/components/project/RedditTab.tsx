import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Check, ExternalLink, Users } from 'lucide-react';

interface Subreddit {
  name: string;
  members: number;
  reason?: string;
}

interface RedditPost {
  title: string;
  body: string;
  subreddits: Subreddit[];
}

interface Props {
  post: RedditPost | null;
  onPostChange: (post: RedditPost) => void;
  isLoading: boolean;
}

function formatMembers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

export default function RedditTab({ post, onPostChange, isLoading }: Props) {
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  const handleCopyTitle = () => {
    if (!post) return;
    navigator.clipboard.writeText(post.title);
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  const handleCopyBody = () => {
    if (!post) return;
    navigator.clipboard.writeText(post.body);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[560px] gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-orange-400" />
          </div>
          <div className="absolute inset-0 rounded-xl border border-orange-500/30 animate-ping opacity-30" />
        </div>
        <p className="text-white/40 text-sm">Crafting your Reddit post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-[560px] gap-4">
        <p className="text-white/30 text-sm">Click Generate to create your Reddit post.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-6">
      {/* Title */}
      <div className="relative">
        <div className="absolute -inset-px bg-gradient-to-r from-orange-600/8 via-transparent to-orange-600/8 rounded-2xl" />
        <div className="relative bg-[#0a0a18] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
            <span className="text-white/20 text-xs font-mono">title</span>
            <button
              onClick={handleCopyTitle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] text-white/40 hover:text-white/70 text-xs transition-all"
            >
              {copiedTitle ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedTitle ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="px-5 py-4 text-white/80 text-sm leading-relaxed">{post.title}</p>
        </div>
      </div>

      {/* Body */}
      <div className="relative">
        <div className="absolute -inset-px bg-gradient-to-r from-orange-600/8 via-transparent to-orange-600/8 rounded-2xl" />
        <div className="relative bg-[#0a0a18] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <span className="text-white/20 text-xs font-mono">reddit-post.txt</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                <span className="text-white/25 text-xs">AI-generated · edit freely</span>
              </div>
              <button
                onClick={handleCopyBody}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] text-white/40 hover:text-white/70 text-xs transition-all"
              >
                {copiedBody ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedBody ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <textarea
            value={post.body}
            onChange={(e) => onPostChange({ ...post, body: e.target.value })}
            className="w-full h-64 bg-transparent text-white/80 text-sm leading-relaxed p-6 resize-none outline-none"
          />
        </div>
      </div>

      {/* Subreddits */}
      {post.subreddits.length > 0 && (
        <div>
          <h3 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
            <Users className="w-3.5 h-3.5" />
            Suggested Communities
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {post.subreddits.map((sub) => (
              <a
                key={sub.name}
                href={`https://reddit.com/r/${sub.name.replace(/^r\//, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-orange-500/20 rounded-xl transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-400 text-xs font-bold">r/</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors truncate">
                      {sub.name.startsWith('r/') ? sub.name : `r/${sub.name}`}
                    </span>
                    <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white/40 flex-shrink-0 transition-colors" />
                  </div>
                  {sub.members != null && (
                    <p className="text-white/25 text-xs mt-0.5">{formatMembers(sub.members)} members</p>
                  )}
                  {sub.reason && (
                    <p className="text-white/30 text-xs mt-1 leading-relaxed">{sub.reason}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
