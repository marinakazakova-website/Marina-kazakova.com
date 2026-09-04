/**
 * Interactive BRAND ECOSYSTEM DESIGN method list.
 * Desktop: hover activates a step, title + description turn accent, the
 * description fades out/in. Mobile: tap (same visual code, acts as an
 * accordion trigger).
 */
(function () {
  "use strict";

  var steps = window.SITE_CONTENT.brandEcosystem.method;
  var activeIndex = 0;
  var listEl;
  var isFinePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function renderDescription(row, step) {
    var lang = window.MK.i18n.getLang();
    var descEl = row.querySelector(".method__desc");
    descEl.innerHTML = '<span class="method__desc-inner">' + step[lang] + "</span>";
  }

  function setActive(index) {
    if (index === activeIndex) return;
    activeIndex = index;
    var rows = listEl.querySelectorAll(".method__row");
    rows.forEach(function (row, i) {
      var isActive = i === index;
      row.classList.toggle("is-active", isActive);
      row.setAttribute("aria-selected", String(isActive));
      if (isActive) renderDescription(row, steps[i]);
    });
  }

  function render() {
    listEl = document.getElementById("methodList");
    listEl.innerHTML = "";

    steps.forEach(function (step, i) {
      var row = document.createElement("div");
      row.className = "method__row" + (i === activeIndex ? " is-active" : "");
      row.setAttribute("role", "tab");
      row.setAttribute("tabindex", "0");
      row.setAttribute("aria-selected", String(i === activeIndex));

      var titleWrap = document.createElement("div");
      titleWrap.className = "method__title-wrap";
      var marker = document.createElement("span");
      marker.className = "method__marker";
      marker.textContent = "×";
      var title = document.createElement("span");
      title.className = "method__title";
      title.textContent = step.title;
      titleWrap.appendChild(marker);
      titleWrap.appendChild(title);

      var desc = document.createElement("div");
      desc.className = "method__desc";

      row.appendChild(titleWrap);
      row.appendChild(desc);

      if (isFinePointer) {
        row.addEventListener("mouseenter", function () { setActive(i); });
      }
      row.addEventListener("click", function () { setActive(i); });
      row.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(i); }
      });

      listEl.appendChild(row);
      if (i === activeIndex) renderDescription(row, step);
    });
  }

  document.addEventListener("mk:langchange", function () {
    var rows = listEl.querySelectorAll(".method__row");
    renderDescription(rows[activeIndex], steps[activeIndex]);
  });

  window.MK = window.MK || {};
  window.MK.method = { init: render };
})();
