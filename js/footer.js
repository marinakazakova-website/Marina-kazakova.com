/**
 * Shared site footer — identical on all 5 pages (Home/Retail/Business/
 * Brands/Films). Left: white icon-only social row. Right: the copyright
 * line, handled separately by the generic data-i18n="footer.copy".
 * Instagram/LinkedIn have no confirmed URL yet (see data/content.js) —
 * rendered inert, same disabled pattern as direction-page.js's links,
 * until the client supplies one; nothing here needs to change when she
 * does, just the href in the data.
 */
(function () {
  "use strict";

  var ICONS = {
    telegram: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.66 3.9L2.87 10.78c-1.22.48-1.21 1.15-.22 1.45l4.56 1.42 1.76 5.42c.21.58.11.81.72.81.47 0 .68-.21.94-.47l2.25-2.19 4.68 3.46c.86.48 1.48.23 1.7-.8l3.08-14.5c.32-1.26-.48-1.83-1.36-1.48zM8.5 13.86l9.13-8.14-10.75 9.02z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3.25a1.96 1.96 0 100 3.92 1.96 1.96 0 000-3.92zM20.44 20h-3.37v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V20H9.67V8.5h3.24v1.57h.05c.45-.86 1.56-1.77 3.2-1.77 3.42 0 4.05 2.25 4.05 5.18V20z"/></svg>'
  };

  function render() {
    var wrap = document.getElementById("footerSocial");
    if (!wrap) return;
    wrap.innerHTML = "";
    (window.SITE_CONTENT.footer.social || []).forEach(function (item) {
      var a = document.createElement("a");
      a.className = "site-footer__icon";
      a.innerHTML = ICONS[item.id] || "";
      a.setAttribute("aria-label", item.id.charAt(0).toUpperCase() + item.id.slice(1));
      if (item.href) {
        a.href = item.href;
        a.target = "_blank";
        a.rel = "noopener";
      } else {
        a.href = "javascript:void(0)";
        a.classList.add("is-disabled");
        a.setAttribute("aria-disabled", "true");
      }
      wrap.appendChild(a);
    });
  }

  window.MK = window.MK || {};
  window.MK.footer = { init: render };
})();
