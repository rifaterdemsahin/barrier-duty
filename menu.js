/**
 * menu.js — Shared navigation menu for all Barrier Duty pages
 * Injects a consistent top nav with links to all SLS sections.
 *
 * Usage: Add <script src="/menu.js"></script> (or relative path) to any page.
 * Optionally set window.MENU_BASE_PATH = '../' for pages in subdirectories.
 */
(function () {
  var base = (typeof window.MENU_BASE_PATH !== 'undefined') ? window.MENU_BASE_PATH : '';

  var menuHTML = '<nav id="sls-menu" style="background:#1e293b;padding:0;position:sticky;top:0;z-index:1000;box-shadow:0 2px 8px rgba(0,0,0,0.3);">' +
    '<div style="max-width:1200px;margin:0 auto;padding:0 16px;">' +
    '<div style="display:flex;align-items:center;flex-wrap:wrap;gap:0;">' +
    '<a href="' + base + 'index.html" style="color:#f59e0b;font-weight:700;font-size:1rem;padding:12px 14px;text-decoration:none;white-space:nowrap;">🚧 Barrier Duty</a>' +
    '<div style="display:flex;flex-wrap:wrap;gap:0;flex:1;">' +
    '<a href="' + base + '1_Real_Unknown/README.md" onclick="openMd(event,\'' + base + '1_Real_Unknown/README.md\')" style="color:#cbd5e1;font-size:0.85rem;padding:12px 10px;text-decoration:none;white-space:nowrap;" title="The Problem">🔍 1 Unknown</a>' +
    '<a href="' + base + '2_Environment/README.md" onclick="openMd(event,\'' + base + '2_Environment/README.md\')" style="color:#cbd5e1;font-size:0.85rem;padding:12px 10px;text-decoration:none;white-space:nowrap;" title="Environment">🌍 2 Env</a>' +
    '<a href="' + base + '3_Simulation/carousel.html" style="color:#cbd5e1;font-size:0.85rem;padding:12px 10px;text-decoration:none;white-space:nowrap;" title="Simulation & Carousel">🎭 3 Sim</a>' +
    '<a href="' + base + '4_Formula/README.md" onclick="openMd(event,\'' + base + '4_Formula/README.md\')" style="color:#cbd5e1;font-size:0.85rem;padding:12px 10px;text-decoration:none;white-space:nowrap;" title="Formula">📐 4 Formula</a>' +
    '<a href="' + base + '5_Symbols/README.md" onclick="openMd(event,\'' + base + '5_Symbols/README.md\')" style="color:#cbd5e1;font-size:0.85rem;padding:12px 10px;text-decoration:none;white-space:nowrap;" title="Symbols / Code">💻 5 Symbols</a>' +
    '<a href="' + base + '6_Semblance/README.md" onclick="openMd(event,\'' + base + '6_Semblance/README.md\')" style="color:#cbd5e1;font-size:0.85rem;padding:12px 10px;text-decoration:none;white-space:nowrap;" title="Errors & Fixes">🐞 6 Semblance</a>' +
    '<a href="' + base + '7_Testing_Known/README.md" onclick="openMd(event,\'' + base + '7_Testing_Known/README.md\')" style="color:#cbd5e1;font-size:0.85rem;padding:12px 10px;text-decoration:none;white-space:nowrap;" title="Testing">✅ 7 Testing</a>' +
    '<a href="' + base + 'markdown_renderer.html" style="color:#94a3b8;font-size:0.85rem;padding:12px 10px;text-decoration:none;white-space:nowrap;" title="Markdown Renderer">📄 MD Viewer</a>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</nav>';

  // Insert as first child of body
  document.body.insertAdjacentHTML('afterbegin', menuHTML);

  // openMd: navigate to markdown_renderer.html with the file as a query param
  window.openMd = function (e, filePath) {
    e.preventDefault();
    window.location.href = base + 'markdown_renderer.html?file=' + encodeURIComponent(filePath);
  };
})();
