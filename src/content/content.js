// ── Text Extractor ─────────────────────────────────────────
function extractPageText() {
  const clone = document.cloneNode(true);

  // Remove noise elements
  const noiseSelectors = [
    'script', 'style', 'nav', 'footer', 'header',
    'aside', 'advertisement', '[class*="ad-"]',
    '[class*="cookie"]', '[class*="popup"]',
    '[class*="modal"]', '[class*="banner"]',
    'iframe', 'noscript'
  ];

  noiseSelectors.forEach(sel => {
    clone.querySelectorAll(sel).forEach(el => el.remove());
  });

  // Try to find main content
  const mainSelectors = [
    'article', 'main', '[role="main"]',
    '.post-content', '.article-body', '.entry-content',
    '.content', '#content', '.post'
  ];

  for (const sel of mainSelectors) {
    const el = clone.querySelector(sel);
    if (el) {
      const text = el.innerText || el.textContent;
      if (text && text.trim().length > 300) {
        return cleanText(text);
      }
    }
  }

  // Fallback to body
  return cleanText(clone.body?.innerText || document.body.innerText);
}

function cleanText(text) {
  return text
    .replace(/\s{3,}/g, '\n\n')
    .replace(/\n{4,}/g, '\n\n')
    .trim()
    .substring(0, 8000); // Limit for API
}

// ── Overlay UI ─────────────────────────────────────────────
function showOverlay(summary, mode = 'full') {
  removeOverlay();

  const overlay = document.createElement('div');
  overlay.id = 'ai-summarizer-overlay';
  overlay.innerHTML = `
    <div class="ais-backdrop"></div>
    <div class="ais-panel">
      <div class="ais-header">
        <div class="ais-title">
          <span class="ais-icon">🤖</span>
          <span>AI Summary</span>
          <span class="ais-badge">${mode}</span>
        </div>
        <div class="ais-actions">
          <button class="ais-btn ais-copy" title="Copy">📋</button>
          <button class="ais-btn ais-close" title="Close">✕</button>
        </div>
      </div>
      <div class="ais-body">
        <div class="ais-content">${formatSummary(summary)}</div>
      </div>
      <div class="ais-footer">
        <span class="ais-url">${window.location.hostname}</span>
        <span class="ais-time">${new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  `;

  // Inject styles
  injectStyles();
  document.body.appendChild(overlay);

  // Event listeners
  overlay.querySelector('.ais-close').addEventListener('click', removeOverlay);
  overlay.querySelector('.ais-backdrop').addEventListener('click', removeOverlay);
  overlay.querySelector('.ais-copy').addEventListener('click', () => {
    navigator.clipboard.writeText(summary).then(() => {
      overlay.querySelector('.ais-copy').textContent = '✅';
      setTimeout(() => { overlay.querySelector('.ais-copy').textContent = '📋'; }, 2000);
    });
  });

  // Keyboard close
  document.addEventListener('keydown', handleKeyClose);

  // Animate in
  requestAnimationFrame(() => overlay.classList.add('ais-visible'));
}

function showLoading() {
  removeOverlay();
  const el = document.createElement('div');
  el.id = 'ai-summarizer-overlay';
  el.innerHTML = `
    <div class="ais-backdrop"></div>
    <div class="ais-panel ais-loading-panel">
      <div class="ais-loader">
        <div class="ais-spinner"></div>
        <p>Analyzing page content...</p>
      </div>
    </div>
  `;
  injectStyles();
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('ais-visible'));
}

function showError(message, needsSetup = false) {
  removeOverlay();
  const el = document.createElement('div');
  el.id = 'ai-summarizer-overlay';
  el.innerHTML = `
    <div class="ais-backdrop"></div>
    <div class="ais-panel">
      <div class="ais-header">
        <div class="ais-title"><span>⚠️ Error</span></div>
        <button class="ais-btn ais-close">✕</button>
      </div>
      <div class="ais-body">
        <p style="color:#ff6b6b;margin:0">${message}</p>
        ${needsSetup ? '<br><a href="#" class="ais-setup-link">⚙️ Open Settings</a>' : ''}
      </div>
    </div>
  `;
  injectStyles();
  document.body.appendChild(el);
  el.querySelector('.ais-close')?.addEventListener('click', removeOverlay);
  el.querySelector('.ais-backdrop')?.addEventListener('click', removeOverlay);
  if (needsSetup) {
    el.querySelector('.ais-setup-link')?.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'OPEN_OPTIONS' });
    });
  }
  requestAnimationFrame(() => el.classList.add('ais-visible'));
}

function removeOverlay() {
  document.getElementById('ai-summarizer-overlay')?.remove();
  document.removeEventListener('keydown', handleKeyClose);
}

function handleKeyClose(e) {
  if (e.key === 'Escape') removeOverlay();
}

function formatSummary(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^• /gm, '<li>')
    .replace(/^\d+\. /gm, '<li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/<li>/g, '</p><li>')
    .trim();
}

function injectStyles() {
  if (document.getElementById('ais-styles')) return;
  const style = document.createElement('style');
  style.id = 'ais-styles';
  style.textContent = `
    #ai-summarizer-overlay { position:fixed; inset:0; z-index:2147483647; opacity:0; transition:opacity .2s; }
    #ai-summarizer-overlay.ais-visible { opacity:1; }
    .ais-backdrop { position:absolute; inset:0; background:rgba(0,0,0,.5); backdrop-filter:blur(4px); }
    .ais-panel {
      position:absolute; top:50%; right:24px; transform:translateY(-50%);
      width:420px; max-width:calc(100vw - 48px); max-height:80vh;
      background:#1a1a2e; border:1px solid rgba(255,255,255,.1);
      border-radius:16px; display:flex; flex-direction:column;
      box-shadow:0 25px 60px rgba(0,0,0,.6); overflow:hidden;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    }
    .ais-header {
      display:flex; align-items:center; justify-content:space-between;
      padding:16px 20px; background:#16213e;
      border-bottom:1px solid rgba(255,255,255,.08);
    }
    .ais-title { display:flex; align-items:center; gap:8px; color:#fff; font-weight:600; }
    .ais-icon { font-size:1.2rem; }
    .ais-badge {
      background:rgba(91,200,204,.2); color:#5bc8cc;
      padding:2px 8px; border-radius:100px; font-size:.7rem; font-weight:600;
      text-transform:uppercase;
    }
    .ais-actions { display:flex; gap:6px; }
    .ais-btn {
      background:rgba(255,255,255,.08); border:none; color:#fff;
      width:30px; height:30px; border-radius:6px; cursor:pointer;
      display:flex; align-items:center; justify-content:center; font-size:.85rem;
      transition:background .15s;
    }
    .ais-btn:hover { background:rgba(255,255,255,.15); }
    .ais-body { flex:1; overflow-y:auto; padding:20px; }
    .ais-content { color:#e0e0e0; line-height:1.7; font-size:.95rem; }
    .ais-content p { margin:0 0 12px; }
    .ais-content li { margin:4px 0 4px 16px; }
    .ais-content strong { color:#5bc8cc; }
    .ais-footer {
      padding:10px 20px; background:#16213e;
      border-top:1px solid rgba(255,255,255,.08);
      display:flex; justify-content:space-between;
      font-size:.75rem; color:rgba(255,255,255,.35);
    }
    .ais-loading-panel { align-items:center; justify-content:center; min-height:200px; }
    .ais-loader { text-align:center; color:rgba(255,255,255,.6); }
    .ais-spinner {
      width:36px; height:36px; border:3px solid rgba(91,200,204,.2);
      border-top-color:#5bc8cc; border-radius:50%;
      animation:ais-spin .8s linear infinite; margin:0 auto 12px;
    }
    @keyframes ais-spin { to { transform:rotate(360deg); } }
  `;
  document.head.appendChild(style);
}

// ── Message Listener ───────────────────────────────────────
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'EXTRACT_AND_SUMMARIZE') {
    showLoading();
    const text = extractPageText();
    chrome.runtime.sendMessage({
      type: 'SUMMARIZE',
      text,
      mode: 'full',
      url: window.location.href,
      title: document.title
    }, (response) => {
      if (response?.success) {
        showOverlay(response.summary, 'full');
      } else {
        showError(response?.error || 'Something went wrong.', response?.needsSetup);
      }
    });
  }

  if (msg.type === 'SHOW_OVERLAY') {
    if (msg.success) {
      showOverlay(msg.summary, msg.mode || 'selection');
    } else {
      showError(msg.error || 'Failed to summarize.');
    }
  }
});
