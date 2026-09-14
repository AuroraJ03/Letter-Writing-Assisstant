import React, { useState } from 'react';
import { X, Plus, Sliders } from 'lucide-react';
import { OutreachContext } from '../types';

interface AddCustomActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, parameters: OutreachContext) => void;
  themeMode?: 'light' | 'dark';
}

export const AddCustomActionModal: React.FC<AddCustomActionModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  themeMode = 'light',
}) => {
  const isDark = themeMode === 'dark';
  const [tagName, setTagName] = useState('');
  const [situation, setSituation] = useState('');
  const [relationship, setRelationship] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [tone, setTone] = useState('');
  const [formAndLength, setFormAndLength] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) {
      setError('Please provide a name for this custom action tag.');
      return;
    }

    onAdd(tagName.trim(), {
      situation: situation.trim(),
      relationship,
      desiredOutcome,
      tone,
      formAndLength,
    });

    // Reset and close
    setTagName('');
    setSituation('');
    setRelationship('');
    setDesiredOutcome('');
    setTone('');
    setFormAndLength('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`rounded-3xl max-w-lg w-full overflow-hidden animate-fade-in flex flex-col max-h-[90vh] border ${
        isDark ? 'bg-slate-900/95 border-slate-700/80 text-slate-100 shadow-2xl' : 'glass-panel-elevated text-slate-800'
      }`}>
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          isDark ? 'border-slate-700/70 bg-slate-850' : 'border-white/60 bg-white/40'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shadow-2xs ${
              isDark ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-gradient-to-br from-indigo-500/20 to-sky-400/20 border-white text-indigo-600'
            }`}>
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Add Custom Quick Action Tag
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Create and name your own tailored parameter set
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Tag Name */}
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Tag Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={tagName}
              onChange={(e) => {
                setTagName(e.target.value);
                if (error) setError(null);
              }}
              placeholder={isDark ? "e.g., Executive Handover, 3-Week Notice Transition" : "e.g., Senior Engineer Coffee Chat, Second Stage Follow-up"}
              className={`w-full px-3 py-2 rounded-xl text-xs outline-none focus:ring-2 shadow-inner border ${
                isDark
                  ? 'bg-slate-850 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-amber-500/30 focus:border-amber-500/60'
                  : 'glass-input text-slate-900 focus:ring-indigo-100'
              }`}
              autoFocus
            />
          </div>

          {/* Situation */}
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              1. Situation & Context
            </label>
            <input
              type="text"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder={isDark ? "e.g., Leaving after 4 years for new leadership role" : "e.g., Seeking advice on distributed systems team openings"}
              className={`w-full px-3 py-2 rounded-xl text-xs outline-none focus:ring-2 shadow-inner border ${
                isDark
                  ? 'bg-slate-850 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-amber-500/30 focus:border-amber-500/60'
                  : 'glass-input text-slate-900 focus:ring-indigo-100'
              }`}
            />
          </div>

          {/* Recipient Relationship */}
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              2. Recipient Relationship
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs outline-none shadow-inner border ${
                isDark ? 'bg-slate-850 border-slate-700 text-slate-100' : 'glass-input text-slate-900'
              }`}
            >
              <option value="">-- Optional: Select relationship --</option>
              {isDark ? (
                <>
                  <option value="Direct Manager / Supervisor">Direct Manager / Supervisor</option>
                  <option value="VP / Department Head / Executive">VP / Department Head / Executive</option>
                  <option value="People Operations / HR Department">People Operations / HR Department</option>
                  <option value="Immediate Teammates & Peers">Immediate Teammates & Peers</option>
                  <option value="Key External Clients & Partners">Key External Clients & Partners</option>
                </>
              ) : (
                <>
                  <option value="Alumni from my university">Alumni from my university</option>
                  <option value="Hiring Manager / Team Lead">Hiring Manager / Team Lead</option>
                  <option value="Campus / University Recruiter">Campus / University Recruiter</option>
                  <option value="Professor / Lab Director">Professor / Lab Director</option>
                  <option value="Cold Industry Professional">Cold Industry Professional</option>
                </>
              )}
            </select>
          </div>

          {/* Desired Outcome */}
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              3. Desired Outcome
            </label>
            <select
              value={desiredOutcome}
              onChange={(e) => setDesiredOutcome(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs outline-none shadow-inner border ${
                isDark ? 'bg-slate-850 border-slate-700 text-slate-100' : 'glass-input text-slate-900'
              }`}
            >
              <option value="">-- Optional: Select outcome --</option>
              {isDark ? (
                <>
                  <option value="Formal resignation with 2-week transition">Formal resignation with 2-week transition</option>
                  <option value="Smooth leadership handover & key client transition">Smooth leadership handover & key client transition</option>
                  <option value="Short-notice departure with handover offer">Short-notice departure with handover offer</option>
                  <option value="Official HR filing & offboarding schedule">Official HR filing & offboarding schedule</option>
                  <option value="Warm farewell & sharing personal contact info">Warm farewell & sharing personal contact info</option>
                </>
              ) : (
                <>
                  <option value="15-min coffee chat / advice">15-min coffee chat / advice</option>
                  <option value="Internship referral">Internship referral</option>
                  <option value="Application follow-up / check-in">Application follow-up / check-in</option>
                  <option value="Research lab sponsorship">Research lab sponsorship</option>
                </>
              )}
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              4. Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs outline-none shadow-inner border ${
                isDark ? 'bg-slate-850 border-slate-700 text-slate-100' : 'glass-input text-slate-900'
              }`}
            >
              <option value="">-- Optional: Select tone --</option>
              {isDark ? (
                <>
                  <option value="Grateful, objective, and constructive">Grateful, objective, and constructive</option>
                  <option value="Executive, diplomatic, and forward-looking">Executive, diplomatic, and forward-looking</option>
                  <option value="Direct, respectful, and appreciative">Direct, respectful, and appreciative</option>
                  <option value="Objective, clear, and compliant">Objective, clear, and compliant</option>
                  <option value="Warm, appreciative, and peer-level">Warm, appreciative, and peer-level</option>
                </>
              ) : (
                <>
                  <option value="Confident & professional peer-level (no excessive deference)">
                    Confident & Peer-Level (No excessive deference)
                  </option>
                  <option value="Direct, crisp, and time-respectful">Direct & Time-Respectful</option>
                  <option value="Warm, conversational yet polished">Warm & Conversational</option>
                </>
              )}
            </select>
          </div>

          {/* Form & Length */}
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              5. Form & Length
            </label>
            <select
              value={formAndLength}
              onChange={(e) => setFormAndLength(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs outline-none shadow-inner border ${
                isDark ? 'bg-slate-850 border-slate-700 text-slate-100' : 'glass-input text-slate-900'
              }`}
            >
              <option value="">-- Optional: Select form & length --</option>
              <option value="Formal Letter">Formal Letter</option>
              <option value="Email (short)">Email (short)</option>
              <option value="Email (standard)">Email (standard)</option>
              <option value="Linkedin Notes">Linkedin Notes</option>
              <option value="social media message">social media message</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className={`pt-3 border-t flex items-center justify-end gap-2.5 ${
            isDark ? 'border-slate-700/70' : 'border-white/60'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl font-semibold text-xs transition-colors border ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-white/70 hover:bg-white text-slate-700 border-white'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 ${
                isDark
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-slate-950 font-bold shadow-amber-500/20'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-indigo-500/20'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Action Tag</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
