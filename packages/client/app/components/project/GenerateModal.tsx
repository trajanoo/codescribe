import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Linkedin, FileText, Wand2 } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useRouter } from 'next/navigation';

const CONTENT_TYPES = [
  { id: 'linkedin', label: 'LinkedIn Post', icon: Linkedin, desc: 'Engaging post to share your project' },
  { id: 'readme', label: 'README', icon: FileText, desc: 'Professional documentation file' },
];

const TONES = ['Professional', 'Casual', 'Excited', 'Storytelling', 'Technical'];
const LENGTHS = [
  { id: 'Short (150 words)', label: 'Short', desc: '~150 words' },
  { id: 'Medium (250 words)', label: 'Medium', desc: '~250 words' },
  { id: 'Long (400 words)', label: 'Long', desc: '~400 words' },
];
const LANGUAGES = ['English', 'Portuguese', 'Spanish', 'French', 'German'];

export default function GenerateModal({ repoUrl, onClose}: { repoUrl: string, onClose: () => void }) {
  const router = useRouter();
  const [contentType, setContentType] = useState('linkedin');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Medium (250 words)');
  const [language, setLanguage] = useState('English');


  const handleGenerate = () => {
    const params = new URLSearchParams({
      repo: repoUrl,
      type: contentType,
      tone,
      length,
      language,
    });
    
    router.push(createPageUrl('Project') + '?' + params.toString());
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-[#0d0d1f] border border-white/[0.08] rounded-2xl p-7 shadow-2xl"
        >

          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Wand2 className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-sm">Configure generation</h2>
                <p className="text-white/30 text-xs truncate max-w-[280px]">{repoUrl.replace('https://github.com/', '')}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg cursor-pointer hover:bg-white/[0.05] text-white/30 hover:text-white/60 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs text-white/40 font-medium uppercase tracking-widest block mb-3">Content type</label>
              <div className="grid grid-cols-2 gap-2.5">
                {CONTENT_TYPES.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    onClick={() => setContentType(id)}
                    className={`flex items-start cursor-pointer gap-3 p-3.5 rounded-xl border text-left transition-all ${
                      contentType === id
                        ? 'bg-violet-600/15 border-violet-500/40 text-white'
                        : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:border-white/[0.12] hover:text-white/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">{label}</p>
                      <p className="text-xs opacity-60">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {contentType === 'linkedin' && (
              <div>
                <label className="text-xs text-white/40 font-medium uppercase tracking-widest block mb-3">Tone</label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-3 py-1.5 cursor-pointer rounded-lg text-sm transition-all ${
                        tone === t
                          ? 'bg-violet-600/20 border border-violet-500/40 text-violet-300'
                          : 'bg-white/[0.03] border border-white/[0.07] text-white/40 hover:text-white/60 hover:border-white/[0.14]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {contentType === 'linkedin' && (
              <div>
                <label className="text-xs text-white/40 font-medium uppercase tracking-widest block mb-3">Length</label>
                <div className="grid grid-cols-3 gap-2">
                  {LENGTHS.map(({ id, label, desc }) => (
                    <button
                      key={id}
                      onClick={() => setLength(id)}
                      className={`p-3 rounded-xl cursor-pointer border text-center transition-all ${
                        length === id
                          ? 'bg-violet-600/15 border-violet-500/40 text-white'
                          : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:border-white/[0.12] hover:text-white/60'
                      }`}
                    >
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs opacity-60 mt-0.5">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-white/40 font-medium uppercase tracking-widest block mb-3">Language</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3.5 cursor-pointer py-1.5 rounded-lg text-sm transition-all ${
                      language === lang
                        ? 'bg-violet-600/20 border border-violet-500/40 text-violet-300'
                        : 'bg-white/[0.03] border border-white/[0.07] text-white/40 hover:text-white/60 hover:border-white/[0.14]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="mt-8 cursor-pointer w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
          >
            Generate now
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}