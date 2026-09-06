/**
 * RETAIL direction page — portfolio section.
 *
 * Layout: CSS multi-column masonry (see .pf-masonry in direction-page.css),
 * modeled on the client's own retail-design.ru — independent column flow,
 * each image kept at its natural aspect ratio (no forced crop), varied
 * heights create the rhythm rather than a fixed grid. Referencing her own
 * site's actual behaviour, repeat-brand photos (Ecco, Catcher, Underline
 * each appear twice) are kept as separate, independent project cards
 * rather than merged into one composition — that's what retail-design.ru
 * itself does.
 *
 * Title / tagline / body / clients / links are NOT duplicated here — they
 * already live in data/content.js -> experienceDirections (id: "retail").
 *
 * Captions: intentionally null. Filenames told us which project is which
 * (for sequencing only) — per instruction, no project names/descriptions
 * are invented. Each project is ready to take a `caption` once supplied.
 */
window.DIRECTION_PAGE_DATA = {
  directionId: "retail",

  ctaText: {
    lead: "Ready to have a project?",
    sub: "Leave a request, it’s free. I’d love to chat.",
    cta: "LET'S TALK"
  },

  blocks: [
    { type: "project", src: "assets/images/experience/retail/new/retail-new-01-ecco.jpeg", caption: null },
    { type: "project", src: "assets/images/experience/retail/new/retail-new-02-gstar-raw.jpeg", caption: null },
    { type: "project", src: "assets/images/experience/retail/new/retail-new-03-sleep8.jpeg", caption: null },
    { type: "project", src: "assets/images/experience/retail/new/retail-new-04-rive-gauche.jpeg", caption: null },
    { type: "project", src: "assets/images/experience/retail/new/retail-new-05-underline.jpeg", caption: null },
    { type: "project", src: "assets/images/experience/retail/new/retail-new-06-ecco.jpeg", caption: null },

    { type: "cta" },

    { type: "project", src: "assets/images/experience/retail/new/retail-new-07-catcher.jpeg", caption: null },
    { type: "project", src: "assets/images/experience/retail/new/retail-new-08-ascona.jpeg", caption: null },
    { type: "project", src: "assets/images/experience/retail/new/retail-new-09-moppi.jpeg", caption: null },
    { type: "project", src: "assets/images/experience/retail/new/retail-new-10-albione.jpeg", caption: null },
    { type: "project", src: "assets/images/experience/retail/new/retail-new-11-ikea-popup.jpeg", caption: null },
    { type: "project", src: "assets/images/experience/retail/new/retail-new-12-underline.jpeg", caption: null },
    { type: "project", src: "assets/images/experience/retail/new/retail-new-13-catcher.jpeg", caption: null }
  ]
};
