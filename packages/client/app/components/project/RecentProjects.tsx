'use client'

import { useEffect, useState } from "react";

interface Repo {
  url: string;
}

export default function RecentProjects({ currentRepo }: { currentRepo: string }) {

  const [recent, setRecent] = useState<Repo[]>([]);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('recent_repos') || '[]');

    const normalized = raw.map((item: any) =>
      typeof item === 'string' ? { url: item } : item
    );

    const filtered = normalized
      .filter((p: Repo) => p.url !== currentRepo)
      .slice(0, 5);

    setRecent(filtered);

  }, [currentRepo]);

  return (
    <div>
      {recent.map((repo, index) => (
        <div key={index}>{repo.url}</div>
      ))}
    </div>
  );
}