/**
 * WAYS TO WORK TOGETHER — service columns + credentials.
 */
(function () {
  "use strict";

  function render() {
    var lang = window.MK.i18n.getLang();
    var data = window.SITE_CONTENT.workTogether;
    var wrap = document.getElementById("workCardBottom");
    wrap.innerHTML = "";

    data.services.forEach(function (service) {
      var col = document.createElement("div");
      col.className = "work-service";
      var title = document.createElement("p");
      title.className = "work-service__title";
      title.textContent = service.title;
      var text = document.createElement("p");
      text.className = "work-service__text";
      text.textContent = service[lang];
      col.appendChild(title);
      col.appendChild(text);
      wrap.appendChild(col);
    });

    var credWrap = document.createElement("div");
    credWrap.className = "work-credentials";
    data.credentials.forEach(function (c) {
      var line = document.createElement("p");
      line.innerHTML = "<strong>" + c.bold + "</strong> " + c.rest;
      credWrap.appendChild(line);
    });
    wrap.appendChild(credWrap);
  }

  document.addEventListener("mk:langchange", render);

  window.MK = window.MK || {};
  window.MK.workTogether = { init: render };
})();
