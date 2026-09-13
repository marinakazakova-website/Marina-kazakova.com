/**
 * App bootstrap.
 */
(function () {
  "use strict";

  function renderTriptych() {
    var wrap = document.getElementById("triptych");
    wrap.innerHTML = "";
    window.SITE_CONTENT.brandEcosystem.triptych.forEach(function (src) {
      var item = document.createElement("div");
      item.className = "triptych__item";
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      item.appendChild(img);
      wrap.appendChild(item);
    });
  }

  // Plain data-i18n only sets textContent, but this line carries a
  // "~~My method:~~" hover-accent span (see js/i18n.js renderInline) — so
  // it needs its own innerHTML render, re-run on every language switch.
  function renderBrandEcosystemText() {
    var el = document.getElementById("brandEcosystemText");
    el.innerHTML = window.MK.i18n.renderInline(window.MK.i18n.t("brandEcosystem.intro"));
  }

  // Static-HTML contact CTAs (data-i18n only swaps their text) — href
  // must be re-applied on every language switch too: EN -> WhatsApp,
  // RU -> Telegram.
  function applyContactLinks() {
    var lang = window.MK.i18n.getLang();
    document.querySelectorAll("[data-contact-link]").forEach(function (el) {
      el.href = window.MK.i18n.contactUrl(lang);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    window.MK.i18n.init();
    window.MK.nav.init();
    renderTriptych();
    renderBrandEcosystemText();
    applyContactLinks();
    window.MK.footer.init();
    window.MK.method.init();
    window.MK.workTogether.init();
    window.MK.experience.init();
    window.MK.openingAnimation.play();
    document.addEventListener("mk:langchange", renderBrandEcosystemText);
    document.addEventListener("mk:langchange", applyContactLinks);
  });
})();
