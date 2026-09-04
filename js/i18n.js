/**
 * Minimal i18n layer. Default language: English.
 * Switching language only swaps text — structure, images, layout and
 * animations never change (per spec).
 */
(function () {
  "use strict";

  var state = { lang: "en" };

  function renderInline(str) {
    if (!str) return "";
    return String(str).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  /** Resolve a "a.b.c" path against SITE_CONTENT, trying the lang-keyed
   *  sub-object first, then falling back to a language-independent value. */
  function t(path) {
    var parts = path.split(".");
    var obj = window.SITE_CONTENT;
    for (var i = 0; i < parts.length - 1; i++) {
      if (!obj) return "";
      obj = obj[parts[i]];
    }
    if (!obj) return "";
    var last = parts[parts.length - 1];
    if (obj[state.lang] && obj[state.lang][last] !== undefined) {
      return obj[state.lang][last];
    }
    return obj[last] !== undefined ? obj[last] : "";
  }

  function tNav(key) {
    return window.SITE_CONTENT.nav[state.lang][key];
  }

  function applyStatic() {
    document.documentElement.setAttribute("lang", state.lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });

    document.querySelectorAll("[data-i18n-nav]").forEach(function (el) {
      el.textContent = tNav(el.getAttribute("data-i18n-nav"));
    });

    document.querySelectorAll(".lang-switch__btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === state.lang);
    });
  }

  function setLang(lang) {
    if (lang !== "en" && lang !== "ru") return;
    if (lang === state.lang) return;
    state.lang = lang;
    applyStatic();
    document.dispatchEvent(new CustomEvent("mk:langchange", { detail: { lang: lang } }));
  }

  function init() {
    document.querySelectorAll(".lang-switch__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-lang"));
      });
    });
    applyStatic();
  }

  window.MK = window.MK || {};
  window.MK.i18n = {
    init: init,
    setLang: setLang,
    t: t,
    renderInline: renderInline,
    getLang: function () { return state.lang; }
  };
})();
