/**
 * RETAIL direction page — portfolio section.
 *
 * Layout: one central vertical axis with a LEFT and a RIGHT zone per row
 * (see .pf-row / .pf-zone--duo in direction-page.css), modeled directly on
 * the client's retail-design.ru screenshots (references/*.png). A zone
 * holds either one large project ("solo") or two smaller ones side by
 * side ("duo"). Rows also carry an `emphasis` ("left"/"right") that widens
 * the heavier zone — even a 1-vs-1 row reads as "one large, one small" on
 * her reference, not an even 50/50 split.
 *
 * Title / tagline / body / clients / links are NOT duplicated here — they
 * already live in data/content.js -> experienceDirections (id: "retail").
 *
 * Each project: { src, caption, ar?, op? }
 *   ar / op are optional — only set when a photo needs a deliberate crop
 *   to hold its place in the rhythm (object-fit: cover); otherwise the
 *   image keeps its natural proportions. Source files untouched.
 *
 * Captions: intentionally null throughout. Filenames only told us which
 * project is which, for sequencing — no names/descriptions invented.
 */
window.DIRECTION_PAGE_DATA = {
  directionId: "retail",

  ctaText: {
    lead: "Ready to have a project?",
    sub: "Leave a request, it’s free. I’d love to chat.",
    cta: "LET'S TALK"
  },

  // Client logos — compact vertical strip under the functional links.
  // Only brands whose logo file has actually been uploaded are listed;
  // no logo is redrawn or substituted. Still missing a file: INGKA,
  // Rive Gauche, One Move, East Step, ORTEKA, Yandex Market, Catcher.
  clientLogos: [
    { src: "assets/logos/clients/client-ikea.png", alt: "IKEA" },
    { src: "assets/logos/clients/client-mega.png", alt: "MEGA" },
    { src: "assets/logos/clients/client-underline.png", alt: "Underline" },
    { src: "assets/logos/clients/client-fujifilm.png", alt: "Fujifilm" },
    { src: "assets/logos/clients/client-tele2.png", alt: "Tele2" },
    { src: "assets/logos/clients/client-askona.png", alt: "Askona" },
    { src: "assets/logos/clients/client-letoile.png", alt: "L'Etoile" },
    { src: "assets/logos/clients/client-adidas-originals.png", alt: "Adidas Originals" },
    { src: "assets/logos/clients/client-reebok-classic.png", alt: "Reebok Classic" },
    { src: "assets/logos/clients/client-ecco.png", alt: "ECCO" },
    { src: "assets/logos/clients/client-g-star-raw.png", alt: "G-STAR RAW" },
    { src: "assets/logos/clients/client-no-one.png", alt: "No One" },
    { src: "assets/logos/clients/client-simple-wine.png", alt: "Simple Wine" },
    { src: "assets/logos/clients/client-u-boat.png", alt: "U-BOAT" },
    { src: "assets/logos/clients/client-eurodecor.png", alt: "EURODECOR" },
    { src: "assets/logos/clients/client-moppi.png", alt: "Moppi" },
    { src: "assets/logos/clients/client-lamoda.png", alt: "Lamoda" },
    { src: "assets/logos/clients/client-gloria-jeans.png", alt: "Gloria Jeans" },
    { src: "assets/logos/clients/client-yandex-market.png", alt: "Yandex Market" },
    { src: "assets/logos/clients/client-alisa.png", alt: "Alisa AI" },
    { src: "assets/logos/clients/client-sleep8.png", alt: "Sleep.8" }
  ],

  rows: [
    // 2 small (left) + 1 large (right)
    {
      emphasis: "right",
      left: [
        { src: "assets/images/experience/retail/new/retail-new-01-ecco.jpeg", caption: null, ar: "3/4", op: "center" },
        { src: "assets/images/experience/retail/new/retail-new-02-gstar-raw.jpeg", caption: null, ar: "3/4", op: "right" }
      ],
      right: [
        { src: "assets/images/experience/retail/new/retail-new-03-sleep8.jpeg", caption: null, ar: "3/4", op: "center" }
      ]
    },
    // 1 large (left) + 1 small (right)
    {
      emphasis: "left",
      left: [
        { src: "assets/images/experience/retail/new/retail-new-04-rive-gauche.jpeg", caption: null, ar: "3/4", op: "35% center" }
      ],
      right: [
        { src: "assets/images/experience/retail/new/retail-new-05-underline.jpeg", caption: null, ar: "3/4", op: "45% center" }
      ]
    },
    // 1 small (left) + 1 large (right)
    {
      emphasis: "right",
      left: [
        { src: "assets/images/experience/retail/new/retail-new-06-ecco.jpeg", caption: null, ar: "1/1", op: "center" }
      ],
      right: [
        { src: "assets/images/experience/retail/new/retail-new-07-catcher.jpeg", caption: null, ar: "3/4", op: "center" }
      ]
    },

    { type: "cta" },

    // 1 large (left) + 2 small (right)
    {
      emphasis: "left",
      left: [
        { src: "assets/images/experience/retail/new/retail-new-08-ascona.jpeg", caption: null }
      ],
      right: [
        { src: "assets/images/experience/retail/new/retail-new-09-moppi.jpeg", caption: null, ar: "3/4", op: "35% center" },
        { src: "assets/images/experience/retail/new/retail-new-10-albione.jpeg", caption: null }
      ]
    },
    // 2 small (left) + 1 large (right)
    {
      emphasis: "right",
      left: [
        { src: "assets/images/experience/retail/new/retail-new-11-ikea-popup.jpeg", caption: null, ar: "3/4", op: "center" },
        { src: "assets/images/experience/retail/new/retail-new-12-underline.jpeg", caption: null, ar: "3/4", op: "center" }
      ],
      right: [
        { src: "assets/images/experience/retail/new/retail-new-13-catcher.jpeg", caption: null, ar: "3/4", op: "35% center" }
      ]
    }
  ]
};
