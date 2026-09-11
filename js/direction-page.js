/**
 * Generic renderer for direction pages (Retail/Business/Brands/Films).
 * Reads title/tagline/body/clients/links from SITE_CONTENT.experienceDirections
 * (approved, bilingual — same data the homepage panels use) and the portfolio
 * block layout from window.DIRECTION_PAGE_DATA (data/<direction>-page.js).
 */
(function () {
  "use strict";

  var ICONS = {
    website: "../assets/icons/icon-website.png",
    portfolio: "../assets/icons/icon-download.png",
    collaboration: "../assets/icons/icon-telegram.png"
  };

  // Assets are stored relative to the site root; pages under a
  // subdirectory (business/, retail/, ...) need "../" to reach them.
  // A standalone preview build inlines assets as absolute data: URIs —
  // prepending "../" to those would corrupt them, so leave any already-
  // absolute URL (data:, http(s):, blob:) untouched.
  function assetUrl(src) {
    return /^(data|https?|blob):/.test(src) ? src : "../" + src;
  }

  function getDirection() {
    var id = window.DIRECTION_PAGE_DATA.directionId;
    return window.SITE_CONTENT.experienceDirections.filter(function (d) { return d.id === id; })[0];
  }

  // A direction's tagline is usually a single English string (the
  // client's own international-facing line), but some (Brands) need a
  // real RU translation — same { en, ru } fallback shape used site-wide.
  function localized(field, lang) {
    if (field && typeof field === "object") return field[lang] || field.en || field.ru || "";
    return field || "";
  }

  function renderIntro(direction) {
    var lang = window.MK.i18n.getLang();
    document.getElementById("directionTitle").textContent = direction.navLabel;
    document.getElementById("directionTagline").textContent = localized(direction.tagline, lang);

    var body = document.getElementById("directionBody");
    body.innerHTML = "";
    direction[lang].body.forEach(function (para) {
      var p = document.createElement("p");
      p.innerHTML = window.MK.i18n.renderInline(para);
      body.appendChild(p);
    });

    var clientsIntroEl = document.getElementById("directionClientsIntro");
    if (clientsIntroEl) {
      if (direction.clientsIntro) {
        clientsIntroEl.textContent = localized(direction.clientsIntro, lang);
        clientsIntroEl.hidden = false;
      } else {
        clientsIntroEl.hidden = true;
      }
    }

    var clientsEl = document.getElementById("directionClients");
    if (direction.clients && direction.clients.length) {
      clientsEl.textContent = direction.clients.join(" · ") + " · ";
      clientsEl.hidden = false;
    } else {
      clientsEl.hidden = true;
    }

    renderLinks(direction);
  }

  function renderLinks(direction) {
    var lang = window.MK.i18n.getLang();
    var wrap = document.getElementById("directionLinks");
    wrap.innerHTML = "";

    function linkRow(kind, data, forceLabel) {
      var el = document.createElement("a");
      el.className = "direction-link";
      var isDisabled = !data || !data.href;
      if (isDisabled) {
        el.classList.add("is-disabled");
        el.href = "javascript:void(0)";
        el.setAttribute("aria-disabled", "true");
      } else {
        el.href = assetUrl(data.href);
        if (kind === "portfolio") {
          el.setAttribute("download", "");
        } else {
          el.target = "_blank";
          el.rel = "noopener";
        }
      }
      el.textContent = localized(forceLabel, lang) || localized(data && data.label, lang);
      wrap.appendChild(el);
    }

    // A page can force its own portfolio-link wording (e.g. Films' "Download
    // Presentation") — falls back to the direction's own approved label
    // (data/content.js) otherwise, which is now the normal case.
    var portfolioLabel = window.DIRECTION_PAGE_DATA.portfolioLabel;
    if (direction.links.website) linkRow("website", direction.links.website);
    if (direction.links.portfolio && direction.links.portfolio.href) linkRow("portfolio", direction.links.portfolio, portfolioLabel);
    if (direction.links.trainings) linkRow("trainings", direction.links.trainings);
    linkRow("collaboration", direction.links.collaboration);

    renderClientLogos();
  }

  function renderClientLogos() {
    var wrap = document.getElementById("clientStrip");
    if (!wrap) return;
    wrap.innerHTML = "";
    var logos = window.DIRECTION_PAGE_DATA.clientLogos;
    if (!logos || !logos.length) { wrap.hidden = true; return; }
    wrap.hidden = false;
    logos.forEach(function (logo) {
      var item = document.createElement("div");
      item.className = "client-strip__item";
      var img = document.createElement("img");
      img.src = assetUrl(logo.src);
      img.alt = logo.alt || "";
      img.loading = "lazy";
      if (logo.h) img.style.height = logo.h + "px";
      if (logo.maxH) img.style.maxHeight = logo.maxH + "px";
      item.appendChild(img);
      wrap.appendChild(item);
    });
  }

  function renderCta() {
    var data = window.DIRECTION_PAGE_DATA.ctaText;
    var lang = window.MK.i18n.getLang();
    var wrap = document.createElement("div");
    wrap.className = "pf-cta";

    var lead = document.createElement("p");
    lead.className = "pf-cta__lead";
    lead.textContent = localized(data.lead, lang);
    var sub = document.createElement("p");
    sub.className = "pf-cta__sub";
    sub.textContent = localized(data.sub, lang);
    var btn = document.createElement("a");
    btn.className = "btn btn--dark";
    btn.textContent = localized(data.cta, lang);
    btn.href = "https://t.me/marinakazakova_ru";
    btn.target = "_blank";
    btn.rel = "noopener";

    wrap.appendChild(lead);
    wrap.appendChild(sub);
    wrap.appendChild(btn);
    return wrap;
  }

  function renderProject(project) {
    var wrap = document.createElement("div");
    wrap.className = "pf-project";

    var fig = document.createElement("div");
    fig.className = "pf-project__figure";
    if (project.ar) fig.style.setProperty("--ar", project.ar.replace("/", " / "));
    if (project.op) fig.style.setProperty("--op", project.op);

    var img = document.createElement("img");
    img.src = assetUrl(project.src);
    img.alt = "";
    img.loading = "lazy";
    fig.appendChild(img);
    wrap.appendChild(fig);

    if (project.caption) {
      var cap = document.createElement("div");
      cap.className = "pf-caption";
      var brand = document.createElement("p");
      brand.className = "pf-caption__brand";
      brand.textContent = localized(project.caption.brand, window.MK.i18n.getLang());
      var desc = document.createElement("p");
      desc.className = "pf-caption__desc";
      desc.textContent = localized(project.caption.desc, window.MK.i18n.getLang());
      cap.appendChild(brand);
      cap.appendChild(desc);
      wrap.appendChild(cap);
    }
    return wrap;
  }

  function renderIntroCell(cell) {
    var wrap = document.createElement("div");
    wrap.className = "pf-intro-case";

    var fig = document.createElement("div");
    fig.className = "pf-project__figure";
    if (cell.photo.ar) fig.style.setProperty("--ar", cell.photo.ar.replace("/", " / "));
    var img = document.createElement("img");
    img.src = assetUrl(cell.photo.src);
    img.alt = "";
    img.loading = "lazy";
    fig.appendChild(img);
    wrap.appendChild(fig);

    if (cell.logo || cell.caption) {
      var meta = document.createElement("div");
      meta.className = "pf-intro-case__meta";

      if (cell.logo) {
        var logoImg = document.createElement("img");
        logoImg.className = "pf-intro-case__logo";
        logoImg.src = assetUrl(cell.logo.src);
        logoImg.alt = cell.logo.alt || "";
        meta.appendChild(logoImg);
      }
      if (cell.caption) {
        var cap = document.createElement("div");
        cap.className = "pf-caption";
        var brand = document.createElement("p");
        brand.className = "pf-caption__brand";
        brand.textContent = localized(cell.caption.brand, window.MK.i18n.getLang());
        var desc = document.createElement("p");
        desc.className = "pf-caption__desc";
        desc.textContent = localized(cell.caption.desc, window.MK.i18n.getLang());
        cap.appendChild(brand);
        cap.appendChild(desc);
        meta.appendChild(cap);
      }
      wrap.appendChild(meta);
    }
    return wrap;
  }

  function renderIntroBlock(row) {
    var wrap = document.createElement("div");
    wrap.className = "pf-row";
    wrap.appendChild(renderIntroCell(row.left));
    wrap.appendChild(renderIntroCell(row.right));
    return wrap;
  }

  function renderVideoCell(cell) {
    var wrap = document.createElement("div");
    wrap.className = "pf-project";

    var fig = document.createElement("div");
    fig.className = "pf-project__figure";
    fig.style.setProperty("--ar", "16 / 9");

    if (cell && cell.src) {
      var video = document.createElement("video");
      video.src = assetUrl(cell.src);
      if (cell.poster) video.poster = assetUrl(cell.poster);
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      fig.appendChild(video);
    }
    wrap.appendChild(fig);
    return wrap;
  }

  function renderVideoRow(row) {
    var wrap = document.createElement("div");
    wrap.className = "pf-row";
    wrap.appendChild(renderVideoCell(row.left));
    wrap.appendChild(renderVideoCell(row.right));
    return wrap;
  }

  function renderZone(items) {
    var zone = document.createElement("div");
    zone.className = "pf-zone" + (items.length > 1 ? " pf-zone--duo" : " pf-zone--solo");
    items.forEach(function (project) { zone.appendChild(renderProject(project)); });
    return zone;
  }

  function renderRow(row) {
    var wrap = document.createElement("div");
    wrap.className = "pf-row";
    if (row.emphasis === "left") wrap.style.gridTemplateColumns = "1.5fr 1fr";
    else if (row.emphasis === "right") wrap.style.gridTemplateColumns = "1fr 1.5fr";
    wrap.appendChild(renderZone(row.left));
    wrap.appendChild(renderZone(row.right));
    return wrap;
  }

  function renderFlow() {
    var wrap = document.getElementById("portfolioFlow");
    if (!wrap) return;
    wrap.innerHTML = "";
    window.DIRECTION_PAGE_DATA.rows.forEach(function (row) {
      var el;
      if (row.type === "cta") el = renderCta();
      else if (row.type === "intro-block") el = renderIntroBlock(row);
      else if (row.type === "video-row") el = renderVideoRow(row);
      else el = renderRow(row);
      wrap.appendChild(el);
    });
  }

  function render() {
    renderIntro(getDirection());
    renderFlow();
  }

  document.addEventListener("mk:langchange", render);

  document.addEventListener("DOMContentLoaded", function () {
    window.MK.i18n.init();
    window.MK.nav.init();
    document.getElementById("siteNav").classList.add("is-visible");
    render();
  });
})();
