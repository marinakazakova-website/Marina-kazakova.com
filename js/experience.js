/**
 * EXPERIENCE section: typographic direction nav (Retail/Business/Brands/
 * Films) + the content panel below it (background photo + light overlay
 * card). Desktop: hover switches direction. Touch: tap switches.
 * Background photo is one shared asset across all four directions (per
 * mockup); only the card content cross-fades.
 */
(function () {
  "use strict";

  var directions = window.SITE_CONTENT.experienceDirections;
  var activeId = directions[0].id;
  var navEl, cardEl, bgEl, slider;
  var isFinePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  var ICONS = {
    website: "assets/icons/icon-website.png",
    portfolio: "assets/icons/icon-download.png",
    collaboration: "assets/icons/icon-telegram.png"
  };

  function getDirection(id) {
    return directions.filter(function (d) { return d.id === id; })[0];
  }

  function renderStaticIntroBits() {
    document.getElementById("experienceFormula").textContent = window.SITE_CONTENT.experienceIntro.formula;
  }

  function renderTypoNav() {
    navEl = document.getElementById("experienceTypoNav");
    navEl.innerHTML = "";
    directions.forEach(function (d) {
      var btn = document.createElement("button");
      btn.className = "experience-typo-nav__item" + (d.id === activeId ? " is-active" : "");
      btn.textContent = d.navLabel;
      btn.setAttribute("data-id", d.id);
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(d.id === activeId));

      if (isFinePointer) {
        btn.addEventListener("mouseenter", function () { setActive(d.id); });
      }
      btn.addEventListener("click", function () { setActive(d.id); });

      navEl.appendChild(btn);
    });
  }

  function linkRow(kind, linkData) {
    var wrap = document.createElement("a");
    wrap.className = "panel-links__item";
    var isDisabled = !linkData || !linkData.href;

    if (isDisabled) {
      wrap.classList.add("is-disabled");
      wrap.setAttribute("aria-disabled", "true");
      wrap.href = "javascript:void(0)";
    } else {
      wrap.href = linkData.href;
      var isDownload = kind === "portfolio";
      if (isDownload) {
        wrap.setAttribute("download", "");
      } else {
        wrap.target = "_blank";
        wrap.rel = "noopener";
      }
    }

    var icon = document.createElement("img");
    icon.className = "panel-links__icon";
    icon.src = ICONS[kind];
    icon.alt = "";
    var span = document.createElement("span");
    span.textContent = (linkData && linkData.label) || "";

    wrap.appendChild(icon);
    wrap.appendChild(span);
    return wrap;
  }

  function buildMedia(direction) {
    var mediaWrap = document.createElement("div");
    mediaWrap.className = "panel-media";

    if (direction.media.type === "slider") {
      var sliderContainer = document.createElement("div");
      mediaWrap.appendChild(sliderContainer);
      var images = [direction.media.cover].concat(direction.media.images).filter(Boolean);
      slider = new window.MK.Slider(sliderContainer, images);
    } else if (direction.media.type === "video") {
      mediaWrap.classList.add(direction.media.video ? "" : "panel-media--empty");
      var slot = document.createElement("div");
      slot.className = "panel-video-slot";
      if (direction.media.video) {
        renderVideoInto(slot, direction.media.video);
      }
      mediaWrap.appendChild(slot);
    }

    return mediaWrap;
  }

  /** Ready for a local mp4, a Vimeo id/url, or a YouTube id/url — wire the
   *  source later in data/content.js (experienceDirections -> films -> media.video). */
  function renderVideoInto(slot, video) {
    if (video.type === "mp4") {
      var v = document.createElement("video");
      v.src = video.src;
      v.controls = true;
      v.playsInline = true;
      slot.appendChild(v);
    } else if (video.type === "vimeo") {
      var f1 = document.createElement("iframe");
      f1.src = "https://player.vimeo.com/video/" + video.id;
      f1.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
      f1.setAttribute("allowfullscreen", "");
      slot.appendChild(f1);
    } else if (video.type === "youtube") {
      var f2 = document.createElement("iframe");
      f2.src = "https://www.youtube.com/embed/" + video.id;
      f2.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
      f2.setAttribute("allowfullscreen", "");
      slot.appendChild(f2);
    }
  }

  function buildCardContent(direction) {
    var lang = window.MK.i18n.getLang();
    var langData = direction[lang];

    var wrap = document.createDocumentFragment();

    var title = document.createElement("h3");
    title.className = "experience-panel-card__title";
    title.textContent = direction.title;
    wrap.appendChild(title);

    var grid = document.createElement("div");
    grid.className = "experience-panel-card__grid";

    grid.appendChild(buildMedia(direction));

    var content = document.createElement("div");
    content.className = "panel-content";

    var tagline = document.createElement("p");
    tagline.className = "panel-content__tagline";
    tagline.textContent = direction.tagline;
    content.appendChild(tagline);

    var body = document.createElement("div");
    body.className = "panel-content__body";
    langData.body.forEach(function (para) {
      var p = document.createElement("p");
      p.innerHTML = window.MK.i18n.renderInline(para);
      body.appendChild(p);
    });
    content.appendChild(body);

    if (direction.clients && direction.clients.length) {
      var clients = document.createElement("p");
      clients.className = "panel-content__clients";
      clients.textContent = direction.clients.join(" · ") + " · ";
      content.appendChild(clients);
    }

    var links = document.createElement("div");
    links.className = "panel-links";
    if (direction.links.website) links.appendChild(linkRow("website", direction.links.website));
    links.appendChild(linkRow("portfolio", direction.links.portfolio));
    links.appendChild(linkRow("collaboration", direction.links.collaboration));
    content.appendChild(links);

    grid.appendChild(content);
    wrap.appendChild(grid);
    return wrap;
  }

  function renderCard(direction, animate) {
    if (!animate) {
      cardEl.innerHTML = "";
      cardEl.appendChild(buildCardContent(direction));
      cardEl.classList.add("is-visible");
      return;
    }
    cardEl.classList.remove("is-visible");
    window.setTimeout(function () {
      cardEl.innerHTML = "";
      cardEl.appendChild(buildCardContent(direction));
      requestAnimationFrame(function () { cardEl.classList.add("is-visible"); });
    }, 180);
  }

  function setActive(id, animate) {
    if (id === activeId && animate !== false) return;
    activeId = id;
    navEl.querySelectorAll(".experience-typo-nav__item").forEach(function (btn) {
      var isActive = btn.getAttribute("data-id") === id;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });
    renderCard(getDirection(id), animate !== false);
  }

  function initBackground() {
    bgEl = document.getElementById("experiencePanelBgImage");
    bgEl.style.backgroundImage = "url('assets/images/backgrounds/experience-panel-bg.png')";
    requestAnimationFrame(function () { bgEl.classList.add("is-ready"); });
  }

  function init() {
    cardEl = document.getElementById("experiencePanelCard");
    renderStaticIntroBits();
    renderTypoNav();
    initBackground();
    setActive(activeId, false);

    document.addEventListener("mk:langchange", function () {
      renderCard(getDirection(activeId), false);
    });
  }

  window.MK = window.MK || {};
  window.MK.experience = { init: init };
})();
