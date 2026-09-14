import React, { useState } from 'react';
import { X, SendHorizontal, Sparkles, Layers, Sliders } from 'lucide-react';
import { OutreachContext } from '../types';

interface ContextHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (context: OutreachContext, formattedPrompt: string) => void;
}

export const ContextHelperModal: React.FC<ContextHelperModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [situation, setSituation] = useState('');
  const [relationship, setRelationship] = useState('Alumni from my university');
  const [customRelationship, setCustomRelationship] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('15-min informational interview');
  const [customOutcome, setCustomOutcome] = useState('');
  const [tone, setTone] = useState('Confident & professional peer-level (no excessive deference)');
  const [formAndLength, setFormAndLength] = useState('Email (short)');
  const [recipientBackground, setRecipientBackground] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rel = relationship === 'Other' ? customRelationship : relationship;
    const outcome = desiredOutcome === 'Other' ? customOutcome : desiredOutcome;

    const ctx: OutreachContext = {
      situation: situation.trim(),
      relationship: rel.trim(),
      desiredOutcome: outcome.trim(),
      tone: tone.trim(),
      formAndLength: formAndLength.trim(),
    };

    const formattedPrompt = `Here is my context for an internship outreach email/message:
- **Context of Situation:** ${ctx.situation || 'Graduate student looking for internships'}
- **Recipient & Relationship:** ${ctx.relationship || 'Professional contact'} ${recipientBackground ? `(${recipientBackground})` : ''}
- **Desired Outcome & Purpose:** ${ctx.desiredOutcome || 'Connect and ask about internship opportunities'}
- **Desired Tone:** ${ctx.tone}
- **Form & Length:** ${ctx.formAndLength}

Could you evaluate this context, point out any missing details, and provide an initial draft?`;

    onSubmit(ctx, formattedPrompt);
    onClose();
  };

  const handleQuickPreset = (preset: 'alumni' | 'recruiter' | 'prof' | 'followup') => {
    if (preset === 'alumni') {
      setSituation("I'm a 1st year Master's student in CS targeting Summer 2026 Software/ML internships.");
      setRelationship('Alumni from my university');
      setRecipientBackground('Senior Software Engineer at my target company');
      setDesiredOutcome('15-min informational interview');
      setTone('Confident & professional peer-level (no excessive deference)');
      setFormAndLength('Email (short)');
    } else if (preset === 'recruiter') {
      setSituation("Applied online for the Data Science Intern role 4 days ago.");
      setRelationship('Campus / University Recruiter');
      setRecipientBackground('Technical recruiter handling graduate hiring');
      setDesiredOutcome('Flag application & express strong alignment with qualifications');
      setTone('Polished, direct, value-focused');
      setFormAndLength('Email (short)');
    } else if (preset === 'prof') {
      setSituation("Graduate student seeking a summer research internship / industry-sponsored lab position.");
      setRelationship('Professor / Lab Director');
      setRecipientBackground('Leads the robotics lab and has industry ties');
      setDesiredOutcome('Inquire about summer openings & pitch thesis alignment');
      setTone('Intellectually curious, respectful, substantive');
      setFormAndLength('Email (standard)');
    } else if (preset === 'followup') {
      setSituation("Sent my resume and reached out 10 days ago without a reply.");
      setRelationship('Hiring Manager / Team Lead');
      setRecipientBackground('Engineering manager for the team I applied to');
      setDesiredOutcome('Polite nudge / status update without being pushy');
      setTone('Brief, courteous, confident');
      setFormAndLength('social media message');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Context Builder (Required Inputs)</h2>
              <p className="text-xs text-slate-500">Provide the 5 essential inputs for high-impact mentor guidance</p>
            </div>
          </div>
          <button
            id="close-context-builder-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Bar */}
        <div className="px-6 py-3 bg-indigo-50/50 border-b border-indigo-100/60 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-semibold text-indigo-900 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Presets:
          </span>
          <button
            type="button"
            onClick={() => handleQuickPreset('alumni')}
            className="px-2.5 py-1 rounded-md bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-medium whitespace-nowrap transition-colors"
          >
            Alumni Outreach
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('recruiter')}
            className="px-2.5 py-1 rounded-md bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-medium whitespace-nowrap transition-colors"
          >
            Recruiter Flag
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('prof')}
            className="px-2.5 py-1 rounded-md bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-medium whitespace-nowrap transition-colors"
          >
            Professor/Lab Lead
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('followup')}
            className="px-2.5 py-1 rounded-md bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-medium whitespace-nowrap transition-colors"
          >
            Follow-Up Nudge
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
          {/* 1. Situation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Context of Situation <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="context-situation-input"
              rows={3}
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g. Master's in Data Science at NYU, looking for Machine Learning internships for next summer. I have 2 published papers and 1 year of software engineering experience."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm resize-none"
              required
            />
          </div>

          {/* 2. Relationship */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                2. Relationship with Recipient <span className="text-rose-500">*</span>
              </label>
              <select
                id="context-relationship-select"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm focus:border-indigo-500 outline-none"
              >
                <option value="Alumni from my university">Alumni from my university</option>
                <option value="Hiring Manager / Engineering Lead">Hiring Manager / Engineering Lead</option>
                <option value="Campus / University Recruiter">Campus / University Recruiter</option>
                <option value="2nd-degree connection / Shared network">2nd-degree connection / Shared network</option>
                <option value="Professor / Lab Director">Professor / Lab Director</option>
                <option value="Cold contact (no prior relationship)">Cold contact (no prior relationship)</option>
                <option value="Other">Other (Custom)</option>
              </select>
              {relationship === 'Other' && (
                <input
                  type="text"
                  placeholder="Specify relationship..."
                  value={customRelationship}
                  onChange={(e) => setCustomRelationship(e.target.value)}
                  className="mt-2 w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 outline-none"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Recipient Title / Background (Optional)
              </label>
              <input
                id="context-recipient-bg-input"
                type="text"
                placeholder="e.g. Senior Staff Scientist at DeepMind, alumnus of Stanford"
                value={recipientBackground}
                onChange={(e) => setRecipientBackground(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs sm:text-sm focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* 3. Desired Outcome */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              3. Desired Outcomes & Purpose <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                '15-min informational interview',
                'Internship referral for open role',
                'Follow up on submitted application',
                'Ask about research opportunities',
                'Other'
              ].map((item) => (
                <label
                  key={item}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                    desiredOutcome === item
                      ? 'border-indigo-500 bg-indigo-50/60 text-indigo-900 font-medium'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="outcome"
                    value={item}
                    checked={desiredOutcome === item}
                    onChange={() => setDesiredOutcome(item)}
                    className="text-indigo-600 focus:ring-0"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            {desiredOutcome === 'Other' && (
              <input
                type="text"
                placeholder="Specify outcome..."
                value={customOutcome}
                onChange={(e) => setCustomOutcome(e.target.value)}
                className="mt-2 w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 outline-none"
                required
              />
            )}
          </div>

          {/* 4. Tone & 5. Length */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                4. Desired Tone <span className="text-rose-500">*</span>
              </label>
              <select
                id="context-tone-select"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm focus:border-indigo-500 outline-none"
              >
                <option value="Confident & professional peer-level (no excessive deference)">
                  Confident & peer-level (Recommended)
                </option>
                <option value="Direct, crisp, and time-respectful">Direct, crisp, and time-respectful</option>
                <option value="Warm, conversational yet professional">Warm, conversational yet professional</option>
                <option value="Academic and technically rigorous">Academic and technically rigorous</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                5. Form & Length <span className="text-rose-500">*</span>
              </label>
              <select
                id="context-length-select"
                value={formAndLength}
                onChange={(e) => setFormAndLength(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm focus:border-indigo-500 outline-none"
              >
                <option value="Email (short)">Email (short)</option>
                <option value="Email (standard)">Email (standard)</option>
                <option value="Linkedin Notes">Linkedin Notes</option>
                <option value="social media message">social media message</option>
              </select>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              id="context-builder-submit-btn"
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium flex items-center gap-2 shadow-xs transition-colors"
            >
              <SendHorizontal className="w-4 h-4" />
              Send to Mentor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
