/**
 * Storage Utility — Chrome storage wrapper
 */

const DEFAULTS = {
  provider: 'rule-based',
  apiKey: '',
  model: 'gpt-4o-mini',
  defaultMode: 'full',
  theme: 'dark',
  autoSummarize: false,
  historyEnabled: true,
  maxHistory: 50
};

export async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULTS, resolve);
  });
}

export async function saveSettings(settings) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(settings, resolve);
  });
}

export async function saveToHistory(entry) {
  return new Promise((resolve) => {
    chrome.storage.local.get({ history: [] }, ({ history }) => {
      history.unshift(entry);
      if (history.length > 50) history = history.slice(0, 50);
      chrome.storage.local.set({ history }, resolve);
    });
  });
}

export async function getHistory() {
  return new Promise((resolve) => {
    chrome.storage.local.get({ history: [] }, ({ history }) => resolve(history));
  });
}

export async function clearHistory() {
  return new Promise((resolve) => {
    chrome.storage.local.set({ history: [] }, resolve);
  });
}
