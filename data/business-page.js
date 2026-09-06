/**
 * BUSINESS direction page — portfolio section.
 *
 * Unlike Retail (editorial / asymmetric axis), Business is deliberately
 * structured and geometric: a strict LEFT | RIGHT two-column grid, most
 * photos at the same visual size. Reuses the exact same primitives as
 * Retail (.pf-row / .pf-zone--solo / .pf-project__figure / hover) — a
 * "row" here is just two solo zones with no `emphasis`, which already
 * renders as an even 1fr/1fr split.
 *
 * The page tells two stories, each opening with a unique "case intro"
 * row (`type: "intro-block"`) instead of a plain photo pair: one side
 * carries the photo, the other adds a small logo + caption (institution
 * name + years) — mirrored between the two stories per the client's own
 * mockup (Сайт_Second pages_Business.jpeg):
 *   - M&W:    left = group photo + M&W logo + caption · right = portrait
 *   - Woodi:  left = portrait/divider photo · right = team photo + Woodi logo + caption
 *
 * Photo order follows Business_new_1..20.jpeg exactly, matching the
 * client's mockup 1:1 (verified image-by-image) — nothing reordered.
 * All 18 landscape photos share the same native ratio (~3/2) already;
 * `ar: "3/2"` just locks that ratio precisely so every grid card lines
 * up. The 2 portrait photos (case-intro dividers) are native 2/3
 * portraits already — no crop needed.
 *
 * Captions: intentionally none on the 16 regular grid photos yet — the
 * client asked to see the composition first and will supply project
 * names / periods / captions afterward. The two case-intro captions
 * (M&W / Woodi Bureau names + years) are transcribed verbatim from her
 * own mockup, not invented.
 *
 * Video slots (`type: "video-row"`): a left/right pair of cells, each
 * either `{ src, poster? }` (renders a <video>) or `null` (an empty,
 * architecturally-ready slot — no placeholder image, just the figure's
 * own background). Same pf-project__figure/--ar card as a photo, locked
 * to 16:9. M&W has one real video + one open slot, right under its
 * case-intro; Woodi Bureau has two open slots at the end of its story
 * (source files are too large for the repo — external links to follow).
 */
window.DIRECTION_PAGE_DATA = {
  directionId: "business",

  ctaText: {
    lead: "Ready to have a project?",
    sub: "Leave a request, it’s free. I’d love to chat.",
    cta: "LET'S TALK"
  },

  // Client logos — companies whose teams trained at M&W (corporate
  // programmes). Same system as Retail: every logo capped to IKEA's
  // footprint (see .client-strip in direction-page.css), original
  // proportions kept, hover scale — nothing new needed for that.
  // Client's brand list has 29 names; 3 have no logo file yet and are
  // left out rather than guessed: BAON, ALLSAINTS, LYYK TEAM.
  //
  // A few logos (H&M, Helly Hansen, Fred Perry, TSUM Moscow, BASK Kids)
  // are unusually narrow wordmarks/monograms — at the default 20px they
  // rendered under ~40px wide, visibly lighter than the rest of the
  // column. `h` gives each an explicit render height, sized so its width
  // reaches ~45px (still well under IKEA's 112px cap) — restores equal
  // visual weight without stretching/distorting anything.
  clientLogos: [
    { src: "assets/logos/clients/school-ingka.png", alt: "INGKA" },
    { src: "assets/logos/clients/school-ikea.png", alt: "IKEA" },
    { src: "assets/logos/clients/school-offprice.png", alt: "OFFPRICE" },
    { src: "assets/logos/clients/school-hm.png", alt: "H&M", h: 28 },
    { src: "assets/logos/clients/school-inditex.png", alt: "Inditex" },
    { src: "assets/logos/clients/school-zara.png", alt: "ZARA" },
    { src: "assets/logos/clients/school-12storeez.png", alt: "12 STOREEZ" },
    { src: "assets/logos/clients/school-tsum-moscow.png", alt: "TSUM Moscow", h: 23 },
    { src: "assets/logos/clients/school-benetton.png", alt: "United Colors of Benetton" },
    { src: "assets/logos/clients/school-21shop.png", alt: "21 Shop" },
    { src: "assets/logos/clients/school-helly-hansen.png", alt: "Helly Hansen", h: 28 },
    { src: "assets/logos/clients/school-debenhams.png", alt: "Debenhams" },
    { src: "assets/logos/clients/school-sportmaster.png", alt: "Спортмастер" },
    { src: "assets/logos/clients/school-gloria-jeans.png", alt: "Gloria Jeans" },
    { src: "assets/logos/clients/school-intimissimi.png", alt: "Intimissimi" },
    { src: "assets/logos/clients/school-calzedonia.png", alt: "Calzedonia" },
    { src: "assets/logos/clients/school-clarks.png", alt: "Clarks" },
    { src: "assets/logos/clients/school-ralf-ringer.png", alt: "Ralf Ringer" },
    { src: "assets/logos/clients/school-stenders.png", alt: "Stenders" },
    { src: "assets/logos/clients/school-kixbox.png", alt: "KIXBOX" },
    { src: "assets/logos/clients/school-fred-perry.png", alt: "Fred Perry", h: 26 },
    { src: "assets/logos/clients/school-albione.png", alt: "Albione" },
    { src: "assets/logos/clients/school-bask-kids.png", alt: "BASK Kids", h: 22 },
    { src: "assets/logos/clients/school-cozy-home.png", alt: "COZY HOME" },
    { src: "assets/logos/clients/school-togas.png", alt: "TOGAS" },
    { src: "assets/logos/clients/school-kare-design.png", alt: "KARE Design" }
  ],

  rows: [
    // ==================== STORY A — M&W / EDUCATION ====================
    {
      type: "intro-block",
      left: {
        photo: { src: "assets/images/experience/business/new/business-new-01.jpeg", ar: "3/2" },
        logo: { src: "assets/logos/clients/mw-horizontal.png", alt: "M&W — Merchandising & Windows" },
        caption: { brand: "Московская школа визуального мерчандайзинга и дизайна витрин M&W", desc: "2014–2025" }
      },
      right: {
        photo: { src: "assets/images/experience/business/new/business-new-02.jpeg" }
      }
    },

    // Two video slots, right under the case-intro. Real footage on the
    // left ("Диплом Basic #17" — a graduation/diploma event); right slot
    // is architecturally ready for the second video, source TBD.
    {
      type: "video-row",
      left: {
        src: "assets/videos/business/mw-diploma-basic-17.mp4",
        poster: "assets/images/experience/business/mw-video-poster.jpg"
      },
      right: null
    },

    {
      left: [{ src: "assets/images/experience/business/new/business-new-03.jpeg", caption: null, ar: "3/2" }],
      right: [{ src: "assets/images/experience/business/new/business-new-04.jpeg", caption: null, ar: "3/2" }]
    },
    {
      left: [{ src: "assets/images/experience/business/new/business-new-05.jpeg", caption: null, ar: "3/2" }],
      right: [{ src: "assets/images/experience/business/new/business-new-06.jpeg", caption: null, ar: "3/2" }]
    },
    {
      left: [{ src: "assets/images/experience/business/new/business-new-07.jpeg", caption: null, ar: "3/2" }],
      right: [{ src: "assets/images/experience/business/new/business-new-08.jpeg", caption: null, ar: "3/2" }]
    },
    {
      left: [{ src: "assets/images/experience/business/new/business-new-09.jpeg", caption: null, ar: "3/2" }],
      right: [{ src: "assets/images/experience/business/new/business-new-10.jpeg", caption: null, ar: "3/2" }]
    },

    { type: "cta" },

    // ==================== STORY B — WOODI BUREAU ====================
    {
      type: "intro-block",
      left: {
        photo: { src: "assets/images/experience/business/new/business-new-11.jpeg" }
      },
      right: {
        photo: { src: "assets/images/experience/business/new/business-new-12.jpeg", ar: "3/2" },
        logo: { src: "assets/logos/clients/woodi-bureau.png", alt: "Woodi Bureau" },
        caption: { brand: "Ритейл-дизайн бюро Woodi Bureau", desc: "2014–2025" }
      }
    },
    {
      left: [{ src: "assets/images/experience/business/new/business-new-13.jpeg", caption: null, ar: "3/2" }],
      right: [{ src: "assets/images/experience/business/new/business-new-14.jpeg", caption: null, ar: "3/2" }]
    },
    {
      left: [{ src: "assets/images/experience/business/new/business-new-15.jpeg", caption: null, ar: "3/2" }],
      right: [{ src: "assets/images/experience/business/new/business-new-16.jpeg", caption: null, ar: "3/2" }]
    },
    {
      left: [{ src: "assets/images/experience/business/new/business-new-17.jpeg", caption: null, ar: "3/2" }],
      right: [{ src: "assets/images/experience/business/new/business-new-18.jpeg", caption: null, ar: "3/2" }]
    },
    {
      left: [{ src: "assets/images/experience/business/new/business-new-19.jpeg", caption: null, ar: "3/2" }],
      right: [{ src: "assets/images/experience/business/new/business-new-20.jpeg", caption: null, ar: "3/2" }]
    },

    // Two more video slots at the end of the Woodi Bureau story — no
    // footage yet (source files too large for the repo; client will send
    // external hosting links later). Both architecturally ready: once a
    // src is added here, it renders exactly like the M&W video above,
    // nothing else to change.
    {
      type: "video-row",
      left: null,
      right: null
    }
  ]
};
