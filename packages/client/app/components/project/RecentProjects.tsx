import React from 'react';
import { Clock, ExternalLink } from 'lucide-react';
import { createPageUrl } from '@/utils';

const formatName = (url: string) =>
  url.replace('https://github.com/', '').replace('http://github.com/', '');

export default function RecentProjects({ currentRepo }: { currentRepo: string }) {
  const raw = JSON.parse(localStorage.getItem('recent_repos') || '[]');
  const normalized = raw.map((item) => typeof item === 'string' ? { url: item } : item);
  const recent = normalized.filter((p) => p.url !== currentRepo).slice(0, 5);

  if (recent.length === 0) return null;

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          Recent Projects
        </h3>
        <a href={createPageUrl('Dashboard')} className="text-xs text-violet-400/70 hover:text-violet-400 transition-colors">
          View all
        </a>
      </div>
      <div className="space-y-1">
        {recent.map((project) => (
          <a
            key={project.url}
            href={createPageUrl('Project') + `?repo=${encodeURIComponent(project.url)}`}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] group transition-all"
          >
            <span className="text-white/40 text-xs font-mono truncate flex-1 group-hover:text-white/70 transition-colors">
              {formatName(project.url)}
            </span>
            <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white/40 flex-shrink-0 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}