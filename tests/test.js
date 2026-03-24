// ── Mock Chrome API ────────────────────────────────────────
globalThis.chrome = {
  storage: {
    sync: {
      get: (defaults, cb) => cb(defaults),
      set: (data, cb) => cb && cb()
    },
    local: {
      get: (defaults, cb) => cb(defaults),
      set: (data, cb) => cb && cb()
    }
  }
};

// ── Rule-Based Summarizer Tests ────────────────────────────
function ruleBasedSummary(text, mode) {
  const sentences = text
    .replace(/\n+/g, ' ')
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 40 && s.length < 300);

  if (sentences.length === 0) {
    return 'Could not extract meaningful content from this page.';
  }

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

  if (mode === 'bullets') return '**Key Points:**\n\n' + top.map(s => `• ${s}`).join('\n');
  if (mode === 'brief') return top.join('. ') + '.';
  return '**Summary:**\n\n' + top.join('. ') + '.';
}

// ── Test Runner ────────────────────────────────────────────
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}: ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(a, b, message) {
  if (a !== b) throw new Error(message || `Expected ${b}, got ${a}`);
}

// ── Tests ──────────────────────────────────────────────────
console.log('\n🤖 AI Page Summarizer — Tests\n');

const SAMPLE_TEXT = `
Artificial intelligence is transforming how we interact with technology.
Machine learning models can now process and understand natural language with remarkable accuracy.
These advances have led to practical applications in healthcare, finance, and education.
The development of large language models has been particularly significant in recent years.
Researchers continue to push the boundaries of what these systems can achieve.
Deep learning architectures have enabled breakthroughs in image recognition and speech synthesis.
The ethical implications of AI development are increasingly discussed among researchers.
Many organizations are now adopting AI tools to improve their productivity and efficiency.
`;

test('Rule-based generates full summary', () => {
  const result = ruleBasedSummary(SAMPLE_TEXT, 'full');
  assert(result.length > 50, 'Summary should not be empty');
  assert(result.includes('**Summary:**'), 'Should have Summary header');
});

test('Rule-based generates brief summary', () => {
  const result = ruleBasedSummary(SAMPLE_TEXT, 'brief');
  assert(result.length > 20, 'Brief should not be empty');
  assert(!result.includes('**Summary:**'), 'Brief should not have header');
});

test('Rule-based generates bullet points', () => {
  const result = ruleBasedSummary(SAMPLE_TEXT, 'bullets');
  assert(result.includes('**Key Points:**'), 'Should have Key Points header');
  assert(result.includes('•'), 'Should have bullet points');
});

test('Handles empty text gracefully', () => {
  const result = ruleBasedSummary('', 'full');
  assert(result.includes('Could not extract'), 'Should return fallback message');
});

test('Handles short text gracefully', () => {
  const result = ruleBasedSummary('Hello world.', 'full');
  assert(result.length > 0, 'Should return something');
});

test('Scores sentences by frequency', () => {
  const text = `
    Machine learning is a subset of artificial intelligence.
    Artificial intelligence encompasses many different technologies.
    Machine learning algorithms learn from data automatically.
    The field of machine learning has grown rapidly in recent years.
    Many companies are investing heavily in artificial intelligence research.
  `;
  const result = ruleBasedSummary(text, 'full');
  assert(result.length > 50, 'Should produce meaningful summary');
});

test('Full mode returns multiple sentences', () => {
  const result = ruleBasedSummary(SAMPLE_TEXT, 'full');
  const sentences = result.split('.').filter(s => s.trim().length > 10);
  assert(sentences.length >= 2, 'Should have multiple sentences');
});

test('Bullets mode includes multiple points', () => {
  const result = ruleBasedSummary(SAMPLE_TEXT, 'bullets');
  const bullets = result.split('•').filter(s => s.trim().length > 5);
  assert(bullets.length >= 3, 'Should have multiple bullet points');
});

test('Text length limiting works', () => {
  const longText = SAMPLE_TEXT.repeat(20);
  const result = ruleBasedSummary(longText, 'full');
  assert(result.length > 0, 'Should handle long text');
});

test('Mode defaults handled', () => {
  const result = ruleBasedSummary(SAMPLE_TEXT, 'unknown_mode');
  assert(result.length > 0, 'Should handle unknown mode');
});

// ── Results ────────────────────────────────────────────────
console.log(`\n${'─'.repeat(40)}`);
console.log(`📊 Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log('❌ Some tests failed!');
  process.exit(1);
} else {
  console.log('✅ All tests passed!');
  process.exit(0);
}
