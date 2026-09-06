/**
 * RETAIL direction page — portfolio flow layout.
 *
 * This is the master template: the block *types* and CSS (direction-page.css)
 * are meant to be reused for Business/Brands/Films once their material is
 * ready — only this data array (images + captions) changes per direction.
 *
 * Title / tagline / body / clients / links are NOT duplicated here — they
 * already live in data/content.js -> experienceDirections (id: "retail"),
 * approved text, bilingual. js/direction-page.js reads them from there.
 *
 * Captions: intentionally left `null`. Per the client's instruction, project
 * names/captions are not to be invented — this only sets up the structure
 * (each block/item can carry a `caption` string once supplied). Nothing
 * renders a <figcaption> while caption is null.
 *
 * Layout model — deliberately NOT a grid. Two block shapes:
 *   { type: "single", src, w, align, ar, op, caption }
 *     w      - CSS width, e.g. "100%", "68%", "30%"
 *     align  - "left" | "right" | "center" (how it sits in the free space)
 *     ar     - aspect-ratio, e.g. "21/9", "3/4", "1/1"
 *     op     - object-position (crop anchor), e.g. "center", "top", "30% 50%"
 *   { type: "multi", valign, items: [{ src, flex, ar, op, offsetY, caption }] }
 *     valign   - "flex-start" | "flex-end" | "center" (row alignment)
 *     flex     - relative width weight within the row
 *     offsetY  - optional vertical stagger, e.g. "3rem"
 * Every image gets its own aspect ratio / crop anchor rather than a shared
 * default, specifically so the same 15 landscape source photos read as a
 * mix of horizontal, square and portrait moments (per instruction: crop via
 * layout only, object-fit/object-position, source files untouched).
 */
window.DIRECTION_PAGE_DATA = {
  directionId: "retail",

  ctaText: {
    lead: "Ready to have a project?",
    sub: "Leave a request, it’s free. I’d love to chat.",
    cta: "LET'S TALK"
  },

  blocks: [
    // Opening statement — the cover art card, nearly full width, wide letterbox.
    { type: "single", src: "assets/images/experience/retail/cover.jpeg",
      w: "100%", align: "center", ar: "21/9", op: "center", caption: null },

    // Small vertical moment, pulled left, lots of air to its right.
    { type: "single", src: "assets/images/experience/retail/retail-01.jpeg",
      w: "30%", align: "left", ar: "3/4", op: "center 30%", caption: null },

    // Two unequal photos on one baseline — large landscape + small square.
    { type: "multi", valign: "flex-end", items: [
      { src: "assets/images/experience/retail/retail-02.jpeg", flex: 1.7, ar: "3/2", op: "center", caption: null },
      { src: "assets/images/experience/retail/retail-03.jpeg", flex: 1, ar: "1/1", op: "center", caption: null }
    ]},

    // Wide but not full — anchored right, generous space on the left.
    { type: "single", src: "assets/images/experience/retail/retail-04.jpeg",
      w: "68%", align: "right", ar: "3/2", op: "center", caption: null },

    { type: "cta" },

    // Single centered portrait, moderate scale.
    { type: "single", src: "assets/images/experience/retail/retail-05.jpeg",
      w: "36%", align: "center", ar: "3/4", op: "center", caption: null },

    // Two photos, staggered vertically rather than aligned.
    { type: "multi", valign: "flex-start", items: [
      { src: "assets/images/experience/retail/retail-06.jpeg", flex: 1, ar: "4/3", op: "center", caption: null },
      { src: "assets/images/experience/retail/retail-07.jpeg", flex: 1, ar: "1/1", op: "center", offsetY: "3.5rem", caption: null }
    ]},

    // Full-width breather.
    { type: "single", src: "assets/images/experience/retail/retail-08.jpeg",
      w: "100%", align: "center", ar: "16/9", op: "center", caption: null },

    // Small square, pulled right this time.
    { type: "single", src: "assets/images/experience/retail/retail-09.jpeg",
      w: "27%", align: "right", ar: "1/1", op: "center", caption: null },

    // Reversed uneven pair — small square first, large landscape after.
    { type: "multi", valign: "flex-start", items: [
      { src: "assets/images/experience/retail/retail-10.jpeg", flex: 1, ar: "3/4", op: "center", caption: null },
      { src: "assets/images/experience/retail/retail-11.jpeg", flex: 1.7, ar: "3/2", op: "center", offsetY: "2rem", caption: null }
    ]},

    // Wide, anchored left.
    { type: "single", src: "assets/images/experience/retail/retail-12.jpeg",
      w: "65%", align: "left", ar: "3/2", op: "center", caption: null },

    // Portrait, anchored right.
    { type: "single", src: "assets/images/experience/retail/retail-13.jpeg",
      w: "32%", align: "right", ar: "3/4", op: "center 35%", caption: null },

    // Small, offset left, big surrounding space.
    { type: "single", src: "assets/images/experience/retail/retail-14.jpeg",
      w: "30%", align: "left", ar: "1/1", op: "center", caption: null },

    // Closing full-width image.
    { type: "single", src: "assets/images/experience/retail/retail-15.jpeg",
      w: "100%", align: "center", ar: "16/9", op: "center", caption: null }
  ]
};
