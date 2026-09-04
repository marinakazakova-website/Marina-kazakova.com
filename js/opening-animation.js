/**
 * Opening animation: image is visible immediately; the headline
 * ("I SEE what it can become.") reveals shortly after, word by word,
 * then the page settles into its normal static state. ~1.6s total.
 * Runs on every load/reload — no "seen before" flag.
 */
(function () {
  "use strict";

  var TOTAL_MS = 1700;

  function buildWord(word, accent) {
    var span = document.createElement("span");
    span.className = "profile-reveal__word" + (accent ? " is-accent" : "");
    span.textContent = word;
    return span;
  }

  function render() {
    var lang = window.MK.i18n.getLang();
    var words = window.SITE_CONTENT.profile[lang].headlineWords;
    var line1 = document.getElementById("revealLine1");
    var line2 = document.getElementById("revealLine2");
    line1.innerHTML = "";
    line2.innerHTML = "";
    words.slice(0, 3).forEach(function (item) { line1.appendChild(buildWord(item.w, item.accent)); });
    words.slice(3, 6).forEach(function (item) { line2.appendChild(buildWord(item.w, item.accent)); });
  }

  function play() {
    render();
    var reveal = document.getElementById("profileReveal");
    // Force a layout tick before triggering the transition.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        reveal.classList.add("is-revealed");
      });
    });
    window.setTimeout(function () {
      window.MK.nav.reveal();
    }, TOTAL_MS);
  }

  document.addEventListener("mk:langchange", render);

  window.MK = window.MK || {};
  window.MK.openingAnimation = { play: play };
})();
