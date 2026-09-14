import type { IncomingMessage, ServerResponse } from "http";
import { GoogleGenAI } from "@google/genai";

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

const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-3.8-flash",
];

async function readRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed. Use POST." }));
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "GEMINI_API_KEY is not configured in Vercel Environment Variables.",
      })
    );
    return;
  }

  try {
    const body = await readRequestBody(req);
    const { messages = [], context, mode = "light" } = body;

    const isDark = mode === "dark";
    let effectiveSystemInstructions = isDark
      ? DARK_MODE_INSTRUCTIONS
      : LIGHT_MODE_INSTRUCTIONS;

    if (context && Object.keys(context).length > 0) {
      const { situation, relationship, desiredOutcome, tone, formAndLength } =
        context;
      if (
        situation ||
        relationship ||
        desiredOutcome ||
        tone ||
        formAndLength
      ) {
        effectiveSystemInstructions += `\n\n[USER CONTEXT PARAMETERS PREVIOUSLY CONFIGURED BY USER]:
- Situation: ${situation || "Not provided"}
- Recipient / Relationship: ${relationship || "Not provided"}
- Desired Outcome: ${desiredOutcome || "Not provided"}
- Tone: ${tone || "Not provided"}
- Form & Length: ${formAndLength || "Not provided"}
Use these provided context details to immediately generate or tailor drafts. Do NOT ask the user to re-provide these inputs.`;
      }
    }

    const contents: any[] = [];
    for (const msg of messages) {
      const parts: any[] = [];
      if (msg.content) {
        parts.push({ text: msg.content });
      }
      if (msg.attachments && Array.isArray(msg.attachments)) {
        for (const att of msg.attachments) {
          if (att.data && att.mimeType) {
            const base64Data = att.data.includes(",")
              ? att.data.split(",")[1]
              : att.data;
            parts.push({
              inlineData: {
                data: base64Data,
                mimeType: att.mimeType,
              },
            });
          }
        }
      }
      if (parts.length > 0) {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts,
        });
      }
    }

    if (contents.length === 0) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "No messages provided." }));
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    let lastError: any = null;

    for (let i = 0; i < CANDIDATE_MODELS.length; i++) {
      const model = CANDIDATE_MODELS[i];
      try {
        const responseStream = await ai.models.generateContentStream({
          model,
          contents,
          config: {
            systemInstruction: effectiveSystemInstructions,
            temperature: 0.7,
          },
        });

        const iterator = responseStream[Symbol.asyncIterator]();
        const firstResult = await iterator.next();

        // Safe to send SSE headers now
        res.writeHead(200, {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
        });

        if (!firstResult.done && firstResult.value?.text) {
          res.write(
            `data: ${JSON.stringify({ text: firstResult.value.text })}\n\n`
          );
        }

        while (true) {
          const item = await iterator.next();
          if (item.done) break;
          if (item.value?.text) {
            res.write(
              `data: ${JSON.stringify({ text: item.value.text })}\n\n`
            );
          }
        }

        res.write("data: [DONE]\n\n");
        res.end();
        return;
      } catch (err: any) {
        lastError = err;
        console.warn(
          `[Vercel Serverless] Model '${model}' failed: ${err?.message?.slice(0, 140)}`
        );
        if (i < CANDIDATE_MODELS.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }
    }

    throw lastError;
  } catch (error: any) {
    console.error("Vercel /api/chat error:", error);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error:
            error?.message ||
            "The model service is temporarily unavailable. Please try again in a moment.",
        })
      );
    } else {
      res.write(
        `data: ${JSON.stringify({
          error:
            error?.message ||
            "The model service is temporarily unavailable. Please try again in a moment.",
        })}\n\n`
      );
      res.end();
    }
  }
}
