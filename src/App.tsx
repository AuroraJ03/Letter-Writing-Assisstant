import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  RotateCcw,
  BookOpen,
  Info,
  StopCircle,
  AlertCircle,
  X,
  GraduationCap,
  Briefcase,
  Sun,
  Moon,
  GripVertical,
  Bookmark,
  ShieldCheck,
} from 'lucide-react';
import { Message, OutreachContext, OutcomeDraft, SavedNote } from './types';
import {
  ParametersCard,
  QuickActionTag,
  INITIAL_LIGHT_QUICK_ACTION_TAGS,
  INITIAL_DARK_QUICK_ACTION_TAGS,
} from './components/ParametersCard';
import { OutcomeDraftView } from './components/OutcomeDraftView';
import { AddCustomActionModal } from './components/AddCustomActionModal';
import { SystemInstructionsModal } from './components/SystemInstructionsModal';
import { KnowledgeBaseDrawer } from './components/KnowledgeBaseDrawer';
import { SavedNotesModal } from './components/SavedNotesModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { SystemDiagramModal } from './components/SystemDiagramModal';
import { MessageItem } from './components/MessageItem';
import { separateChatAndDraft } from './utils/draftParser';

// parameters 默认没有任何 input
const EMPTY_CONTEXT: OutreachContext = {
  situation: '',
  relationship: '',
  desiredOutcome: '',
  tone: '',
  formAndLength: '',
};

const INITIAL_GREETING_LIGHT: Message = {
  id: 'initial-greeting-light',
  role: 'assistant',
  content: `Hello! I'm here as your peer career mentor to help you write confident, authentic letters and reach-outs. Whether you need to write a cold outreach, ask for a referral, or check in with a recruiter, ask away!

You can select a quick action tag above to discuss a scenario, calibrate your **Parameters**, or share what happened below.`,
  timestamp: Date.now(),
};

const INITIAL_GREETING_DARK: Message = {
  id: 'initial-greeting-dark',
  role: 'assistant',
  content: `Hello. As an experienced peer mentor, I'm here to serve as your sounding board as you navigate your formal resignation. Together we will ensure your departure is handled with executive composure, protecting professional relationships and leaving an impeccable impression.

Select a resignation scenario above, configure your **Parameters**, or tell me about your notice timeline and transition goals below.`,
  timestamp: Date.now(),
};

const STORAGE_KEY_SAVED_NOTES = 'peer_advisor_saved_notes_v1';
const STORAGE_KEY_THEME_MODE = 'peer_advisor_theme_mode_v1';

export default function App() {
  // Theme mode: light (Internship Outreach) vs dark (Full-time Resignation)
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_THEME_MODE);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {
      // ignore
    }
    return 'light';
  });

  const isDark = themeMode === 'dark';

  // 3. chat 默认空白
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const chatInputRef = useRef<HTMLInputElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [context, setContext] = useState<OutreachContext>(EMPTY_CONTEXT);

  // Quick Action Tags and selection state
  const [quickActionTags, setQuickActionTags] = useState<QuickActionTag[]>(() =>
    isDark ? INITIAL_DARK_QUICK_ACTION_TAGS : INITIAL_LIGHT_QUICK_ACTION_TAGS
  );
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [isAddCustomModalOpen, setIsAddCustomModalOpen] = useState(false);
  const [hideQuickActions, setHideQuickActions] = useState(false);

  // 2. Chat 和 draft outcome 之间可拖拽调整宽度比例
  // splitRatio 表示左侧 Chat 占整行的百分比 (25% - 75%)
  const [splitRatio, setSplitRatio] = useState<number>(50);
  const [isDragging, setIsDragging] = useState(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  // The outcome draft 默认空白，直到 user 确定开始 draft
  const [outcomeDraft, setOutcomeDraft] = useState<OutcomeDraft | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');

  // 3 & 4. Saved Notes
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SAVED_NOTES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  });
  const [isSavedNotesModalOpen, setIsSavedNotesModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [parametersResetKey, setParametersResetKey] = useState(0);

  // Modals & Drawers
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const [isKbDrawerOpen, setIsKbDrawerOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync saved notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_NOTES, JSON.stringify(savedNotes));
    } catch (e) {
      console.error('Failed to persist saved notes', e);
    }
  }, [savedNotes]);

  // Sync theme mode to localStorage and root html element class
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME_MODE, themeMode);
    } catch {
      // ignore
    }
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // Handle switching theme mode
  const handleToggleThemeMode = () => {
    // 1. 当两个mode切换时，如果当前mode已经生成了一个draft，自动存储进saved Notes，切换到的目标mode里面应该是空的。
    if (outcomeDraft && (outcomeDraft.body || outcomeDraft.raw || outcomeDraft.subject)) {
      const isEmail = (context.formAndLength || outcomeDraft.formAndLength || '').toLowerCase().includes('email');
      const modeLabel = themeMode === 'dark' ? 'Resignation Draft' : 'Outreach Draft';
      const autoTitle = isEmail && outcomeDraft.subject
        ? outcomeDraft.subject
        : `${modeLabel}: ${context.relationship || context.formAndLength || 'Draft'} (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;

      const newNote: SavedNote = {
        id: `note-${Date.now()}`,
        title: autoTitle,
        savedAt: Date.now(),
        draft: {
          ...outcomeDraft,
          formAndLength: context.formAndLength || outcomeDraft.formAndLength,
        },
        parameters: { ...context },
      };

      setSavedNotes((prev) => [newNote, ...prev.filter((n) => n.id !== newNote.id)]);
    }

    // 切换到的目标 mode 里面应该是空的
    setOutcomeDraft(null);

    const nextMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextMode);

    // Swap initial tags if using default tags without custom modifications
    setQuickActionTags(
      nextMode === 'dark' ? INITIAL_DARK_QUICK_ACTION_TAGS : INITIAL_LIGHT_QUICK_ACTION_TAGS
    );
    setSelectedTagId(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Handle Dragging to resize Chat vs Draft Ratio
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const newRatio = ((clientX - rect.left) / rect.width) * 100;
      // Clamp between 25% and 75% for good usability
      const clampedRatio = Math.min(Math.max(newRatio, 25), 75);
      setSplitRatio(clampedRatio);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  const handleRetry = (promptToRetry?: string) => {
    const prompt = promptToRetry || lastPrompt;
    if (!prompt) return;

    setMessages((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].role === 'assistant' && prev[prev.length - 1].isError) {
        return prev.slice(0, -1);
      }
      return prev;
    });

    setErrorMsg(null);
    handleSendMessage(prompt);
  };

  // Helper to determine if user message is requesting a draft
  const isDraftRequest = (text: string): boolean => {
    const lower = text.toLowerCase();
    return (
      lower.includes('draft') ||
      lower.includes('write') ||
      lower.includes('compose') ||
      lower.includes('generate') ||
      lower.includes('email') ||
      lower.includes('letter') ||
      lower.includes('message') ||
      lower.includes('reach out') ||
      lower.includes('reach-out') ||
      lower.includes('写') ||
      lower.includes('起草') ||
      lower.includes('草稿') ||
      lower.includes('生成') ||
      lower.includes('帮我写') ||
      lower.includes('发信') ||
      lower.includes('寒暄')
    );
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!content || isStreaming) return;

    setErrorMsg(null);
    setInputText('');
    setLastPrompt(content);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    // Prepare assistant placeholder
    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantPlaceholder: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages([...newMessages, assistantPlaceholder]);
    setIsStreaming(true);

    try {
      abortControllerRef.current = new AbortController();

      // Check if user has saved/configured parameters with actual inputs
      const hasSavedParameters = Boolean(
        context.situation?.trim() ||
        context.relationship?.trim() ||
        context.desiredOutcome?.trim() ||
        context.tone?.trim() ||
        context.formAndLength?.trim()
      );

      // Map messages for the backend. If user asks to draft and has saved parameters,
      // explicitly inject the saved parameters into the latest user message sent to the AI
      // so the AI does not ask the user to repeat what they already input.
      const outgoingMessages = newMessages.map((m, idx) => {
        if (idx === newMessages.length - 1 && hasSavedParameters && isDraftRequest(m.content)) {
          const isEmail = (context.formAndLength || '').toLowerCase().includes('email') || (context.formAndLength || '').toLowerCase().includes('formal');
          const formatInstructions = isEmail
            ? 'Include a concise, relevant Subject or Formal Heading line inside the <<<DRAFT>>> block.'
            : 'Do NOT include a Subject line since this is a non-email format.';

          const defaultSituation = isDark
            ? 'Full-time employee resigning/transitioning'
            : 'Graduate student seeking internship / advice';
          const defaultRelationship = isDark
            ? 'Direct Manager / Supervisor'
            : 'Industry Professional / Alum';
          const defaultOutcome = isDark
            ? 'Formal 2-week notice with constructive handover'
            : '15-min chat / referral inquiry';
          const defaultTone = isDark
            ? 'Grateful, objective, and constructive'
            : 'Confident & professional peer-level (no excessive deference)';

          const enrichedText = `${m.content}

[SYSTEM NOTE: Automatically retrieved user-configured parameters below. DO NOT ask the user to repeat these inputs; directly incorporate them to generate the draft wrapped in <<<DRAFT>>>...<<<END_DRAFT>>>]:
- Situation: ${context.situation || defaultSituation}
- Recipient / Relationship: ${context.relationship || defaultRelationship}
- Desired Outcome: ${context.desiredOutcome || defaultOutcome}
- Tone: ${context.tone || defaultTone}
- Form & Length: ${context.formAndLength || (isDark ? 'Formal Letter' : 'Email (short)')}
Note: ${formatInstructions}`;

          return {
            role: m.role,
            content: enrichedText,
          };
        }
        return {
          role: m.role,
          content: m.content,
        };
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: outgoingMessages,
          context,
          mode: themeMode,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Readable stream not supported.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let rawAccumulatedText = '';
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const dataPayload = trimmed.replace(/^data:\s*/, '');
          if (dataPayload === '[DONE]') {
            break;
          }

          try {
            const parsed = JSON.parse(dataPayload);
            if (parsed.text) {
              rawAccumulatedText += parsed.text;

              const { chatText, hasDraft, extractedDraft } = separateChatAndDraft(
                rawAccumulatedText,
                context.formAndLength
              );

              if (hasDraft && extractedDraft) {
                const isEmail = (context.formAndLength || '').toLowerCase().includes('email');
                setOutcomeDraft({
                  subject: isEmail ? (extractedDraft.subject || 'Outreach Letter') : '',
                  body: extractedDraft.body || '',
                  lastUpdated: Date.now(),
                  wordCount: extractedDraft.body ? extractedDraft.body.trim().split(/\s+/).filter(Boolean).length : 0,
                  raw: rawAccumulatedText,
                  formAndLength: context.formAndLength,
                });
              }

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? {
                        ...msg,
                        content:
                          chatText ||
                          (hasDraft
                            ? "I've drafted your outreach message. Take a look at The Outcome Draft panel on the right. Is this ok?"
                            : ''),
                      }
                    : msg
                )
              );
            } else if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch (e: any) {
            if (e.message && !e.message.includes('JSON')) {
              throw e;
            }
          }
        }
      }

      const { chatText: finalChat, hasDraft: finalHasDraft, extractedDraft: finalDraft } =
        separateChatAndDraft(rawAccumulatedText, context.formAndLength);

      if (finalHasDraft && finalDraft) {
        const isEmail = (context.formAndLength || '').toLowerCase().includes('email');
        setOutcomeDraft({
          subject: isEmail ? (finalDraft.subject || 'Outreach Letter') : '',
          body: finalDraft.body || '',
          lastUpdated: Date.now(),
          wordCount: finalDraft.body ? finalDraft.body.trim().split(/\s+/).filter(Boolean).length : 0,
          raw: rawAccumulatedText,
          formAndLength: context.formAndLength,
        });
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content:
                  finalChat ||
                  (finalHasDraft
                    ? "I've drafted your outreach message. Take a look at The Outcome Draft panel on the right. Is this ok?"
                    : msg.content),
                isStreaming: false,
                isError: false,
              }
            : msg
        )
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('User cancelled stream');
      } else {
        console.error('Chat error:', err);
        let cleanErr = err.message || 'Failed to communicate with advisor.';
        try {
          const parsed = JSON.parse(cleanErr);
          if (parsed.error?.message) {
            cleanErr = typeof parsed.error.message === 'string' && parsed.error.message.startsWith('{')
              ? JSON.parse(parsed.error.message)?.error?.message || parsed.error.message
              : parsed.error.message;
          } else if (parsed.error) {
            cleanErr = parsed.error;
          }
        } catch {
          // ignore
        }

        if (cleanErr.includes("503") || cleanErr.includes("high demand") || cleanErr.includes("UNAVAILABLE")) {
          cleanErr = "The model is currently experiencing high demand. Spikes in demand are usually temporary. Please click 'Retry' to try again.";
        }

        setErrorMsg(cleanErr);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: cleanErr,
                  isStreaming: false,
                  isError: true,
                }
              : msg
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  // 选择 quick action，高亮 tag
  const handleSelectQuickActionTag = (tag: QuickActionTag) => {
    setSelectedTagId(tag.id);
    if (tag.parameters) {
      setContext((prev) => ({
        ...prev,
        ...tag.parameters,
      }));
    }
    handleSendMessage(tag.prompt);
  };

  // 再次点击取消选中，不触发 conversation
  const handleDeselectQuickActionTag = () => {
    setSelectedTagId(null);
  };

  // 点击 save 后 parameters 自动 collapse，quick actions 会消失直到 user reset 这个 conversation
  const handleSaveParameters = (updated: OutreachContext) => {
    setContext(updated);
    setHideQuickActions(true);
  };

  // 点击 quick draft 后 parameters 自动 collapse，quick actions 会消失直到 user reset 这个 conversation
  const handleQuickDraft = (updated: OutreachContext) => {
    setContext(updated);
    setHideQuickActions(true);

    const isEmail = (updated.formAndLength || '').toLowerCase().includes('email');
    const formatInstructions = isEmail
      ? 'Include a concise, relevant Subject line inside the <<<DRAFT>>> block.'
      : 'Do NOT include a Subject line since this is a non-email format.';

    handleSendMessage(
      `Please generate a first draft based on my parameters:
- **Situation:** ${updated.situation || (isDark ? 'Full-time employee resigning/transitioning' : 'Graduate student seeking internship / advice')}
- **Recipient:** ${updated.relationship || (isDark ? 'Direct Manager / Supervisor' : 'Industry Professional / Alum')}
- **Desired Outcome:** ${updated.desiredOutcome || (isDark ? 'Formal 2-week notice with constructive handover' : '15-min chat / referral')}
- **Tone:** ${updated.tone || (isDark ? 'Grateful, objective, and constructive' : 'Confident & professional peer-level (no excessive deference)')}
- **Form & Length:** ${updated.formAndLength || (isDark ? 'Formal Letter' : 'Email (short)')}

Note: ${formatInstructions}
Remember to wrap the draft in <<<DRAFT>>>...<<<END_DRAFT>>> tags and display it in The Outcome Draft panel, then ask me if it's ok.`
    );
  };

  // 4. parameter 里的 save 旁边增加一个 skip 按键，点击后自动收起 parameter section 到 chatbox， agent 询问 What can I help。其他 interaction 不变。
  const handleSkipParameters = () => {
    const helpMessage: Message = {
      id: `advisor-help-${Date.now()}`,
      role: 'assistant',
      content: 'What can I help?',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, helpMessage]);

    // 自动收起到 chatbox，聚焦输入框
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 80);
  };

  // 添加自定义 parameter set
  const handleAddCustomTag = (name: string, customParams: OutreachContext) => {
    const newTagId = `custom-${Date.now()}`;
    const newTag: QuickActionTag = {
      id: newTagId,
      label: name,
      prompt: `I'm reaching out with the scenario "${name}". Before drafting, what specific questions do you have for me to evaluate the context and approach?`,
      parameters: customParams,
      isCustom: true,
    };

    setQuickActionTags((prev) => [...prev, newTag]);
    setSelectedTagId(newTagId);
    setContext((prev) => ({
      ...prev,
      ...customParams,
    }));
    handleSendMessage(newTag.prompt);
  };

  // Quick Advice triggers
  const handleQuickAdvice = (topic: 'deferential' | 'excuses' | 'followup') => {
    if (topic === 'deferential') {
      if (isDark) {
        handleSendMessage("Does this resignation letter sound overly apologetic or deferential? Please ensure it maintains professional dignity, gratitude, and executive confidence.");
      } else {
        handleSendMessage("Am I being too deferential in my message? Can you review my approach and remove any overly humble or weak phrases?");
      }
    } else if (topic === 'excuses') {
      if (isDark) {
        handleSendMessage("Can you verify that I'm not over-explaining my reasons for resigning or inventing unnecessary justifications? Keep it objective and clear.");
      } else {
        handleSendMessage("I want to make sure I'm not making excuses or over-explaining what happened. Could you check if my message is direct, honest, and accountable?");
      }
    } else if (topic === 'followup') {
      if (isDark) {
        handleSendMessage("How and when should I follow up with HR or my manager regarding the handover plan and offboarding logistics?");
      } else {
        handleSendMessage("What is your advice on following up if they don't reply within a week? When and how should I send a second nudge without being annoying?");
      }
    }
  };

  // Quick Revisions
  const handleQuickRevision = (instruction: string) => {
    handleSendMessage(`Please revise the outcome draft with this feedback: ${instruction}`);
  };

  // Accept draft
  const handleAcceptDraft = () => {
    handleSendMessage("Yes, this draft looks great and meets my goals! What are your suggested next steps and tips for future reference?");
  };

  // 3. Save draft note handler
  const handleSaveDraftNote = () => {
    if (!outcomeDraft) return;

    const isEmail = (context.formAndLength || outcomeDraft.formAndLength || '').toLowerCase().includes('email');
    const autoTitle = isEmail && outcomeDraft.subject
      ? outcomeDraft.subject
      : `${context.relationship || context.formAndLength || 'Outreach'} Note`;

    const newNote: SavedNote = {
      id: `note-${Date.now()}`,
      title: autoTitle,
      savedAt: Date.now(),
      draft: {
        ...outcomeDraft,
        formAndLength: context.formAndLength || outcomeDraft.formAndLength,
      },
      parameters: { ...context },
    };

    setSavedNotes((prev) => [newNote, ...prev.filter((n) => n.id !== newNote.id)]);
  };

  // 4. Use this note from SavedNotesModal
  const handleUseSavedNote = (note: SavedNote) => {
    setContext(note.parameters || EMPTY_CONTEXT);
    setOutcomeDraft(note.draft);
    setIsSavedNotesModalOpen(false);
    setHideQuickActions(true);
  };

  // Delete saved note
  const handleDeleteSavedNote = (id: string) => {
    setSavedNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // File Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target?.result as string;
      if (fileContent) {
        const uploadPrompt = `I've uploaded my draft material (${file.name}) for your review:\n\n\`\`\`\n${fileContent.slice(0, 4000)}\n\`\`\`\n\nPlease give me your candid, critical feedback on tone, clarity, and whether it sounds too deferential.`;
        handleSendMessage(uploadPrompt);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 2. 点击 chat 的 reset 后所有 conversation，包括 parameters 的输入，都清空。
  const handleOpenResetModal = () => {
    setIsResetModalOpen(true);
  };

  const handleExecuteReset = () => {
    // Cancel any in-flight streaming response
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setMessages([]);
    setOutcomeDraft(null);
    setContext({
      situation: '',
      relationship: '',
      desiredOutcome: '',
      tone: '',
      formAndLength: '',
    });
    setSelectedTagId(null);
    setHideQuickActions(false);
    setErrorMsg(null);
    setInputText('');
    setIsStreaming(false);
    setParametersResetKey((k) => k + 1);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-colors duration-200 ${
        isDark
          ? 'dark bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200'
          : 'bg-gradient-to-br from-[#EEF2FF] via-[#E0E7FE] to-[#F1F5F9] text-slate-800 selection:bg-indigo-500/20 selection:text-indigo-900'
      }`}
    >
      {/* Decorative Organic Liquid Bubbles & Ambient Gradients */}
      {isDark ? (
        <>
          <div
            className="liquid-bubble w-[520px] h-[520px] bg-gradient-to-br from-amber-600/10 via-amber-700/10 to-slate-800/40 -top-24 -left-20 animate-pulse"
            style={{ animationDuration: '8s' }}
          />
          <div
            className="liquid-bubble w-[640px] h-[640px] bg-gradient-to-tr from-slate-800/30 via-amber-900/15 to-slate-900/40 top-1/4 -right-32 animate-pulse"
            style={{ animationDuration: '11s' }}
          />
          <div
            className="liquid-bubble w-[480px] h-[480px] bg-gradient-to-r from-amber-950/20 via-slate-900/30 to-amber-900/20 bottom-0 left-1/3"
          />
        </>
      ) : (
        <>
          <div
            className="liquid-bubble w-[520px] h-[520px] bg-gradient-to-br from-indigo-300/45 via-purple-300/35 to-blue-200/40 -top-24 -left-20 animate-pulse"
            style={{ animationDuration: '8s' }}
          />
          <div
            className="liquid-bubble w-[640px] h-[640px] bg-gradient-to-tr from-sky-200/40 via-indigo-200/40 to-violet-300/35 top-1/4 -right-32 animate-pulse"
            style={{ animationDuration: '11s' }}
          />
          <div
            className="liquid-bubble w-[480px] h-[480px] bg-gradient-to-r from-blue-200/35 via-teal-100/30 to-indigo-200/35 bottom-0 left-1/3"
          />
        </>
      )}

      {/* Frosted Liquid Glass Utility Bar at Top */}
      <header
        className={`relative z-20 px-4 sm:px-6 py-3 border-b flex items-center justify-between shadow-xs transition-colors ${
          isDark
            ? 'border-slate-800 bg-slate-900/80 backdrop-blur-xl text-slate-100'
            : 'border-white/60 bg-white/45 backdrop-blur-xl text-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-md ${
              isDark
                ? 'bg-gradient-to-br from-amber-600 to-amber-500 text-slate-950 shadow-amber-500/20'
                : 'bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 text-white shadow-indigo-500/20'
            }`}
          >
            {isDark ? <Briefcase className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
          </div>
          <div>
            <span className={`font-bold tracking-tight text-sm ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              Peer Career Advisor
            </span>
            <span
              className={`hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                isDark
                  ? 'bg-amber-950/70 text-amber-400 border-amber-800/60'
                  : 'bg-indigo-100/70 text-indigo-700 border-indigo-200/50'
              }`}
            >
              {isDark ? 'Resignation Mentor Mode' : 'Internship Mentor Mode'}
            </span>
          </div>
        </div>

        {/* Top Controls: Mode Switch + Saved Notes + Knowledge Base + System Instructions + Info */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-medium">
          {/* Light / Dark Mode Toggle Switch */}
          <button
            id="theme-mode-toggle-btn"
            onClick={handleToggleThemeMode}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-semibold transition-all active:scale-95 shadow-2xs ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-750 border-amber-500/40 text-amber-400 hover:text-amber-300'
                : 'bg-white/80 hover:bg-white border-indigo-200/60 text-indigo-700 hover:text-indigo-800'
            }`}
            title={isDark ? 'Switch to Light Mode: Graduate Student / Internship Outreach' : 'Switch to Dark Mode: Full-time Professional / Resignation'}
          >
            {isDark ? (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] hidden sm:inline">Dark: Resignation</span>
                <span className="text-[11px] sm:hidden">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[11px] hidden sm:inline">Light: Outreach</span>
                <span className="text-[11px] sm:hidden">Light</span>
              </>
            )}
          </button>

          {/* Saved Notes */}
          <button
            onClick={() => setIsSavedNotesModalOpen(true)}
            className={`px-3 py-1.5 rounded-xl active:scale-95 border transition-all flex items-center gap-1.5 shadow-2xs relative ${
              isDark
                ? 'hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                : 'hover:bg-white/70 border-transparent hover:border-white/80 text-slate-700 hover:text-indigo-700'
            }`}
            title="View saved notes and drafts"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-indigo-600'}`} />
            <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Saved Notes</span>
            {savedNotes.length > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white shadow-2xs ${
                  isDark ? 'bg-amber-600 text-slate-950 font-bold' : 'bg-indigo-600'
                }`}
              >
                {savedNotes.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsKbDrawerOpen(true)}
            className={`px-3 py-1.5 rounded-xl active:scale-95 border transition-all flex items-center gap-1.5 shadow-2xs ${
              isDark
                ? 'hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                : 'hover:bg-white/70 border-transparent hover:border-white/80 text-slate-700 hover:text-indigo-700'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-indigo-500'}`} />
            <span className="hidden sm:inline">Knowledge Base</span>
          </button>
          
          <button
            onClick={() => setIsSystemModalOpen(true)}
            className={`px-3 py-1.5 rounded-xl active:scale-95 border transition-all flex items-center gap-1.5 shadow-2xs ${
              isDark
                ? 'hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                : 'hover:bg-white/70 border-transparent hover:border-white/80 text-slate-700 hover:text-indigo-700'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-indigo-500'}`} />
            <span className="hidden sm:inline">System Instructions</span>
          </button>

          <button
            onClick={() => setIsInfoModalOpen(true)}
            className={`px-3 py-1.5 rounded-xl active:scale-95 border transition-all flex items-center gap-1.5 shadow-2xs ${
              isDark
                ? 'hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                : 'hover:bg-white/70 border-transparent hover:border-white/80 text-slate-700 hover:text-indigo-700'
            }`}
            title="System Architecture Diagram & Agent Info"
          >
            <Info className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-indigo-500'}`} />
            <span className="hidden sm:inline">Info</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Title */}
        <div className="mb-4 sm:mb-5 px-1 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className={`text-sm sm:text-base font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              {isDark
                ? "Hi, I'm Your Peer Career Advisor & Resignation Mentor"
                : "Hi, I'm Your Peer Career Advisor & Mentor"}
            </h1>
            <p className={`text-xs mt-1 leading-normal max-w-3xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isDark
                ? "A sounding board providing strategic perspective, drafting diplomatic resignation letters, planning transition handover, and preserving professional bridges."
                : "A sounding board providing candid feedback, drafting confident peer-level outreach messages, and calibrating your internship search without excessive deference."}
            </p>
          </div>

          {/* Quick indicator of active mode */}
          <div
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 shadow-2xs ${
              isDark
                ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                : 'bg-indigo-50 border-indigo-200/80 text-indigo-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-amber-400' : 'bg-indigo-500'}`} />
            <span>Mode: {isDark ? 'Dark (Resignation)' : 'Light (Internship Outreach)'}</span>
          </div>
        </div>

        {/* 2. Chat 和 draft outcome 之间可拖拽调整宽度比例 */}
        <div
          ref={splitContainerRef}
          style={{
            ['--left-width' as any]: `${splitRatio}%`,
            ['--right-width' as any]: `${100 - splitRatio}%`,
          }}
          className="flex-1 flex flex-col lg:flex-row gap-0 items-start w-full relative"
        >
          {/* ================= LEFT COLUMN: Chatbot ================= */}
          <div
            style={{ width: `var(--left-width, ${splitRatio}%)` }}
            className={`w-full lg:w-[var(--left-width)] flex flex-col h-[740px] rounded-3xl p-4 sm:p-5 relative overflow-hidden transition-[width] duration-75 border ${
              isDark
                ? 'bg-slate-900/90 border-slate-800 shadow-xl'
                : 'glass-panel-elevated'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 px-1">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                  isDark ? 'bg-amber-400 shadow-amber-400/50' : 'bg-emerald-500 shadow-emerald-400/50'
                }`} />
                <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Advisor Chat
                </h2>
              </div>
              {/* Reset button */}
              <button
                type="button"
                onClick={handleOpenResetModal}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border shadow-2xs flex items-center gap-1.5 transition-all active:scale-95 ${
                  isDark
                    ? 'text-slate-300 hover:text-rose-400 bg-slate-800 hover:bg-slate-750 border-slate-700'
                    : 'text-slate-600 hover:text-rose-600 bg-white/70 hover:bg-white border-white/90'
                }`}
                title="Reset conversation and parameters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Top Parameters Card */}
            <div className="mb-3">
              <ParametersCard
                key={parametersResetKey}
                context={context}
                quickActionTags={quickActionTags}
                selectedTagId={selectedTagId}
                hideQuickActions={hideQuickActions}
                themeMode={themeMode}
                onSelectQuickActionTag={handleSelectQuickActionTag}
                onDeselectQuickActionTag={handleDeselectQuickActionTag}
                onOpenAddModal={() => setIsAddCustomModalOpen(true)}
                onSaveParameters={handleSaveParameters}
                onQuickDraft={handleQuickDraft}
                onSkip={handleSkipParameters}
              />
            </div>

            {/* Messages Thread (Glass Scroll Container) */}
            <div
              className={`flex-1 overflow-y-auto rounded-2xl border shadow-inner mb-3 p-1.5 min-h-0 divide-y ${
                isDark
                  ? 'bg-slate-900/70 border-slate-800 divide-slate-800'
                  : 'bg-white/60 backdrop-blur-md border-white/80 divide-slate-100/60'
              }`}
            >
              {messages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  themeMode={themeMode}
                  onSendFeedback={handleSendMessage}
                  onRetry={message.isError ? () => handleRetry() : undefined}
                />
              ))}

              {isStreaming && (
                <div
                  className={`py-3 px-4 rounded-xl flex items-center gap-2.5 text-xs m-2 border ${
                    isDark
                      ? 'bg-amber-950/30 border-amber-900/50 text-amber-300'
                      : 'bg-indigo-50/60 backdrop-blur-md border-indigo-100/60 text-indigo-700'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full animate-ping ${isDark ? 'bg-amber-400' : 'bg-indigo-600'}`} />
                  <span className="font-semibold">Peer Advisor is analyzing and formulating perspective...</span>
                </div>
              )}

              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Error Banner with Retry */}
            {errorMsg && (
              <div
                className={`mb-3 p-3 border rounded-2xl text-xs flex items-center justify-between gap-2 shadow-sm animate-fade-in ${
                  isDark
                    ? 'bg-amber-950/40 border-amber-900/80 text-amber-300'
                    : 'bg-amber-50/80 backdrop-blur-md border-amber-200/80 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="truncate font-medium">{errorMsg}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {lastPrompt && (
                    <button
                      type="button"
                      onClick={() => handleRetry()}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Retry
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setErrorMsg(null)}
                    className="text-amber-500 hover:text-amber-800 p-1 rounded transition-colors"
                    title="Dismiss alert"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Controls Area (Quick Advice + Input) */}
            <div
              className={`rounded-2xl p-3 shadow-sm space-y-2.5 border ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'glass-panel'
              }`}
            >
              {/* Quick Advice Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Quick advice:
                </span>
                <button
                  type="button"
                  onClick={() => handleQuickAdvice('deferential')}
                  className={`px-3 py-1 rounded-full border text-xs font-medium transition-all shadow-2xs hover:shadow-xs active:scale-95 ${
                    isDark
                      ? 'border-amber-700/50 bg-slate-800 hover:bg-slate-750 text-amber-300'
                      : 'border-indigo-200/70 bg-white/70 hover:bg-indigo-50 text-indigo-700'
                  }`}
                >
                  {isDark ? 'Too apologetic?' : 'Too deferential?'}
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdvice('excuses')}
                  className={`px-3 py-1 rounded-full border text-xs font-medium transition-all shadow-2xs hover:shadow-xs active:scale-95 ${
                    isDark
                      ? 'border-amber-700/50 bg-slate-800 hover:bg-slate-750 text-amber-300'
                      : 'border-indigo-200/70 bg-white/70 hover:bg-indigo-50 text-indigo-700'
                  }`}
                >
                  {isDark ? 'Over-explaining?' : 'Making excuses?'}
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdvice('followup')}
                  className={`px-3 py-1 rounded-full border text-xs font-medium transition-all shadow-2xs hover:shadow-xs active:scale-95 ${
                    isDark
                      ? 'border-amber-700/50 bg-slate-800 hover:bg-slate-750 text-amber-300'
                      : 'border-indigo-200/70 bg-white/70 hover:bg-indigo-50 text-indigo-700'
                  }`}
                >
                  {isDark ? 'Handover logistics?' : 'Follow-up advice?'}
                </button>
              </div>

              {/* Input Form with Glass Liquid Aesthetics */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className={`flex items-center gap-2 rounded-2xl px-3 py-2 shadow-inner transition-all border ${
                  isDark
                    ? 'bg-slate-850/90 border-slate-750 focus-within:border-amber-500/80 focus-within:ring-2 focus-within:ring-amber-500/20'
                    : 'bg-white/75 backdrop-blur-md border-white/90 focus-within:border-indigo-500/80 focus-within:ring-3 focus-within:ring-indigo-100'
                }`}
              >
                <input
                  ref={chatInputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isDark
                      ? "Discuss notice period, review handover details, or ask for letter critique..."
                      : "Ask for feedback, tone critique, or share what happened..."
                  }
                  className={`flex-1 bg-transparent border-0 outline-none text-xs sm:text-sm py-1 ${
                    isDark ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-800 placeholder:text-slate-400'
                  }`}
                  disabled={isStreaming}
                />

                {/* Hidden native file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".txt,.md,.doc,.docx,.pdf"
                />

                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-colors ${
                    isDark ? 'text-slate-300 hover:text-white hover:bg-slate-750' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  Upload
                </button>

                {/* Send Button */}
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={handleStopStreaming}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-600 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs"
                  >
                    <StopCircle className="w-3.5 h-3.5" />
                    Stop
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-40 ${
                      isDark
                        ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-slate-950 font-bold shadow-amber-500/20 disabled:hover:from-amber-600 disabled:hover:to-amber-500'
                        : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-indigo-500/20 disabled:hover:from-indigo-600 disabled:hover:to-indigo-500'
                    }`}
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* 2. Drag handle divider between Chat and Draft Outcome (Visible on lg screens) */}
          <div
            onMouseDown={() => setIsDragging(true)}
            className="hidden lg:flex items-center justify-center w-5 cursor-col-resize group relative z-30 self-stretch select-none"
            title="Drag to resize panels"
          >
            <div
              className={`w-1.5 h-16 rounded-full border shadow-xs flex items-center justify-center transition-all ${
                isDark
                  ? 'bg-slate-800 group-hover:bg-amber-500 group-hover:w-2 border-slate-700'
                  : 'bg-white/70 group-hover:bg-indigo-500/80 group-hover:w-2 border-white/80'
              }`}
            >
              <GripVertical
                className={`w-3.5 h-3.5 transition-colors ${
                  isDark ? 'text-slate-500 group-hover:text-slate-950' : 'text-slate-400 group-hover:text-white'
                }`}
              />
            </div>
          </div>

          {/* Mobile spacing between columns */}
          <div className="h-6 lg:hidden" />

          {/* ================= RIGHT COLUMN: The Outcome Draft ================= */}
          <div
            style={{ width: `var(--right-width, ${100 - splitRatio}%)` }}
            className="w-full lg:w-[var(--right-width)] transition-[width] duration-75"
          >
            {/* 3 & 5: Save button in OutcomeDraftView and hide subject line when not email */}
            <OutcomeDraftView
              draft={outcomeDraft}
              formAndLength={context.formAndLength}
              themeMode={themeMode}
              onQuickRevision={handleQuickRevision}
              onAcceptDraft={handleAcceptDraft}
              onSaveDraftNote={handleSaveDraftNote}
              onUpdateDraft={(updated) => setOutcomeDraft(updated)}
            />
          </div>
        </div>
      </main>

      {/* Add Custom Parameter Action Tag Modal */}
      <AddCustomActionModal
        isOpen={isAddCustomModalOpen}
        themeMode={themeMode}
        onClose={() => setIsAddCustomModalOpen(false)}
        onAdd={handleAddCustomTag}
      />

      {/* 4. Saved Notes Modal */}
      <SavedNotesModal
        isOpen={isSavedNotesModalOpen}
        themeMode={themeMode}
        onClose={() => setIsSavedNotesModalOpen(false)}
        savedNotes={savedNotes}
        onUseNote={handleUseSavedNote}
        onDeleteNote={handleDeleteSavedNote}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        themeMode={themeMode}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleExecuteReset}
      />

      {/* Modals & Drawers */}
      <SystemInstructionsModal
        isOpen={isSystemModalOpen}
        themeMode={themeMode}
        onClose={() => setIsSystemModalOpen(false)}
      />

      <SystemDiagramModal
        isOpen={isInfoModalOpen}
        themeMode={themeMode}
        onClose={() => setIsInfoModalOpen(false)}
      />

      <KnowledgeBaseDrawer
        isOpen={isKbDrawerOpen}
        themeMode={themeMode}
        onClose={() => setIsKbDrawerOpen(false)}
      />
    </div>
  );
}
