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

    document.getElementById("brandsTagline").textContent = metaText(DATA.tagline, window.MK.i18n.getLang());
    document.getElementById("brandsDuration").textContent = metaText(DATA.duration, window.MK.i18n.getLang());
  }

  // The five meta labels are the interface around the content, not the
  // content itself — same set on every stage, so kept once here rather
  // than repeated per stage in the data file.
  var META_LABELS = {
    en: { goal: "GOAL", scope: "SCOPE OF WORK", result: "RESULT", team: "TEAM", outsource: "OUTSOURCE", timing: "TIMELINE" },
    ru: { goal: "ЦЕЛЬ", scope: "СОСТАВ РАБОТ", result: "РЕЗУЛЬТАТ", team: "КОМАНДА", outsource: "АУТСОРС", timing: "СРОК" }
  };

  // A meta field is either a plain string (same in both languages — the
  // client's own English scope/team terms) or an { en, ru } pair (the
  // explanatory prose that actually needs translating). Mirrors the
  // fallback shape window.MK.i18n.t() already uses site-wide.
  function metaText(field, lang) {
    if (field && typeof field === "object") return field[lang] || field.en || field.ru || "";
    return field || "";
  }

  // TEAM/OUTSOURCE each get a small hover-only note pinned to the row's
  // right edge — who pays for what, without adding a permanent line of
  // copy. "MONTHLY FEE" prints in the brand accent, the rest in the row's
  // ordinary text color.
  var HINT_TEXT = {
    team: { en: "MONTHLY FEE", ru: "ЕЖЕМЕСЯЧНЫЙ ГОНОРАР" },
    outsource: { en: "✱ SEPARATE DEVELOPMENT BUDGET", ru: "✱ ОТДЕЛЬНЫЙ БЮДЖЕТ НА РАЗВИТИЕ" }
  };

  function buildTeamHint(lang) {
    var hint = document.createElement("span");
    hint.className = "brands-meta__hint brands-meta__hint--team";
    hint.textContent = "✱ " + HINT_TEXT.team[lang];
    return hint;
  }

  function buildOutsourceHint(lang) {
    var hint = document.createElement("span");
    hint.className = "brands-meta__hint brands-meta__hint--outsource";
    hint.textContent = HINT_TEXT.outsource[lang];
    return hint;
  }

  function buildMetaRow(key, stage) {
    var lang = window.MK.i18n.getLang();
    var row = document.createElement("div");
    row.className = "brands-meta__row" + (key === "outsource" ? " brands-meta__row--outsource" : "");
    row.dataset.metaKey = key;
    var label = document.createElement("span");
    label.className = "brands-meta__label";
    label.textContent = META_LABELS[lang][key];
    row.appendChild(label);

    var outsource = key === "outsource" ? stage.meta.outsource : null;
    var hasOutsource = outsource && outsource.tags && outsource.tags.length;
    if (hasOutsource) {
      // Tags and the "depending on ..." note are direct siblings in one
      // wrapping flex row, so the note flows right after the last tag
      // instead of dropping to its own line.
      var valueWrap = document.createElement("div");
      valueWrap.className = "brands-meta__value brands-meta__value--outsource";
      outsource.tags.forEach(function (name) {
        var tag = document.createElement("span");
        tag.className = "brands-meta__tag";
        tag.textContent = name;
        valueWrap.appendChild(tag);
      });
      if (outsource.note) {
        var note = document.createElement("span");
        note.className = "brands-meta__note";
        note.textContent = outsource.note;
        valueWrap.appendChild(note);
      }
      row.appendChild(valueWrap);
    } else {
      var value = document.createElement("p");
      value.className = "brands-meta__value";
      value.textContent = key === "outsource" ? "—" : metaText(stage.meta[key], lang);
      row.appendChild(value);
    }

    if (key === "team") {
      row.appendChild(buildTeamHint(lang));
    } else if (key === "outsource" && hasOutsource) {
      // No outside specialists at this stage (Brand Audit / Brand
      // Foundation) -> no development-budget hint either.
      row.appendChild(buildOutsourceHint(lang));
    }
    return row;
  }

  // Re-applies just the label/value text on every existing stage section
  // when the language switches — never rebuilds the stage DOM, so open
  // "CHECK WORKFLOW PLAN" panels and the running GIF animations are left
  // completely undisturbed (only their surrounding copy changes).
  function applyBrandsLang() {
    var lang = window.MK.i18n.getLang();
    var durationEl = document.getElementById("brandsDuration");
    if (durationEl) durationEl.textContent = metaText(DATA.duration, lang);
    var taglineEl = document.getElementById("brandsTagline");
    if (taglineEl) taglineEl.textContent = metaText(DATA.tagline, lang);
    DATA.stages.forEach(function (stage) {
      var section = document.getElementById(stage.id);
      if (!section) return;
      section.querySelectorAll(".brands-meta__row").forEach(function (row) {
        var key = row.dataset.metaKey;
        row.querySelector(".brands-meta__label").textContent = META_LABELS[lang][key];
        if (key === "team") {
          row.querySelector(".brands-meta__hint--team").textContent = "✱ " + HINT_TEXT.team[lang];
        }
        var outsourceHint = row.querySelector(".brands-meta__hint--outsource");
        if (outsourceHint) outsourceHint.textContent = HINT_TEXT.outsource[lang];
        // OUTSOURCE's tags/dash are English professional terms, same in
        // both languages — nothing to re-render, and doing so via
        // .textContent would wipe out the tag markup.
        if (key === "outsource") return;
        row.querySelector(".brands-meta__value").textContent = metaText(stage.meta[key], lang);
      });
      var quote = section.querySelector(".brands-workflow__quote");
      if (quote) quote.textContent = metaText(stage.meta.goal, lang);
      stage.workflow.forEach(function (step) {
        if (step.caption) {
          var caption = section.querySelector('.brands-media__caption[data-step-id="' + step.id + '"]');
          if (caption) caption.textContent = metaText(step.caption, lang);
        }
        if (step.result) {
          var panel = section.querySelector('.brands-result__panel[data-step-id="' + step.id + '"]');
          if (panel) panel.textContent = metaText(step.result, lang);
        }
      });
    });
  }

  // Shared accumulation meter for Research + Unpacking (see
  // css/brands.css) — a thin segmented bar that fills bottom-to-top in
  // sync with the host card's own cycle, then resets with it. variant is
  // "stepped" (Research: data points arriving) or "smooth" (Unpacking:
  // gathered gradually through conversation).
  function buildProgressMeter(variant) {
    var CELLS = 6;
    var meter = document.createElement("div");
    meter.className = "progress-meter progress-meter--" + variant;
    meter.setAttribute("aria-hidden", "true");

    var track = document.createElement("div");
    track.className = "progress-meter__track";
    var fill = document.createElement("div");
    fill.className = "progress-meter__fill";
    for (var i = 0; i < CELLS; i++) {
      track.appendChild(document.createElement("div")).className = "progress-meter__cell";
      fill.appendChild(document.createElement("div")).className = "progress-meter__cell";
    }
    meter.appendChild(track);
    meter.appendChild(fill);
    return meter;
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

    wrap.appendChild(buildProgressMeter("stepped"));

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

    wrap.appendChild(buildProgressMeter("smooth"));

    return wrap;
  }

  // Brand Audit / Strategy & Road Map: one continuous animated SVG,
  // built from a static template (no per-instance data to loop over,
  // unlike the two cycles above) — INFORMATION -> CONNECTIONS ->
  // DIRECTION -> ROADMAP -> STRATEGY. Every element's timing lives in
  // css/brands.css as plain percentage keyframes sharing one --sr-dur
  // clock, so this function only needs to emit the markup once.
  function buildStrategyRoadmap() {
    var wrap = document.createElement("div");
    wrap.className = "strategy-roadmap";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML =
      '<svg viewBox="0 0 1280 720">' +
        '<g>' +
          '<path class="strategy-roadmap__chaos-line" style="animation-delay:0.0s"  d="M -40,120  C 260,60  420,260  680,180  C 900,120 1100,220 1330,140" />' +
          '<path class="strategy-roadmap__chaos-line" style="animation-delay:0.15s" d="M 1330,560 C 1040,640 860,420  620,500  C 420,560  220,460  -40,560" />' +
          '<path class="strategy-roadmap__chaos-line" style="animation-delay:0.3s"  d="M 120,-40  C 200,180  60,320  220,480  C 340,600 260,700 320,760" />' +
          '<path class="strategy-roadmap__chaos-line" style="animation-delay:0.45s" d="M 1180,-40 C 1080,160 1220,300 1040,440 C 900,540 980,640 900,760" />' +
          '<path class="strategy-roadmap__chaos-line" style="animation-delay:0.6s"  d="M -40,340  C 220,300 380,420 640,360  C 880,300 1040,380 1330,320" />' +
          '<path class="strategy-roadmap__chaos-line" style="animation-delay:0.2s"  d="M 640,-40  C 560,140 760,220 660,380  C 580,520 720,600 640,760" />' +
          '<path class="strategy-roadmap__chaos-line" style="animation-delay:0.5s"  d="M 1330,240 C 1080,180 940,300 760,240 C 560,180 360,260 -40,200" />' +
          '<text class="strategy-roadmap__chaos-word" style="animation: sr-chaos-word-1 var(--sr-dur) linear infinite;" x="260" y="150">BRAND</text>' +
          '<text class="strategy-roadmap__chaos-word" style="animation: sr-chaos-word-2 var(--sr-dur) linear infinite;" x="760" y="120">FOUNDER</text>' +
          '<text class="strategy-roadmap__chaos-word" style="animation: sr-chaos-word-3 var(--sr-dur) linear infinite;" x="900" y="560">PRODUCT</text>' +
          '<text class="strategy-roadmap__chaos-word" style="animation: sr-chaos-word-4 var(--sr-dur) linear infinite;" x="220" y="440">AUDIENCE</text>' +
          '<text class="strategy-roadmap__chaos-word" style="animation: sr-chaos-word-5 var(--sr-dur) linear infinite;" x="980" y="300">MARKET</text>' +
          '<text class="strategy-roadmap__chaos-word" style="animation: sr-chaos-word-6 var(--sr-dur) linear infinite;" x="440" y="600">COMPETITORS</text>' +
          '<text class="strategy-roadmap__chaos-word" style="animation: sr-chaos-word-7 var(--sr-dur) linear infinite;" x="720" y="420">INSIGHTS</text>' +
        '</g>' +
        '<g>' +
          '<path class="strategy-roadmap__converge-line" d="M 60,220  C 320,240 480,300 640,360" />' +
          '<path class="strategy-roadmap__converge-line" d="M 60,540  C 320,460 480,400 640,360" />' +
          '<path class="strategy-roadmap__converge-line" d="M 1220,180 C 940,240 760,300 640,360" />' +
          '<circle class="strategy-roadmap__converge-dot" cx="420" cy="290" r="0" />' +
          '<circle class="strategy-roadmap__converge-dot" cx="820" cy="270" r="0" />' +
          '<circle class="strategy-roadmap__converge-dot" cx="640" cy="360" r="0" />' +
        '</g>' +
        '<g class="strategy-roadmap__group">' +
          '<path class="strategy-roadmap__line-base" d="M 170,380 L 1110,380" />' +
          '<path class="strategy-roadmap__line-purple" d="M 170,380 L 1110,380" />' +
          '<g class="strategy-roadmap__dot n0"><circle cx="170" cy="380" r="7" /></g>' +
          '<g class="strategy-roadmap__dot n1"><circle cx="405" cy="380" r="7" /></g>' +
          '<g class="strategy-roadmap__dot n2"><circle cx="640" cy="380" r="7" /></g>' +
          '<g class="strategy-roadmap__dot n3"><circle cx="875" cy="380" r="7" /></g>' +
          '<g class="strategy-roadmap__dot n4"><circle cx="1110" cy="380" r="7" /></g>' +
          '<text class="strategy-roadmap__label l0" x="170" y="340" text-anchor="middle">FOUNDATION</text>' +
          '<text class="strategy-roadmap__label l1" x="405" y="340" text-anchor="middle">POSITIONING</text>' +
          '<text class="strategy-roadmap__label l2" x="640" y="340" text-anchor="middle">PRODUCT</text>' +
          '<text class="strategy-roadmap__label l3" x="875" y="340" text-anchor="middle">IDENTITY</text>' +
          '<text class="strategy-roadmap__label l4" x="1110" y="340" text-anchor="middle">MARKET</text>' +
          '<g class="strategy-roadmap__detail d0">' +
            '<text class="strategy-roadmap__detail-head" x="170" y="430" text-anchor="middle">FOUNDATION</text>' +
            '<text class="strategy-roadmap__detail-line" x="170" y="452" text-anchor="middle">Meaning</text>' +
            '<text class="strategy-roadmap__detail-line" x="170" y="472" text-anchor="middle">Positioning</text>' +
            '<text class="strategy-roadmap__detail-line" x="170" y="492" text-anchor="middle">Audience</text>' +
          '</g>' +
          '<g class="strategy-roadmap__detail d1">' +
            '<text class="strategy-roadmap__detail-head" x="640" y="430" text-anchor="middle">PRODUCT</text>' +
            '<text class="strategy-roadmap__detail-line" x="640" y="452" text-anchor="middle">Offer</text>' +
            '<text class="strategy-roadmap__detail-line" x="640" y="472" text-anchor="middle">Experience</text>' +
            '<text class="strategy-roadmap__detail-line" x="640" y="492" text-anchor="middle">Value</text>' +
          '</g>' +
          '<g class="strategy-roadmap__detail d2">' +
            '<text class="strategy-roadmap__detail-head" x="1110" y="430" text-anchor="middle">MARKET</text>' +
            '<text class="strategy-roadmap__detail-line" x="1110" y="452" text-anchor="middle">Launch</text>' +
            '<text class="strategy-roadmap__detail-line" x="1110" y="472" text-anchor="middle">Communication</text>' +
            '<text class="strategy-roadmap__detail-line" x="1110" y="492" text-anchor="middle">Growth</text>' +
          '</g>' +
          '<g class="strategy-roadmap__card c0">' +
            '<rect x="130" y="180" width="80" height="110" rx="4" fill="none" stroke="var(--color-accent)" stroke-width="1.5" />' +
            '<line x1="130" y1="290" x2="210" y2="180" stroke="var(--sr-muted-strong)" stroke-width="1" />' +
            '<rect x="130" y="180" width="80" height="110" fill="url(#srRefGrad)" opacity="0.5" />' +
          '</g>' +
          '<g class="strategy-roadmap__card c1">' +
            '<rect x="600" y="150" width="80" height="110" rx="4" fill="none" stroke="var(--color-accent)" stroke-width="1.5" />' +
            '<line x1="600" y1="260" x2="680" y2="150" stroke="var(--sr-muted-strong)" stroke-width="1" />' +
            '<rect x="600" y="150" width="80" height="110" fill="url(#srRefGrad)" opacity="0.5" />' +
          '</g>' +
          '<g class="strategy-roadmap__card c2">' +
            '<rect x="1070" y="180" width="80" height="110" rx="4" fill="none" stroke="var(--color-accent)" stroke-width="1.5" />' +
            '<line x1="1070" y1="290" x2="1150" y2="180" stroke="var(--sr-muted-strong)" stroke-width="1" />' +
            '<rect x="1070" y="180" width="80" height="110" fill="url(#srRefGrad)" opacity="0.5" />' +
          '</g>' +
          '<circle class="strategy-roadmap__pulse" r="9" fill="var(--color-accent)" style="filter:blur(1px)" />' +
        '</g>' +
        '<defs>' +
          '<linearGradient id="srRefGrad" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="#3a3d55" />' +
            '<stop offset="1" stop-color="#15151d" />' +
          '</linearGradient>' +
        '</defs>' +
      '</svg>' +
      '<div class="strategy-roadmap__title"><h3>STRATEGY<br>&amp; ROADMAP</h3></div>';
    return wrap;
  }

  // Product Experience's three structural diagrams — same visual system
  // as the Brand Audit GIFs (black window, thin white/muted lines,
  // purple accent for active nodes, Consolas micro-labels), but static
  // system schematics rather than time-based cycles: each one draws in
  // once on scroll reveal (via .is-visible, see observeReveals) instead
  // of looping, since a product system reads as structure, not process.
  function buildProductBuilding() {
    var wrap = document.createElement("div");
    wrap.className = "product-diagram product-diagram--building";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML =
      '<svg viewBox="0 0 400 300">' +
        '<g class="pd-line" style="animation-delay:0ms"><line x1="120" y1="90" x2="150" y2="115" /></g>' +
        '<g class="pd-line" style="animation-delay:80ms"><line x1="280" y1="90" x2="250" y2="115" /></g>' +
        '<g class="pd-line" style="animation-delay:160ms"><line x1="120" y1="210" x2="150" y2="175" /></g>' +
        '<g class="pd-line" style="animation-delay:240ms"><line x1="280" y1="210" x2="250" y2="175" /></g>' +
        '<g class="pd-line" style="animation-delay:320ms"><line x1="200" y1="213" x2="200" y2="174" /></g>' +
        '<g class="pd-card" style="animation-delay:0ms"><rect x="30" y="30" width="100" height="60" rx="3" /><text x="80" y="63">AUDIENCE</text></g>' +
        '<g class="pd-card" style="animation-delay:80ms"><rect x="270" y="30" width="100" height="60" rx="3" /><text x="320" y="63">FORMAT</text></g>' +
        '<g class="pd-card" style="animation-delay:160ms"><rect x="30" y="205" width="100" height="60" rx="3" /><text x="80" y="238">VALUE</text></g>' +
        '<g class="pd-card" style="animation-delay:240ms"><rect x="270" y="205" width="100" height="60" rx="3" /><text x="320" y="238">PRICING</text></g>' +
        '<g class="pd-card" style="animation-delay:320ms"><rect x="150" y="213" width="100" height="46" rx="3" /><text x="200" y="239">RESULT</text></g>' +
        '<g class="pd-core" style="animation-delay:420ms">' +
          '<rect x="150" y="108" width="100" height="66" rx="4" />' +
          '<text x="200" y="134">PRODUCT</text>' +
          '<text x="200" y="151">OFFER</text>' +
          '<circle class="pd-pulse" cx="200" cy="108" r="3.5" />' +
        '</g>' +
        '<g class="pd-plus"><line x1="190" y1="14" x2="202" y2="14" /><line x1="196" y1="8" x2="196" y2="20" /></g>' +
        '<g class="pd-plus"><line x1="10" y1="150" x2="22" y2="150" /><line x1="16" y1="144" x2="16" y2="156" /></g>' +
        '<text class="pd-caption" x="20" y="270">IDEAS</text>' +
        '<text class="pd-caption" x="20" y="282">INSIGHTS</text>' +
        '<text class="pd-caption" x="20" y="294">OPPORTUNITIES</text>' +
      '</svg>';
    return wrap;
  }

  function buildProductArchitecture() {
    var wrap = document.createElement("div");
    wrap.className = "product-diagram product-diagram--architecture";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML =
      '<svg viewBox="0 0 400 300">' +
        '<text class="pd-caption pd-caption--top" x="60" y="16">ONE BRAND</text>' +
        '<text class="pd-caption pd-caption--top" x="60" y="28">MANY POSSIBILITIES</text>' +
        '<g class="pd-tier" style="animation-delay:0ms"><rect x="60" y="40" width="200" height="55" rx="3" /><text x="80" y="71">PREMIUM</text></g>' +
        '<g class="pd-tier pd-tier--core" style="animation-delay:100ms"><rect x="60" y="122" width="200" height="65" rx="3" /><text x="80" y="158">CORE</text></g>' +
        '<g class="pd-tier" style="animation-delay:200ms"><rect x="60" y="214" width="200" height="55" rx="3" /><text x="80" y="245">ENTRY</text></g>' +
        '<g class="pd-connector" style="animation-delay:60ms"><line x1="110" y1="95" x2="110" y2="122" /><line x1="210" y1="95" x2="210" y2="122" /></g>' +
        '<g class="pd-connector" style="animation-delay:160ms"><line x1="110" y1="187" x2="110" y2="214" /><line x1="210" y1="187" x2="210" y2="214" /></g>' +
        '<g class="pd-ladder" style="animation-delay:260ms">' +
          '<line x1="260" y1="67" x2="330" y2="67" />' +
          '<line x1="260" y1="154" x2="330" y2="154" />' +
          '<line x1="260" y1="241" x2="330" y2="241" />' +
          '<line class="pd-ladder__spine" x1="330" y1="67" x2="330" y2="241" />' +
          '<circle class="pd-ladder__dot" cx="330" cy="67" r="4" />' +
          '<circle class="pd-ladder__dot pd-pulse-dot" cx="330" cy="154" r="4" />' +
          '<circle class="pd-ladder__dot" cx="330" cy="241" r="4" />' +
          '<text class="pd-ladder__label" x="340" y="70">EXPAND</text>' +
          '<text class="pd-ladder__label" x="340" y="157">GROW</text>' +
          '<text class="pd-ladder__label" x="340" y="244">ATTRACT</text>' +
        '</g>' +
        '<text class="pd-caption" x="20" y="270">STRATEGY</text>' +
        '<text class="pd-caption" x="20" y="282">STRUCTURE</text>' +
        '<text class="pd-caption" x="20" y="294">SCALABILITY</text>' +
      '</svg>';
    return wrap;
  }

  function buildProductJourney() {
    var wrap = document.createElement("div");
    wrap.className = "product-diagram product-diagram--journey";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML =
      '<svg viewBox="0 0 400 300">' +
        '<defs><linearGradient id="pdGlassGrad" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="#3a3d55" /><stop offset="1" stop-color="#15151d" />' +
        '</linearGradient></defs>' +
        '<g class="pd-path"><polyline points="15,150 70,95 130,190 190,115 250,190 330,110" /></g>' +
        '<circle class="pd-node" cx="15" cy="150" r="3.5" style="animation-delay:40ms" />' +
        '<circle class="pd-node" cx="70" cy="95" r="4" style="animation-delay:100ms" />' +
        '<circle class="pd-node" cx="130" cy="190" r="4" style="animation-delay:160ms" />' +
        '<circle class="pd-node" cx="190" cy="115" r="4" style="animation-delay:220ms" />' +
        '<circle class="pd-node" cx="250" cy="190" r="4" style="animation-delay:280ms" />' +
        '<circle class="pd-node pd-node--result" cx="330" cy="110" r="6" style="animation-delay:340ms" />' +
        '<text class="pd-journey__label" x="70" y="82">DISCOVER</text>' +
        '<text class="pd-journey__label" x="130" y="207">EXPLORE</text>' +
        '<text class="pd-journey__label" x="190" y="102">PURCHASE</text>' +
        '<text class="pd-journey__label" x="250" y="207">EXPERIENCE</text>' +
        '<text class="pd-journey__label pd-journey__label--result" x="330" y="97">RESULT</text>' +
        '<g class="pd-glass"><rect x="150" y="130" width="60" height="80" rx="2" /><rect x="175" y="122" width="60" height="80" rx="2" /></g>' +
        '<text class="pd-glass__label" x="205" y="230">MORE THAN</text>' +
        '<text class="pd-glass__label" x="205" y="242">A PRODUCT</text>' +
        '<text class="pd-caption pd-caption--right" x="345" y="20">PEOPLE</text>' +
        '<text class="pd-caption pd-caption--right" x="345" y="32">JOURNEY</text>' +
        '<text class="pd-caption pd-caption--right" x="345" y="44">EMOTIONS</text>' +
        '<text class="pd-caption pd-caption--right" x="345" y="56">RESULTS</text>' +
        '<text class="pd-caption" x="20" y="270">COMMUNICATION</text>' +
        '<text class="pd-caption" x="20" y="282">TOUCHPOINTS</text>' +
        '<text class="pd-caption" x="20" y="294">ENGAGEMENT</text>' +
      '</svg>';
    return wrap;
  }

  // Purple "Result" button, bottom-right inside the window (replaces
  // the case tag on these three diagrams, since there's no client
  // project behind them) — a plain <button> so hover AND keyboard/touch
  // focus both reveal the outcome panel, per spec's "hover/active".
  function buildResultButton(step) {
    var wrap = document.createElement("div");
    wrap.className = "brands-result";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "brands-result__btn";
    btn.textContent = "RESULT";
    var panel = document.createElement("p");
    panel.className = "brands-result__panel";
    panel.dataset.stepId = step.id;
    panel.textContent = metaText(step.result, window.MK.i18n.getLang());
    wrap.appendChild(btn);
    wrap.appendChild(panel);
    return wrap;
  }

  // ---- Market Development — 4 animated typographic cards (Digital /
  // Flagman-Physical Space / PR & Event / Hero Film). Same underlying
  // scan mechanic as Brand Audit's audit-cycle (two synced tracks, one
  // clipped to a center line so whichever word crosses it reads as
  // active), but words are sized dynamically per card — height first
  // (line height = window height / word count, so the whole list
  // stacks with no gap and every word stays on screen at once), then
  // width (shrunk only if the longest word would otherwise clip) — to
  // fill the window edge-to-edge the way the client's own reference
  // ("Audit_Gyph 1.mov") does, rather than the site's small fixed
  // audit-cycle scale. Dim/active told apart by weight + brightness,
  // not opacity, so every word stays legible throughout the loop.
  var marketFitCtx = null;
  function sizeMarketCycle(cycleEl, words) {
    if (!cycleEl.isConnected) return;
    if (!marketFitCtx) marketFitCtx = document.createElement("canvas").getContext("2d");
    var boxH = cycleEl.clientHeight;
    var boxW = cycleEl.clientWidth * 0.94; // minus the right-edge tick gutter
    if (!boxH || !boxW) return;
    var lineH = boxH / words.length;
    var fontSize = lineH * 0.62;

    marketFitCtx.font = "800 " + fontSize + "px " + getComputedStyle(cycleEl).fontFamily;
    var widest = 0;
    words.forEach(function (w) {
      var wpx = marketFitCtx.measureText(w).width;
      if (wpx > widest) widest = wpx;
    });
    var availableForText = boxW - fontSize * 0.5;
    if (widest > availableForText && widest > 0) {
      var scale = availableForText / widest;
      fontSize *= scale;
      lineH *= scale;
    }
    cycleEl.style.setProperty("--market-line-h", lineH + "px");
    cycleEl.style.setProperty("--market-word-size", fontSize + "px");
  }

  function buildMarketCycle(words) {
    var wrap = document.createElement("div");
    wrap.className = "market-cycle";
    wrap.setAttribute("aria-hidden", "true");
    var doubled = words.concat(words);
    var durationS = words.length * 2.2; // same unhurried pace as audit-cycle

    function track(mod) {
      var t = document.createElement("div");
      t.className = "market-cycle__track market-cycle__track--" + mod;
      t.style.animationDuration = durationS + "s";
      t.style.marginTop = "calc(var(--market-line-h) * -" + (words.length / 2) + ")";
      doubled.forEach(function (w) {
        var line = document.createElement("span");
        line.className = "market-cycle__word";
        line.textContent = w;
        t.appendChild(line);
      });
      return t;
    }

    var mask = document.createElement("div");
    mask.className = "market-cycle__mask";
    mask.appendChild(track("dim"));
    wrap.appendChild(mask);

    var hi = document.createElement("div");
    hi.className = "market-cycle__highlight";
    hi.appendChild(track("active"));
    wrap.appendChild(hi);

    var dots = document.createElement("span");
    dots.className = "market-cycle__dots";
    for (var i = 0; i < 3; i++) dots.appendChild(document.createElement("i"));
    wrap.appendChild(dots);

    return wrap;
  }

  // Black / purple / lime ambient background, one canvas per card —
  // same wobbling-blob technique as js/gradient-motion.js, but a
  // distinct, more vivid dark palette for this dark UI context rather
  // than forking that shared module's own restrained purple/grey read.
  var MARKET_PURPLE = "#7a81ff";
  var MARKET_PURPLE_DIM = "#544bb0";
  var MARKET_LIME = "#c9f24b";
  var MARKET_BLACK = "#0b0b0c";
  var MARKET_BLUR = 40;

  function initMarketGlow(canvas, seedOffset) {
    var ctx = canvas.getContext("2d");
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, PAD;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      W = rect.width; H = rect.height;
      if (!W || !H) return;
      PAD = Math.round(MARKET_BLUR * 1.5);
      var gw = W + PAD * 2, gh = H + PAD * 2;
      canvas.style.left = (-PAD) + "px";
      canvas.style.top = (-PAD) + "px";
      canvas.style.width = gw + "px";
      canvas.style.height = gh + "px";
      canvas.style.filter = "blur(" + MARKET_BLUR + "px)";
      canvas.width = gw * DPR;
      canvas.height = gh * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    window.addEventListener("resize", resize);
    resize();

    function blobPath(cx, cy, baseR, t, seed) {
      ctx.beginPath();
      var steps = 40;
      for (var i = 0; i <= steps; i++) {
        var a = (i / steps) * Math.PI * 2;
        var wob = 1
          + 0.14 * Math.sin(a * 3 + t * 0.0003 + seed)
          + 0.08 * Math.sin(a * 5 - t * 0.00045 + seed * 1.6);
        var r = baseR * wob;
        var x = cx + Math.cos(a) * r;
        var y = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }
    function drift(t, speed, ax, ay, phase) {
      return { x: Math.sin(t * speed + phase) * ax, y: Math.cos(t * speed * 0.8 + phase * 1.3) * ay };
    }

    function frame(t) {
      if (!W || !H) { requestAnimationFrame(frame); return; }
      t += seedOffset;
      var gw = W + PAD * 2, gh = H + PAD * 2;
      var ox = PAD, oy = PAD;

      ctx.fillStyle = MARKET_BLACK;
      ctx.fillRect(0, 0, gw, gh);

      var d1 = drift(t, 0.00011, W * 0.08, H * 0.07, 0.0);
      ctx.globalAlpha = 0.72;
      ctx.fillStyle = MARKET_PURPLE_DIM;
      blobPath(ox + W * 0.32 + d1.x, oy + H * 0.56 + d1.y, W * 0.44, t, 1.1);
      ctx.fill();

      var d2 = drift(t, 0.00009, W * 0.07, H * 0.06, 2.4);
      ctx.globalAlpha = 0.78;
      ctx.fillStyle = MARKET_PURPLE;
      blobPath(ox + W * 0.82 + d2.x, oy + H * 0.86 + d2.y, W * 0.36, t, 3.3);
      ctx.fill();

      var d3 = drift(t, 0.00014, W * 0.06, H * 0.05, 4.8);
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = MARKET_LIME;
      blobPath(ox + W * 0.16 + d3.x, oy + H * 0.96 + d3.y, W * 0.26, t, 6.2);
      ctx.fill();

      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
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
    } else if (step.visual === "strategy-roadmap") {
      win.classList.add("brands-media__window--strategy-roadmap");
      win.appendChild(buildStrategyRoadmap());
    } else if (step.visual === "image" && step.image) {
      win.classList.add("brands-media__window--image");
      var img = document.createElement("img");
      img.src = assetUrl(step.image);
      img.alt = step.label || "";
      img.loading = "lazy";
      win.appendChild(img);
      if (step.caseTag) {
        var tag = document.createElement("span");
        tag.className = "brands-media__tag";
        tag.textContent = step.caseTag;
        win.appendChild(tag);
      }
    } else if (step.visual === "product-building") {
      win.classList.add("brands-media__window--product");
      win.appendChild(buildProductBuilding());
    } else if (step.visual === "product-architecture") {
      win.classList.add("brands-media__window--product");
      win.appendChild(buildProductArchitecture());
    } else if (step.visual === "product-journey") {
      win.classList.add("brands-media__window--product");
      win.appendChild(buildProductJourney());
    } else if (step.visual === "market-cycle" && step.words) {
      win.classList.add("brands-media__window--market");
      var glowBg = document.createElement("canvas");
      glowBg.className = "market-cycle__bg";
      win.appendChild(glowBg);
      var marketCycle = buildMarketCycle(step.words);
      win.appendChild(marketCycle);
      win.appendChild(buildProgressMeter("stepped"));
      (function (cycleEl, words) {
        function resize() { sizeMarketCycle(cycleEl, words); }
        requestAnimationFrame(function () { requestAnimationFrame(resize); });
        window.addEventListener("resize", resize);
      })(marketCycle, step.words);
      initMarketGlow(glowBg, Math.random() * 6000);
    } else {
      var placeholder = document.createElement("span");
      placeholder.className = "brands-media__plus";
      placeholder.textContent = "+";
      win.appendChild(placeholder);
    }
    if (step.result) win.appendChild(buildResultButton(step));
    cell.appendChild(win);

    if (step.caption) {
      var caption = document.createElement("p");
      caption.className = "brands-media__caption";
      caption.dataset.stepId = step.id;
      caption.textContent = metaText(step.caption, window.MK.i18n.getLang());
      cell.appendChild(caption);
    }

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
    meta.appendChild(buildMetaRow("goal", stage));
    meta.appendChild(buildMetaRow("scope", stage));
    meta.appendChild(buildMetaRow("result", stage));
    meta.appendChild(buildMetaRow("team", stage));
    meta.appendChild(buildMetaRow("outsource", stage));
    meta.appendChild(buildMetaRow("timing", stage));
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
    quote.textContent = metaText(stage.meta.goal, window.MK.i18n.getLang());
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

  // Stage meta text (goal/scope/result/team/timing) is the one part of
  // this page that actually changes with the language switch — method
  // nav, workflow labels and both CTAs stay English by design, so they
  // need no listener here. Updates text in place rather than re-running
  // renderStages(), so open workflow panels and the GIF animations
  // already running inside them are left untouched.
  document.addEventListener("mk:langchange", applyBrandsLang);

  document.addEventListener("DOMContentLoaded", function () {
    renderMethodNav();
    renderStages();
    observeReveals();
    observeActiveStage();
    observeStickyMethod();
    initHeroGradient();
  });
})();
