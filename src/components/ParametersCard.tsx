import React, { useState } from 'react';
import {
  Sliders,
  ChevronDown,
  ChevronUp,
  Zap,
  BookmarkCheck,
  SkipForward,
  Tag,
  MessageSquarePlus,
  Plus,
  Check,
} from 'lucide-react';
import { OutreachContext } from '../types';

export interface QuickActionTag {
  id: string;
  label: string;
  prompt: string;
  parameters?: Partial<OutreachContext>;
  isCustom?: boolean;
}

export const INITIAL_LIGHT_QUICK_ACTION_TAGS: QuickActionTag[] = [
  {
    id: 'linkedin-note',
    label: 'LinkedIn connection note',
    prompt:
      "I want to write a LinkedIn connection request note to an industry professional. Before drafting, what specific context and details do you need from me?",
    parameters: {
      relationship: 'Cold Industry Professional',
      desiredOutcome: '15-min coffee chat / advice',
      formAndLength: 'Linkedin Notes',
      tone: 'Confident & professional peer-level (no excessive deference)',
    },
  },
  {
    id: 'alum-cold-email',
    label: 'Cold email to alum',
    prompt:
      "I'm planning a cold email to a university alumnus working at my target company. Can you ask me the clarifying questions you need to understand my situation before drafting?",
    parameters: {
      relationship: 'Alumni from my university',
      desiredOutcome: '15-min coffee chat / advice',
      formAndLength: 'Email (short)',
      tone: 'Confident & professional peer-level (no excessive deference)',
    },
  },
  {
    id: 'recruiter-checkin',
    label: 'Recruiter check-in',
    prompt:
      "I want to reach out to a campus recruiter about a graduate internship posting. What questions do you have for me first so we can calibrate the right approach?",
    parameters: {
      relationship: 'Campus / University Recruiter',
      desiredOutcome: 'Internship referral',
      formAndLength: 'Email (short)',
      tone: 'Direct, crisp, and time-respectful',
    },
  },
  {
    id: 'followup-nudge',
    label: 'Follow-up nudge',
    prompt:
      "I applied for an internship 10-14 days ago and haven't heard back. Before drafting a follow-up, what details do you need about my application status?",
    parameters: {
      relationship: 'Hiring Manager / Team Lead',
      desiredOutcome: 'Application follow-up / check-in',
      formAndLength: 'Social media message',
      tone: 'Direct, crisp, and time-respectful',
    },
  },
  {
    id: 'professor-inquiry',
    label: 'Professor / Lab outreach',
    prompt:
      "I'm considering reaching out to a professor or research lab director for internship or project sponsorship. What context do you need from me to give feedback?",
    parameters: {
      relationship: 'Professor / Lab Director',
      desiredOutcome: 'Research lab sponsorship',
      formAndLength: 'Email (standard)',
      tone: 'Confident & professional peer-level (no excessive deference)',
    },
  },
];

export const INITIAL_DARK_QUICK_ACTION_TAGS: QuickActionTag[] = [
  {
    id: 'formal-resignation-notice',
    label: 'Formal 2-Week Resignation',
    prompt:
      "I have worked full-time and decided to formally resign. What specific details about my notice period, transition plan, and relationship with my manager do you need before drafting my resignation letter?",
    parameters: {
      relationship: 'Direct Manager / Supervisor',
      desiredOutcome: 'Formal resignation with 2-week transition',
      formAndLength: 'Formal Letter',
      tone: 'Grateful, objective, and constructive',
    },
  },
  {
    id: 'immediate-executive-resignation',
    label: 'Senior / Executive Resignation',
    prompt:
      "I am resigning from a senior/lead position. How should we structure the communication to preserve executive rapport and facilitate project handover?",
    parameters: {
      relationship: 'VP / Department Head / Executive',
      desiredOutcome: 'Smooth leadership handover & key client transition',
      formAndLength: 'Email (standard)',
      tone: 'Executive, diplomatic, and forward-looking',
    },
  },
  {
    id: 'short-notice-resignation',
    label: 'Short notice / Urgent departure',
    prompt:
      "I need to resign with a shorter notice window due to personal circumstances. How can we present this professionally without burning bridges?",
    parameters: {
      relationship: 'Direct Manager / Supervisor',
      desiredOutcome: 'Short-notice departure with handover offer',
      formAndLength: 'Email (short)',
      tone: 'Direct, respectful, and appreciative',
    },
  },
  {
    id: 'hr-resignation-followup',
    label: 'HR & Benefits departure note',
    prompt:
      "I need to submit my official resignation copy to People Ops / HR and inquire about the exit interview and offboarding process. What context should I include?",
    parameters: {
      relationship: 'People Operations / HR Department',
      desiredOutcome: 'Official HR filing & offboarding schedule',
      formAndLength: 'Email (standard)',
      tone: 'Objective, clear, and compliant',
    },
  },
  {
    id: 'team-farewell-message',
    label: 'Team farewell announcement',
    prompt:
      "My resignation has been accepted by leadership and I want to send a warm, professional farewell message to my immediate teammates on Slack/Email.",
    parameters: {
      relationship: 'Immediate Teammates & Peers',
      desiredOutcome: 'Warm farewell & sharing personal contact info',
      formAndLength: 'social media message',
      tone: 'Warm, appreciative, and peer-level',
    },
  },
];

export const INITIAL_QUICK_ACTION_TAGS: QuickActionTag[] = INITIAL_LIGHT_QUICK_ACTION_TAGS;

export interface DarkToneStep {
  value: string;
  label: string;
  shortDesc: string;
  badge: string;
}

export const DARK_TONE_STEPS: DarkToneStep[] = [
  {
    value: 'Professional: Grateful, diplomatic, and objective',
    label: 'Professional',
    shortDesc: 'Diplomatic, grateful & respectful',
    badge: 'Polished',
  },
  {
    value: 'Balanced: Direct, concise, and business-focused',
    label: 'Balanced',
    shortDesc: 'Matter-of-fact & objective transition',
    badge: 'Direct',
  },
  {
    value: 'Passive-aggressive: Coldly polite, subtle sarcasm, unvarnished corporate reality',
    label: 'Cold & Sarcastic',
    shortDesc: 'Pointed remarks & subtle corporate irony',
    badge: 'Spicy',
  },
  {
    value: 'I am mad at the company: Casual, sarcastic, candid & completely done with the toxic BS',
    label: 'I am mad at the company',
    shortDesc: 'Unfiltered, sarcastic & unapologetic',
    badge: 'Zero Filter',
  },
];

interface ParametersCardProps {
  context: OutreachContext;
  quickActionTags: QuickActionTag[];
  selectedTagId: string | null;
  hideQuickActions: boolean;
  themeMode?: 'light' | 'dark';
  onSelectQuickActionTag: (tag: QuickActionTag) => void;
  onDeselectQuickActionTag: () => void;
  onOpenAddModal: () => void;
  onSaveParameters: (updated: OutreachContext) => void;
  onQuickDraft: (updated: OutreachContext) => void;
  onSkip?: () => void;
}

export const ParametersCard: React.FC<ParametersCardProps> = ({
  context,
  quickActionTags,
  selectedTagId,
  hideQuickActions,
  themeMode = 'light',
  onSelectQuickActionTag,
  onDeselectQuickActionTag,
  onOpenAddModal,
  onSaveParameters,
  onQuickDraft,
  onSkip,
}) => {
  const isDark = themeMode === 'dark';

  // 3. Parameter 默认展开状态
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Local state for editing parameters
  const [situation, setSituation] = useState(context.situation);
  const [relationship, setRelationship] = useState(context.relationship);
  const [desiredOutcome, setDesiredOutcome] = useState(context.desiredOutcome);
  const [tone, setTone] = useState(context.tone);
  const [formAndLength, setFormAndLength] = useState(context.formAndLength);

  React.useEffect(() => {
    setSituation(context.situation);
    setRelationship(context.relationship);
    setDesiredOutcome(context.desiredOutcome);
    setTone(context.tone);
    setFormAndLength(context.formAndLength);
  }, [context]);

  const currentLocalContext: OutreachContext = {
    situation,
    relationship,
    desiredOutcome,
    tone,
    formAndLength,
  };

  // Determine dark mode tone stepper active index
  const resolvedDarkStepIndex = DARK_TONE_STEPS.findIndex((s) => s.value === tone);
  const darkToneStepIndex = resolvedDarkStepIndex >= 0
    ? resolvedDarkStepIndex
    : tone.toLowerCase().includes('mad') || tone.toLowerCase().includes('sarcastic') || tone.toLowerCase().includes('toxic')
    ? 3
    : tone.toLowerCase().includes('passive') || tone.toLowerCase().includes('cold')
    ? 2
    : tone.toLowerCase().includes('direct') || tone.toLowerCase().includes('concise')
    ? 1
    : 0;

  const currentDarkStep = DARK_TONE_STEPS[darkToneStepIndex] || DARK_TONE_STEPS[0];

  // 5. 只要user在parameter里有任何input，expand的文字变成Edit，功能不变。
  const hasAnyInput = Boolean(
    situation.trim() ||
    relationship ||
    desiredOutcome ||
    tone ||
    formAndLength
  );

  // 4. 点击quick draft和save后parameters自动collapse。quick actions会消失直到user reset这个conversation。
  const handleSaveOnly = () => {
    onSaveParameters(currentLocalContext);
    setIsCollapsed(true);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2200);
  };

  const handleQuickDraftClick = () => {
    setIsCollapsed(true);
    onQuickDraft(currentLocalContext);
  };

  // 点击 Skip 后自动收起 parameter section，并触发 agent 询问 What can I help
  const handleSkip = () => {
    setIsCollapsed(true);
    if (onSkip) {
      onSkip();
    }
  };

  const handleTagClick = (tag: QuickActionTag) => {
    if (selectedTagId === tag.id) {
      onDeselectQuickActionTag();
    } else {
      onSelectQuickActionTag(tag);
    }
  };

  const expandButtonLabel = hasAnyInput ? 'Edit' : 'Expand';

  return (
    <div className={`glass-panel rounded-2xl overflow-hidden transition-all duration-300 ${isDark ? 'border-slate-700/80 bg-slate-900/60' : ''}`}>
      {/* Header Bar */}
      <div className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 border-b ${isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white/40 border-white/60'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-2xs ${
            isDark 
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' 
              : 'bg-gradient-to-br from-indigo-500/20 to-sky-400/20 border-white/80 text-indigo-600'
          }`}>
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-xs font-bold uppercase tracking-wider leading-none ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {isDark ? 'Resignation Parameters' : 'Parameters'}
              </h3>
              {hasAnyInput && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-md ${
                  isDark
                    ? 'text-amber-400 bg-amber-950/60 border border-amber-800/60'
                    : 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
                }`}>
                  Configured
                </span>
              )}
            </div>
            <p className={`text-[11px] font-medium mt-0.5 ${isDark ? 'text-amber-400/90' : 'text-indigo-600/90'}`}>
              {isDark ? 'Full-time resignation & departure context' : 'Refined tone & outreach context'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 border shadow-2xs active:scale-95 ${
            isDark
              ? 'text-amber-400 hover:text-amber-300 bg-slate-800 hover:bg-slate-700 border-slate-700'
              : 'text-indigo-600 hover:text-indigo-800 bg-white/60 hover:bg-white/90 border-white/80'
          }`}
        >
          {isCollapsed ? (
            <>
              <span>{expandButtonLabel}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>Collapse</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* 1. COLLAPSED VIEW: Quick action section temporarily hidden for both modes */}
      {isCollapsed ? null : (
        /* 2. EXPANDED VIEW: 显示 parameters inputs + Quick Draft & Save & Skip 热键 */
        <div className={`p-4 sm:p-5 backdrop-blur-md space-y-4 text-xs ${isDark ? 'bg-slate-900/50 text-slate-300' : 'bg-white/30 text-slate-700'}`}>
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isDark ? '1. Situation & Notice Period' : '1. Situation & Target Role'}
            </label>
            <input
              type="text"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder={
                isDark
                  ? 'e.g., Full-time Senior Engineer resigning after 3 years, giving standard 2 weeks notice'
                  : 'e.g., 1st year Graduate student seeking Summer 2026 Software / ML Internship'
              }
              className={`w-full px-3 py-2 rounded-xl glass-input text-xs outline-none transition-all shadow-inner ${
                isDark ? 'text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-amber-500/30' : 'text-slate-900 focus:ring-2 focus:ring-indigo-100'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                2. Recipient Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl glass-input text-xs outline-none transition-all shadow-inner ${
                  isDark ? 'text-slate-100 bg-slate-800' : 'text-slate-900'
                }`}
              >
                <option value="">-- Select relationship --</option>
                {isDark ? (
                  <>
                    <option value="Direct Manager / Supervisor">Direct Manager / Supervisor</option>
                    <option value="VP / Department Head / Executive">VP / Department Head / Executive</option>
                    <option value="People Operations / HR Department">People Operations / HR Department</option>
                    <option value="Immediate Teammates & Peers">Immediate Teammates & Peers</option>
                    <option value="Client / External Partner">Client / External Partner</option>
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

            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                3. Desired Outcome
              </label>
              <select
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl glass-input text-xs outline-none transition-all shadow-inner ${
                  isDark ? 'text-slate-100 bg-slate-800' : 'text-slate-900'
                }`}
              >
                <option value="">-- Select outcome --</option>
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
          </div>

          {/* 4. Tone - Full Width Row */}
          <div className="w-full">
            {isDark ? (
              <div className="p-4 rounded-2xl border bg-slate-800/70 border-slate-700/80 shadow-inner">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      4. Tone Stepper
                    </label>
                    <span className="text-[10px] text-slate-400">
                      (Drag slider or click steps to control tone)
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                      darkToneStepIndex === 3
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        : darkToneStepIndex === 2
                        ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                        : darkToneStepIndex === 1
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {currentDarkStep.badge}
                  </span>
                </div>

                {/* Stepper with perfectly aligned track, nodes, drag handle and text labels */}
                <div className="relative pt-2 pb-1">
                  {/* Background Track Line */}
                  <div className="absolute top-[17px] left-[10px] right-[10px] h-2 bg-slate-700/90 rounded-full pointer-events-none" />

                  {/* Active Highlighted Fill Line */}
                  <div
                    className={`absolute top-[17px] left-[10px] h-2 rounded-full pointer-events-none transition-all duration-150 ${
                      darkToneStepIndex === 3
                        ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500'
                        : darkToneStepIndex === 2
                        ? 'bg-gradient-to-r from-emerald-500 to-orange-500'
                        : darkToneStepIndex === 1
                        ? 'bg-gradient-to-r from-emerald-500 to-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `calc(${((darkToneStepIndex) / (DARK_TONE_STEPS.length - 1)) * 100}% - ${((darkToneStepIndex) / (DARK_TONE_STEPS.length - 1)) * 20}px + 10px)`,
                    }}
                  />

                  {/* Native Range Slider Layer (transparent, placed over track for smooth dragging) */}
                  <input
                    type="range"
                    min={0}
                    max={DARK_TONE_STEPS.length - 1}
                    step={1}
                    value={darkToneStepIndex}
                    onChange={(e) => {
                      const idx = Number(e.target.value);
                      setTone(DARK_TONE_STEPS[idx].value);
                    }}
                    className="absolute top-0 left-0 w-full h-9 opacity-0 cursor-pointer z-20"
                    aria-label="Tone Stepper"
                  />

                  {/* Stepper Interactive Nodes & Corresponding Text Column */}
                  <div className="relative z-10 grid grid-cols-4 w-full">
                    {DARK_TONE_STEPS.map((step, idx) => {
                      const isSelected = idx === darkToneStepIndex;
                      const isPastOrCurrent = idx <= darkToneStepIndex;

                      return (
                        <button
                          key={step.label}
                          type="button"
                          onClick={() => setTone(step.value)}
                          className="flex flex-col items-center group cursor-pointer text-center px-1"
                        >
                          {/* Circle Dot Marker (Centered Exactly at Top 18px matching track) */}
                          <div className="h-6 flex items-center justify-center">
                            <div
                              className={`rounded-full border-2 transition-all duration-200 ${
                                isSelected
                                  ? idx === 3
                                    ? 'w-5 h-5 bg-rose-500 border-white shadow-lg shadow-rose-500/60 scale-110'
                                    : idx === 2
                                    ? 'w-5 h-5 bg-orange-500 border-white shadow-lg shadow-orange-500/60 scale-110'
                                    : idx === 1
                                    ? 'w-5 h-5 bg-amber-500 border-white shadow-lg shadow-amber-500/60 scale-110'
                                    : 'w-5 h-5 bg-emerald-500 border-white shadow-lg shadow-emerald-500/60 scale-110'
                                  : isPastOrCurrent
                                  ? 'w-3.5 h-3.5 bg-slate-400 border-slate-300'
                                  : 'w-3.5 h-3.5 bg-slate-700 border-slate-500 group-hover:border-slate-300'
                              }`}
                            />
                          </div>

                          {/* Label Directly Aligned Below The Node */}
                          <span
                            className={`text-[11px] mt-1.5 leading-snug transition-colors ${
                              isSelected
                                ? idx === 3
                                  ? 'text-rose-400 font-bold'
                                  : idx === 2
                                  ? 'text-orange-400 font-bold'
                                  : idx === 1
                                  ? 'text-amber-300 font-bold'
                                  : 'text-emerald-400 font-bold'
                                : 'text-slate-400 group-hover:text-slate-200 font-medium'
                            }`}
                          >
                            {step.label}
                          </span>

                          {/* Short Sub-description */}
                          <span
                            className={`text-[9.5px] mt-0.5 leading-tight transition-colors hidden sm:block ${
                              isSelected
                                ? 'text-slate-300 font-normal'
                                : 'text-slate-500 group-hover:text-slate-400'
                            }`}
                          >
                            {step.shortDesc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 text-slate-600">
                  4. Tone (Non-deferential)
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs outline-none transition-all shadow-inner text-slate-900"
                >
                  <option value="">-- Select tone --</option>
                  <option value="Confident & professional peer-level (no excessive deference)">
                    Confident & Peer-Level (No excessive deference)
                  </option>
                  <option value="Direct, crisp, and time-respectful">Direct & Time-Respectful</option>
                  <option value="Warm, conversational yet polished">Warm & Conversational</option>
                </select>
              </div>
            )}
          </div>

          {/* 5. Form & Length - Full Width Row */}
          <div className="w-full">
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              5. Form & Length
            </label>
            <select
              value={formAndLength}
              onChange={(e) => setFormAndLength(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl glass-input text-xs outline-none transition-all shadow-inner ${
                isDark ? 'text-slate-100 bg-slate-800' : 'text-slate-900'
              }`}
            >
              <option value="">-- Select form & length --</option>
              {isDark ? (
                <>
                  <option value="Formal Letter">Formal Letter (Standard 1-page)</option>
                  <option value="Email (standard)">Email (Standard ~150-200 words)</option>
                  <option value="Email (short)">Email (Short & direct ~80-100 words)</option>
                  <option value="social media message">Internal message / Slack farewell</option>
                </>
              ) : (
                <>
                  <option value="Email (short)">Email (short)</option>
                  <option value="Email (standard)">Email (standard)</option>
                  <option value="Linkedin Notes">Linkedin Notes</option>
                  <option value="social media message">social media message</option>
                </>
              )}
            </select>
          </div>

          {/* Quick Draft, Save, and Skip Buttons */}
          <div className={`pt-3 border-t flex items-center justify-end gap-2 ${isDark ? 'border-slate-800/80' : 'border-white/60'}`}>
            {/* 4. Skip button */}
            <button
              type="button"
              onClick={handleSkip}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border-slate-700'
                  : 'bg-white/70 hover:bg-white border-white/90 text-slate-600 hover:text-slate-900'
              }`}
              title="Skip parameters, collapse section, and ask agent directly in chat"
            >
              <SkipForward className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>Skip</span>
            </button>

            <button
              type="button"
              onClick={handleSaveOnly}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white/80 hover:bg-white border-white/90 text-slate-700'
              }`}
              title="Save parameters and collapse"
            >
              <BookmarkCheck className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>Save</span>
            </button>

            <button
              type="button"
              onClick={handleQuickDraftClick}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                isDark
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-md shadow-indigo-500/20'
              }`}
              title="Immediately generate a draft using these parameters and collapse"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Quick Draft</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
