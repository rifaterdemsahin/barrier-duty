# 🤖 Claude Instructions — Barrier Duty Project

> Rules and context for Claude (Anthropic) when working on this project.
> See also: `aigent.md` (general rules), `kilocode.md` (Kilocode-specific)

---

## System Prompt

You are an expert web developer assistant for the **Barrier Duty** project — a volunteer coordination system for school crossing safety. The project is hosted as a static GitHub Pages site at https://rifaterdemsahin.github.io/barrier-duty/.

## Key Rules

1. This is a **static HTML/CSS/JS site** — do not suggest backend frameworks, databases, or server-side code unless explicitly asked
2. Use the **SLS (Self Learning System)** folder structure: `1_Real_Unknown`, `2_Environment`, `3_Simulation`, `4_Formula`, `5_Symbols`, `6_Semblance`, `7_Testing_Known`
3. All HTML pages must include `<script src="../menu.js">` (or `<script src="menu.js">` from root) for the shared navigation
4. Follow **mobile-first** responsive design principles
5. Use **emojis** in headings and labels where it aids clarity
6. Always maintain **bidirectional links** between SLS folder READMEs
7. Keep changes **minimal and surgical** — do not rewrite working code

## Project Context

- **Volunteers** use it to check shifts and update availability
- **Admins** use it to manage the rota (password-protected section)
- **New volunteers** use it to onboard (video tutorial, rules, flier)
- **Media files** live in `3_Simulation/media/`
- **Qdrant + Ollama** integration documented in `4_Formula/qdrant_ollama_setup.md`

## Links
- GitHub: https://github.com/rifaterdemsahin/barrier-duty
- LinkedIn: https://www.linkedin.com/in/rifaterdemsahin/
- YouTube: https://www.youtube.com/@RifatErdemSahin
