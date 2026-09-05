/**
 * App bootstrap.
 */
(function () {
  "use strict";

  function renderTriptych() {
    var wrap = document.getElementById("triptych");
    wrap.innerHTML = "";
    window.SITE_CONTENT.brandEcosystem.triptych.forEach(function (src) {
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      wrap.appendChild(img);
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
