'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, ArrowLeft, Github, Clock, Trash2, ExternalLink, FolderOpen, Plus } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { supabase } from '@/lib/supabase';
import { Timestamp } from 'next/dist/server/lib/cache-handlers/types';
import { sup } from 'framer-motion/client';

interface Project {
    repo_url: string
    created_at: string
  }

const formatName = (url: string) =>
    url.replace('https://github.com/', '').replace('http://github.com/', '');

const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })  
};

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [newUrl, setNewUrl] = useState('');

    useEffect(() => {
        async function fetchProjects() {
            const { data: userData } = await supabase.auth.getUser();
            const user = userData.user

            if (!user) return;

            const { data, error } = await supabase
                .from("projects")
                .select("repo_url, created_at")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })

            if (error) {
                console.error(error)
                return
            }

            if (data) setProjects(data);
        }
        fetchProjects();

    }, []);

    const handleDelete = async (url: string) => {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        if(!user) return;

        const { error } = await supabase
            .from("projects")
            .delete()
            .eq("user_id", user.id)
            .eq("repo_url", url);

        if(error) {
            console.error(error)
            return;
        }

        setProjects((prev) => prev.filter((p) => p.repo_url !== url));
    };

    const handleNew = () => {
        if (!newUrl.trim()) return;
        window.location.href = createPageUrl('Project') + `?repo=${encodeURIComponent(newUrl.trim())}`;
    };

    return (
        <div className="min-h-screen bg-[#07070f]">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 right-1/3 w-[600px] h-[500px] bg-violet-600/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/4 rounded-full blur-[120px]" />
            </div>

            {/* Navbar */}
            <nav className="relative z-20 border-b border-white/[0.05] bg-[#07070f]/80 backdrop-blur-xl">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <a href={createPageUrl('Home')} className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm">
                            <ArrowLeft className="w-4 h-4" />
                            Home
                        </a>
                        <div className="h-4 w-px bg-white/10" />
                        <a href={createPageUrl('Home')} className="flex items-center gap-2">
                            <span className="text-white/80 font-medium text-sm">codescribe<span className="text-violet-400">.io</span></span>
                        </a>
                    </div>
                </div>
            </nav>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
                    <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
                    <p className="text-white/35 text-sm">Your project history</p>
                </motion.div>

                {/* New project input */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="mb-10"
                >
                    <div className="relative flex items-center gap-3 p-2 bg-white/[0.03] border border-white/[0.08] rounded-2xl">
                        <Github className="w-4 h-4 text-white/25 ml-3" />
                        <input
                            type="text"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleNew()}
                            placeholder="Paste a GitHub repository URL to get started..."
                            className="flex-1 bg-transparent text-white placeholder:text-white/25 outline-none text-sm py-2"
                        />
                        <button
                            onClick={handleNew}
                            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Generate
                        </button>
                    </div>
                </motion.div>

                {/* Projects list */}
                {projects.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col items-center justify-center py-24 text-center"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
                            <FolderOpen className="w-7 h-7 text-white/20" />
                        </div>
                        <p className="text-white/30 text-sm">No projects yet. Paste a GitHub URL above to get started.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        {projects.map((project, i) => (
                            <motion.div
                                key={project.repo_url}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                className="group flex items-center gap-4 px-5 py-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.1] rounded-2xl transition-all"
                            >
                                <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                                    <Github className="w-4 h-4 text-white/40" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-white/75 text-sm font-mono truncate group-hover:text-white transition-colors">
                                        {formatName(project.repo_url)}
                                    </p>
                                    {project.created_at && (
                                        <p className="text-white/25 text-xs flex items-center gap-1 mt-0.5">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(project.created_at)}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a
                                        href={createPageUrl('Project') + `?repo=${encodeURIComponent(project.repo_url)}`}
                                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/20 text-violet-300 text-xs font-medium transition-all"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Open
                                    </a>
                                    <button
                                        onClick={() => handleDelete(project.repo_url)}
                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}