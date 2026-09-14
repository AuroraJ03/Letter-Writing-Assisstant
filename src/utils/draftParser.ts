import { OutcomeDraft } from '../types';

export interface ParsedChatOutput {
  chatText: string;
  extractedDraft: OutcomeDraft | null;
  hasDraft: boolean;
}

/**
 * Robustly separates the conversational peer advisor text from the drafted outreach letter.
 * Guarantees that the draft letter is ONLY displayed in the Outcome Draft panel and never in chat.
 */
export function separateChatAndDraft(rawText: string, formAndLength?: string): ParsedChatOutput {
  if (!rawText) {
    return { chatText: '', extractedDraft: null, hasDraft: false };
  }

  // 1. Primary check: <<<DRAFT>>> ... <<<END_DRAFT>>> tags
  if (rawText.includes('<<<DRAFT>>>')) {
    const parts = rawText.split('<<<DRAFT>>>');
    const beforeDraft = parts[0];
    const afterStart = parts[1] || '';

    let draftBlock = '';
    let afterDraft = '';

    if (afterStart.includes('<<<END_DRAFT>>>')) {
      const endParts = afterStart.split('<<<END_DRAFT>>>');
      draftBlock = endParts[0].trim();
      afterDraft = endParts.slice(1).join('<<<END_DRAFT>>>').trim();
    } else {
      // Currently streaming draft block
      draftBlock = afterStart.trim();
    }

    const draft = parseDraftContent(draftBlock, formAndLength);

    // Clean conversational text (strip draft tags)
    let cleanChat = `${beforeDraft.trim()}\n\n${afterDraft.trim()}`.trim();
    if (!cleanChat && draft) {
      cleanChat = "I've drafted your outreach message based on your parameters and goals. Take a look at The Outcome Draft on the right. Is this ok?";
    }

    return {
      chatText: cleanChat,
      extractedDraft: draft,
      hasDraft: !!draft,
    };
  }

  // 2. Secondary check: Standard markdown code block or "Subject: ..." block
  const subjectRegex = /(?:^|\n)(?:```[a-z]*\s*)?Subject:\s*([^\n]+)([\s\S]+?)(?:```|$)/i;
  const subjectMatch = rawText.match(subjectRegex);

  if (subjectMatch) {
    const fullMatch = subjectMatch[0];
    const subject = subjectMatch[1].trim();
    let body = subjectMatch[2].trim();

    // Clean trailing markdown backticks or "is this ok?" if bundled in body
    body = body.replace(/```$/g, '').trim();

    // If body contains closing questions, extract them back to chat
    const okMatch = body.match(/\n\s*(?:Is this ok\?|Does this look ok\?|Let me know if you would like any changes[\s\S]*)$/i);
    let closingAdvice = '';
    if (okMatch && okMatch.index !== undefined) {
      closingAdvice = body.substring(okMatch.index).trim();
      body = body.substring(0, okMatch.index).trim();
    }

    const words = body.split(/\s+/).filter(Boolean).length;
    const isEmail = formAndLength ? formAndLength.toLowerCase().includes('email') : true;

    const draft: OutcomeDraft = {
      subject: isEmail ? subject : '',
      body,
      wordCount: words,
      lastUpdated: Date.now(),
      raw: fullMatch,
      formAndLength,
    };

    // Remove the draft from the conversational chat
    let cleanChat = rawText.replace(fullMatch, '').trim();
    if (closingAdvice && !cleanChat.includes(closingAdvice)) {
      cleanChat = `${cleanChat}\n\n${closingAdvice}`.trim();
    }

    if (!cleanChat) {
      cleanChat = "I've drafted your outreach message. Review the draft in The Outcome Draft panel on the right. Is this ok?";
    }

    return {
      chatText: cleanChat,
      extractedDraft: draft,
      hasDraft: true,
    };
  }

  // No draft found in this text
  return {
    chatText: rawText,
    extractedDraft: null,
    hasDraft: false,
  };
}

function parseDraftContent(content: string, formAndLength?: string): OutcomeDraft | null {
  if (!content) return null;

  const isEmail = formAndLength ? formAndLength.toLowerCase().includes('email') : true;
  let subject = isEmail ? 'Reaching out regarding internship opportunity' : '';
  let body = content;

  const subjectMatch = content.match(/Subject:\s*([^\n]+)/i);
  if (subjectMatch) {
    if (isEmail) {
      subject = subjectMatch[1].trim();
    }
    body = content.substring(content.indexOf(subjectMatch[0]) + subjectMatch[0].length).trim();
  }

  // Remove code block markers if any
  body = body.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();

  // Strip trailing "is this ok" if captured inside draft
  body = body.split(/\n\s*(?:Is this ok\?|Does this look ok\?|Let me know if you)/i)[0].trim();

  const words = body.split(/\s+/).filter(Boolean).length;

  return {
    subject,
    body,
    wordCount: words,
    lastUpdated: Date.now(),
    raw: content,
    formAndLength,
  };
}
