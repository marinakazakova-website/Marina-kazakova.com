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

      var label = document.createElement("p");
      label.className = "work-service__label";
      label.textContent = service.label[lang];
      col.appendChild(label);

      var title = document.createElement("p");
      title.className = "work-service__title";
      title.textContent = service.title;
      col.appendChild(title);

      service.before.forEach(function (line) {
        var p = document.createElement("p");
        p.className = "work-service__text";
        p.textContent = line[lang];
        col.appendChild(p);
      });

      var tags = document.createElement("p");
      tags.className = "work-service__tags";
      tags.textContent = service.tags.join(" · ");
      col.appendChild(tags);

      service.after.forEach(function (line) {
        var p = document.createElement("p");
        p.className = "work-service__text";
        p.textContent = line[lang];
        col.appendChild(p);
      });

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
