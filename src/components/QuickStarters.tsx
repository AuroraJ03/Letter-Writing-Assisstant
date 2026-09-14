import React from 'react';
import { UserCheck, Clock, Send, Sparkles, FileSearch } from 'lucide-react';

interface QuickStartersProps {
  onSelectPrompt: (prompt: string) => void;
  onOpenContextBuilder: () => void;
  onOpenReviewMaterials: () => void;
}

export const QuickStarters: React.FC<QuickStartersProps> = ({
  onSelectPrompt,
  onOpenContextBuilder,
  onOpenReviewMaterials,
}) => {
  const starters = [
    {
      icon: <UserCheck className="w-4 h-4 text-indigo-600" />,
      title: "Alumni LinkedIn Referral",
      description: "Cold message to an alumnus at my target company for a summer internship referral.",
      prompt: "I'm a graduate student in Computer Science looking for a Summer 2026 Software Engineering internship. I want to reach out on LinkedIn to an alumnus from my university who is now a Senior Engineer at Stripe. I'd like to ask for a brief 15-minute chat to learn about their team and potentially ask for a referral. What other context do you need to help me draft this?",
    },
    {
      icon: <Send className="w-4 h-4 text-blue-600" />,
      title: "Direct Team Lead Pitch",
      description: "Reaching out directly to an engineering lead about an open intern posting.",
      prompt: "I want to email an Engineering Manager directly about an open Machine Learning Intern position on their team. I have applied online, but want to stand out by referencing their recent work on low-latency inference. Help me draft a crisp, confident email (~120 words) that avoids sounding too humble or desperate.",
    },
    {
      icon: <Clock className="w-4 h-4 text-amber-600" />,
      title: "Follow-Up After 2 Weeks",
      description: "Nudge a recruiter or hiring manager after applying without hearing back.",
      prompt: "I applied for a Graduate Product Management Intern role 14 days ago and reached out to the recruiter, but haven't received a reply. I'm feeling a bit anxious. Could you help me craft a confident, respectful follow-up that isn't pushy?",
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-4">
      <div className="text-center space-y-1.5 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Graduate Internship Mentorship & Outreach
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          How can your Career Peer Advisor help today?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          I act as your senior peer and sounding board. I provide candid feedback, draft non-deferential outreach messages, and guide your internship search.
        </p>
      </div>

      {/* Action shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <button
          type="button"
          onClick={onOpenContextBuilder}
          className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-300 transition-all text-left flex items-start gap-3 group"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-indigo-900 block">Structured Context Builder</span>
            <span className="text-xs text-slate-600">Provide the 5 required inputs (situation, relationship, outcomes, tone, length)</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenReviewMaterials}
          className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-300 transition-all text-left flex items-start gap-3 group"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <FileSearch className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-900 block">Review My Existing Material</span>
            <span className="text-xs text-slate-600">Paste your draft or resume bullets for critical, unsparing peer feedback</span>
          </div>
        </button>
      </div>

      {/* Starter scenarios */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block px-1">
          Or start from a common graduate scenario:
        </span>
        <div className="grid grid-cols-1 gap-2.5">
          {starters.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt(item.prompt)}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/70 transition-all text-left flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-indigo-50 transition-colors shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">{item.description}</p>
              </div>
              <span className="text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                Start &rarr;
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
