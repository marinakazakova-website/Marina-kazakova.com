/**
 * STRATEGIC SESSION — /strategic-session/. Screen 1 only for now.
 */
(function () {
  "use strict";

  function render() {
    var lang = window.MK.i18n.getLang();
    var data = window.SITE_CONTENT.strategicSession[lang];

    document.getElementById("ssTitle").textContent = data.title;

    var body = document.getElementById("ssBody");
    body.innerHTML = "";
    data.body.forEach(function (para) {
      var p = document.createElement("p");
      p.textContent = para;
      body.appendChild(p);
    });

    document.getElementById("ssCtaLabel").textContent = data.cta;
  }

  document.addEventListener("mk:langchange", render);

  document.addEventListener("DOMContentLoaded", function () {
    window.MK.i18n.init();
    window.MK.nav.init();
    window.MK.footer.init();
    document.getElementById("siteNav").classList.add("is-visible");
    render();
  });
})();
