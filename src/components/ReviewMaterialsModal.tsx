import React, { useState } from 'react';
import { X, SendHorizontal, AlertCircle, FileCheck, Sparkles } from 'lucide-react';

interface ReviewMaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formattedPrompt: string) => void;
}

export const ReviewMaterialsModal: React.FC<ReviewMaterialsModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [materialType, setMaterialType] = useState<'draft' | 'resume' | 'portfolio'>('draft');
  const [content, setContent] = useState('');
  const [recipientContext, setRecipientContext] = useState('');
  const [specificConcern, setSpecificConcern] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    let typeLabel = 'Draft Outreach Email';
    if (materialType === 'resume') typeLabel = 'Resume Bullet Points / Experience Excerpt';
    if (materialType === 'portfolio') typeLabel = 'Portfolio / Project Pitch Description';

    const prompt = `Please critically evaluate the following ${typeLabel} I've prepared for internship outreach. Give me honest, rigorous feedback on tone, clarity, and effectiveness, point out any weak or overly deferential language, and provide an improved draft if applicable.

**Target Recipient / Context:**
${recipientContext.trim() || 'Internship hiring manager or industry peer'}

**My specific concerns or questions:**
${specificConcern.trim() || 'Is it too humble or wordy? Does it showcase value directly?'}

**Material to Review:**
\`\`\`
${content.trim()}
\`\`\``;

    onSubmit(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Critical Material Review</h2>
              <p className="text-xs text-slate-500">Get honest, unsparing peer feedback on your draft, resume blurb, or portfolio</p>
            </div>
          </div>
          <button
            id="close-review-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
          {/* Material Type Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Material Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMaterialType('draft')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                  materialType === 'draft'
                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Draft Message / Email
              </button>
              <button
                type="button"
                onClick={() => setMaterialType('resume')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                  materialType === 'resume'
                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Resume Bullet Points
              </button>
              <button
                type="button"
                onClick={() => setMaterialType('portfolio')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                  materialType === 'portfolio'
                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Project / Portfolio Pitch
              </button>
            </div>
          </div>

          {/* Context of Recipient */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Recipient & Internship Goal
            </label>
            <input
              type="text"
              placeholder="e.g. Cold email to a Tech Lead at Stripe for a Software Engineering Intern position"
              value={recipientContext}
              onChange={(e) => setRecipientContext(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs sm:text-sm focus:border-amber-500 outline-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Paste Your Material <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your drafted text, subject line, or resume excerpt here..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-mono resize-none"
              required
            />
          </div>

          {/* Specific concerns */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              What do you feel most unsure about? (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Sounds too apologetic, worried it's too long, or unsure if the call to action is clear"
              value={specificConcern}
              onChange={(e) => setSpecificConcern(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs sm:text-sm focus:border-amber-500 outline-none"
            />
          </div>

          {/* Mentor note reminder */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Your mentor will provide critical, candid feedback like a senior peer in the industry, cutting out fluff, deferential clichés, and ineffective calls-to-action.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-critical-review-btn"
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-medium flex items-center gap-2 shadow-xs transition-colors"
            >
              <SendHorizontal className="w-4 h-4" />
              Request Critical Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
