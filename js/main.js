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

  document.addEventListener("DOMContentLoaded", function () {
    window.MK.i18n.init();
    window.MK.nav.init();
    renderTriptych();
    renderBrandEcosystemText();
    window.MK.footer.init();
    window.MK.method.init();
    window.MK.workTogether.init();
    window.MK.experience.init();
    window.MK.openingAnimation.play();
    document.addEventListener("mk:langchange", renderBrandEcosystemText);
  });
})();
