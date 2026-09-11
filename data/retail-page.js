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
 *   caption is { brand, desc } or null — brand is the project name (kept
 *   as-is in both languages), desc is a real { en, ru } translation.
 */
window.DIRECTION_PAGE_DATA = {
  directionId: "retail",

  ctaText: {
    lead: { en: "Have a project in mind?", ru: "Есть проект?" },
    sub: {
      en: "Tell me about it. I’d love to discuss it with you.",
      ru: "Расскажите о нём — буду рада обсудить задачу"
    },
    cta: { en: "LET'S TALK", ru: "СВЯЗАТЬСЯ" }
  },

  // Client logos — compact vertical strip under the functional links.
  // Only brands whose logo file has actually been uploaded are listed;
  // no logo is redrawn or substituted. Still missing a file: INGKA,
  // Rive Gauche, One Move, East Step, ORTEKA, Catcher.
  //
  // Sizing: every logo is capped to IKEA's own footprint (see .client-strip
  // in direction-page.css: max-height 20px / max-width 112px) so nothing
  // outweighs the reference mark. Optional `maxH` overrides that cap for a
  // logo whose typeface still reads heavier than IKEA at the same geometry.
  clientLogos: [
    { src: "assets/logos/clients/client-ikea.png", alt: "IKEA" },
    { src: "assets/logos/clients/client-mega.png", alt: "MEGA" },
    { src: "assets/logos/clients/client-underline.png", alt: "Underline" },
    { src: "assets/logos/clients/client-fujifilm.png", alt: "Fujifilm", maxH: 17 },
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
        { src: "assets/images/experience/retail/new/retail-new-01-ecco.jpeg", caption: { brand: "ECCO", desc: { en: "Window Display Design", ru: "Дизайн витрины" } }, ar: "3/4", op: "center" },
        { src: "assets/images/experience/retail/new/retail-new-02-gstar-raw.jpeg", caption: { brand: "G-STAR RAW", desc: { en: "Pop-up Space for a New Collection", ru: "Pop-up пространство для новой коллекции" } }, ar: "3/4", op: "right" }
      ],
      right: [
        { src: "assets/images/experience/retail/new/retail-new-03-sleep8.jpeg", caption: { brand: "SLEEP.8", desc: { en: "Turnkey Store Design · Portugal", ru: "Дизайн магазина под ключ · Португалия" } }, ar: "3/4", op: "center" }
      ]
    },
    // 1 large (left) + 1 small (right)
    {
      emphasis: "left",
      left: [
        { src: "assets/images/experience/retail/new/retail-new-04-rive-gauche.jpeg", caption: { brand: "RIVE GAUCHE", desc: { en: "Niche Perfumery Corner Design", ru: "Дизайн корнера нишевой парфюмерии" } }, ar: "3/4", op: "35% center" }
      ],
      right: [
        { src: "assets/images/experience/retail/new/retail-new-05-underline.jpeg", caption: { brand: "UNDERLINE", desc: { en: "Seasonal Window Display & Store Styling", ru: "Сезонное оформление витрин и пространства" } }, ar: "3/4", op: "45% center" }
      ]
    },
    // 1 small (left) + 1 large (right)
    {
      emphasis: "right",
      left: [
        { src: "assets/images/experience/retail/new/retail-new-06-ecco.jpeg", caption: { brand: "ECCO", desc: { en: "Entrance Display Design", ru: "Дизайн входной зоны" } }, ar: "1/1", op: "center" }
      ],
      right: [
        { src: "assets/images/experience/retail/new/retail-new-07-catcher.jpeg", caption: { brand: "CATCHER", desc: { en: "Turnkey Store Design", ru: "Дизайн магазина под ключ" } }, ar: "3/4", op: "center" }
      ]
    },

    { type: "cta" },

    // 1 large (left) + 2 small (right)
    {
      emphasis: "left",
      left: [
        { src: "assets/images/experience/retail/new/retail-new-08-ascona.jpeg", caption: { brand: "ASKONA", desc: { en: "Window Display Design", ru: "Дизайн витрины" } } }
      ],
      right: [
        { src: "assets/images/experience/retail/new/retail-new-09-moppi.jpeg", caption: { brand: "MOPPI", desc: { en: "Island Retail Corner Design", ru: "Дизайн островного retail-корнера" } }, ar: "3/4", op: "35% center" },
        { src: "assets/images/experience/retail/new/retail-new-10-albione.jpeg", caption: { brand: "ALBIONE", desc: { en: "Window Display Design", ru: "Дизайн витрины" } } }
      ]
    },
    // 2 small (left) + 1 large (right)
    {
      emphasis: "right",
      left: [
        { src: "assets/images/experience/retail/new/retail-new-11-ikea-popup.jpeg", caption: { brand: "IKEA · FLEX POP UP", desc: { en: "Modular Pop-up Retail Concept", ru: "Модульная pop-up retail-концепция" } }, ar: "3/4", op: "center" },
        { src: "assets/images/experience/retail/new/retail-new-12-underline.jpeg", caption: { brand: "UNDERLINE", desc: { en: "6,000 m² Fashion Retail Space", ru: "Fashion retail space · 6 000 м²" } }, ar: "3/4", op: "center" }
      ],
      right: [
        { src: "assets/images/experience/retail/new/retail-new-13-catcher.jpeg", caption: { brand: "CATCHER", desc: { en: "Turnkey Store Design", ru: "Дизайн магазина под ключ" } }, ar: "3/4", op: "35% center" }
      ]
    }
  ]
};
