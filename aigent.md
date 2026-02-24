# 🤖 Agent Rules — Barrier Duty Project

> This file defines the context and rules for AI agents working on this project.
> See also: `claude.md` (Claude-specific), `kilocode.md` (Kilocode-specific)

---

## 📌 Project Context

**Project:** Barrier Duty — Volunteer coordination for school crossing safety  
**Live URL:** https://rifaterdemsahin.github.io/barrier-duty/  
**Repo:** https://github.com/rifaterdemsahin/barrier-duty  
**Owner:** Rifat Erdem Sahin — https://www.linkedin.com/in/rifaterdemsahin/  
**YouTube:** https://www.youtube.com/@RifatErdemSahin  

---

## 🗂️ Folder Structure (SLS — Self Learning System)

| Folder | Purpose |
|--------|---------|
| `1_Real_Unknown/` | Define the unknown problem (OKRs, goals) |
| `2_Environment/` | Landscape, constraints, clients |
| `3_Simulation/` | Mockups, carousel, visual demos |
| `4_Formula/` | Recipes, guides, how-to build it |
| `5_Symbols/` | Core source code |
| `6_Semblance/` | Errors, near-misses, fixes |
| `7_Testing_Known/` | Tests, acceptance criteria, validation |

---

## 📏 Rules for AI Agents

1. **Always use the SLS folder structure** — place new files in the appropriate folder
2. **Never commit secrets** — use `.env.example` for templates, never `.env`
3. **Static site only** — no server-side code; this is a GitHub Pages site
4. **Mobile-first HTML** — all pages must include `<meta name="viewport">` and be responsive
5. **Shared navigation** — all HTML pages must include `menu.js` for the shared nav bar
6. **Emoji where meaningful** — use emojis in headings and labels to aid scannability
7. **Commit after each activity** — follow git commit conventions
8. **Bidirectional links** — every SLS folder README must link back to adjacent folders
9. **Markdown accessible** — all `.md` files should be linkable via `markdown_renderer.html`
10. **No breaking changes** — existing links must continue to work

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Hosting:** GitHub Pages (static)
- **CI/CD:** GitHub Actions (`.github/workflows/static.yml`)
- **Data:** Google Sheets (optional integration)
- **Automation:** n8n (optional email workflows)
- **Local AI:** Ollama + Qdrant (see `4_Formula/qdrant_ollama_setup.md`)
