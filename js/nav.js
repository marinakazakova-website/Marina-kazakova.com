/**
 * Sticky navigation: scroll shadow, offset smooth-scroll, mobile toggle,
 * active-section highlighting.
 */
(function () {
  "use strict";

  var nav, toggle, links, sections;

  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  function closeMobile() {
    links.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function initSmoothScroll() {
    nav.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var target = document.querySelector(a.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        var navHeight = nav.offsetHeight;
        var top = target.getBoundingClientRect().top + window.pageYOffset - (navHeight - 1);
        window.scrollTo({ top: top, behavior: "smooth" });
        closeMobile();
      });
    });
  }

  function initActiveHighlight() {
    if (!("IntersectionObserver" in window)) return;
    var linkMap = {};
    links.querySelectorAll("a").forEach(function (a) {
      linkMap[a.getAttribute("href").replace("#", "")] = a;
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = linkMap[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            links.querySelectorAll("a").forEach(function (a) { a.classList.remove("is-active"); });
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(function (s) { observer.observe(s); });
  }

  function reveal() {
    nav.classList.add("is-visible");
  }

  function init() {
    nav = document.getElementById("siteNav");
    toggle = document.getElementById("navToggle");
    links = document.getElementById("navLinks");
    sections = document.querySelectorAll("main > section[id]");

    window.addEventListener("scroll", onScroll, { passive: true });

    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    initSmoothScroll();
    initActiveHighlight();
  }

  window.MK = window.MK || {};
  window.MK.nav = { init: init, reveal: reveal };
})();
