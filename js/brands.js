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

  // Assets are relative to the site root; this page lives one level
  // down (brands/), so it normally needs "../" to reach them. A
  // standalone preview build inlines images as absolute data: URIs —
  // prepending "../" to those would corrupt them, so leave any
  // already-absolute URL untouched (see js/direction-page.js).
  function assetUrl(src) {
    return /^(data|https?|blob):/.test(src) ? src : "../" + src;
  }

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

  // Vertical looping word list (Brand Audit / Research): two identical
  // word tracks scroll in lockstep — a dim full-height one and a purple
  // one clipped to a single center line — so whichever word is passing
  // through that line reads as the active one, no JS-timed color logic
  // needed. Words repeated once for a seamless -50% loop.
  function buildAuditCycle(words) {
    var wrap = document.createElement("div");
    wrap.className = "audit-cycle";
    wrap.setAttribute("aria-hidden", "true");

    var doubled = words.concat(words);

    function buildTrack(modifier) {
      var track = document.createElement("div");
      track.className = "audit-cycle__track audit-cycle__track--" + modifier;
      doubled.forEach(function (word) {
        var line = document.createElement("span");
        line.className = "audit-cycle__word";
        line.textContent = word;
        track.appendChild(line);
      });
      return track;
    }

    var dim = document.createElement("div");
    dim.className = "audit-cycle__mask";
    dim.appendChild(buildTrack("dim"));
    wrap.appendChild(dim);

    var highlight = document.createElement("div");
    highlight.className = "audit-cycle__highlight";
    highlight.appendChild(buildTrack("active"));
    wrap.appendChild(highlight);

    var dots = document.createElement("span");
    dots.className = "audit-cycle__dots";
    for (var i = 0; i < 3; i++) dots.appendChild(document.createElement("i"));
    wrap.appendChild(dots);

    return wrap;
  }

  // Looping photo cycle (Brand Audit / Unpacking): every frame is
  // absolutely stacked and shares one fade keyframe, each offset by a
  // negative delay to its own slot — exactly one is visible at a time,
  // in order, forever (same shared-animation approach as the audit
  // cycle above). Two two-line corner words frame the cycling frame,
  // matching the client's reference composition at a scale that fits
  // this card.
  function buildInterviewCollage(step) {
    var wrap = document.createElement("div");
    wrap.className = "interview-collage";
    wrap.setAttribute("aria-hidden", "true");

    var stage = document.createElement("div");
    stage.className = "interview-collage__stage";
    var n = step.images.length;
    // Must match the animation-duration set on .interview-collage__frame
    // in css/brands.css — animation-delay takes a time value, not a
    // percentage, so the per-image offset is computed from it directly.
    var CYCLE_SECONDS = 33;
    step.images.forEach(function (src, i) {
      var frame = document.createElement("div");
      frame.className = "interview-collage__frame";
      frame.style.animationDelay = (-(i * CYCLE_SECONDS / n)) + "s";
      var img = document.createElement("img");
      img.src = assetUrl(src);
      img.alt = "";
      img.loading = "lazy";
      frame.appendChild(img);
      stage.appendChild(frame);
    });
    wrap.appendChild(stage);

    var corners = step.corners || {};
    [["tl", corners.tl], ["br", corners.br]].forEach(function (pair) {
      if (!pair[1]) return;
      var word = document.createElement("span");
      word.className = "interview-collage__word interview-collage__word--" + pair[0];
      pair[1].forEach(function (line) {
        var lineEl = document.createElement("span");
        lineEl.className = "interview-collage__word-line";
        lineEl.textContent = line;
        word.appendChild(lineEl);
      });
      wrap.appendChild(word);
    });

    return wrap;
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

    if (step.visual === "audit-cycle" && step.words) {
      win.classList.add("brands-media__window--audit-cycle");
      win.appendChild(buildAuditCycle(step.words));
    } else if (step.visual === "interview-collage" && step.images) {
      win.classList.add("brands-media__window--interview-collage");
      win.appendChild(buildInterviewCollage(step));
    } else {
      var placeholder = document.createElement("span");
      placeholder.className = "brands-media__plus";
      placeholder.textContent = "+";
      win.appendChild(placeholder);
    }
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

    var ctaGroup = document.createElement("div");
    ctaGroup.className = "brands-cta-group";

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
    ctaGroup.appendChild(toggle);

    // Same visual system as the workflow toggle (font/size/border/radius/
    // height) — just a plain contact link, not an expand control.
    var discuss = document.createElement("a");
    discuss.className = "brands-toggle brands-toggle--cta";
    discuss.href = "https://t.me/marinakazakova_ru";
    discuss.target = "_blank";
    discuss.rel = "noopener";
    discuss.textContent = "DISCUSS YOUR PROJECT";
    ctaGroup.appendChild(discuss);

    inner.appendChild(ctaGroup);

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
