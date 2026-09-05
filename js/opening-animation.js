/**
 * Opening sequence (runs on every full page load — not on language switch
 * or in-site navigation):
 *
 *   1. MARINA KAZAKOVA fades in, large, centered over the (scrimmed) hero photo.
 *   2. Short hold.
 *   3. It shrinks + flies into the header's top-left corner, landing exactly
 *      on the permanent nav mark — the scrim fades out at the same time.
 *   4. The real header (links, EN/RU) fades in; scroll unlocks.
 *   5. The "I SEE WHAT / IT CAN BECOME." headline mask-reveals, line by line.
 *
 * Total runtime ~2.7s. All timings below are in ms.
 */
(function () {
  "use strict";

  var TITLE_IN_DELAY = 100;
  var TITLE_IN_DUR = 350;
  var HOLD_DUR = 600;
  var FLY_DUR = 600;
  var HEADLINE_GAP = 350;

  function buildWord(word, accent) {
    var span = document.createElement("span");
    span.className = "profile-reveal__word" + (accent ? " is-accent" : "");
    span.textContent = word;
    return span;
  }

  function buildLine(container, words) {
    container.innerHTML = "";
    var inner = document.createElement("span");
    inner.className = "profile-reveal__line-inner";
    words.forEach(function (item, i) {
      if (i > 0) inner.appendChild(document.createTextNode(" "));
      inner.appendChild(buildWord(item.w, item.accent));
    });
    container.appendChild(inner);
  }

  function renderHeadline() {
    var lang = window.MK.i18n.getLang();
    var words = window.SITE_CONTENT.profile[lang].headlineWords;
    buildLine(document.getElementById("revealLine1"), words.slice(0, 3));
    buildLine(document.getElementById("revealLine2"), words.slice(3, 6));
  }

  function revealHeadline() {
    document.getElementById("profileReveal").classList.add("is-revealed");
  }

  /** Centers the opening title in the viewport, then — after the hold —
   *  flies/shrinks it to sit exactly over the real (still-invisible)
   *  header mark, and finally hands off to the permanent header. */
  function playTitle(onDocked) {
    var title = document.getElementById("openingTitle");
    var scrim = document.getElementById("mediaScrim");
    var navMark = document.querySelector(".site-nav__mark");

    if (!title || !navMark) { onDocked(); return; }

    var titleRect = title.getBoundingClientRect();
    var centerX = window.innerWidth / 2 - titleRect.width / 2;
    var centerY = window.innerHeight / 2 - titleRect.height / 2;

    title.style.setProperty("--tx", centerX + "px");
    title.style.setProperty("--ty", centerY + "px");
    title.style.setProperty("--s", "1");

    window.setTimeout(function () {
      requestAnimationFrame(function () {
        title.classList.add("is-visible");
      });
    }, TITLE_IN_DELAY);

    window.setTimeout(function () {
      var targetRect = navMark.getBoundingClientRect();
      var scale = targetRect.height / titleRect.height;
      var targetX = targetRect.left + targetRect.width / 2 - titleRect.width / 2;
      var targetY = targetRect.top + targetRect.height / 2 - titleRect.height / 2;

      title.classList.add("is-flying");
      title.style.setProperty("--tx", targetX + "px");
      title.style.setProperty("--ty", targetY + "px");
      title.style.setProperty("--s", String(scale));
      if (scrim) scrim.classList.add("is-hidden");

      window.setTimeout(function () {
        title.classList.add("is-done");
        window.MK.nav.reveal();
        document.body.classList.remove("is-opening");
        onDocked();
      }, FLY_DUR);
    }, TITLE_IN_DELAY + TITLE_IN_DUR + HOLD_DUR);
  }

  function play() {
    renderHeadline();
    document.body.classList.add("is-opening");

    playTitle(function () {
      window.setTimeout(revealHeadline, HEADLINE_GAP);
    });
  }

  document.addEventListener("mk:langchange", renderHeadline);

  window.MK = window.MK || {};
  window.MK.openingAnimation = { play: play };
})();
