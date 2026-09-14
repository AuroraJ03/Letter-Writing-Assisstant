import React from 'react';
import { X, ExternalLink, BookOpen, Check, Bookmark, Sparkles, Moon, Sun } from 'lucide-react';
import { LIGHT_MODE_KNOWLEDGE_BASE, DARK_MODE_KNOWLEDGE_BASE, KnowledgeItem } from '../types';

interface KnowledgeBaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode?: 'light' | 'dark';
}

export const KnowledgeBaseDrawer: React.FC<KnowledgeBaseDrawerProps> = ({
  isOpen,
  onClose,
  themeMode = 'light',
}) => {
  if (!isOpen) return null;

  const isDark = themeMode === 'dark';
  const currentItems: KnowledgeItem[] = isDark ? DARK_MODE_KNOWLEDGE_BASE : LIGHT_MODE_KNOWLEDGE_BASE;
  const alternateItems: KnowledgeItem[] = isDark ? LIGHT_MODE_KNOWLEDGE_BASE : DARK_MODE_KNOWLEDGE_BASE;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-md">
      <div
        className={`w-full max-w-md h-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-200 border-l ${
          isDark
            ? 'bg-slate-900/95 border-slate-700/80 text-slate-100'
            : 'glass-panel-elevated border-white/80 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800 bg-slate-900/80' : 'border-white/60 bg-white/40'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-md ${
                isDark
                  ? 'bg-gradient-to-br from-amber-500 to-indigo-600 text-white shadow-amber-500/20'
                  : 'bg-gradient-to-br from-indigo-600 to-sky-500 text-white shadow-indigo-500/20'
              }`}
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Curated Knowledge Base</h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isDark
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}
                >
                  {isDark ? 'Resignation Mode' : 'Internship Outreach'}
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {isDark
                  ? 'Benchmark standards for formal resignations & transitions'
                  : 'Benchmark guides for graduate internship outreach'}
              </p>
            </div>
          </div>
          <button
            id="close-kb-drawer-btn"
            onClick={onClose}
            className={`p-1.5 rounded-xl transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'text-slate-400 hover:text-slate-700 hover:bg-white/80'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div
            className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed border ${
              isDark
                ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                : 'glass-panel border-indigo-100/70 text-indigo-950'
            }`}
          >
            {isDark ? (
              <div className="flex items-start gap-2">
                <Moon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Active Focus (Dark Mode):</strong> Grounded in formal resignation frameworks, standard two-week notice protocols, relationship preservation, and executive departure etiquette.
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <Sun className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Active Focus (Light Mode):</strong> Grounded in non-deferential cold outreach, recruiter networking, academic lab sponsorship, and ATS alignment.
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
              {isDark ? 'Formal Resignation Knowledge Resources' : 'Outreach & Career Development Resources'}
            </div>
            {currentItems.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block p-4 rounded-2xl border transition-all group active:scale-98 ${
                  isDark
                    ? 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-amber-500/40'
                    : 'glass-panel hover:bg-white/90 border-white/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isDark
                        ? 'bg-amber-400/10 text-amber-300 border-amber-400/25'
                        : 'bg-indigo-50/80 text-indigo-700 border-indigo-100'
                    }`}
                  >
                    {item.category}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors shrink-0" />
                </div>
                <h3
                  className={`text-sm font-bold transition-colors ${
                    isDark
                      ? 'text-slate-100 group-hover:text-amber-300'
                      : 'text-slate-900 group-hover:text-indigo-700'
                  }`}
                >
                  {item.title}
                </h3>
                <p className={`text-xs mt-1 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.description}
                </p>
              </a>
            ))}
          </div>

          {/* Cross-mode knowledge section */}
          <div className="pt-4 border-t border-slate-700/40 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
              {isDark ? 'Also Available: Light Mode (Internship Search)' : 'Also Available: Dark Mode (Full-Time Resignation)'}
            </div>
            {alternateItems.map((item, idx) => (
              <a
                key={`alt-${idx}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block p-3.5 rounded-2xl border opacity-75 hover:opacity-100 transition-all group ${
                  isDark
                    ? 'bg-slate-800/30 hover:bg-slate-800/70 border-slate-800 hover:border-slate-700'
                    : 'bg-white/40 hover:bg-white/80 border-white/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-medium text-slate-400">{item.category}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 shrink-0" />
                </div>
                <h4 className="text-xs font-semibold mt-0.5 text-slate-300 group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h4>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
