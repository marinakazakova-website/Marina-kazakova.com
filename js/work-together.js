/**
 * WAYS TO WORK TOGETHER — service columns + credentials.
 */
(function () {
  "use strict";

  // A black "possible request" pill that reveals its real underlying ask
  // in a panel sliding out to the right — on hover (desktop), and on tap
  // (mobile, where hover doesn't exist): first tap opens, second closes.
  function buildRequestPill(item, lang) {
    var req = document.createElement("div");
    req.className = "work-service__request";

    var pill = document.createElement("button");
    pill.type = "button";
    pill.className = "work-service__pill";
    pill.textContent = item.title[lang];
    pill.setAttribute("aria-expanded", "false");

    var expand = document.createElement("div");
    expand.className = "work-service__pill-expand";
    var panel = document.createElement("div");
    panel.className = "work-service__pill-panel";
    panel.textContent = item.hover[lang];
    expand.appendChild(panel);

    pill.addEventListener("click", function () {
      var isOpen = req.classList.toggle("is-open");
      pill.setAttribute("aria-expanded", String(isOpen));
    });

    req.appendChild(pill);
    req.appendChild(expand);
    return req;
  }

  function render() {
    var lang = window.MK.i18n.getLang();
    var data = window.SITE_CONTENT.workTogether;
    var wrap = document.getElementById("workCardBottom");
    wrap.innerHTML = "";

    data.services.forEach(function (service) {
      var col = document.createElement("div");
      col.className = "work-service";

      var head = document.createElement("div");
      head.className = "work-service__head";
      var title = document.createElement("p");
      title.className = "work-service__title";
      title.textContent = service.title[lang];
      var timing = document.createElement("span");
      timing.className = "work-service__timing";
      timing.textContent = service.timing[lang];
      head.appendChild(title);
      head.appendChild(timing);
      col.appendChild(head);

      var body = document.createElement("p");
      body.className = "work-service__text";
      body.textContent = service.body[lang];
      col.appendChild(body);

      var sectionLabel = document.createElement("span");
      sectionLabel.className = "work-service__section-label";
      sectionLabel.textContent = service.sectionLabel[lang];
      col.appendChild(sectionLabel);

      if (service.items) {
        var pills = document.createElement("div");
        pills.className = "work-service__pills";
        service.items.forEach(function (item) {
          pills.appendChild(buildRequestPill(item, lang));
        });
        col.appendChild(pills);
      }

      if (service.steps) {
        var steps = document.createElement("div");
        steps.className = "work-service__steps";
        service.steps.forEach(function (step, i) {
          var unit = document.createElement("span");
          unit.className = "work-service__step";
          unit.style.animationDelay = (i * 0.15) + "s";
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
        observeSteps(steps);
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

  // Reveals the "Cooperation Strategy" process chain one step at a time
  // (each pill + arrow fades/slides in with a short stagger) the first time
  // it scrolls into view, so it reads as a sequence rather than a static
  // bag of tags. Plays once per element.
  function observeSteps(stepsEl) {
    if (!("IntersectionObserver" in window)) {
      stepsEl.classList.add("is-visible");
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    observer.observe(stepsEl);
  }

  document.addEventListener("mk:langchange", render);

  window.MK = window.MK || {};
  window.MK.workTogether = { init: render };
})();
