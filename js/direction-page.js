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

  function figure(item) {
    var fig = document.createElement("div");
    fig.className = "pf-figure";
    var img = document.createElement("img");
    img.src = "../" + item.src;
    img.alt = "";
    img.loading = "lazy";
    fig.appendChild(img);

    var wrap = document.createElement("div");
    wrap.appendChild(fig);
    if (item.caption) {
      var cap = document.createElement("p");
      cap.className = "pf-caption";
      cap.textContent = item.caption;
      wrap.appendChild(cap);
    }
    return wrap;
  }

  function renderCta() {
    var data = window.DIRECTION_PAGE_DATA.ctaText;
    var wrap = document.createElement("div");
    wrap.className = "pf-block pf-cta";

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

  function renderBlock(block) {
    if (block.type === "cta") return renderCta();

    var wrap = document.createElement("div");
    wrap.className = "pf-block pf-" + block.type;
    if (block.hero) wrap.classList.add("pf-hero");
    if (block.end) wrap.classList.add("is-end");

    if (block.items) {
      block.items.forEach(function (item) { wrap.appendChild(figure(item)); });
    } else {
      wrap.appendChild(figure(block));
    }
    return wrap;
  }

  function renderFlow() {
    var wrap = document.getElementById("portfolioFlow");
    wrap.innerHTML = "";
    window.DIRECTION_PAGE_DATA.blocks.forEach(function (block) {
      wrap.appendChild(renderBlock(block));
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
