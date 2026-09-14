import React from 'react';
import { X, CheckCircle2, ShieldAlert, Sparkles, BookOpen, UserCheck, MessageSquareQuote, FileText } from 'lucide-react';

interface SystemInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode?: 'light' | 'dark';
}

export const SystemInstructionsModal: React.FC<SystemInstructionsModalProps> = ({
  isOpen,
  onClose,
  themeMode = 'light',
}) => {
  if (!isOpen) return null;

  const isDark = themeMode === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <div className={`rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 border ${
        isDark 
          ? 'bg-slate-900/95 border-slate-700/80 text-slate-200' 
          : 'glass-panel-elevated bg-white/95 border-white/60 text-slate-700'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-slate-700/70 bg-slate-850' : 'border-white/60 bg-white/40'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-md ${
              isDark
                ? 'bg-gradient-to-br from-amber-600 to-amber-500 text-slate-950 shadow-amber-500/20'
                : 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-indigo-500/20'
            }`}>
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-base font-bold leading-none ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Active System Instructions
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                  isDark
                    ? 'bg-amber-950/70 text-amber-400 border-amber-800/60'
                    : 'bg-indigo-100/70 text-indigo-700 border-indigo-200/50'
                }`}>
                  {isDark ? 'Dark Mode (Resignation)' : 'Light Mode (Outreach & Internships)'}
                </span>
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Peer Career Advisor/Mentor with Professional Experience
              </p>
            </div>
          </div>
          <button
            id="close-system-modal-btn"
            onClick={onClose}
            className={`p-1.5 rounded-xl transition-colors ${
              isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-white/80'
            }`}
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className={`p-6 overflow-y-auto space-y-6 text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {/* Role & Purpose */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-slate-800/60 border-amber-500/20' : 'glass-panel border-indigo-100/70'
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                isDark ? 'text-amber-400' : 'text-indigo-700'
              }`}>
                Role Name
              </span>
              <p className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Peer Career Advisor/Mentor with Professional Experience
              </p>
            </div>
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-slate-800/60 border-slate-700' : 'glass-panel border-slate-200/60'
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Engagement Context
              </span>
              <p className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {isDark
                  ? 'The user has worked full time and decided to resign.'
                  : 'Graduate student seeking professional mentorship & guidance on finding internships.'}
              </p>
            </div>
          </div>

          {/* Purpose */}
          <div className={`space-y-1.5 p-4 rounded-2xl border ${
            isDark ? 'bg-slate-800/50 border-slate-700/80' : 'glass-panel border-slate-200/60'
          }`}>
            <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              <Sparkles className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-indigo-600'}`} />
              Core Purpose & Output
            </h3>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {isDark
                ? 'Act as a guide or peer mentor in a professional context. Produce a formal, polished draft of a resignation letter or transition email, ask "is this ok?", and provide future reference tips and offboarding next steps once confirmed.'
                : 'Act as a guide or peer mentor in a professional context. Produce a draft of a professional-sounding reach-out letter/message/email, ask "is this ok?", and provide future reference tips and outreach next steps once confirmed.'}
            </p>
          </div>

          {/* Behavioral Rules */}
          <div className="space-y-3">
            <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              <CheckCircle2 className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-emerald-600'}`} />
              Key Behavioral Rules
            </h3>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <div className={`p-3 rounded-xl flex items-start gap-2 border ${isDark ? 'bg-slate-800/40 border-slate-700/70' : 'glass-panel'}`}>
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isDark ? 'bg-amber-400' : 'bg-indigo-500'}`} />
                <span>Professional tone — acts as a sounding board with judgment & experience</span>
              </div>
              <div className={`p-3 rounded-xl flex items-start gap-2 border ${isDark ? 'bg-slate-800/40 border-slate-700/70' : 'glass-panel'}`}>
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isDark ? 'bg-amber-400' : 'bg-indigo-500'}`} />
                <span>Shows empathy without focusing or diving too deeply into emotions</span>
              </div>
              <div className={`p-3 rounded-xl flex items-start gap-2 border ${isDark ? 'bg-slate-800/40 border-slate-700/70' : 'glass-panel'}`}>
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isDark ? 'bg-amber-400' : 'bg-indigo-500'}`} />
                <span>Identifies context by asking clarifying questions for missing information</span>
              </div>
              <div className={`p-3 rounded-xl flex items-start gap-2 border ${isDark ? 'bg-slate-800/40 border-slate-700/70' : 'glass-panel'}`}>
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isDark ? 'bg-amber-400' : 'bg-indigo-500'}`} />
                <span>Avoids extremely deferential tones when drafting {isDark ? 'resignation letters' : 'reach-outs'}</span>
              </div>
              <div className={`p-3 rounded-xl flex items-start gap-2 border sm:col-span-2 ${isDark ? 'bg-slate-800/40 border-slate-700/70' : 'glass-panel'}`}>
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isDark ? 'bg-amber-400' : 'bg-indigo-500'}`} />
                <span>Respectful to the user, but critical & judgmental on uploaded materials</span>
              </div>
            </div>
          </div>

          {/* Strict Boundaries & Does Not Do */}
          <div className="space-y-3">
            <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              Boundaries & Prohibitions
            </h3>
            <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
              isDark ? 'bg-rose-950/20 border-rose-900/40 text-slate-300' : 'glass-panel bg-rose-50/30 border-rose-100/60 text-slate-600'
            }`}>
              <p>• <strong>No Assumptions:</strong> Uses placeholder text [name] for unknown variables instead of assuming.</p>
              <p>• <strong>No Excessive Deference:</strong> Refuses self-diminishing apologies or submissive phrases.</p>
              <p>• <strong>No Invented Excuses:</strong> Does not fabricate false explanations to make departures or messages more sympathetic.</p>
              <p>• <strong>No False Physicality:</strong> Never claims human physical sensations or emotional sentience.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-3.5 border-t flex justify-end ${
          isDark ? 'border-slate-700/70 bg-slate-850' : 'border-white/60 bg-white/40'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95 ${
              isDark
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-slate-950 font-bold shadow-amber-500/20'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-indigo-500/20'
            }`}
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
