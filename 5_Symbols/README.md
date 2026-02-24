# 💻 5_Symbols — Core Source Code

> The implementation. Where the formula becomes real.

---

## 📁 Key Files

| File | Description |
|------|-------------|
| [`index.html`](../index.html) | Main application page — home, rota, volunteers, updates, resources, admin |
| [`styles.css`](../styles.css) | Responsive CSS — grid, flex, mobile-first |
| [`script.js`](../script.js) | Client-side JS — navigation, auth, rota filtering, animations |
| [`menu.js`](../menu.js) | Shared navigation menu injected across all pages |
| [`update-availability.html`](../update-availability.html) | Volunteer self-service availability update form |
| [`flier.html`](../flier.html) | Printable recruitment flier |
| [`markdown_renderer.html`](../markdown_renderer.html) | Renders any `.md` file from the repo in the browser |
| [`3_Simulation/carousel.html`](../3_Simulation/carousel.html) | Image/video carousel of duty media assets |
| [`config.template.js`](../config.template.js) | Configuration template (copy to `config.js`, never commit) |

---

## 🔌 Integrations

- **Google Sheets API** — live volunteer data (see [API_INTEGRATION.md](../API_INTEGRATION.md))
- **n8n** — automated email notifications (see [N8N_EMAIL_WORKFLOW.md](../N8N_EMAIL_WORKFLOW.md))
- **Qdrant + Ollama** — semantic search (see [4_Formula/qdrant_ollama_setup.md](../4_Formula/qdrant_ollama_setup.md))
- **GitHub Actions** — CI/CD to GitHub Pages (see [`.github/workflows/static.yml`](../.github/workflows/static.yml))

---

## 🔗 See Also
- [4_Formula](../4_Formula/README.md) — How the code was built
- [6_Semblance](../6_Semblance/README.md) — Known issues and fixes
