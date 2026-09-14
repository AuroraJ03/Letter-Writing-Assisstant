import React, { useState } from 'react';
import {
  X,
  Layers,
  Cpu,
  Server,
  Database,
  ArrowRight,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  HelpCircle,
  FileEdit,
  ShieldCheck,
  Maximize2,
  ZoomIn,
  Activity,
  Workflow
} from 'lucide-react';
import systemDiagramImg from '../assets/images/system_diagram_1789257220300.jpg';

interface SystemDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode?: 'light' | 'dark';
}

type TabType = 'flowchart' | 'diagram_image' | 'agent_lifecycle';

export const SystemDiagramModal: React.FC<SystemDiagramModalProps> = ({ isOpen, onClose, themeMode = 'light' }) => {
  const isDark = themeMode === 'dark';
  const [activeTab, setActiveTab] = useState<TabType>('flowchart');
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-5xl border rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-scale-up ${
          isDark
            ? 'bg-slate-900/95 border-slate-700/80 text-slate-200'
            : 'bg-white/95 backdrop-blur-2xl border-white/90 text-slate-800'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="system-diagram-modal-title"
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark
            ? 'border-slate-800 bg-slate-850'
            : 'border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-indigo-50/40'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs border ${
              isDark
                ? 'bg-amber-950/50 border-amber-800/60 text-amber-400'
                : 'bg-indigo-50 border-indigo-100 text-indigo-600'
            }`}>
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="system-diagram-modal-title" className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  System Architecture & Agent Diagram
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isDark
                    ? 'bg-amber-950/70 text-amber-400 border-amber-800/60'
                    : 'bg-indigo-100/80 text-indigo-700 border-indigo-200/60'
                }`}>
                  Full Stack + AI Agent
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Overview of client interfaces, peer mentor agent reasoning, backend proxy, and knowledge integration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`px-6 py-2.5 border-b flex items-center justify-between flex-wrap gap-2 ${
          isDark ? 'border-slate-800 bg-slate-850/80' : 'border-slate-100 bg-slate-50/60'
        }`}>
          <div className={`flex items-center gap-1.5 p-1 rounded-2xl border shadow-2xs ${
            isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white/80 border-slate-200/70'
          }`}>
            <button
              type="button"
              onClick={() => setActiveTab('flowchart')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'flowchart'
                  ? isDark
                    ? 'bg-amber-600 text-slate-950 font-bold shadow-xs'
                    : 'bg-indigo-600 text-white shadow-xs'
                  : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Architecture</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('diagram_image')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'diagram_image'
                  ? isDark
                    ? 'bg-amber-600 text-slate-950 font-bold shadow-xs'
                    : 'bg-indigo-600 text-white shadow-xs'
                  : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generated Infographic View</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('agent_lifecycle')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'agent_lifecycle'
                  ? isDark
                    ? 'bg-amber-600 text-slate-950 font-bold shadow-xs'
                    : 'bg-indigo-600 text-white shadow-xs'
                  : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Agent Interaction Loop</span>
            </button>
          </div>

          <div className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            App Architecture: <span className={`font-semibold ${isDark ? 'text-amber-400' : 'text-slate-700'}`}>Client-Server + Gemini Agent</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: INTERACTIVE ARCHITECTURE */}
          {activeTab === 'flowchart' && (
            <div className="space-y-6">
              {/* Architecture Intro */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    End-to-End System Overview
                  </h4>
                  <p className="text-xs text-indigo-900/80 leading-relaxed">
                    The application connects a dual-pane React client with an Express API proxy, hosting the
                    <strong> Peer Career Advisor Agent</strong> powered by Gemini. User inputs and outreach parameters
                    stream through the agent loop, isolating drafts into a dedicated outcome workspace.
                  </p>
                </div>
              </div>

              {/* Four Pillar Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Layer 1: Client Experience */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">1. Client Layer (Frontend SPA)</span>
                      </div>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                        React + Tailwind
                      </span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span><strong>Parameters Form:</strong> Captures situation, recipient background, desired goal, tone, and format.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span><strong>Chat Sounding Board:</strong> Graduate student conversation panel with inline suggestions and voice.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span><strong>Outcome Draft Canvas:</strong> Real-time isolated draft renderer with copy, markdown, and save options.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span><strong>Saved Notes & KB:</strong> Drawer of saved outreach drafts and industry mentorship guidelines.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Data: React State + Local Storage</span>
                    <span className="font-semibold text-blue-600">UI / UX Tier</span>
                  </div>
                </div>

                {/* Layer 2: The Agent Core */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-purple-50/40 border-2 border-indigo-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white shadow-xs flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-indigo-950">2. Peer Mentor Agent (Intelligence)</span>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/90 px-2 py-0.5 rounded-full">
                        Core Persona
                      </span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                        <span><strong>Context Validator:</strong> Flags missing details and asks targeted clarifying questions.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                        <span><strong>Tone Calibrator:</strong> Strips unnatural deferential phrasing; crafts confident peer voice.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                        <span><strong>Delimiter Parser:</strong> Encapsulates outputs in <code>&lt;draft&gt;</code> tags for live UI extraction.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                        <span><strong>Boundary Enforcer:</strong> Enforces <code>[name]</code> placeholders and strict ethical guidelines.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-indigo-100/80 flex items-center justify-between text-[11px] text-indigo-900/70">
                    <span>Rules: AGENTS.md + GEMINI.md</span>
                    <span className="font-bold text-indigo-700">Agent Reasoning Tier</span>
                  </div>
                </div>

                {/* Layer 3: Backend API */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                          <Server className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">3. Backend API Proxy</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Express + Node.js
                      </span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span><strong>Streaming Endpoint:</strong> <code>POST /api/chat</code> handles real-time chunked SSE token transmission.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span><strong>Secure Key Storage:</strong> Keeps <code>GEMINI_API_KEY</code> completely hidden from client DevTools.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span><strong>Payload Formatting:</strong> Injects structured context variables and system instruction headers.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Protocol: Server-Sent Events / HTTP POST</span>
                    <span className="font-semibold text-emerald-600">Gateway Tier</span>
                  </div>
                </div>

                {/* Layer 4: AI & Knowledge Foundation */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center">
                          <Database className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">4. Foundation LLM & Knowledge Base</span>
                      </div>
                      <span className="text-[10px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                        Gemini Flash
                      </span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                        <span><strong>Gemini Model Engine:</strong> High-throughput reasoning and natural conversational generation.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                        <span><strong>Career Standards Grounding:</strong> Indeed email etiquette, Rutgers STEM formats, LinkedIn outreach rules.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                        <span><strong>Resume & Portfolio Guidance:</strong> ATS optimization rules and design portfolio standards.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Model: Gemini API SDK</span>
                    <span className="font-semibold text-violet-600">Intelligence Tier</span>
                  </div>
                </div>
              </div>

              {/* Visual Flow Pipeline */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Live Data Flow Pipeline
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                    Bidirectional Streaming
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Step 1: Input</span>
                    <p className="text-slate-300 mt-1 font-medium text-[11px]">User inputs query + Context Parameters</p>
                    <div className="flex items-center justify-end text-slate-500 mt-2">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Step 2: Stream</span>
                    <p className="text-slate-300 mt-1 font-medium text-[11px]">Express API proxies stream to Gemini</p>
                    <div className="flex items-center justify-end text-slate-500 mt-2">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Step 3: Agent</span>
                    <p className="text-slate-300 mt-1 font-medium text-[11px]">Agent calibrates tone, generates &lt;draft&gt;</p>
                    <div className="flex items-center justify-end text-slate-500 mt-2">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Step 4: Display</span>
                    <p className="text-slate-300 mt-1 font-medium text-[11px]">Canvas renders draft; chat asks "Is this ok?"</p>
                    <div className="flex items-center justify-end text-emerald-400 mt-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GENERATED INFOGRAPHIC IMAGE */}
          {activeTab === 'diagram_image' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Visual System Architecture Infographic
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Rendered high-level visual model depicting the agent boundary, pipeline flows, and client layout
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsImageExpanded(!isImageExpanded)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-all flex items-center gap-1.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{isImageExpanded ? 'Compact View' : 'Expand Image'}</span>
                </button>
              </div>

              <div
                className={`relative rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 flex items-center justify-center transition-all ${
                  isImageExpanded ? 'h-[620px]' : 'h-[440px]'
                }`}
              >
                <img
                  src={systemDiagramImg}
                  alt="App System Diagram with Agent Architecture"
                  className="w-full h-full object-contain cursor-pointer hover:scale-[1.01] transition-transform duration-200"
                  referrerPolicy="no-referrer"
                  onClick={() => setIsImageExpanded(!isImageExpanded)}
                />
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium border border-white/20 flex items-center gap-1.5 pointer-events-none">
                  <ZoomIn className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Click to toggle zoom</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Architecture Note:</strong> The Peer Career Advisor Agent enforces strict boundary constraints:
                  it never stores personal credentials, operates with zero unconfirmed assumptions, and runs as an
                  experienced peer sounding board providing direct, actionable feedback on internship outreach.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: AGENT INTERACTION LOOP */}
          {activeTab === 'agent_lifecycle' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    Agent Interaction & State Machine Loop
                  </h4>
                  <p className="text-xs text-indigo-900/80 mt-1 leading-relaxed">
                    The Agent adheres to a strict protocol defined in the system instructions: it validates information completeness,
                    avoids deference, isolates drafts with <code>&lt;draft&gt;</code> markers, and will not provide future tips until you affirm the draft.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Stage 1 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-900">Context Gathering & Gap Detection</h5>
                      <span className="text-[10px] font-semibold text-slate-500">Initial Phase</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      The agent scans the user's message and the Outreach Parameters (Situation, Recipient, Desired Outcome, Tone, Form/Length).
                      If critical context is missing, it asks measured clarifying questions without being overly formal or too casual.
                    </p>
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-900">Outreach Message Generation & Tone Calibration</h5>
                      <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        Core Draft Phase
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Generates the first outreach draft using confident peer-to-peer phrasing. It avoids excessive apologies or deference.
                      Any missing specifics use standard brackets (e.g. <code>[name]</code>, <code>[specific project]</code>) instead of fabricating details.
                    </p>
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-900">Live UI Draft Extraction</h5>
                      <span className="text-[10px] font-semibold text-slate-500">Frontend Synchronization</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      The client automatically parses <code>&lt;draft&gt;...&lt;/draft&gt;</code> tags from the incoming stream.
                      The draft is isolated into the right-hand canvas workspace in real-time, while conversation advice stays in the chat feed.
                    </p>
                  </div>
                </div>

                {/* Stage 4 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-900">Review Gate & "Is this ok?" Check</h5>
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        Critical Boundary
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      After every draft, the agent specifically asks <em>"Is this ok?"</em>. It waits for user feedback on tone, wording,
                      or revisions, iterating without being overly defensive or apologetic.
                    </p>
                  </div>
                </div>

                {/* Stage 5 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    5
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-900">Affirmation & Next Steps Reveal</h5>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Completion Phase
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      <strong>Only after</strong> the user responds affirmatively (e.g. "Looks good!", "I love this"), the agent
                      proceeds to unlock subsequent career guidance, follow-up cadence advice, and long-term networking strategies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Agent Status: Online & Monitoring Interaction Quality</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all active:scale-95"
          >
            Close Diagram
          </button>
        </div>
      </div>
    </div>
  );
};
