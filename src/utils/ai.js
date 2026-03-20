/**
 * AI Summarizer Utility
 * Supports: OpenAI GPT-4, Rule-based (free, no API key)
 */

// ── Rule-Based Summarizer (Free, No API Key) ───────────────
function ruleBasedSummary(text, mode) {
  const sentences = text
    .replace(/\n+/g, ' ')
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 40 && s.length < 300);

  if (sentences.length === 0) {
    return 'Could not extract meaningful content from this page.';
  }

  // Score sentences by importance
  const wordFreq = {};
  sentences.forEach(s => {
    s.toLowerCase().split(/\s+/).forEach(w => {
      if (w.length > 4) wordFreq[w] = (wordFreq[w] || 0) + 1;
    });
  });

  const scored = sentences.map(s => {
    const words = s.toLowerCase().split(/\s+/);
    const score = words.reduce((acc, w) => acc + (wordFreq[w] || 0), 0) / words.length;
    return { sentence: s, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const limit = mode === 'brief' ? 3 : mode === 'bullets' ? 5 : 4;
  const top = scored.slice(0, limit).map(s => s.sentence);

  if (mode === 'bullets') {
    return '**Key Points:**\n\n' + top.map(s => `• ${s}`).join('\n');
  }
  if (mode === 'brief') {
    return top.join('. ') + '.';
  }

  return '**Summary:**\n\n' + top.join('. ') + '.';
}

// ── OpenAI Summarizer ──────────────────────────────────────
async function openAISummary(text, mode, apiKey, model = 'gpt-4o-mini') {
  const modePrompts = {
    full:      'Provide a clear, comprehensive summary in 3-4 paragraphs.',
    brief:     'Provide a very brief 2-3 sentence summary.',
    bullets:   'Summarize as 5-7 bullet points covering the key information.',
    eli5:      'Explain this in simple terms as if explaining to a 10-year-old.',
    academic:  'Provide an academic-style abstract summary.',
    selection: 'Summarize this selected text clearly and concisely.'
  };

  const prompt = modePrompts[mode] || modePrompts.full;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert at summarizing web content clearly and accurately. Be concise and informative.'
        },
        {
          role: 'user',
          content: `${prompt}\n\nContent:\n${text.substring(0, 6000)}`
        }
      ],
      temperature: 0.3,
      max_tokens: 600
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'OpenAI API error');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ── Main Summarize Function ────────────────────────────────
export async function summarizeText(text, mode = 'full', settings = {}) {
  if (!text || text.trim().length < 50) {
    return {
      summary: 'Not enough content to summarize on this page.',
      provider: 'none'
    };
  }

  const provider = settings.provider || 'rule-based';

  try {
    if (provider === 'openai' && settings.apiKey) {
      const summary = await openAISummary(
        text, mode,
        settings.apiKey,
        settings.model || 'gpt-4o-mini'
      );
      return { summary, provider: 'openai' };
    }
  } catch (err) {
    console.warn('OpenAI failed, falling back to rule-based:', err.message);
  }

  // Fallback: rule-based
  const summary = ruleBasedSummary(text, mode);
  return { summary, provider: 'rule-based' };
}
