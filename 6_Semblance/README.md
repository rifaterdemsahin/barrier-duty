# 🐞 6_Semblance — Errors & Near-Misses

> Log problems, causes, fixes, and workarounds. The gap between simulation and reality.

---

## 🪵 Issue Log

| # | Problem | Cause | Fix | Status |
|---|---------|-------|-----|--------|
| 1 | Carousel images not displaying on mobile | Incorrect relative paths after media move | Updated paths to `media/` prefix | ✅ Fixed |
| 2 | Admin password visible in JS source | Client-side auth only | Documented in README security warning; production needs server-side auth | ⚠️ Known |
| 3 | GitHub Pages deployment failing | `configure-pages` action version mismatch | Updated to `actions/configure-pages@v5` in static.yml | ✅ Fixed |
| 4 | Videos autoplay blocked on mobile | Browser autoplay policy | Removed `autoplay` attribute; use user-initiated play | ✅ Fixed |
| 5 | Markdown renderer CORS error on local file:// | Browser security restriction | Must serve from HTTP server, not file:// protocol | ⚠️ By design |

---

## 📝 Lessons Learned

- Static GitHub Pages sites cannot use server-side logic — all auth is client-side only
- Large video files (>10MB) should use Git LFS or external hosting (YouTube/Vimeo) in production
- Mobile browsers block autoplay for videos — always provide play controls

---

## 🔗 See Also
- [5_Symbols](../5_Symbols/README.md) — The code
- [7_Testing_Known](../7_Testing_Known/README.md) — Test results
