/**
 * menu.js — Shared navigation menu for all Barrier Duty pages
 * Injects a consistent top nav with links to all SLS sections.
 *
 * Usage: Add <script src="/menu.js"></script> (or relative path) to any page.
 * Optionally set window.MENU_BASE_PATH = '../' for pages in subdirectories.
 */
(function () {
  var base = (typeof window.MENU_BASE_PATH !== 'undefined') ? window.MENU_BASE_PATH : '';

  async function buildMenu() {
    let navigationData = null;
    const azureUrl = 'https://dpstoragebarrierduty.blob.core.windows.net/config/navigation_config.json';
    const localUrl = base + 'navigation_config.json';
    
    try {
      let res = await fetch(azureUrl);
      if (!res.ok) res = await fetch(localUrl);
      if (res.ok) navigationData = await res.json();
    } catch (e) {
      console.warn("Failed to fetch navigation config for menu.js:", e);
    }
    
    if (!navigationData) return;
    
    var linksHTML = navigationData.debugMenu
      .filter(item => item.url !== 'divider')
      .slice(0, 8) // Limit to top items for horizontal space
      .map(item => `<a href="${base}${item.url}" onclick="openMd(event,'${base}${item.url}')" style="color:#cbd5e1;font-size:0.85rem;padding:12px 10px;text-decoration:none;white-space:nowrap;">${item.label.replace('   ├─ ', '')}</a>`)
      .join('');
      
    var menuHTML = '<nav id="sls-menu" style="background:#1e293b;padding:0;position:sticky;top:0;z-index:1000;box-shadow:0 2px 8px rgba(0,0,0,0.3);">' +
      '<div style="max-width:1200px;margin:0 auto;padding:0 16px;">' +
      '<div style="display:flex;align-items:center;flex-wrap:wrap;gap:0;">' +
      '<a href="' + base + 'index.html" style="color:#f59e0b;font-weight:700;font-size:1rem;padding:12px 14px;text-decoration:none;white-space:nowrap;">🚧 Barrier Duty</a>' +
      '<div style="display:flex;flex-wrap:wrap;gap:0;flex:1;">' +
      linksHTML +
      '</div></div></div></nav>';

    // Insert as first child of body
    console.log("SLS menu hidden for customers"); // document.body.insertAdjacentHTML('afterbegin', menuHTML);
  }

  // openMd: navigate to markdown_renderer.html with the file as a query param
  window.openMd = function (e, filePath) {
    if (filePath.includes('.html')) return; // Allow normal navigation to HTML files
    e.preventDefault();
    window.location.href = base + 'markdown_renderer.html?file=' + encodeURIComponent(filePath.replace(base, ''));
  };

  buildMenu();
})();
