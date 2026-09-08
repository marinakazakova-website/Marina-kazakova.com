/**
 * EXPERIENCE section: typographic direction nav (Retail/Business/Brands/
 * Films). Each word links straight to that direction's own page — no
 * inline preview panel here, since the content it used to show (photo,
 * tagline, body, links, client logos) already lives on those pages.
 */
(function () {
  "use strict";

  var directions = window.SITE_CONTENT.experienceDirections;

  // Only directions with a built page get a real link. Brands has none
  // yet, so it renders as a plain (non-clickable) label rather than a
  // dead link.
  var PAGE_HREF = {
    retail: "retail/index.html",
    business: "business/index.html",
    films: "films/index.html"
  };

  function renderStaticIntroBits() {
    document.getElementById("experienceFormula").textContent = window.SITE_CONTENT.experienceIntro.formula;
  }

  function renderTypoNav() {
    var navEl = document.getElementById("experienceTypoNav");
    navEl.innerHTML = "";
    directions.forEach(function (d) {
      var href = PAGE_HREF[d.id];
      var el = document.createElement(href ? "a" : "span");
      el.className = "experience-typo-nav__item";
      el.textContent = d.navLabel;
      if (href) {
        el.href = href;
      } else {
        el.setAttribute("aria-disabled", "true");
      }
      navEl.appendChild(el);
    });
  }

  function init() {
    renderStaticIntroBits();
    renderTypoNav();
  }

  window.MK = window.MK || {};
  window.MK.experience = { init: init };
})();
