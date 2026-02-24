# ✅ 7_Testing_Known — Validation & Proof

> Reach back to proof. Validate against the original objectives in `1_Real_Unknown`. Did you solve the unknown?

---

## 🎬 Tutorial Video

[![How Barrier Duty Works](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/@RifatErdemSahin)

> 📺 Watch the full walkthrough on the [Rifat Erdem Sahin YouTube Channel](https://www.youtube.com/@RifatErdemSahin)

---

## ✅ Acceptance Criteria Checklist

### From OKRs ([1_Real_Unknown](../1_Real_Unknown/README.md))

- [ ] **KR1 — 100% shift coverage:** All shifts in the rota have a volunteer assigned
- [ ] **KR2 — Response time < 2 hours:** Gaps are identified and filled within 2 hours using the availability update portal
- [ ] **KR3 — 30+ active volunteers:** Volunteer directory shows ≥ 30 active entries
- [ ] **KR4 — All volunteers onboarded:** Resources section shows training video and volunteers confirm completion

---

## 🧪 Functional Test Checklist

### Site Navigation
- [ ] All 7 SLS sections accessible from the menu on every page
- [ ] Home page loads at `https://rifaterdemsahin.github.io/barrier-duty/`
- [ ] Links are bidirectional — every section links back to others

### Volunteer Rota
- [ ] Rota table displays correctly on desktop (≥1024px)
- [ ] Rota table displays correctly on tablet (768px–1023px)
- [ ] Rota table displays correctly on mobile (< 768px)
- [ ] Morning/Afternoon filter buttons work

### Availability Update
- [ ] Form at `update-availability.html` submits without errors
- [ ] Confirmation message shown on successful submit

### Media Carousel (3_Simulation)
- [ ] All 4 images display in carousel
- [ ] Both videos play with controls
- [ ] Carousel navigation (prev/next) works on desktop
- [ ] Carousel navigation works on mobile (swipe or buttons)
- [ ] Carousel link accessible from main site navigation

### Markdown Renderer
- [ ] `markdown_renderer.html` loads a `.md` file when given `?file=` URL parameter
- [ ] All README files accessible via renderer

### Admin Area
- [ ] Admin area requires password to access
- [ ] Default password `admin123` grants access
- [ ] Logout button returns to login screen

### External Links
- [ ] GitHub repo link opens `https://github.com/rifaterdemsahin/barrier-duty`
- [ ] LinkedIn link opens `https://www.linkedin.com/in/rifaterdemsahin/`
- [ ] YouTube link opens `https://www.youtube.com/@RifatErdemSahin`

### SEO / Crawlability
- [ ] `robots.txt` accessible at root
- [ ] `sitemap.xml` accessible at root
- [ ] All pages have `<meta name="viewport">` for mobile

---

## 🔗 See Also
- [1_Real_Unknown](../1_Real_Unknown/README.md) — The original problem & OKRs
- [6_Semblance](../6_Semblance/README.md) — Known issues
