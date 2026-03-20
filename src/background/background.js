/**
 * 🤖 AI Page Summarizer — Background Service Worker
 * Handles AI API calls, context menu, keyboard shortcuts
 */

import { summarizeText } from '../utils/ai.js';
import { getSettings, saveToHistory } from '../utils/storage.js';

// ── Context Menu ───────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'summarize-page',
    title: '🤖 Summarize This Page',
    contexts: ['page']
  });
  chrome.contextMenus.create({
    id: 'summarize-selection',
    title: '✂️ Summarize Selection',
    contexts: ['selection']
  });
  chrome.contextMenus.create({
    id: 'summarize-link',
    title: '🔗 Summarize Link',
    contexts: ['link']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'summarize-selection' && info.selectionText) {
    const settings = await getSettings();
    const result = await summarizeText(info.selectionText, 'selection', settings);
    chrome.tabs.sendMessage(tab.id, { type: 'SHOW_OVERLAY', ...result });
  }
  if (info.menuItemId === 'summarize-page') {
    chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_AND_SUMMARIZE' });
  }
});

// ── Keyboard Shortcut ──────────────────────────────────────
chrome.commands.onCommand.addListener((command) => {
  if (command === 'summarize-page') {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_AND_SUMMARIZE' });
    });
  }
});

// ── Message Handler ────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'SUMMARIZE') {
    handleSummarize(msg, sender, sendResponse);
    return true;
  }
  if (msg.type === 'GET_SETTINGS') {
    getSettings().then(sendResponse);
    return true;
  }
});

async function handleSummarize(msg, sender, sendResponse) {
  try {
    const settings = await getSettings();

    if (settings.provider === 'openai' && !settings.apiKey) {
      sendResponse({
        success: false,
        error: 'Please add your OpenAI API key in Settings.',
        needsSetup: true
      });
      return;
    }

    const result = await summarizeText(msg.text, msg.mode, settings);

    // Save to history
    await saveToHistory({
      url: msg.url,
      title: msg.title,
      summary: result.summary,
      mode: msg.mode,
      timestamp: Date.now()
    });

    sendResponse({ success: true, ...result });
  } catch (err) {
    sendResponse({ success: false, error: err.message });
  }
}
