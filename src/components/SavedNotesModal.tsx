import React from 'react';
import { X, Bookmark, ArrowRight, Trash2, Calendar, FileText, Check } from 'lucide-react';
import { SavedNote } from '../types';

interface SavedNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedNotes: SavedNote[];
  themeMode?: 'light' | 'dark';
  onUseNote: (note: SavedNote) => void;
  onDeleteNote: (id: string) => void;
}

export const SavedNotesModal: React.FC<SavedNotesModalProps> = ({
  isOpen,
  onClose,
  savedNotes,
  themeMode = 'light',
  onUseNote,
  onDeleteNote,
}) => {
  if (!isOpen) return null;

  const isDark = themeMode === 'dark';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`rounded-3xl max-w-2xl w-full overflow-hidden animate-fade-in flex flex-col max-h-[90vh] border ${
        isDark ? 'bg-slate-900/95 border-slate-700/80 text-slate-100 shadow-2xl' : 'glass-panel-elevated text-slate-800'
      }`}>
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          isDark ? 'border-slate-700/70 bg-slate-850' : 'border-white/60 bg-white/40'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shadow-2xs ${
              isDark
                ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                : 'bg-gradient-to-br from-indigo-500/20 to-sky-400/20 border-white text-indigo-600'
            }`}>
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Saved Notes</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Your saved drafts and corresponding parameters
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1 rounded-xl transition-colors ${
              isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-white/80'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3.5">
          {savedNotes.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center justify-center">
              <div className={`w-12 h-12 rounded-2xl border shadow-sm flex items-center justify-center mb-3 ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-white/80 border-white/90 text-slate-400'
              }`}>
                <FileText className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h4 className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>No saved notes yet</h4>
              <p className={`text-[11px] max-w-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                When you draft a letter or note in the Outcome Draft section, click "Save" to keep it here for quick access later.
              </p>
            </div>
          ) : (
            savedNotes.map((note) => {
              const isEmail = (note.parameters?.formAndLength || '').toLowerCase().includes('email');
              const showSubject = isEmail && note.draft?.subject;

              return (
                <div
                  key={note.id}
                  className={`p-4 rounded-2xl flex flex-col gap-3 transition-all border ${
                    isDark
                      ? 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800'
                      : 'glass-panel hover:bg-white/90'
                  }`}
                >
                  {/* Top bar */}
                  <div className={`flex items-start justify-between gap-2 border-b pb-2.5 ${
                    isDark ? 'border-slate-700/60' : 'border-white/60'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                          {note.title || 'Untitled Draft'}
                        </span>
                        {note.parameters?.formAndLength && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            isDark
                              ? 'text-amber-400 bg-slate-700/80 border-slate-600'
                              : 'text-indigo-700 bg-indigo-50/80 border-indigo-100'
                          }`}>
                            {note.parameters.formAndLength}
                          </span>
                        )}
                      </div>
                      <div className={`flex items-center gap-2 text-[10px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(note.savedAt).toLocaleString()}</span>
                        <span>•</span>
                        <span>{note.draft.wordCount || 0} words</span>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => onDeleteNote(note.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-700' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                      }`}
                      title="Delete saved note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Body Preview */}
                  <div className={`text-xs leading-relaxed font-sans p-3 rounded-xl border max-h-32 overflow-y-auto ${
                    isDark ? 'bg-slate-900/60 border-slate-700 text-slate-200' : 'bg-white/40 border-white/80 text-slate-700'
                  }`}>
                    {showSubject && (
                      <div className={`font-semibold mb-1 ${isDark ? 'text-amber-300' : 'text-indigo-950'}`}>
                        Subject: {note.draft.subject}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{note.draft.body}</p>
                  </div>

                  {/* Parameters snapshot tag pills */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                    {note.parameters?.relationship && (
                      <span className={`px-2 py-0.5 rounded-md border ${
                        isDark ? 'bg-slate-700/60 border-slate-600 text-slate-300' : 'bg-white/80 border-white text-slate-600'
                      }`}>
                        {note.parameters.relationship}
                      </span>
                    )}
                    {note.parameters?.desiredOutcome && (
                      <span className={`px-2 py-0.5 rounded-md border ${
                        isDark ? 'bg-slate-700/60 border-slate-600 text-slate-300' : 'bg-white/80 border-white text-slate-600'
                      }`}>
                        {note.parameters.desiredOutcome}
                      </span>
                    )}
                    {note.parameters?.tone && (
                      <span className={`px-2 py-0.5 rounded-md border ${
                        isDark ? 'bg-slate-700/60 border-slate-600 text-slate-300' : 'bg-white/80 border-white text-slate-600'
                      }`}>
                        {note.parameters.tone}
                      </span>
                    )}
                  </div>

                  {/* Card Actions: Use this button */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => onUseNote(note)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95 ${
                        isDark
                          ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-slate-950 font-bold shadow-amber-500/20'
                          : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-indigo-500/20'
                      }`}
                    >
                      <span>Use this</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
