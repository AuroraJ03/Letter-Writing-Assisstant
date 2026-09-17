import React, { useState } from 'react';
import { Copy, Check, Sparkles, SendHorizontal, ThumbsUp, Edit3, User, Bot, CornerDownRight, ArrowUpRight, AlertCircle, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { separateChatAndDraft } from '../utils/draftParser';

interface MessageItemProps {
  message: Message;
  themeMode?: 'light' | 'dark';
  onSendFeedback?: (feedback: string) => void;
  onRetry?: () => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, themeMode = 'light', onSendFeedback, onRetry }) => {
  const isDark = themeMode === 'dark';
  const [copied, setCopied] = useState(false);
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [revisionText, setRevisionText] = useState('');

  const isAssistant = message.role === 'assistant';
  const isError = !!message.isError;

  // Extract draft so we strictly hide the draft from the chat bubble
  const { chatText, hasDraft, extractedDraft } = isAssistant && !isError
    ? separateChatAndDraft(message.content)
    : { chatText: message.content, hasDraft: false, extractedDraft: null };

  // Check if message asks "is this ok?" or variants
  const asksIfOk = isAssistant && !isError && /is this ok\??|does this look ok\??|would this work\??/i.test(message.content);

  const handleCopy = () => {
    navigator.clipboard.writeText(chatText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAffirmative = () => {
    if (onSendFeedback) {
      onSendFeedback("Yes, this looks great and meets my goals! Please share your suggested next steps and tips for future reference without rewriting it.");
    }
  };

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionText.trim()) return;
    if (onSendFeedback) {
      onSendFeedback(revisionText.trim());
      setRevisionText('');
      setShowRevisionInput(false);
    }
  };

  const handleRevisionChip = (chip: string) => {
    if (onSendFeedback) {
      onSendFeedback(chip);
    }
  };

  const userRoleLabel = isDark ? 'Resigning Professional (You)' : 'Graduate Student (You)';

  return (
    <div
      className={`py-4 px-4 sm:px-5 flex gap-3.5 transition-colors rounded-2xl m-1 ${
        isDark
          ? isAssistant
            ? 'bg-slate-800/85 border border-slate-700/80 shadow-md text-slate-200'
            : 'bg-slate-800/40 border border-slate-700/50 text-slate-300'
          : isAssistant
            ? 'bg-white/45 backdrop-blur-md border border-white/70 shadow-2xs text-slate-800'
            : 'bg-indigo-50/40 backdrop-blur-xs text-slate-800'
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0 pt-0.5">
        {isAssistant ? (
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${
              isDark
                ? 'bg-gradient-to-br from-amber-600 to-amber-500 text-slate-950 shadow-amber-500/20 font-bold'
                : 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-indigo-500/25'
            }`}
          >
            <Bot className="w-4 h-4" />
          </div>
        ) : (
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-semibold text-xs shadow-2xs border ${
              isDark
                ? 'bg-slate-750 border-slate-700 text-amber-400'
                : 'bg-white/90 border-white text-indigo-700'
            }`}
          >
            <User className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {isAssistant ? 'Peer Career Advisor' : userRoleLabel}
            </span>
            {isAssistant && (
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-amber-950/60 text-amber-400 border-amber-800/50'
                    : 'bg-white/80 text-indigo-700 border-indigo-100/80 shadow-2xs'
                }`}
              >
                Senior Peer
              </span>
            )}
            <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={`text-xs flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-slate-400 hover:text-slate-700 hover:bg-white/80'
            }`}
            title="Copy message"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px] text-emerald-500 font-semibold">Copied</span>
              </>
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Message Content */}
        {isError ? (
          <div className={`p-3 border rounded-xl text-xs space-y-2 ${
            isDark ? 'bg-amber-950/30 border-amber-900/60 text-amber-300' : 'bg-amber-50/90 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{message.content}</div>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Request</span>
              </button>
            )}
          </div>
        ) : (
          <div
            className={`text-xs sm:text-sm leading-relaxed font-sans max-w-none ${
              isDark
                ? 'prose prose-invert prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 text-slate-200'
                : 'prose prose-slate prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 text-slate-800'
            }`}
          >
            <ReactMarkdown>{chatText}</ReactMarkdown>
          </div>
        )}

        {/* If assistant emitted a draft, show an informative banner pointing to the Outcome Draft view */}
        {hasDraft && (
          <div
            className={`mt-2.5 p-3 rounded-xl border flex items-center justify-between gap-2 shadow-2xs ${
              isDark
                ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                : 'bg-gradient-to-r from-indigo-50/90 to-purple-50/90 border-indigo-100 text-indigo-950'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-medium">
              <Sparkles className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-indigo-600'}`} />
              <span>Draft updated in <strong>The Outcome Draft</strong> panel.</span>
            </div>
            <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${isDark ? 'text-amber-400' : 'text-indigo-600'}`}>
              Look right <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        )}

        {/* Assistant Interaction Loop: "is this ok?" hot triggers */}
        {asksIfOk && !isError && (
          <div className={`pt-2 border-t flex flex-wrap items-center gap-2 ${
            isDark ? 'border-slate-700/60' : 'border-indigo-100/50'
          }`}>
            <button
              onClick={handleAffirmative}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95 ${
                isDark
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-slate-950 font-bold shadow-amber-500/20'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-indigo-500/20'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Yes, this looks great!</span>
            </button>

            <button
              onClick={() => setShowRevisionInput(!showRevisionInput)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 ${
                isDark
                  ? 'bg-slate-750 hover:bg-slate-700 border-slate-600 text-slate-200'
                  : 'bg-white/80 hover:bg-white border-white text-slate-700'
              }`}
            >
              <Edit3 className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-indigo-600'}`} />
              <span>I need revisions</span>
            </button>

            {/* Quick revision pills */}
            <button
              onClick={() => handleRevisionChip(isDark ? "Make it more concise and focused strictly on handover." : "Make it shorter and more concise (target ~80-100 words).")}
              className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition-all active:scale-95 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-white/70 hover:bg-white text-slate-600 hover:text-indigo-700 border-white'
              }`}
            >
              {isDark ? 'Focus on handover' : 'Shorter'}
            </button>

            <button
              onClick={() => handleRevisionChip(isDark ? "Ensure tone is executive, grateful, and bridge-building." : "Tone down deferential phrases, sound like an equal peer.")}
              className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition-all active:scale-95 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-white/70 hover:bg-white text-slate-600 hover:text-indigo-700 border-white'
              }`}
            >
              {isDark ? 'Diplomatic & grateful' : 'Less deferential'}
            </button>
          </div>
        )}

        {/* Custom revision feedback form */}
        {showRevisionInput && (
          <form onSubmit={handleRevisionSubmit} className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={revisionText}
              onChange={(e) => setRevisionText(e.target.value)}
              placeholder={isDark ? "e.g., Emphasize smooth transition of project deliverables..." : "e.g., Make the opening punchier, mention my ML project..."}
              className={`flex-1 px-3 py-1.5 text-xs rounded-xl outline-none focus:ring-2 border ${
                isDark
                  ? 'bg-slate-850 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-amber-500/30'
                  : 'glass-input text-slate-900 focus:ring-indigo-100'
              }`}
              autoFocus
            />
            <button
              type="submit"
              disabled={!revisionText.trim()}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-40 ${
                isDark
                  ? 'bg-amber-600 hover:bg-amber-700 text-slate-950 font-bold'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <span>Send</span>
              <SendHorizontal className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
