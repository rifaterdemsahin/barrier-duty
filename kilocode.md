# ⚡ Kilocode Configuration — Barrier Duty Project

> Rules and context for Kilocode agent when working on this project.
> See also: `aigent.md` (general rules), `claude.md` (Claude-specific)

---

## Agent Configuration

```yaml
project: barrier-duty
description: Volunteer coordination for school crossing safety
tech_stack:
  - html5
  - css3
  - vanilla-javascript
  - github-pages
hosting: static
repo: https://github.com/rifaterdemsahin/barrier-duty
live_url: https://rifaterdemsahin.github.io/barrier-duty/
```

## Folder Structure

```
barrier-duty/
├── 1_Real_Unknown/   # Problem definition, OKRs
├── 2_Environment/    # Context, constraints, client setup
├── 3_Simulation/     # Mockups, carousel (carousel.html)
│   └── media/        # Images and videos
├── 4_Formula/        # How-to guides, Qdrant/Ollama setup
├── 5_Symbols/        # Source code reference
├── 6_Semblance/      # Error log, fixes
├── 7_Testing_Known/  # Tests, acceptance criteria
├── index.html        # Main app
├── menu.js           # Shared navigation
├── markdown_renderer.html  # Render any .md file
└── ...
```

## Rules

1. Always add `menu.js` to new HTML pages
2. Place media in `3_Simulation/media/`
3. Document setup steps in `4_Formula/`
4. Log errors/fixes in `6_Semblance/`
5. Never commit `.env` — use `.env.example`
6. Commit after each significant activity
