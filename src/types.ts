export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  isError?: boolean;
}

export interface OutreachContext {
  situation: string;
  relationship: string;
  desiredOutcome: string;
  tone: string;
  formAndLength: string;
}

export interface OutcomeDraft {
  subject: string;
  body: string;
  lastUpdated: number;
  wordCount: number;
  raw?: string;
  formAndLength?: string;
}

export interface SavedNote {
  id: string;
  title: string;
  savedAt: number;
  draft: OutcomeDraft;
  parameters: OutreachContext;
}

export interface KnowledgeItem {
  title: string;
  category: string;
  description: string;
  url: string;
}

export const LIGHT_MODE_KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    title: "Indeed: How to Write a Professional Email",
    category: "Email Foundations",
    description: "Structure, subject lines, professional closings, and etiquette for career communications.",
    url: "https://www.indeed.com/career-advice/career-development/how-to-write-a-professional-email"
  },
  {
    title: "Rutgers: Professional Email Templates",
    category: "Academic & STEM",
    description: "Pre-tested formal outreach templates tailored for STEM students contacting professors and industry leads.",
    url: "https://e3-stem.camden.rutgers.edu/professional-email-templates/"
  },
  {
    title: "LinkedIn: 6 Connection Request Templates",
    category: "Networking & InMail",
    description: "High-conversion 300-character LinkedIn invitation notes that avoid sounding spammy.",
    url: "https://www.linkedin.com/pulse/6-message-templates-linkedin-connection-request-success-/"
  },
  {
    title: "Networking Outreach Insights (Mallory Contois)",
    category: "Cold Outreach",
    description: "Real-world examples of authentic, non-deferential messages that get responses from leaders.",
    url: "https://www.linkedin.com/posts/mallorycontois_i-got-lots-of-asks-for-an-example-of-a-good-share-7345415601470808067-dBkz/"
  },
  {
    title: "Job Search & ATS Optimization (Rachel Bourne)",
    category: "Internship Search",
    description: "Strategic networking and application insights from an experienced technical recruiter.",
    url: "https://www.linkedin.com/posts/rachel-bourne_jobsearch-resumetips-atsoptimization-share-7384585261961154560-ttcJ/"
  },
  {
    title: "Design & Professional Portfolios (Tom Scott)",
    category: "Portfolio & Craft",
    description: "Inspirational case studies on presenting professional experience with impact.",
    url: "https://www.linkedin.com/pulse/9-design-portfolios-inspire-you-tom-scott-rjyoe/"
  }
];

export const DARK_MODE_KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    title: "Phoenix: How to Write a Formal Resignation Letter with Examples",
    category: "Formal Resignation",
    description: "Essential structure, notice period timing, graceful departure etiquette, and professional sign-offs.",
    url: "http://phoenix.edu/blog/how-to-write-a-formal-resignation-letter-with-examples.html"
  },
  {
    title: "Monster & LinkedIn: Resignation Letter That Leaves a Good Impression",
    category: "Career Transition",
    description: "Preserving workplace relationships, positive tone calibration, and leaving on constructive terms.",
    url: "https://www.linkedin.com/pulse/how-write-resignation-letter-leaves-good-impression-monster-khgge/"
  },
  {
    title: "Indeed: Formal Letter of Resignation Guide & Samples",
    category: "Professional Standards",
    description: "Clear two-week notice wording, transition offer phrasing, and HR-ready resignation templates.",
    url: "https://www.indeed.com/career-advice/career-development/formal-letter-of-resignation"
  }
];

export const KNOWLEDGE_BASE_ITEMS: KnowledgeItem[] = LIGHT_MODE_KNOWLEDGE_BASE;

