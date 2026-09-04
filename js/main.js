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

  document.addEventListener("DOMContentLoaded", function () {
    window.MK.i18n.init();
    window.MK.nav.init();
    renderTriptych();
    window.MK.method.init();
    window.MK.workTogether.init();
    window.MK.experience.init();
    window.MK.openingAnimation.play();
  });
})();
