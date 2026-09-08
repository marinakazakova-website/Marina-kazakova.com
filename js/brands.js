/**
 * BRANDS page — method sequence (reveal + anchor nav in one) and the
 * five always-present stage sections, each with an inline-expanding
 * CHECK WORKFLOW PLAN. No accordion across stages: every stage's toggle
 * is independent, and all five stages stay on the page at once (the
 * user can either jump via the nav or just scroll through everything).
 */
(function () {
  "use strict";

  var DATA = window.BRANDS_PAGE_DATA;

  function renderMethodNav() {
    var nav = document.getElementById("brandsMethodNav");
    nav.innerHTML = "";
    DATA.method.forEach(function (step, i) {
      var a = document.createElement("a");
      a.className = "brands-method__item reveal-seq";
      a.style.transitionDelay = (i * 90) + "ms";
      a.href = "#" + step.id;
      a.textContent = step.label;
      a.setAttribute("data-target", step.id);
      nav.appendChild(a);
    });

    document.getElementById("brandsTagline").textContent = DATA.tagline;
  }

  function buildMetaRow(labelText, valueText) {
    var row = document.createElement("div");
    row.className = "brands-meta__row";
    var label = document.createElement("span");
    label.className = "brands-meta__label";
    label.textContent = labelText;
    var value = document.createElement("p");
    value.className = "brands-meta__value";
    value.textContent = valueText;
    row.appendChild(label);
    row.appendChild(value);
    return row;
  }

  function buildMediaCell(step) {
    var cell = document.createElement("div");
    cell.className = "brands-media" + (step.open ? " brands-media--open" : "");

    var head = document.createElement("div");
    head.className = "brands-media__head";
    var num = document.createElement("span");
    num.className = "brands-media__num";
    num.textContent = step.id + (step.open ? " +++" : "");
    head.appendChild(num);
    if (step.label) {
      var label = document.createElement("span");
      label.className = "brands-media__label";
      label.textContent = step.label;
      head.appendChild(label);
    }
    cell.appendChild(head);

    var win = document.createElement("div");
    win.className = "brands-media__window reveal-fade-in";
    var placeholder = document.createElement("span");
    placeholder.className = "brands-media__plus";
    placeholder.textContent = "+";
    win.appendChild(placeholder);
    cell.appendChild(win);

    return cell;
  }

  function buildStage(stage) {
    var section = document.createElement("section");
    section.className = "brands-stage";
    section.id = stage.id;

    var inner = document.createElement("div");
    inner.className = "container brands-stage__inner";

    var title = document.createElement("h2");
    title.className = "brands-stage__title reveal-up";
    var indexEl = document.createElement("span");
    indexEl.className = "brands-stage__index";
    indexEl.textContent = stage.index;
    title.appendChild(indexEl);
    // The " | " divider stays in the title's own (Consolas) font; the
    // index and stage name switch to Montserrat via their own spans.
    var divider = document.createElement("span");
    divider.className = "brands-stage__divider";
    divider.textContent = " | ";
    title.appendChild(divider);
    var nameEl = document.createElement("span");
    nameEl.className = "brands-stage__name";
    nameEl.textContent = stage.title;
    title.appendChild(nameEl);
    inner.appendChild(title);

    var meta = document.createElement("div");
    meta.className = "brands-meta reveal-up";
    meta.appendChild(buildMetaRow("ЦЕЛЬ", stage.meta.goal));
    meta.appendChild(buildMetaRow("СОСТАВ РАБОТ", stage.meta.scope));
    meta.appendChild(buildMetaRow("РЕЗУЛЬТАТ", stage.meta.result));
    meta.appendChild(buildMetaRow("КОМАНДА", stage.meta.team));
    meta.appendChild(buildMetaRow("СРОК", stage.meta.timing));
    inner.appendChild(meta);

    var toggle = document.createElement("button");
    toggle.className = "brands-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    var toggleLabel = document.createElement("span");
    toggleLabel.className = "brands-toggle__label";
    toggleLabel.textContent = "CHECK WORKFLOW PLAN";
    var toggleIcon = document.createElement("span");
    toggleIcon.className = "brands-toggle__icon";
    toggleIcon.textContent = "+";
    toggle.appendChild(toggleLabel);
    toggle.appendChild(toggleIcon);
    inner.appendChild(toggle);

    var wrap = document.createElement("div");
    wrap.className = "brands-workflow-wrap";
    var workflow = document.createElement("div");
    workflow.className = "brands-workflow";

    var quote = document.createElement("p");
    quote.className = "brands-workflow__quote";
    quote.textContent = stage.meta.goal;
    workflow.appendChild(quote);

    var grid = document.createElement("div");
    grid.className = "brands-grid brands-grid--" + stage.layout;
    stage.workflow.forEach(function (step) {
      grid.appendChild(buildMediaCell(step));
    });
    workflow.appendChild(grid);

    wrap.appendChild(workflow);
    inner.appendChild(wrap);

    toggle.addEventListener("click", function () {
      var isOpen = wrap.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggleIcon.textContent = isOpen ? "×" : "+";
    });

    section.appendChild(inner);
    return section;
  }

  function renderStages() {
    var wrap = document.getElementById("brandsStages");
    wrap.innerHTML = "";
    DATA.stages.forEach(function (stage) {
      wrap.appendChild(buildStage(stage));
    });
  }

  // Restrained scroll reveals: fade/slide-up only, plays once per
  // element. Mirrors the pattern already used on the Films page.
  function observeReveals() {
    var targets = document.querySelectorAll(".reveal-up, .reveal-fade-in, .reveal-seq");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    targets.forEach(function (el) { observer.observe(el); });
  }

  // Highlights the method-nav item matching whichever stage section is
  // currently in view while scrolling straight through the page. Tracks
  // every section's visibility (not just the entries in the latest
  // batch) and always resolves to the topmost one currently qualifying,
  // so two sections crossing the 50% threshold in the same batch can't
  // let the wrong one win by virtue of being processed last.
  function observeActiveStage() {
    if (!("IntersectionObserver" in window)) return;
    var navItems = document.querySelectorAll(".brands-method__item");
    var sections = document.querySelectorAll(".brands-stage");
    if (!sections.length) return;

    var visible = {};
    function applyActive() {
      var activeId = null;
      for (var i = 0; i < sections.length; i++) {
        if (visible[sections[i].id]) { activeId = sections[i].id; break; }
      }
      navItems.forEach(function (item) {
        item.classList.toggle("is-active", item.getAttribute("data-target") === activeId);
      });
      sections.forEach(function (s) {
        s.classList.toggle("is-active", s.id === activeId);
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
      applyActive();
    }, { threshold: 0.5 });
    sections.forEach(function (s) { observer.observe(s); });
  }

  // Toggles .is-stuck on the method bar the moment position:sticky
  // actually engages, via a 1px sentinel placed just above it. The
  // observer's rootMargin is shifted up by the bar's own sticky `top`
  // offset, so "sentinel scrolled out" lines up exactly with "bar is
  // now pinned" rather than merely "scrolled past the viewport top".
  function observeStickyMethod() {
    var methodEl = document.getElementById("brandsMethod");
    var sentinel = document.getElementById("brandsMethodSentinel");
    if (!methodEl || !sentinel || !("IntersectionObserver" in window)) return;

    var topOffset = parseFloat(window.getComputedStyle(methodEl).top) || 0;
    var observer = new IntersectionObserver(function (entries) {
      methodEl.classList.toggle("is-stuck", !entries[0].isIntersecting);
    }, { rootMargin: "-" + Math.ceil(topOffset) + "px 0px 0px 0px", threshold: 0 });
    observer.observe(sentinel);
  }

  // Sizes the hero gradient's wrapper to exactly the intro + method
  // block's combined natural height, then hands it to the shared
  // gradient-motion module (same animation as homepage Block 2 - not a
  // new variant). methodEl.offsetTop already accounts for everything
  // above it (intro included), since its offsetParent is .brands-page.
  function initHeroGradient() {
    var wrap = document.getElementById("brandsHeroBg");
    var canvas = wrap && wrap.querySelector("canvas");
    var methodEl = document.getElementById("brandsMethod");
    if (!wrap || !canvas || !methodEl || !window.MK || !window.MK.gradientMotion) return;

    function sizeWrap() {
      wrap.style.height = (methodEl.offsetTop + methodEl.offsetHeight) + "px";
    }
    window.addEventListener("resize", sizeWrap);
    sizeWrap();

    window.MK.gradientMotion.init(wrap, canvas);
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderMethodNav();
    renderStages();
    observeReveals();
    observeActiveStage();
    observeStickyMethod();
    initHeroGradient();
  });
})();
