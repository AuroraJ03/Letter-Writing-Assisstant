import React, { useState, useEffect } from 'react';
import { Copy, Check, Edit2, ThumbsUp, Sparkles, FileText, Bookmark, BookmarkCheck } from 'lucide-react';
import { OutcomeDraft } from '../types';

interface OutcomeDraftViewProps {
  draft: OutcomeDraft | null;
  formAndLength?: string;
  themeMode?: 'light' | 'dark';
  onQuickRevision: (instruction: string) => void;
  onAcceptDraft: () => void;
  onSaveDraftNote: () => void;
  onUpdateDraft?: (updated: OutcomeDraft) => void;
}

export const OutcomeDraftView: React.FC<OutcomeDraftViewProps> = ({
  draft,
  formAndLength,
  themeMode = 'light',
  onQuickRevision,
  onAcceptDraft,
  onSaveDraftNote,
  onUpdateDraft,
}) => {
  const isDark = themeMode === 'dark';
  const [copied, setCopied] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editSubject, setEditSubject] = useState(draft?.subject || '');
  const [editBody, setEditBody] = useState(draft?.body || '');

  // Keep local edit state in sync when draft changes
  useEffect(() => {
    if (draft) {
      setEditSubject(draft.subject);
      setEditBody(draft.body);
    }
  }, [draft]);

  // 5. 如果用户input了这个draft的form是非email的任何别的，draft不需要有subject line。
  const activeForm = (formAndLength || draft?.formAndLength || '').toLowerCase();
  // Is it an email? "email (short)" or "email (standard)" or "email"
  const isEmail = activeForm.includes('email');
  // If activeForm is empty, only show subject if draft specifically has a real subject and doesn't explicitly declare non-email
  const showSubjectLine = isEmail || (!activeForm && Boolean(draft?.subject && draft.subject.trim()));

  const handleCopy = () => {
    if (!draft) return;
    const textToCopy = showSubjectLine && draft.subject.trim()
      ? `Subject: ${draft.subject}\n\n${draft.body}`
      : draft.body;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveClick = () => {
    if (!draft) return;
    onSaveDraftNote();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2200);
  };

  const handleSaveEdit = () => {
    if (onUpdateDraft && draft) {
      const words = editBody.trim().split(/\s+/).filter(Boolean).length;
      onUpdateDraft({
        ...draft,
        subject: editSubject,
        body: editBody,
        wordCount: words,
        lastUpdated: Date.now(),
      });
    }
    setIsEditing(false);
  };

  // Highlights brackets like [Name], [Company], [Role]
  const renderHighlightedBody = (content: string) => {
    const parts = content.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span
            key={index}
            className="bg-indigo-100/70 text-indigo-800 font-semibold px-1.5 py-0.5 rounded-lg border border-indigo-200 font-mono text-[13px] shadow-2xs inline-block"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div
      className={`flex flex-col rounded-3xl p-4 sm:p-5 transition-all duration-300 relative overflow-hidden border ${
        isDark
          ? 'bg-slate-900/80 border-slate-800/80 shadow-2xl shadow-slate-950/40 text-slate-100'
          : 'glass-panel-elevated text-slate-900'
      } ${
        draft
          ? 'min-h-[420px] max-h-none h-auto'
          : 'h-[40vh] min-h-[260px]'
      }`}
    >
      {/* Background Liquid Light Accent in Top Right */}
      <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-2xl pointer-events-none ${
        isDark ? 'bg-amber-500/10' : 'bg-gradient-to-br from-indigo-300/30 to-purple-200/20'
      }`} />

      {/* Column Title */}
      <div className="flex items-center justify-between pb-3 px-1 relative z-10">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full shadow-xs ${
            isDark ? 'bg-amber-500 shadow-amber-400/50' : 'bg-indigo-500 shadow-indigo-400/50'
          }`} />
          <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            {isDark ? 'The Resignation Draft' : 'The Outcome Draft'}
          </h2>
        </div>

        {draft && (
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shadow-2xs ${
              isDark
                ? 'text-amber-400 bg-slate-800/90 border-slate-700'
                : 'text-indigo-700 bg-white/80 border-white/90'
            }`}>
              {draft.wordCount} words
            </span>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`text-xs px-3 py-1 rounded-xl border shadow-2xs flex items-center gap-1.5 font-semibold transition-all active:scale-95 ${
                isDark
                  ? 'text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 border-slate-700'
                  : 'text-slate-700 hover:text-slate-900 bg-white/80 hover:bg-white border-white/90'
              }`}
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-400 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Save to Saved Notes */}
            <button
              onClick={handleSaveClick}
              className={`text-xs px-3 py-1 rounded-xl border shadow-2xs flex items-center gap-1.5 font-semibold transition-all active:scale-95 ${
                savedToast
                  ? isDark
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : isDark
                    ? 'text-amber-400 hover:text-amber-300 bg-slate-800/90 hover:bg-slate-700 border-slate-700'
                    : 'text-indigo-700 hover:text-indigo-900 bg-white/80 hover:bg-white border-white/90'
              }`}
              title="Save to Saved Notes"
            >
              {savedToast ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Bookmark className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-indigo-600'}`} />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Main Draft Canvas Area */}
      <div className={`flex-1 rounded-2xl overflow-hidden flex flex-col min-h-0 relative z-10 border ${
        isDark ? 'glass-panel border-slate-700/80 bg-slate-900/60' : 'glass-panel'
      }`}>
        {draft ? (
          <div className={`p-5 sm:p-6 flex flex-col backdrop-blur-md ${
            isDark ? 'bg-slate-850/80' : 'bg-white/70'
          }`}>
            {/* Subject Header (Only shown if format is email or unspecified) */}
            {showSubjectLine ? (
              <div className={`pb-4 mb-4 border-b flex items-start justify-between gap-3 ${
                isDark ? 'border-slate-700/70' : 'border-indigo-100/60'
              }`}>
                <div className="flex-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                    isDark ? 'text-amber-400/90' : 'text-indigo-600/90'
                  }`}>
                    Subject Line
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      className={`w-full text-sm font-semibold glass-input rounded-xl px-3 py-1.5 outline-none ${
                        isDark 
                          ? 'text-slate-100 focus:ring-2 focus:ring-amber-500/30' 
                          : 'text-slate-900 focus:ring-2 focus:ring-indigo-200'
                      }`}
                    />
                  ) : (
                    <h3 className={`text-sm sm:text-base font-semibold leading-snug ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      {draft.subject || (isDark ? 'Resignation Notice - [Your Name]' : 'Reaching out regarding internship opportunity')}
                    </h3>
                  )}
                </div>
                <button
                  onClick={() => (isEditing ? handleSaveEdit() : setIsEditing(true))}
                  className={`text-xs font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg border shadow-2xs transition-all shrink-0 active:scale-95 ${
                    isDark
                      ? 'text-amber-400 hover:text-amber-300 bg-slate-800 hover:bg-slate-700 border-slate-700'
                      : 'text-indigo-600 hover:text-indigo-800 bg-white/80 hover:bg-white border-white/90'
                  }`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>
            ) : (
              /* Non-email header bar with edit button */
              <div className={`pb-3 mb-3 border-b flex items-center justify-between ${
                isDark ? 'border-slate-700/70' : 'border-indigo-100/60'
              }`}>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                  isDark
                    ? 'text-amber-400 bg-slate-800 border-slate-700'
                    : 'text-indigo-700 bg-indigo-50/80 border-indigo-100'
                }`}>
                  {formAndLength || (isDark ? 'Formal Resignation Document' : 'Message')}
                </span>
                <button
                  onClick={() => (isEditing ? handleSaveEdit() : setIsEditing(true))}
                  className={`text-xs font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg border shadow-2xs transition-all shrink-0 active:scale-95 ${
                    isDark
                      ? 'text-amber-400 hover:text-amber-300 bg-slate-800 hover:bg-slate-700 border-slate-700'
                      : 'text-indigo-600 hover:text-indigo-800 bg-white/80 hover:bg-white border-white/90'
                  }`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>
            )}

            {/* Email / Note Body */}
            <div className={`text-sm leading-relaxed font-sans whitespace-pre-wrap ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}>
              {isEditing ? (
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={10}
                  className={`w-full text-sm glass-input rounded-xl p-3.5 font-mono text-xs outline-none resize-y leading-relaxed shadow-inner ${
                    isDark
                      ? 'text-slate-100 focus:ring-2 focus:ring-amber-500/30'
                      : 'text-slate-800 focus:ring-2 focus:ring-indigo-200'
                  }`}
                />
              ) : (
                renderHighlightedBody(draft.body)
              )}
            </div>

            {/* Acceptance / Next steps prompt card */}
            <div className={`mt-5 pt-3 border-t flex flex-wrap items-center justify-between gap-2.5 p-3.5 rounded-2xl border shadow-2xs ${
              isDark
                ? 'border-slate-700/80 bg-slate-900/80 border-amber-500/20'
                : 'border-indigo-100/60 bg-gradient-to-r from-indigo-50/80 via-white/80 to-purple-50/80 border-indigo-200/50'
            }`}>
              <div className={`flex items-center gap-2 text-xs font-semibold ${
                isDark ? 'text-slate-200' : 'text-indigo-950'
              }`}>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shadow-xs ${
                  isDark ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-indigo-600 text-white'
                }`}>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>{isDark ? 'Is this resignation draft ok?' : 'Happy with this draft letter?'}</span>
              </div>
              <button
                onClick={onAcceptDraft}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95 ${
                  isDark
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-slate-950 font-bold shadow-amber-500/20'
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-indigo-500/20'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                {isDark ? 'Looks Good - Unlock Offboarding Tips' : 'Accept & Unlock Next Steps'}
              </button>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className={`flex-1 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm ${
            isDark ? 'bg-slate-900/40' : 'bg-white/40'
          }`}>
            <div className={`w-14 h-14 rounded-2xl border shadow-md flex items-center justify-center mb-3 relative ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-amber-400 shadow-amber-500/10'
                : 'bg-white/80 border-white/90 text-indigo-600 shadow-indigo-500/10'
            }`}>
              <FileText className="w-6 h-6 stroke-[1.6] relative z-10" />
            </div>
            <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {isDark ? 'Resignation Letter Canvas' : 'Outcome Draft Canvas'}
            </h3>
            <p className={`text-xs max-w-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {isDark
                ? 'Your formal resignation letter or transition document will appear here once you discuss and calibrate with your mentor.'
                : 'Your generated reach-out letter or LinkedIn note will appear here once you discuss and calibrate with your advisor.'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Area: Quick revisions */}
      <div className="pt-3 px-1 relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Quick revisions:
          </span>
          {isDark ? (
            <>
              <button
                type="button"
                disabled={!draft}
                onClick={() => onQuickRevision('Make the resignation letter more concise and direct (1-2 crisp paragraphs).')}
                className={`px-3 py-1 rounded-full text-xs font-medium border shadow-2xs transition-all active:scale-95 disabled:opacity-40 ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border-slate-700'
                    : 'bg-white/70 hover:bg-white text-slate-700 hover:text-indigo-700 border-white/80'
                }`}
              >
                More Concise
              </button>
              <button
                type="button"
                disabled={!draft}
                onClick={() => onQuickRevision('Emphasize a seamless knowledge transfer, handover documentation, and training my successor.')}
                className={`px-3 py-1 rounded-full text-xs font-medium border shadow-2xs transition-all active:scale-95 disabled:opacity-40 ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border-slate-700'
                    : 'bg-white/70 hover:bg-white text-slate-700 hover:text-indigo-700 border-white/80'
                }`}
              >
                Focus on Handover
              </button>
              <button
                type="button"
                disabled={!draft}
                onClick={() => onQuickRevision('Ensure tone is strictly neutral, objective, and non-apologetic while expressing professional gratitude.')}
                className={`px-3 py-1 rounded-full text-xs font-medium border shadow-2xs transition-all active:scale-95 disabled:opacity-40 ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border-slate-700'
                    : 'bg-white/70 hover:bg-white text-slate-700 hover:text-indigo-700 border-white/80'
                }`}
              >
                Neutral & Non-Apologetic
              </button>
              <button
                type="button"
                disabled={!draft}
                onClick={() => onQuickRevision('Include personal contact information (LinkedIn & email) for keeping in touch post-departure.')}
                className={`px-3 py-1 rounded-full text-xs font-medium border shadow-2xs transition-all active:scale-95 disabled:opacity-40 ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border-slate-700'
                    : 'bg-white/70 hover:bg-white text-slate-700 hover:text-indigo-700 border-white/80'
                }`}
              >
                Add Personal Contact
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled={!draft}
                onClick={() => onQuickRevision('Make the draft shorter and more concise (target ~80-100 words).')}
                className="px-3 py-1 rounded-full bg-white/70 hover:bg-white disabled:opacity-40 disabled:hover:bg-white/70 border border-white/80 text-xs font-medium text-slate-700 hover:text-indigo-700 shadow-2xs transition-all active:scale-95"
              >
                Shorter
              </button>
              <button
                type="button"
                disabled={!draft}
                onClick={() => onQuickRevision('Tone down any deferential or apologetic phrases. Make me sound like an equal, confident graduate peer.')}
                className="px-3 py-1 rounded-full bg-white/70 hover:bg-white disabled:opacity-40 disabled:hover:bg-white/70 border border-white/80 text-xs font-medium text-slate-700 hover:text-indigo-700 shadow-2xs transition-all active:scale-95"
              >
                Less Deferential
              </button>
              <button
                type="button"
                disabled={!draft}
                onClick={() => onQuickRevision('Adjust the tone to be warmer and more conversational while remaining fully professional.')}
                className="px-3 py-1 rounded-full bg-white/70 hover:bg-white disabled:opacity-40 disabled:hover:bg-white/70 border border-white/80 text-xs font-medium text-slate-700 hover:text-indigo-700 shadow-2xs transition-all active:scale-95"
              >
                Warmer
              </button>
              <button
                type="button"
                disabled={!draft}
                onClick={() => onQuickRevision('Put the ball clearly in their court with a low-friction, concrete ask and explicit flexibility.')}
                className="px-3 py-1 rounded-full bg-white/70 hover:bg-white disabled:opacity-40 disabled:hover:bg-white/70 border border-white/80 text-xs font-medium text-slate-700 hover:text-indigo-700 shadow-2xs transition-all active:scale-95"
              >
                Ball in their court
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
