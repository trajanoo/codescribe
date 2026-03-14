'use client'

import React, { useEffect, useState } from 'react';
import { Clock, ExternalLink } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Project {
  repo_url: string;
}

const formatName = (url: string) =>
  url.replace('https://github.com/', '').replace('http://github.com/', '');

export default function RecentProjects({ currentRepo }: { currentRepo?: string }) {

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchProjects() {

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) return;

      const { data } = await supabase
        .from('projects')
        .select('repo_url')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) {
        setProjects(data);
      }
    }

    fetchProjects();

  }, []);

  const recent = projects.filter(p => p.repo_url !== currentRepo);

  if (projects.length === 0) return null;

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          Recent Projects
        </h3>

        <Link
  href="/dashboard"
  className="text-xs text-violet-400/70 hover:text-violet-400 transition-colors"
>
  View all
</Link>
      </div>

      <div className="space-y-1">
        {recent.map((project) => (
          <a
            key={project.repo_url}
            href={createPageUrl('Project') + `?repo=${encodeURIComponent(project.repo_url)}`}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] group transition-all"
          >
            <span className="text-white/40 text-xs font-mono truncate flex-1 group-hover:text-white/70 transition-colors">
              {formatName(project.repo_url)}
            </span>

            <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white/40 flex-shrink-0 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}