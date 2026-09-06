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

  function getDirection() {
    var id = window.DIRECTION_PAGE_DATA.directionId;
    return window.SITE_CONTENT.experienceDirections.filter(function (d) { return d.id === id; })[0];
  }

  function renderIntro(direction) {
    var lang = window.MK.i18n.getLang();
    document.getElementById("directionTitle").textContent = direction.navLabel;
    document.getElementById("directionTagline").textContent = direction.tagline;

    var body = document.getElementById("directionBody");
    body.innerHTML = "";
    direction[lang].body.forEach(function (para) {
      var p = document.createElement("p");
      p.innerHTML = window.MK.i18n.renderInline(para);
      body.appendChild(p);
    });

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
        el.href = /^https?:/.test(data.href) ? data.href : "../" + data.href;
        if (kind === "portfolio") {
          el.setAttribute("download", "");
        } else {
          el.target = "_blank";
          el.rel = "noopener";
        }
      }
      el.textContent = forceLabel || (data && data.label) || "";
      wrap.appendChild(el);
    }

    if (direction.links.website) linkRow("website", direction.links.website);
    linkRow("portfolio", direction.links.portfolio, "Check our projects");
    linkRow("collaboration", direction.links.collaboration, "Let's talk");
  }

  function renderCta() {
    var data = window.DIRECTION_PAGE_DATA.ctaText;
    var wrap = document.createElement("div");
    wrap.className = "pf-cta";

    var lead = document.createElement("p");
    lead.className = "pf-cta__lead";
    lead.textContent = data.lead;
    var sub = document.createElement("p");
    sub.className = "pf-cta__sub";
    sub.textContent = data.sub;
    var btn = document.createElement("a");
    btn.className = "btn btn--dark";
    btn.textContent = data.cta;
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
    img.src = "../" + project.src;
    img.alt = "";
    img.loading = "lazy";
    fig.appendChild(img);
    wrap.appendChild(fig);

    if (project.caption) {
      var cap = document.createElement("p");
      cap.className = "pf-caption";
      cap.textContent = project.caption;
      wrap.appendChild(cap);
    }
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
    wrap.innerHTML = "";
    window.DIRECTION_PAGE_DATA.rows.forEach(function (row) {
      wrap.appendChild(row.type === "cta" ? renderCta() : renderRow(row));
    });
  }

  function render() {
    renderIntro(getDirection());
  }

  document.addEventListener("mk:langchange", render);

  document.addEventListener("DOMContentLoaded", function () {
    window.MK.i18n.init();
    window.MK.nav.init();
    document.getElementById("siteNav").classList.add("is-visible");
    render();
    renderFlow();
  });
})();
