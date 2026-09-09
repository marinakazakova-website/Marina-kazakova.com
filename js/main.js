/**
 * App bootstrap.
 */
(function () {
  "use strict";

  function renderTriptych() {
    var wrap = document.getElementById("triptych");
    wrap.innerHTML = "";
    window.SITE_CONTENT.brandEcosystem.triptych.forEach(function (src, i) {
      var item = document.createElement("div");
      // Last frame carries the arrow/growth graphic — the one spot a
      // slow light sweep reads as "forward motion" rather than noise.
      item.className = "triptych__item" + (i === window.SITE_CONTENT.brandEcosystem.triptych.length - 1 ? " triptych__item--sweep" : "");
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      item.appendChild(img);
      wrap.appendChild(item);
    });
  }

  function renderFooterLinks() {
    var wrap = document.getElementById("footerLinks");
    wrap.innerHTML = "";
    window.SITE_CONTENT.footer.links.forEach(function (link) {
      var a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.label;
      a.target = "_blank";
      a.rel = "noopener";
      wrap.appendChild(a);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    window.MK.i18n.init();
    window.MK.nav.init();
    renderTriptych();
    renderFooterLinks();
    window.MK.method.init();
    window.MK.workTogether.init();
    window.MK.experience.init();
    window.MK.openingAnimation.play();
  });
})();
