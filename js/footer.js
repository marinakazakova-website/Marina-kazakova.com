/**
 * Shared site footer — identical on all 5 pages (Home/Retail/Business/
 * Brands/Films). Left: white icon-only social row (Telegram, WhatsApp,
 * Instagram, LinkedIn). Right: the copyright line, handled separately
 * by the generic data-i18n="footer.copy".
 */
(function () {
  "use strict";

  var ICONS = {
    telegram: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.66 3.9L2.87 10.78c-1.22.48-1.21 1.15-.22 1.45l4.56 1.42 1.76 5.42c.21.58.11.81.72.81.47 0 .68-.21.94-.47l2.25-2.19 4.68 3.46c.86.48 1.48.23 1.7-.8l3.08-14.5c.32-1.26-.48-1.83-1.36-1.48zM8.5 13.86l9.13-8.14-10.75 9.02z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.234c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.898 6.995c-.003 5.45-4.437 9.857-9.89 9.857M20.516 3.485A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.427-8.416"/></svg>',
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
