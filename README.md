<div align="center">

# 🤖 AI Page Summarizer

### Summarize any webpage in seconds — free built-in mode or GPT-4 powered

[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore)
[![Manifest](https://img.shields.io/badge/Manifest-V3-green?style=for-the-badge)](https://developer.chrome.com/docs/extensions/mv3/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Stars](https://img.shields.io/github/stars/khaledxbenali92/ai-page-summarizer?style=for-the-badge&color=yellow)](https://github.com/khaledxbenali92/ai-page-summarizer/stargazers)

[Features](#-features) • [Install](#-installation) • [Usage](#-usage) • [Modes](#-summary-modes) • [Contributing](#-contributing)

</div>

---

## 😩 The Problem

You open 20 tabs. You'll "read them later." You never do.

**AI Page Summarizer** gives you the key points of any webpage in seconds — so you actually consume the content you save.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ⚡ **Free Built-in Mode** | Works without any API key using smart extraction |
| 🤖 **GPT-4 Powered** | Optional OpenAI integration for superior summaries |
| 📋 **6 Summary Styles** | Full, Brief, Bullets, ELI5, Academic, Selection |
| ✂️ **Text Selection** | Summarize any selected text on the page |
| 🖱️ **Right-Click Menu** | Context menu on any page or selection |
| ⌨️ **Keyboard Shortcut** | `Ctrl+Shift+S` to summarize instantly |
| 📜 **History** | Recent summaries saved locally |
| 📋 **One-Click Copy** | Copy summary to clipboard instantly |
| 🎨 **Beautiful Overlay** | Dark-themed summary panel on the page |
| ⚙️ **Settings Page** | Configure provider, model, and preferences |

---

## 📥 Installation

### Method 1 — Load Unpacked (Developer Mode)

```bash
# Clone the repository
git clone https://github.com/khaledxbenali92/ai-page-summarizer.git
```

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer Mode** (top right toggle)
3. Click **"Load unpacked"**
4. Select the `ai-page-summarizer` folder
5. The extension icon appears in your toolbar ✅

### Method 2 — Chrome Web Store

*(Coming soon)*

---

## 📖 Usage

### Basic — Click the Extension Icon
1. Navigate to any webpage
2. Click the 🤖 icon in the toolbar
3. Choose a summary style
4. Click **"Summarize This Page"**
5. Summary appears as an overlay on the page

### Keyboard Shortcut
```
Ctrl + Shift + S   (Windows/Linux)
Cmd  + Shift + S   (Mac)
```

### Right-Click Menu
Right-click anywhere on a page:
- **"Summarize This Page"** — full page summary
- **"Summarize Selection"** — selected text only
- **"Summarize Link"** — summarize link target

### Enable GPT-4 (Optional)
1. Click the ⚙️ settings icon in the popup
2. Select **"OpenAI GPT-4"** as provider
3. Enter your API key from [platform.openai.com](https://platform.openai.com/api-keys)
4. Save settings

---

## 🎨 Summary Modes

| Mode | Description | Best For |
|------|-------------|---------|
| 📄 **Full** | 3-4 paragraph summary | Articles, blog posts |
| ⚡ **Brief** | 2-3 sentences | Quick overview |
| 📋 **Bullets** | 5-7 key points | Reference & notes |
| 🧒 **ELI5** | Simple language | Complex topics |
| 🎓 **Academic** | Abstract style | Research papers |
| ✂️ **Selection** | Selected text only | Specific passages |

---

## 📁 Project Structure

```
ai-page-summarizer/
├── manifest.json                 # Extension manifest (V3)
├── popup.html                    # Toolbar popup UI
├── options.html                  # Settings page
├── src/
│   ├── background/
│   │   └── background.js         # Service worker
│   ├── content/
│   │   └── content.js            # Page injection & overlay
│   ├── popup/
│   │   └── popup.js              # Popup logic
│   └── utils/
│       ├── ai.js                 # AI summarization (OpenAI + rule-based)
│       └── storage.js            # Chrome storage wrapper
├── icons/                        # Extension icons
├── tests/
│   └── test.js                   # Test suite (Node.js)
├── .github/workflows/ci.yml      # CI pipeline
└── README.md
```

---

## 🧪 Running Tests

```bash
node tests/test.js
```

Output:
```
🤖 AI Page Summarizer — Tests

  ✅ Rule-based generates full summary
  ✅ Rule-based generates brief summary
  ✅ Rule-based generates bullet points
  ✅ Handles empty text gracefully
  ✅ Handles short text gracefully
  ✅ Scores sentences by frequency
  ✅ Full mode returns multiple sentences
  ✅ Bullets mode includes multiple points
  ✅ Text length limiting works
  ✅ Mode defaults handled

Results: 10 passed, 0 failed
✅ All tests passed!
```

---

## 🗺️ Roadmap

- [x] Manifest V3 extension
- [x] Free rule-based summarization
- [x] OpenAI GPT-4 integration
- [x] 6 summary modes
- [x] Right-click context menu
- [x] Keyboard shortcut
- [x] Beautiful overlay UI
- [x] Settings page
- [x] Summary history
- [ ] Firefox support
- [ ] Edge support
- [ ] PDF summarization
- [ ] YouTube transcript summary
- [ ] Export to Notion/Obsidian
- [ ] Summary sharing via link

---

## 🤝 Contributing

```bash
git clone https://github.com/YOUR-USERNAME/ai-page-summarizer.git
cd ai-page-summarizer
git checkout -b feat/your-feature
# make changes
node tests/test.js
git commit -m "feat: your feature"
git push origin feat/your-feature
```

**Ideas:**
- 🦊 Firefox/Edge support
- 📺 YouTube transcript summarization
- 📄 PDF support
- 🔌 Notion/Obsidian export
- 🌍 Multi-language summaries

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Khaled Ben Ali**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/benalikhaled)
[![Twitter](https://img.shields.io/badge/Twitter-Follow-1DA1F2?style=flat&logo=twitter)](https://twitter.com/khaledbali92)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-333?style=flat&logo=github)](https://github.com/khaledxbenali92)

---

<div align="center">

⭐ **Star this if you're tired of unread tabs!** ⭐

</div>
