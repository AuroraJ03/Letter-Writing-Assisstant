import React from 'react';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  themeMode?: 'light' | 'dark';
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  themeMode = 'light',
}) => {
  if (!isOpen) return null;

  const isDark = themeMode === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 animate-scale-up border ${
          isDark
            ? 'bg-slate-900/95 border-slate-700/80 text-slate-100'
            : 'bg-white/95 backdrop-blur-xl border-white/80 text-slate-800'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-modal-title"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-xs ${
              isDark
                ? 'bg-rose-950/50 border-rose-900/60 text-rose-400'
                : 'bg-rose-50 border-rose-100 text-rose-600'
            }`}>
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 id="reset-modal-title" className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Reset Conversation?
              </h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Start a fresh session with your peer mentor
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1 rounded-xl transition-colors ${
              isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-white/80'
            }`}
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
          isDark
            ? 'bg-rose-950/30 border-rose-900/50 text-rose-300'
            : 'bg-rose-50/60 border-rose-100/80 text-rose-900'
        }`}>
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            This will clear your entire chat history, empty all parameters inputs, and clear the current outcome draft canvas.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-all active:scale-95 border ${
              isDark
                ? 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700'
                : 'text-slate-600 hover:text-slate-800 bg-white/70 hover:bg-white border-white/80'
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 shadow-md shadow-rose-500/20 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </div>
      </div>
    </div>
  );
};
