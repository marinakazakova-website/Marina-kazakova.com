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

      var head = document.createElement("div");
      head.className = "work-service__head";
      var title = document.createElement("p");
      title.className = "work-service__title";
      title.textContent = service.title;
      var timing = document.createElement("span");
      timing.className = "work-service__timing";
      timing.textContent = service.timing;
      head.appendChild(title);
      head.appendChild(timing);
      col.appendChild(head);

      service.before.forEach(function (line) {
        var p = document.createElement("p");
        p.className = "work-service__text";
        p.textContent = line[lang];
        col.appendChild(p);
      });

      if (service.tags) {
        var pills = document.createElement("div");
        pills.className = "work-service__pills";
        service.tags.forEach(function (tag) {
          var pill = document.createElement("span");
          pill.className = "work-service__pill";
          pill.textContent = tag;
          pills.appendChild(pill);
        });
        col.appendChild(pills);
      }

      if (service.steps) {
        var steps = document.createElement("div");
        steps.className = "work-service__steps";
        service.steps.forEach(function (step, i) {
          var unit = document.createElement("span");
          unit.className = "work-service__step";
          var pill = document.createElement("span");
          pill.className = "work-service__pill";
          pill.textContent = step;
          unit.appendChild(pill);
          if (i < service.steps.length - 1) {
            var arrow = document.createElement("span");
            arrow.className = "work-service__step-arrow";
            arrow.textContent = "→";
            unit.appendChild(arrow);
          }
          steps.appendChild(unit);
        });
        col.appendChild(steps);
      }

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
