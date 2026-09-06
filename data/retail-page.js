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
 * (each block can carry a `caption` string once supplied). A block renders
 * no <figcaption> at all while caption is null.
 */
window.DIRECTION_PAGE_DATA = {
  directionId: "retail",
  ctaText: {
    lead: "Ready to have a project?",
    sub: "Leave a request, it’s free. I’d love to chat.",
    cta: "LET'S TALK"
  },

  blocks: [
    { type: "full", hero: true, src: "assets/images/experience/retail/cover.jpeg", caption: null },
    { type: "pair", items: [
      { src: "assets/images/experience/retail/retail-01.jpeg", caption: null },
      { src: "assets/images/experience/retail/retail-02.jpeg", caption: null }
    ]},
    { type: "full", src: "assets/images/experience/retail/retail-03.jpeg", caption: null },
    { type: "portrait", src: "assets/images/experience/retail/retail-04.jpeg", caption: null },
    { type: "cta" },
    { type: "trio", items: [
      { src: "assets/images/experience/retail/retail-05.jpeg", caption: null },
      { src: "assets/images/experience/retail/retail-06.jpeg", caption: null },
      { src: "assets/images/experience/retail/retail-07.jpeg", caption: null }
    ]},
    { type: "asymmetric", items: [
      { src: "assets/images/experience/retail/retail-08.jpeg", caption: null },
      { src: "assets/images/experience/retail/retail-09.jpeg", caption: null }
    ]},
    { type: "full", src: "assets/images/experience/retail/retail-10.jpeg", caption: null },
    { type: "pair", items: [
      { src: "assets/images/experience/retail/retail-11.jpeg", caption: null },
      { src: "assets/images/experience/retail/retail-12.jpeg", caption: null }
    ]},
    { type: "portrait", src: "assets/images/experience/retail/retail-13.jpeg", caption: null },
    { type: "small", end: true, src: "assets/images/experience/retail/retail-14.jpeg", caption: null },
    { type: "full", src: "assets/images/experience/retail/retail-15.jpeg", caption: null }
  ]
};
