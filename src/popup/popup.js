/**
 * Popup Script
 */

import { getSettings } from '../utils/storage.js';

let selectedMode = 'full';

document.addEventListener('DOMContentLoaded', async () => {
  const settings = await getSettings();
  updateProviderBadge(settings);
  loadHistory();
  setupModeButtons();
  setupSummarizeButton();
  setupSettingsButton();
});

function setupModeButtons() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMode = btn.dataset.mode;
    });
  });
}

function setupSummarizeButton() {
  const btn = document.getElementById('summarizeBtn');
  const status = document.getElementById('status');

  btn.addEventListener('click', async () => {
    btn.classList.add('loading');
    btn.disabled = true;
    setStatus('Analyzing page...', 'loading');

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['src/content/content.js']
      });
    } catch (e) {
      // Already injected
    }

    chrome.tabs.sendMessage(tab.id, {
      type: 'EXTRACT_AND_SUMMARIZE',
      mode: selectedMode
    }, (response) => {
      btn.classList.remove('loading');
      btn.disabled = false;

      if (chrome.runtime.lastError) {
        setStatus('Cannot summarize this page type.', 'error');
        return;
      }

      if (response?.success) {
        setStatus('✅ Summary displayed on page!', 'success');
        setTimeout(() => setStatus(''), 3000);
        window.close();
      } else {
        setStatus(response?.error || 'Failed to summarize.', 'error');
      }
    });
  });
}

function setupSettingsButton() {
  document.getElementById('settingsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}

function updateProviderBadge(settings) {
  const dot = document.getElementById('providerDot');
  const label = document.getElementById('providerLabel');

  if (settings.provider === 'openai' && settings.apiKey) {
    dot.classList.remove('offline');
    label.textContent = 'GPT-4 Active';
  } else {
    dot.classList.add('offline');
    label.textContent = 'Free Mode';
  }
}

function setStatus(message, type = '') {
  const el = document.getElementById('status');
  el.textContent = message;
  el.className = `status ${type}`;
}

async function loadHistory() {
  const { history = [] } = await chrome.storage.local.get({ history: [] });
  if (history.length === 0) return;

  const section = document.getElementById('historySection');
  const list = document.getElementById('historyList');
  section.style.display = 'block';

  const recent = history.slice(0, 3);
  list.innerHTML = recent.map(item => `
    <div class="history-item" data-url="${item.url}">
      <div class="history-item-title">${item.title || item.url}</div>
      <div class="history-item-time">${new Date(item.timestamp).toLocaleDateString()}</div>
    </div>
  `).join('');
}
