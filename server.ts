import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

const SYSTEM_INSTRUCTIONS_BASE = `SYSTEM INSTRUCTIONS:
Role Name:
Peer Career Advisor/Mentor with Professional Experience

Purpose:
Act as a guide or peer mentor in a professional context. Provide perspective and feedback as if they were a more experienced professional. 

Behavioral Rules:
- Use a professional tone - act as a sounding board
- Show empathy but do not focus on or dive too deeply into emotions
- Demonstrate judgement, background, and knowledge about the situation or context given
- Identify the context by asking clarifying questions that weren’t specified by the user
- Use language as if the user was talking to someone who is their peer but with more experience
- Don’t start with an extremely deferential tone when drafting the email as it may sound unnatural. 
- Be respectful to the user but most importantly be critical and judgemental on any given materials from the user if they ask the agent to give feedback.

Interaction Loop:
- Ask for as much context as possible from the user using straightforward and measured language, not too formal or too casual.
- If the user expresses worry or concern, provide straightforward feedback.
- Based on the user’s request and context provided, identify any missing info that is needed to make a more accurate judgement.
- If context is enough, generate a first draft of the email according to the user’s desired tone and keep in mind the context and background of the person potentially receiving the email.
- Ask the user to read over it and if further revisions are required. Keep it short.
- When the user provides more information and feedback about desired tone, quality, word usage, provide a rewritten draft without being too deferential.
- Keep revising until the user answers affirmatively to the output. 
- Do not provide feedback and next steps until user affirms that they like the email draft.

Boundaries:
- Help the user come to a conclusion to solve the problem. Do not make assumptions of the context without confirming with the user. Use placeholder text ([name]) for unknown inputs instead of making assumptions. Do not continue conversations regarding safety concerns or harmful behavior.

Does not do:
- Evaluate situation without giving suggestions
- Act like it has awareness of human physicality (saying it feels pain empathetically, saying that it understands emotions, etc.)
- Invent excuses or misrepresent what actually happened to make the apology more sympathetic

Required Inputs:
From the user: context of situation relationship with recipient and desired outcomes (e.g. what is the purpose of email). Provide the letter’s desired tone and their desired approximate length for the email.

Outputs (Both modes):
- Feedback on the user’s words or uploaded materials
- Alternative wording if a point is true but hard to say
- Do not provide the next steps or feedback until user specifically asks
- After each draft generated, ask "is this ok?"
- Once the user responds positively to the question, give tips for future reference after drafting email and suggested next steps to reach general goal

DRAFT FORMATTING & UI DISPLAY RULES:
- Whenever you generate or revise an email, LinkedIn note, reach-out draft, or resignation letter, you MUST wrap the drafted message inside <<<DRAFT>>> and <<<END_DRAFT>>> tags.
- For Email / Formal Letter formats:
<<<DRAFT>>>
Subject: <subject line or formal heading>

<complete message body>
<<<END_DRAFT>>>
- For non-email message formats (e.g. Linkedin Notes, Slack/Teams direct message): Do NOT include a Subject line. Format directly as:
<<<DRAFT>>>
<complete message body>
<<<END_DRAFT>>>
- In your conversational chat text, provide your peer commentary, rationale, and ask "is this ok?".
- CRITICAL: Never write or repeat the drafted letter/message body outside of the <<<DRAFT>>>...<<<END_DRAFT>>> block. The dedicated "Outcome Draft" panel on the right side of the screen will display the draft to the user; the chat box must only contain your conversational peer mentoring.`;

const LIGHT_MODE_INSTRUCTIONS = `${SYSTEM_INSTRUCTIONS_BASE}

Engagement Context:
Light mode: The user is a graduate student seeking professional mentorship and guidance on finding internships.

Outputs:
Light Mode: A draft of a professional-sounding reach-out letter/message/email

Knowledge Base (Light Mode):
- https://www.indeed.com/career-advice/career-development/how-to-write-a-professional-email
- https://e3-stem.camden.rutgers.edu/professional-email-templates/
- https://www.linkedin.com/pulse/6-message-templates-linkedin-connection-request-success-/
- https://www.linkedin.com/posts/mallorycontois_i-got-lots-of-asks-for-an-example-of-a-good-share-7345415601470808067-dBkz/
- https://www.linkedin.com/posts/rachel-bourne_jobsearch-resumetips-atsoptimization-share-7384585261961154560-ttcJ/
- https://www.linkedin.com/pulse/9-design-portfolios-inspire-you-tom-scott-rjyoe/`;

const DARK_MODE_INSTRUCTIONS = `${SYSTEM_INSTRUCTIONS_BASE}

Engagement Context:
Dark mode: The user has worked full time and decided to resign.

Outputs:
Dark Mode: A draft of a resignation letter

Knowledge Base (Dark Mode):
- http://phoenix.edu/blog/how-to-write-a-formal-resignation-letter-with-examples.html
- https://www.linkedin.com/pulse/how-write-resignation-letter-leaves-good-impression-monster-khgge/
- https://www.indeed.com/career-advice/career-development/formal-letter-of-resignation`;

const SYSTEM_INSTRUCTIONS = LIGHT_MODE_INSTRUCTIONS;


let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in the environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// System instruction metadata endpoint
app.get("/api/system-instructions", (req, res) => {
  const mode = (req.query.mode as string) === "dark" ? "dark" : "light";
  if (mode === "dark") {
    res.json({
      roleName: "Peer Career Advisor/Mentor with Professional Experience",
      purpose: "Act as a guide or peer mentor in a professional context. Provide perspective and feedback as if they were a more experienced professional.",
      mode: "dark",
      context: "The user has worked full time and decided to resign.",
      raw: DARK_MODE_INSTRUCTIONS,
      knowledgeBase: [
        { title: "Phoenix: How to Write a Formal Resignation Letter with Examples", url: "http://phoenix.edu/blog/how-to-write-a-formal-resignation-letter-with-examples.html" },
        { title: "Monster & LinkedIn: How to Write a Resignation Letter that Leaves a Good Impression", url: "https://www.linkedin.com/pulse/how-write-resignation-letter-leaves-good-impression-monster-khgge/" },
        { title: "Indeed: Formal Letter of Resignation Guide & Samples", url: "https://www.indeed.com/career-advice/career-development/formal-letter-of-resignation" }
      ]
    });
  } else {
    res.json({
      roleName: "Peer Career Advisor/Mentor with Professional Experience",
      purpose: "Act as a guide or peer mentor in a professional context. Provide perspective and feedback as if they were a more experienced professional.",
      mode: "light",
      context: "The user is a graduate student seeking professional mentorship and guidance on finding internships.",
      raw: LIGHT_MODE_INSTRUCTIONS,
      knowledgeBase: [
        { title: "Indeed: How to Write a Professional Email", url: "https://www.indeed.com/career-advice/career-development/how-to-write-a-professional-email" },
        { title: "Rutgers: Professional Email Templates", url: "https://e3-stem.camden.rutgers.edu/professional-email-templates/" },
        { title: "LinkedIn: Message Templates for Connection Requests", url: "https://www.linkedin.com/pulse/6-message-templates-linkedin-connection-request-success-/" },
        { title: "LinkedIn: Networking outreach examples (Mallory Contois)", url: "https://www.linkedin.com/posts/mallorycontois_i-got-lots-of-asks-for-an-example-of-a-good-share-7345415601470808067-dBkz/" },
        { title: "LinkedIn: Job search & ATS optimization (Rachel Bourne)", url: "https://www.linkedin.com/posts/rachel-bourne_jobsearch-resumetips-atsoptimization-share-7384585261961154560-ttcJ/" },
        { title: "LinkedIn: Design portfolios to inspire you (Tom Scott)", url: "https://www.linkedin.com/pulse/9-design-portfolios-inspire-you-tom-scott-rjyoe/" }
      ]
    });
  }
});

// Candidate models to try in order during temporary high-demand (503) or rate limits (429)
// gemini-3.1-flash-lite and gemini-flash-latest are fast and highly available;
// gemini-3.8-flash and gemini-3.1-pro-preview serve as robust alternatives.
const CANDIDATE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-3.8-flash",
  "gemini-3.1-pro-preview",
];

function formatGeminiError(error: any): string {
  if (!error) return "An unexpected error occurred while communicating with the advisor.";
  let rawMsg = error?.message || String(error);

  // Extract nested JSON error if present from @google/genai ApiError
  try {
    let parsed = JSON.parse(rawMsg);
    while (parsed && typeof parsed === "object") {
      if (typeof parsed.error === "string") {
        try {
          parsed = JSON.parse(parsed.error);
        } catch {
          rawMsg = parsed.error;
          break;
        }
      } else if (parsed.error?.message) {
        if (typeof parsed.error.message === "string" && parsed.error.message.trim().startsWith("{")) {
          try {
            parsed = JSON.parse(parsed.error.message);
          } catch {
            rawMsg = parsed.error.message;
            break;
          }
        } else {
          rawMsg = parsed.error.message;
          break;
        }
      } else if (parsed.message) {
        rawMsg = parsed.message;
        break;
      } else {
        break;
      }
    }
  } catch {
    // Non-JSON string, use rawMsg
  }

  if (rawMsg.includes("503") || rawMsg.includes("high demand") || rawMsg.includes("UNAVAILABLE")) {
    return "The model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again in a moment.";
  }
  if (rawMsg.includes("429") || rawMsg.includes("RESOURCE_EXHAUSTED") || rawMsg.includes("quota")) {
    return "Rate limit reached. Please wait a few seconds and try again.";
  }
  if (rawMsg.includes("API_KEY") || rawMsg.includes("API key")) {
    return "GEMINI_API_KEY is not configured or invalid. Please check Settings > Secrets.";
  }

  return rawMsg;
}

async function streamWithModelFallback(
  ai: GoogleGenAI,
  contents: any,
  systemInstruction: string,
  res: express.Response
) {
  let lastError: any = null;

  for (let i = 0; i < CANDIDATE_MODELS.length; i++) {
    const model = CANDIDATE_MODELS[i];
    try {
      const responseStream = await ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      // Verify the stream responds before committing SSE headers.
      // If the model is experiencing 503/429, .next() will reject here,
      // allowing us to fall back safely to the next model in CANDIDATE_MODELS.
      const iterator = responseStream[Symbol.asyncIterator]();
      const firstResult = await iterator.next();

      // Headers can now be safely committed
      if (!res.headersSent) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
      }

      if (!firstResult.done && firstResult.value?.text) {
        res.write(`data: ${JSON.stringify({ text: firstResult.value.text })}\n\n`);
      }

      // Stream remaining chunks
      while (true) {
        const item = await iterator.next();
        if (item.done) break;
        if (item.value?.text) {
          res.write(`data: ${JSON.stringify({ text: item.value.text })}\n\n`);
        }
      }

      res.write("data: [DONE]\n\n");
      res.end();
      return; // Stream finished successfully
    } catch (err: any) {
      lastError = err;
      const errMsg = String(err?.message || "");
      console.warn(`[Gemini] Candidate model '${model}' failed: ${errMsg.slice(0, 160)}`);

      // If headers were already committed, write error payload to stream
      if (res.headersSent) {
        const friendlyError = formatGeminiError(err);
        res.write(`data: ${JSON.stringify({ error: friendlyError })}\n\n`);
        res.end();
        return;
      }

      // If headers were not sent, pause briefly and try next model
      if (i < CANDIDATE_MODELS.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
  }

  // If all candidate models failed before sending headers, rethrow lastError
  throw lastError;
}

// Chat completion endpoint (with SSE streaming and model fallback)
app.post("/api/chat", async (req, res) => {
  const { messages, context, mode } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  try {
    const ai = getAi();

    // Map messages into @google/genai format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Choose base instructions based on mode
    const isDarkMode = mode === "dark";
    let effectiveSystemInstructions = isDarkMode ? DARK_MODE_INSTRUCTIONS : LIGHT_MODE_INSTRUCTIONS;

    if (context && typeof context === 'object') {
      const hasInputs =
        Boolean(context.situation?.trim()) ||
        Boolean(context.relationship?.trim()) ||
        Boolean(context.desiredOutcome?.trim()) ||
        Boolean(context.tone?.trim()) ||
        Boolean(context.formAndLength?.trim());

      if (hasInputs) {
        const isEmail = (context.formAndLength || '').toLowerCase().includes('email') || (context.formAndLength || '').toLowerCase().includes('formal');
        const subjectRule = isEmail
          ? "This is an email/formal letter format: include a relevant 'Subject: <subject line or formal resignation heading>' line."
          : "This is a non-email format (" + (context.formAndLength || 'message/notes') + "): DO NOT include a 'Subject:' line.";

        const defaultSituation = isDarkMode
          ? '[Unspecified - full-time employee resigning/transitioning]'
          : '[Unspecified - use standard graduate student seeking internship/advice]';

        const defaultRelationship = isDarkMode
          ? '[Direct Manager / Supervisor / HR Lead]'
          : '[Professional Contact / Industry Peer]';

        const defaultOutcome = isDarkMode
          ? '[Formal resignation notice with graceful 2-week transition]'
          : '[15-min chat / internship inquiry]';

        effectiveSystemInstructions += `\n\nACTIVE USER SAVED PARAMETERS:
The user has configured and saved the following parameters in the interface. When the user asks you to write, draft, help with, or generate an outreach letter/message or resignation letter, YOU MUST IMMEDIATELY RECOGNIZE AND USE THESE PARAMETERS DIRECTLY to generate the draft. DO NOT ask the user to repeat, confirm, or re-enter any information already provided below:
- Situation: ${context.situation?.trim() || defaultSituation}
- Recipient & Relationship: ${context.relationship?.trim() || defaultRelationship}
- Desired Outcome: ${context.desiredOutcome?.trim() || defaultOutcome}
- Desired Tone: ${context.tone?.trim() || '[Confident & professional peer-level, no excessive deference]'}
- Form & Length: ${context.formAndLength?.trim() || (isDarkMode ? '[Formal Letter]' : '[Email (short)]')}
- Format Subject Rule: ${subjectRule}

CRITICAL: Since the user already input and saved these parameters, proceed directly to crafting the draft within <<<DRAFT>>>...<<<END_DRAFT>>> without asking them to re-specify what is already established above!`;
      }
    }

    // Stream with model fallback
    await streamWithModelFallback(ai, contents, effectiveSystemInstructions, res);
  } catch (error: any) {
    console.error("Gemini API error:", error);
    const friendlyError = formatGeminiError(error);

    if (!res.headersSent) {
      res.status(503).json({
        error: friendlyError,
      });
    } else {
      res.write(`data: ${JSON.stringify({ error: friendlyError })}\n\n`);
      res.end();
    }
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
