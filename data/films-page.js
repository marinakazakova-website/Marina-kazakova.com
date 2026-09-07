/* ========================================================================
   FILMS direction page — data hook for the shared intro (js/direction-page.js).
   The FFF cinematic section below the intro is hand-authored, static markup
   in films/index.html (not a repeating dataset like Retail/Business), so
   `rows` stays empty here — only the intro/links behaviour is shared.
   ======================================================================== */
window.DIRECTION_PAGE_DATA = {
  directionId: "films",

  // Overrides the shared renderer's default "Check our projects" label for
  // the portfolio-kind button — Films downloads the FFF presentation, not
  // a project index. Retail/Business don't set this, so they keep the
  // default text unchanged.
  portfolioLabel: "Download Presentation",

  clientLogos: [],
  rows: []
};
