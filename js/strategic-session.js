/**
 * STRATEGIC SESSION — /strategic-session/
 * UX-skeleton pass: hero + how-it-works + results + approach + an
 * interactive Strategic Brief (you -> context -> request -> review ->
 * thanks). No backend yet — Send just moves to the thank-you screen
 * locally; nothing is transmitted or stored (see spec).
 */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Renders **bold** the same way js/i18n.js's renderInline does, for
  // the one line (Brief intro) that needs it here. ----
  function renderInline(str) {
    return String(str || "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  // ======================================================================
  // Scroll reveal (same recipe as js/films.js) — re-run after any dynamic
  // section rebuilds itself (language switch), so freshly created nodes
  // get observed too.
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
  // Typewriter — reused by the Results columns and the Approach text.
  // Runs once when the element scrolls into view; respects
  // prefers-reduced-motion by just setting the full text instantly.
  // ======================================================================
  function typeInOnView(el, text) {
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
          runTypewriter(el, text);
        }
      });
    }, { threshold: 0.4 });
    observer.observe(el);
  }

  function runTypewriter(el, text) {
    var cursor = document.createElement("span");
    cursor.className = "ss-typing-cursor";
    cursor.textContent = "|";
    var i = 0;
    var speed = Math.max(8, Math.min(22, Math.round(900 / text.length)));
    (function step() {
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
    var body = document.getElementById("ssBody");
    body.innerHTML = "";
    data.body.forEach(function (para) {
      var p = document.createElement("p");
      p.textContent = para;
      body.appendChild(p);
    });
    document.getElementById("ssCtaLabel").textContent = data.cta;
  }

  // ======================================================================
  // 02 — HOW IT WORKS
  // ======================================================================
  function renderHowItWorks(data) {
    document.getElementById("ssHowLabel").textContent = data.howItWorks.label;
    var wrap = document.getElementById("ssHowStages");
    wrap.innerHTML = "";
    data.howItWorks.stages.forEach(function (stage) {
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
      if (stage.duration) {
        var duration = document.createElement("span");
        duration.className = "ss-stage__duration";
        duration.textContent = stage.duration;
        head.appendChild(duration);
      }
      card.appendChild(head);

      var text = document.createElement("p");
      text.className = "ss-stage__text";
      text.textContent = stage.text;
      card.appendChild(text);

      wrap.appendChild(card);
    });
  }

  // ======================================================================
  // 03 — RESULTS (typing reveal per column)
  // ======================================================================
  function renderResults(data) {
    document.getElementById("ssResultsLabel").textContent = data.results.label;
    document.getElementById("ssResultsTitle").textContent = data.results.title;
    var wrap = document.getElementById("ssResultsColumns");
    wrap.innerHTML = "";
    data.results.columns.forEach(function (col) {
      var item = document.createElement("div");
      item.className = "ss-result reveal-up";
      var title = document.createElement("p");
      title.className = "ss-result__title";
      title.textContent = col.title;
      var text = document.createElement("p");
      text.className = "ss-result__text";
      item.appendChild(title);
      item.appendChild(text);
      wrap.appendChild(item);
      typeInOnView(text, col.text);
    });
  }

  // ======================================================================
  // 04 — APPROACH (temporary accent block, typing text alongside the
  // future video)
  // ======================================================================
  function renderApproach(data) {
    document.getElementById("ssApproachTitle").textContent = data.approach.title;
    document.getElementById("ssApproachTransition").textContent = data.approach.transition + " ↓";
    var textEl = document.getElementById("ssApproachText");
    typeInOnView(textEl, data.approach.text);
  }

  // ======================================================================
  // 05 — STRATEGIC BRIEF (interactive, stateful — no backend yet)
  // ======================================================================
  var briefState = {
    step: "you", // you | context | request | review | thanks
    mode: "type", // type | speak (step "request" only)
    recording: false,
    recordSeconds: 0,
    recordTimer: null,
    data: { name: "", email: "", company: "", role: "", website: "", instagram: "", linkedin: "", otherLinks: "", context: "", request: "" }
  };

  var STEP_ORDER = ["you", "context", "request"];

  function briefLang() {
    return window.SITE_CONTENT.strategicSession[window.MK.i18n.getLang()].brief;
  }

  // Copies whatever the visible step's fields currently hold into
  // briefState.data before that step's DOM gets torn down — otherwise an
  // EN/RU switch mid-step (before Next/Back is clicked) would discard
  // anything already typed.
  var FIELD_MAP = {
    ssName: "name", ssEmail: "email", ssCompany: "company", ssRole: "role",
    ssWebsite: "website", ssInstagram: "instagram", ssLinkedin: "linkedin", ssOtherLinks: "otherLinks",
    ssContext: "context", ssRequest: "request"
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
    var currentIndex = STEP_ORDER.indexOf(briefState.step);
    // Review/thanks keep the last (request) step marked done, not current.
    if (currentIndex === -1) currentIndex = STEP_ORDER.length;

    STEP_ORDER.forEach(function (key, i) {
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
      var label = document.createElement("span");
      label.textContent = brief.steps[i];

      step.appendChild(num);
      step.appendChild(label);
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

    var actions = document.createElement("div");
    actions.className = "ss-brief__actions ss-brief__actions--end";
    var next = document.createElement("a");
    next.className = "btn btn--dark";
    next.href = "javascript:void(0)";
    next.textContent = s.next;
    next.addEventListener("click", function () {
      briefState.data.name = document.getElementById("ssName").value;
      briefState.data.email = document.getElementById("ssEmail").value;
      briefState.data.company = document.getElementById("ssCompany").value;
      briefState.data.role = document.getElementById("ssRole").value;
      goToStep("context");
    });
    actions.appendChild(next);
    panel.appendChild(actions);
  }

  function renderStepContext(panel, s) {
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

    panel.appendChild(buildField({ id: "ssContext", type: "textarea", rows: 4, label: s.contextQuestion, placeholder: s.contextPlaceholder, value: briefState.data.context }));

    var actions = document.createElement("div");
    actions.className = "ss-brief__actions";
    var back = document.createElement("a");
    back.className = "btn btn--outline";
    back.href = "javascript:void(0)";
    back.textContent = s.back;
    back.addEventListener("click", function () { collectContext(); goToStep("you"); });
    var next = document.createElement("a");
    next.className = "btn btn--dark";
    next.href = "javascript:void(0)";
    next.textContent = s.next;
    next.addEventListener("click", function () { collectContext(); goToStep("request"); });
    actions.appendChild(back);
    actions.appendChild(next);
    panel.appendChild(actions);

    function collectContext() {
      briefState.data.website = document.getElementById("ssWebsite").value;
      briefState.data.instagram = document.getElementById("ssInstagram").value;
      briefState.data.linkedin = document.getElementById("ssLinkedin").value;
      briefState.data.otherLinks = document.getElementById("ssOtherLinks").value;
      briefState.data.context = document.getElementById("ssContext").value;
    }
  }

  function renderStepRequest(panel, s) {
    var heading = document.createElement("h3");
    heading.className = "ss-brief__step-heading";
    heading.textContent = s.heading;
    panel.appendChild(heading);

    var hint = document.createElement("p");
    hint.className = "ss-brief__step-hint";
    hint.textContent = s.hint;
    panel.appendChild(hint);

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
      collectRequest();
      briefState.mode = "type";
      clearRecordTimer();
      briefState.recording = false;
      renderBrief();
    });
    speakTab.addEventListener("click", function () {
      collectRequest();
      briefState.mode = "speak";
      renderBrief();
    });
    tabs.appendChild(typeTab);
    tabs.appendChild(speakTab);
    panel.appendChild(tabs);

    if (briefState.mode === "speak") {
      panel.appendChild(buildVoiceMock(s));
    } else {
      panel.appendChild(buildField({ id: "ssRequest", type: "textarea", rows: 5, label: s.label, placeholder: s.placeholder, value: briefState.data.request }));
    }

    var actions = document.createElement("div");
    actions.className = "ss-brief__actions";
    var back = document.createElement("a");
    back.className = "btn btn--outline";
    back.href = "javascript:void(0)";
    back.textContent = s.back;
    back.addEventListener("click", function () { collectRequest(); goToStep("context"); });
    var next = document.createElement("a");
    next.className = "btn btn--dark";
    next.href = "javascript:void(0)";
    next.textContent = s.next;
    next.addEventListener("click", function () { collectRequest(); goToStep("review"); });
    actions.appendChild(back);
    actions.appendChild(next);
    panel.appendChild(actions);

    function collectRequest() {
      var field = document.getElementById("ssRequest");
      if (field) briefState.data.request = field.value;
    }
  }

  // Visual-only mic mock: no microphone access, no real transcription —
  // just the recording state + a placeholder "transcript" the user can
  // edit, per spec (backend/transcription connect later).
  function buildVoiceMock(s) {
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
        briefState.data.request = s.transcribedPlaceholder;
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
    var s = totalSeconds % 60;
    return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
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

    var actions = document.createElement("div");
    actions.className = "ss-brief__actions";
    var edit = document.createElement("a");
    edit.className = "btn btn--outline";
    edit.href = "javascript:void(0)";
    edit.textContent = r.edit;
    edit.addEventListener("click", function () { goToStep("you"); });
    var send = document.createElement("a");
    send.className = "btn btn--dark";
    send.href = "javascript:void(0)";
    send.textContent = r.send;
    send.addEventListener("click", function () { goToStep("thanks"); });
    actions.appendChild(edit);
    actions.appendChild(send);
    panel.appendChild(actions);
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

    if (briefState.step === "you") renderStepYou(panel, brief.step1);
    else if (briefState.step === "context") renderStepContext(panel, brief.step2);
    else if (briefState.step === "request") renderStepRequest(panel, brief.step3);
    else if (briefState.step === "review") renderStepReview(panel, brief);
    else if (briefState.step === "thanks") renderStepThanks(panel, brief);
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
