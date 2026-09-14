/**
 * STRATEGIC SESSION — /strategic-session/
 * Storyboard pass v2: hero + how-it-works (icons, equal-height cards,
 * connectors) + results (accordion reveal) + approach (video UI mock,
 * result plaque) + Strategic Brief (You -> Context links -> Context
 * question -> Request -> Review -> Thanks, each key question its own
 * screen with a Type/Speak toggle). No backend yet — Send just moves to
 * the thank-you screen locally; nothing is transmitted or stored.
 */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function renderInline(str) {
    return String(str || "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  // ======================================================================
  // Scroll reveal (same recipe as js/films.js)
  // ======================================================================
  function observeReveals(root) {
    var targets = (root || document).querySelectorAll(".reveal-up");
    if (!targets.length) return;
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
    }, { threshold: 0.25 });
    targets.forEach(function (el) { observer.observe(el); });
  }

  // ======================================================================
  // Typewriter — reused by the Approach text. Each element tracks its own
  // "run token" so a stale in-flight animation (e.g. still typing the EN
  // text when the user switches to RU) can never keep overwriting it —
  // this was the cause of the approach block showing English under RU.
  // ======================================================================
  var typingRunId = 0;
  function typeInOnView(el, text) {
    var myRun = ++typingRunId;
    el.dataset.typeRun = String(myRun);
    el.textContent = "";
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      el.textContent = text;
      return;
    }
    var started = false;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !started) {
          started = true;
          observer.unobserve(entry.target);
          runTypewriter(el, text, myRun);
        }
      });
    }, { threshold: 0.4 });
    observer.observe(el);
  }

  function runTypewriter(el, text, myRun) {
    var cursor = document.createElement("span");
    cursor.className = "ss-typing-cursor";
    cursor.textContent = "|";
    var i = 0;
    var speed = Math.max(8, Math.min(22, Math.round(900 / text.length)));
    (function step() {
      if (el.dataset.typeRun !== String(myRun)) return; // superseded — stop
      el.textContent = text.slice(0, i);
      el.appendChild(cursor);
      i++;
      if (i <= text.length) {
        setTimeout(step, speed);
      } else {
        cursor.remove();
      }
    })();
  }

  // ======================================================================
  // 01 — HERO
  // ======================================================================
  function renderHero(data) {
    document.getElementById("ssTitle").textContent = data.title;
    document.getElementById("ssBody").textContent = data.body;
    document.getElementById("ssCtaLabel").textContent = data.cta;
  }

  // ======================================================================
  // 02 — HOW IT WORKS
  // ======================================================================
  var STAGE_ICONS = {
    web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>',
    docs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 2.5h8l4 4V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z"/><path d="M14 2.5V7h4M8 12h8M8 16h8M8 8h3"/></svg>',
    ai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/></svg>',
    materials: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="2.5" y="6" width="13" height="12" rx="2.2"/><path d="M15.5 10.2l6-3.2v10l-6-3.2z"/></svg>',
    timer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9.5 2.5h5"/></svg>',
    pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 2.5h8l4 4V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z"/><path d="M14 2.5V7h4"/><path d="M7.5 13.5h1.2a1.3 1.3 0 1 1 0 2.6H7.5zM11.5 13.5h1a1.5 1.5 0 0 1 0 3h-1zM16.5 13.5v3M16.5 15h1.3"/></svg>',
    result: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 12.5l4.5 4.5L20 6"/></svg>'
  };

  function buildStageIcon(id) {
    var span = document.createElement("span");
    span.className = "ss-stage__icon";
    span.innerHTML = STAGE_ICONS[id] || "";
    return span;
  }

  function buildConnector(vertical) {
    var wrap = document.createElement("div");
    wrap.className = "ss-how__connector" + (vertical ? " ss-how__connector--vertical" : "");
    wrap.setAttribute("aria-hidden", "true");
    var dot1 = document.createElement("span");
    dot1.className = "ss-how__connector-dot";
    var line = document.createElement("span");
    line.className = "ss-how__connector-line";
    var dot2 = document.createElement("span");
    dot2.className = "ss-how__connector-dot";
    wrap.appendChild(dot1);
    wrap.appendChild(line);
    wrap.appendChild(dot2);
    return wrap;
  }

  function renderHowItWorks(data) {
    document.getElementById("ssHowLabel").textContent = data.howItWorks.label;
    var wrap = document.getElementById("ssHowStages");
    wrap.innerHTML = "";
    data.howItWorks.stages.forEach(function (stage, i) {
      if (i > 0) {
        wrap.appendChild(buildConnector(false));
        wrap.appendChild(buildConnector(true));
      }

      var card = document.createElement("div");
      card.className = "ss-stage reveal-up";

      var head = document.createElement("div");
      head.className = "ss-stage__head";
      var index = document.createElement("span");
      index.className = "ss-stage__index";
      index.textContent = stage.index;
      var title = document.createElement("span");
      title.className = "ss-stage__title";
      title.textContent = stage.title;
      head.appendChild(index);
      head.appendChild(title);
      card.appendChild(head);

      if (stage.duration) {
        var duration = document.createElement("span");
        duration.className = "ss-stage__duration";
        duration.textContent = stage.duration;
        card.appendChild(duration);
      }

      var text = document.createElement("p");
      text.className = "ss-stage__text";
      text.textContent = stage.text;
      card.appendChild(text);

      if (stage.icons && stage.icons.length) {
        var iconRow = document.createElement("div");
        iconRow.className = "ss-stage__icons";
        stage.icons.forEach(function (id) { iconRow.appendChild(buildStageIcon(id)); });
        card.appendChild(iconRow);
      }

      wrap.appendChild(card);
    });
  }

  // ======================================================================
  // 03 — RESULTS (big accent titles, click-to-expand text — same
  // hover-or-open pattern as the Ways to Work Together request pills)
  // ======================================================================
  function renderResults(data) {
    document.getElementById("ssResultsLabel").textContent = data.results.label;
    document.getElementById("ssResultsTitle").textContent = data.results.title;
    var wrap = document.getElementById("ssResultsColumns");
    wrap.innerHTML = "";
    data.results.columns.forEach(function (col) {
      var item = document.createElement("div");
      item.className = "ss-result reveal-up";

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ss-result__title";
      btn.textContent = col.title;
      btn.setAttribute("aria-expanded", "false");

      var panelWrap = document.createElement("div");
      panelWrap.className = "ss-result__panel-wrap";
      var panel = document.createElement("p");
      panel.className = "ss-result__panel";
      panel.textContent = col.text;
      panelWrap.appendChild(panel);

      btn.addEventListener("click", function () {
        var isOpen = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(isOpen));
      });

      item.appendChild(btn);
      item.appendChild(panelWrap);
      wrap.appendChild(item);
    });
  }

  // ======================================================================
  // 04 — APPROACH (temporary accent block: video mock with player-UI
  // chrome, a result plaque next to it, typed text alongside)
  // ======================================================================
  function renderApproach(data) {
    document.getElementById("ssApproachTitle").textContent = data.approach.title;
    document.getElementById("ssApproachResultLabel").textContent = data.approach.resultPlaceholder;
    document.getElementById("ssApproachTransitionLabel").textContent = data.approach.transition;
    var textEl = document.getElementById("ssApproachText");
    typeInOnView(textEl, data.approach.text);
  }

  // ======================================================================
  // 05 — STRATEGIC BRIEF (interactive, stateful — no backend yet)
  // Internal flow: you -> context-links -> context-question -> request ->
  // review -> thanks. The 3-node progress bar (YOU/CONTEXT/REQUEST) maps
  // both context sub-steps onto its single "CONTEXT" node.
  // ======================================================================
  var briefState = {
    step: "you",
    mode: "type", // type | speak — applies to whichever question step is active
    recording: false,
    recordSeconds: 0,
    recordTimer: null,
    data: { name: "", email: "", company: "", role: "", website: "", instagram: "", linkedin: "", otherLinks: "", context: "", request: "" }
  };

  var PROGRESS_MAP = { you: 0, "context-links": 1, "context-question": 1, request: 2 };

  function briefLang() {
    return window.SITE_CONTENT.strategicSession[window.MK.i18n.getLang()].brief;
  }

  var FIELD_MAP = {
    ssName: "name", ssEmail: "email", ssCompany: "company", ssRole: "role",
    ssWebsite: "website", ssInstagram: "instagram", ssLinkedin: "linkedin", ssOtherLinks: "otherLinks",
    ssContextAnswer: "context", ssRequest: "request"
  };
  function collectVisibleFields() {
    Object.keys(FIELD_MAP).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) briefState.data[FIELD_MAP[id]] = el.value;
    });
  }

  function renderBriefIntro(brief) {
    document.getElementById("ssBriefTitle").textContent = brief.title;
    document.getElementById("ssBriefIntro").innerHTML = renderInline(brief.intro);
  }

  function renderBriefProgress(brief) {
    var wrap = document.getElementById("ssBriefProgress");
    wrap.innerHTML = "";
    var currentIndex = PROGRESS_MAP[briefState.step];
    if (currentIndex === undefined) currentIndex = 3; // review/thanks: all done

    brief.steps.forEach(function (label, i) {
      if (i > 0) {
        var line = document.createElement("div");
        line.className = "ss-brief__step-line";
        wrap.appendChild(line);
      }
      var step = document.createElement("div");
      step.className = "ss-brief__step";
      if (i < currentIndex) step.classList.add("is-done");
      else if (i === currentIndex) step.classList.add("is-current");

      var num = document.createElement("span");
      num.className = "ss-brief__step-num";
      num.textContent = i < currentIndex ? "✓" : String(i + 1);
      var labelEl = document.createElement("span");
      labelEl.textContent = label;

      step.appendChild(num);
      step.appendChild(labelEl);
      wrap.appendChild(step);
    });
  }

  function clearRecordTimer() {
    if (briefState.recordTimer) {
      clearInterval(briefState.recordTimer);
      briefState.recordTimer = null;
    }
  }

  function goToStep(step) {
    briefState.step = step;
    briefState.mode = "type";
    briefState.recording = false;
    clearRecordTimer();
    renderBrief();
    var panel = document.getElementById("ssBriefPanel");
    if (panel) panel.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function buildField(config) {
    var field = document.createElement("div");
    field.className = "ss-field";
    var label = document.createElement("label");
    label.textContent = config.label;
    label.setAttribute("for", config.id);
    field.appendChild(label);

    var input;
    if (config.type === "textarea") {
      input = document.createElement("textarea");
      input.rows = config.rows || 3;
    } else if (config.type === "select") {
      input = document.createElement("select");
      config.options.forEach(function (opt) {
        var o = document.createElement("option");
        o.value = opt;
        o.textContent = opt;
        input.appendChild(o);
      });
    } else {
      input = document.createElement("input");
      input.type = config.type || "text";
    }
    input.id = config.id;
    if (config.placeholder) input.placeholder = config.placeholder;
    if (config.value) input.value = config.value;
    field.appendChild(input);
    return field;
  }

  function buildActions(config) {
    var actions = document.createElement("div");
    actions.className = "ss-brief__actions" + (config.back ? "" : " ss-brief__actions--end");
    if (config.back) {
      var back = document.createElement("a");
      back.className = "btn btn--outline";
      back.href = "javascript:void(0)";
      back.textContent = config.back;
      back.addEventListener("click", config.onBack);
      actions.appendChild(back);
    }
    var next = document.createElement("a");
    next.className = "btn btn--dark";
    next.href = "javascript:void(0)";
    next.textContent = config.next;
    next.addEventListener("click", config.onNext);
    actions.appendChild(next);
    return actions;
  }

  // ---- Step: YOU ----
  function renderStepYou(panel, s) {
    var heading = document.createElement("h3");
    heading.className = "ss-brief__step-heading";
    heading.textContent = s.heading;
    panel.appendChild(heading);

    var row = document.createElement("div");
    row.className = "ss-field-row";
    row.appendChild(buildField({ id: "ssName", type: "text", label: s.name, value: briefState.data.name }));
    row.appendChild(buildField({ id: "ssEmail", type: "email", label: s.email, value: briefState.data.email }));
    panel.appendChild(row);

    panel.appendChild(buildField({ id: "ssCompany", type: "text", label: s.company, value: briefState.data.company }));
    panel.appendChild(buildField({ id: "ssRole", type: "select", label: s.role, options: s.roleOptions, value: briefState.data.role || s.roleOptions[0] }));

    panel.appendChild(buildActions({
      next: s.next,
      onNext: function () {
        briefState.data.name = document.getElementById("ssName").value;
        briefState.data.email = document.getElementById("ssEmail").value;
        briefState.data.company = document.getElementById("ssCompany").value;
        briefState.data.role = document.getElementById("ssRole").value;
        goToStep("context-links");
      }
    }));
  }

  // ---- Step: CONTEXT — LINKS ----
  function renderStepContextLinks(panel, s) {
    var heading = document.createElement("h3");
    heading.className = "ss-brief__step-heading";
    heading.textContent = s.heading;
    panel.appendChild(heading);

    var row = document.createElement("div");
    row.className = "ss-field-row";
    row.appendChild(buildField({ id: "ssWebsite", type: "text", label: s.website, value: briefState.data.website }));
    row.appendChild(buildField({ id: "ssInstagram", type: "text", label: s.instagram, value: briefState.data.instagram }));
    panel.appendChild(row);

    var row2 = document.createElement("div");
    row2.className = "ss-field-row";
    row2.appendChild(buildField({ id: "ssLinkedin", type: "text", label: s.linkedin, value: briefState.data.linkedin }));
    row2.appendChild(buildField({ id: "ssOtherLinks", type: "text", label: s.otherLinks, value: briefState.data.otherLinks }));
    panel.appendChild(row2);

    function collect() {
      briefState.data.website = document.getElementById("ssWebsite").value;
      briefState.data.instagram = document.getElementById("ssInstagram").value;
      briefState.data.linkedin = document.getElementById("ssLinkedin").value;
      briefState.data.otherLinks = document.getElementById("ssOtherLinks").value;
    }

    panel.appendChild(buildActions({
      back: s.back,
      next: s.next,
      onBack: function () { collect(); goToStep("you"); },
      onNext: function () { collect(); goToStep("context-question"); }
    }));
  }

  // ---- Shared: a question step with a Type/Speak toggle (used by both
  // the context question and the main request — same interaction). ----
  function renderQuestionStep(panel, s, opts) {
    var heading = document.createElement("h3");
    heading.className = "ss-brief__step-heading";
    heading.textContent = s.heading;
    panel.appendChild(heading);

    if (s.hint) {
      var hint = document.createElement("p");
      hint.className = "ss-brief__step-hint";
      hint.textContent = s.hint;
      panel.appendChild(hint);
    }

    var tabs = document.createElement("div");
    tabs.className = "ss-mode-tabs";
    var typeTab = document.createElement("button");
    typeTab.type = "button";
    typeTab.className = "ss-mode-tab" + (briefState.mode === "type" ? " is-active" : "");
    typeTab.textContent = s.typeTab;
    var speakTab = document.createElement("button");
    speakTab.type = "button";
    speakTab.className = "ss-mode-tab" + (briefState.mode === "speak" ? " is-active" : "");
    speakTab.textContent = s.speakTab;
    typeTab.addEventListener("click", function () {
      opts.collect();
      briefState.mode = "type";
      clearRecordTimer();
      briefState.recording = false;
      renderBrief();
    });
    speakTab.addEventListener("click", function () {
      opts.collect();
      briefState.mode = "speak";
      renderBrief();
    });
    tabs.appendChild(typeTab);
    tabs.appendChild(speakTab);
    panel.appendChild(tabs);

    if (briefState.mode === "speak") {
      panel.appendChild(buildVoiceMock(s, opts));
    } else {
      panel.appendChild(buildField({ id: opts.fieldId, type: "textarea", rows: 5, label: s.label, placeholder: s.placeholder, value: briefState.data[opts.dataKey] }));
    }

    panel.appendChild(buildActions({
      back: s.back,
      next: s.next,
      onBack: function () { opts.collect(); opts.onBack(); },
      onNext: function () { opts.collect(); opts.onNext(); }
    }));
  }

  // Visual-only mic mock: no microphone access, no real transcription —
  // just the recording state + a placeholder "transcript" the user can
  // edit, per spec (backend/transcription connect later).
  function buildVoiceMock(s, opts) {
    var wrap = document.createElement("div");
    wrap.className = "ss-voice";

    var mic = document.createElement("button");
    mic.type = "button";
    mic.className = "ss-voice__mic" + (briefState.recording ? " is-recording" : "");
    mic.setAttribute("aria-pressed", String(briefState.recording));
    mic.textContent = "🎤";

    var timer = document.createElement("span");
    timer.className = "ss-voice__timer";
    timer.textContent = formatTimer(briefState.recordSeconds);

    var hint = document.createElement("p");
    hint.className = "ss-voice__hint";
    hint.textContent = briefState.recording ? s.recordHint : s.speakTab;

    mic.addEventListener("click", function () {
      if (!briefState.recording) {
        briefState.recording = true;
        briefState.recordSeconds = 0;
        briefState.recordTimer = setInterval(function () {
          briefState.recordSeconds++;
          timer.textContent = formatTimer(briefState.recordSeconds);
        }, 1000);
        mic.classList.add("is-recording");
        hint.textContent = s.recordHint;
      } else {
        clearRecordTimer();
        briefState.recording = false;
        briefState.data[opts.dataKey] = s.transcribedPlaceholder;
        briefState.mode = "type";
        renderBrief();
      }
    });

    wrap.appendChild(mic);
    wrap.appendChild(timer);
    wrap.appendChild(hint);
    return wrap;
  }

  function formatTimer(totalSeconds) {
    var m = Math.floor(totalSeconds / 60);
    var sec = totalSeconds % 60;
    return (m < 10 ? "0" + m : m) + ":" + (sec < 10 ? "0" + sec : sec);
  }

  function renderStepReview(panel, brief) {
    var r = brief.review;
    var heading = document.createElement("h3");
    heading.className = "ss-brief__step-heading";
    heading.textContent = r.heading;
    panel.appendChild(heading);

    var box = document.createElement("div");
    box.className = "ss-review";
    var dl = document.createElement("dl");
    var links = [briefState.data.website, briefState.data.instagram, briefState.data.linkedin, briefState.data.otherLinks].filter(Boolean).join("\n");

    [
      [r.name, briefState.data.name || "—"],
      [r.company, briefState.data.company || "—"],
      [r.links, links || "—"],
      [r.context, briefState.data.context || "—"],
      [r.request, briefState.data.request || "—"]
    ].forEach(function (pair) {
      var dt = document.createElement("dt");
      dt.textContent = pair[0];
      var dd = document.createElement("dd");
      dd.textContent = pair[1];
      dl.appendChild(dt);
      dl.appendChild(dd);
    });
    box.appendChild(dl);
    panel.appendChild(box);

    panel.appendChild(buildActions({
      back: r.edit,
      next: r.send,
      onBack: function () { goToStep("you"); },
      onNext: function () { goToStep("thanks"); }
    }));
  }

  function renderStepThanks(panel, brief) {
    var t = brief.thankYou;
    var wrap = document.createElement("div");
    wrap.className = "ss-thanks";
    var heading = document.createElement("h3");
    heading.className = "ss-thanks__title";
    heading.textContent = t.heading;
    var text = document.createElement("p");
    text.className = "ss-thanks__text";
    text.textContent = t.text;
    wrap.appendChild(heading);
    wrap.appendChild(text);
    panel.appendChild(wrap);
  }

  function renderBrief() {
    var brief = briefLang();
    renderBriefIntro(brief);
    renderBriefProgress(brief);

    var panel = document.getElementById("ssBriefPanel");
    panel.innerHTML = "";
    panel.className = "ss-brief__panel";

    if (briefState.step === "you") {
      renderStepYou(panel, brief.step1);
    } else if (briefState.step === "context-links") {
      renderStepContextLinks(panel, brief.step2Links);
    } else if (briefState.step === "context-question") {
      renderQuestionStep(panel, brief.step2Question, {
        fieldId: "ssContextAnswer",
        dataKey: "context",
        collect: function () {
          var f = document.getElementById("ssContextAnswer");
          if (f) briefState.data.context = f.value;
        },
        onBack: function () { goToStep("context-links"); },
        onNext: function () { goToStep("request"); }
      });
    } else if (briefState.step === "request") {
      renderQuestionStep(panel, brief.step3, {
        fieldId: "ssRequest",
        dataKey: "request",
        collect: function () {
          var f = document.getElementById("ssRequest");
          if (f) briefState.data.request = f.value;
        },
        onBack: function () { goToStep("context-question"); },
        onNext: function () { goToStep("review"); }
      });
    } else if (briefState.step === "review") {
      renderStepReview(panel, brief);
    } else if (briefState.step === "thanks") {
      renderStepThanks(panel, brief);
    }
  }

  // ======================================================================
  // Bootstrap
  // ======================================================================
  function render() {
    collectVisibleFields();
    var data = window.SITE_CONTENT.strategicSession[window.MK.i18n.getLang()];
    renderHero(data);
    renderHowItWorks(data);
    renderResults(data);
    renderApproach(data);
    renderBrief();
    observeReveals(document);
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
