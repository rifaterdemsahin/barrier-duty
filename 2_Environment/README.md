# 🌍 2_Environment — Landscape & Context

> Read the landscape. Roadmap, use cases, constraints, and the context the project lives in.

---

## 🗺️ Roadmap

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Static site with rota display + availability update form | ✅ Done |
| Phase 2 | Google Sheets integration for live data | 🟡 In progress |
| Phase 3 | Email/WhatsApp automated reminders (n8n) | 🔴 Planned |
| Phase 4 | AI-assisted gap filling with Qdrant + Ollama | 🔴 Planned |
| Phase 5 | Mobile app / PWA | 🔴 Future |

---

## 🖥️ Client Access

### 🪟 Windows Client
1. Open **Chrome**, **Edge**, or **Firefox**
2. Navigate to: `https://rifaterdemsahin.github.io/barrier-duty/`
3. For offline use: Press **Ctrl+D** to bookmark, or **Ctrl+Shift+D** to add to the home screen shortcut
4. For local development: `python -m http.server 8000` then visit `http://localhost:8000`

### 🍎 Mac Client
1. Open **Safari**, **Chrome**, or **Firefox**
2. Navigate to: `https://rifaterdemsahin.github.io/barrier-duty/`
3. For offline/desktop shortcut: File → Add to Dock (Safari) or bookmark
4. For local development: `python3 -m http.server 8000` then visit `http://localhost:8000`

### 📱 Mobile (iOS / Android)
1. Open your mobile browser
2. Navigate to: `https://rifaterdemsahin.github.io/barrier-duty/`
3. **Add to Home Screen** (iOS: Share → Add to Home Screen; Android: menu → Add to Home Screen) for an app-like experience

### 🤖 AI Clients
The project can be integrated with AI assistants for scheduling assistance:

- **Claude (Anthropic):** Use the `claude.md` prompt file at the root to give Claude context about the project. Run via claude.ai or the Claude API.
- **ChatGPT / GPT-4:** Paste the contents of `aigent.md` as a system prompt
- **Kilocode:** See `kilocode.md` for agent configuration
- **Ollama (Local LLM):** See [4_Formula — Qdrant & Ollama Setup](../4_Formula/qdrant_ollama_setup.md) for embedding/search setup using `nomic-embed-text` (4096 context)
- **Copilot:** Works with GitHub Copilot in VS Code; the `.github/` workflows handle CI/CD

---

## 🧩 Use Cases

| Actor | Use Case | Description |
|-------|----------|-------------|
| Volunteer | View my shifts | See upcoming rota assignments |
| Volunteer | Update availability | Submit a change request if unable to attend |
| Admin | Fill gaps | Identify and contact volunteers to cover empty slots |
| Admin | Publish rota | Update the schedule for the coming week |
| New Volunteer | Onboard | Watch training video, read rules, sign up |
| Parent | Share flier | Print/share the recruitment flier |

---

## ⛓️ Constraints

- **No backend server** — hosted as a static GitHub Pages site
- **No user accounts** — volunteers identified by name/email via forms
- **GDPR / Privacy** — volunteer data stored in Google Sheets (admin only); not exposed on the public site
- **Budget: zero** — all tools must be free or open source
- **Accessibility** — must work on cheap Android phones in the school car park

---

## 🔗 See Also
- [1_Real_Unknown](../1_Real_Unknown/README.md) — The problem
- [3_Simulation](../3_Simulation/README.md) — What the solution looks like
- [4_Formula](../4_Formula/README.md) — How to build it
