/**
 * FILMS page — FFF cinematic section reveals.
 * Restrained scroll-triggered fade / slide-up / mask-wipe only (see spec:
 * no bounce, spring, or parallax). Plays once per element, mirroring the
 * IntersectionObserver pattern already used in js/work-together.js.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var targets = document.querySelectorAll(".fff .reveal-up, .fff .reveal-fade, .fff .reveal-mask");
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
    }, { threshold: 0.3 });

    targets.forEach(function (el) { observer.observe(el); });
  });
})();
