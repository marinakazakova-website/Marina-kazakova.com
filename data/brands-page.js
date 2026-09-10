/* ========================================================================
   BRANDS direction page — data for the shared intro (js/direction-page.js)
   AND the custom method/workflow system below it (js/brands.js). Text is
   taken verbatim from the client's own BRANDS page mockup — not rewritten
   or shortened.

   i18n: each stage's `meta.goal/result/timing` is the explanatory prose
   that actually changes with the language switch, so each is
   `{ en, ru }`; `scope`/`team` are the client's own English terms
   (industry scope tags, team-role titles) and stay a single string
   used in both languages, per her mockup. Method nav, workflow step
   labels (RESEARCH/UNPACKING/...) and both CTAs are English-only by
   design (js/brands.js) — they're the method's own international
   interface, not translated content.
   ======================================================================== */
window.DIRECTION_PAGE_DATA = {
  directionId: "brands",
  clientLogos: [],
  rows: []
};

/* Method sequence — doubles as: (1) a one-time reveal animation right
   under the intro text, and (2) the anchor nav for the five stage
   sections below (click -> smooth-scroll, active stage highlighted on
   scroll). One row, one component — not duplicated. */
window.BRANDS_PAGE_DATA = {
  method: [
    { id: "brand-audit", label: "Brand Audit" },
    { id: "brand-foundation", label: "Brand Foundation" },
    { id: "visual-foundation", label: "Visual Foundation" },
    { id: "product-experience", label: "Product Experience" },
    { id: "market-development", label: "Market Development" }
  ],

  tagline: "Different Brands. One Strategic System.",

  stages: [
    {
      id: "brand-audit",
      index: "0",
      title: "Brand Audit",
      meta: {
        goal: {
          en: "Understand where the brand stands today, what potential it holds, and where it should move next.",
          ru: "Понять, где бренд находится сейчас, какой у него потенциал и куда ему двигаться дальше."
        },
        // Scope/team lists are the client's own terms — already English in
        // her source mockup, unchanged in either language (see i18n note
        // in the header comment above).
        scope: "Research · Founder unpacking · Brand analysis · Audience · Competitors · Market · Customer Experience · Growth opportunities",
        result: {
          en: "“Brand Audit & Strategic Roadmap” — the brand's current position, growth points, strategic hypotheses, priority audiences, product development directions, and a roadmap for the work ahead.",
          ru: "“Brand Audit & Strategic Roadmap” — текущая позиция бренда, точки роста, стратегические гипотезы, приоритетные аудитории, направления развития продукта, roadmap дальнейшей работы."
        },
        team: "Marina Kazakova — Brand Strategist / Strategic Lead · Analyst / Industry Expert when required",
        // No outside specialists at this stage — shown as a plain dash.
        outsource: null,
        timing: { en: "3 weeks", ru: "3 недели" }
      },
      // All three steps in one row (see .brands-grid--row3wide) —
      // Strategy & Road Map's column is proportionally wider since its
      // graphic is native 16:9 against the other two's 4:3.
      layout: "row3wide",
      workflow: [
        {
          id: "01",
          label: "Research",
          // Vertical looping word cycle — visualizes gathering/analyzing
          // all incoming brand information. Exact words/order per brief,
          // nothing added.
          visual: "audit-cycle",
          words: [
            "Brand", "Founder", "Product", "Website", "Socials", "Audience",
            "Market", "Competitors", "Experience", "Content", "Visuals", "Insights"
          ]
        },
        {
          id: "02",
          label: "Unpacking",
          // Looping cycle through real Zoom-call screenshots (full
          // gallery view, not cropped to one face), framed by two
          // two-line corner words — visualizes founder unpacking through
          // interview (brand unpacking starts with unpacking the
          // founder). Per client's reference composition: black canvas,
          // accent-purple Montserrat corners, grayscale center. Images
          // pre-processed to a uniform frame (see
          // assets/images/brands/unpacking/).
          visual: "interview-collage",
          corners: { tl: ["Founder", "Brand"], br: ["Interview", "Unpacking"] },
          images: [
            "assets/images/brands/unpacking/unpacking-01.jpg",
            "assets/images/brands/unpacking/unpacking-02.jpg",
            "assets/images/brands/unpacking/unpacking-03.jpg",
            "assets/images/brands/unpacking/unpacking-04.jpg",
            "assets/images/brands/unpacking/unpacking-05.jpg",
            "assets/images/brands/unpacking/unpacking-06.jpg",
            "assets/images/brands/unpacking/unpacking-07.jpg",
            "assets/images/brands/unpacking/unpacking-08.jpg",
            "assets/images/brands/unpacking/unpacking-09.jpg",
            "assets/images/brands/unpacking/unpacking-10.jpg",
            "assets/images/brands/unpacking/unpacking-11.jpg"
          ]
        },
        {
          id: "03",
          label: "Strategy & Road Map",
          // INFORMATION -> CONNECTIONS -> DIRECTION -> ROADMAP -> STRATEGY,
          // one continuous 20s loop: chaotic dashed lines carrying the
          // Research word-set converge into a single line, straighten
          // into a horizontal roadmap, pick up the 5 Development Strategy
          // stage names, a few short detail lines and neutral visual-
          // reference frames, then a final accent pulse sweeps the whole
          // route before it resolves to the title card and loops.
          visual: "strategy-roadmap"
        }
      ]
    },
    {
      id: "brand-foundation",
      index: "1",
      title: "Brand Foundation",
      meta: {
        goal: {
          en: "Define the Brand — its meaning, positioning, and place in the market.",
          ru: "Сформулировать Бренд, его смыслы, позиционирование и место на рынке."
        },
        scope: "Brand vision & Positioning · Brand Idea · Values · Narrative · Audience · Brand Architecture · Tone of Voice · Communication Strategy · Founder Positioning",
        result: {
          en: "“Brand Foundation & Brand Strategy” — a single strategic system that the product, visual language, communication and customer experience are then built on.",
          ru: "“Brand Foundation & Brand Strategy” — единая стратегическая система, на которой дальше строится продукт, визуальный язык, коммуникация и customer experience."
        },
        team: "Marina Kazakova — Brand Strategist · Founder / Key Team · Industry Expert when required",
        outsource: null,
        timing: { en: "3-6 weeks", ru: "3-6 недель" }
      },
      layout: "cascade4",
      // Client-supplied vertical collage frames (one per sub-step),
      // same visual logic as her mockup — used as-is, not rebuilt.
      workflow: [
        {
          id: "1.1",
          label: "Founder Identity",
          visual: "image",
          image: "assets/images/brands/foundation/founder-identity.jpg",
          // Case tag — the project's own name, not translated.
          caseTag: "Bogdan Kanuka Artist",
          caption: {
            en: "Researching the founder’s expertise, journey and role → defining their distinctive strength.",
            ru: "Исследование экспертизы, пути и роли фаундера → формулирование его ключевой силы."
          }
        },
        {
          id: "1.2",
          label: "Brand Platform",
          visual: "image",
          image: "assets/images/brands/foundation/brand-platform.jpg",
          caseTag: "Retail Design | Online Education Platform",
          caption: {
            en: "Defining the brand’s meaning, vision, positioning, values, audience and architecture.",
            ru: "Определение смысла, видения, позиционирования, ценностей, аудитории и архитектуры бренда."
          }
        },
        {
          id: "1.3",
          label: "Brand Narrative",
          visual: "image",
          image: "assets/images/brands/foundation/brand-narrative.jpg",
          caseTag: "PORTAL | MultiSpace Amsterdam",
          caption: {
            en: "Building the central brand story, key messages and tone of voice.",
            ru: "Разработка центральной истории бренда, ключевых сообщений и tone of voice."
          }
        },
        {
          id: "1.4",
          label: "Creative Direction",
          visual: "image",
          image: "assets/images/brands/foundation/creative-direction.jpg",
          caseTag: "Homeless | Creative Women Accessories",
          caption: {
            en: "Translating strategy and narrative into a visual direction for the brand and founder.",
            ru: "Перевод стратегии и нарратива в визуальное направление бренда и фаундера."
          }
        }
      ]
    },
    {
      id: "visual-foundation",
      index: "2",
      title: "Visual Foundation",
      meta: {
        goal: {
          en: "Translate the brand strategy into a recognizable visual and communication language.",
          ru: "Перевести стратегию бренда в узнаваемый визуальный и коммуникационный язык."
        },
        scope: "Visual Direction · Brand Identity · Art Direction · Graphic System · Photography · Video · Content System · Digital / Web Direction",
        // Already English in the client's own mockup — same in both languages.
        result: "“Visual Brand System” — brand ID, photo content, SMM visual guide, web visual.",
        team: "Marina Kazakova — Brand Identity & Creative Lead · Photographer / Set Designer · Web / UX-UI Designer · Stylist / Makeup Artist when required",
        outsource: {
          tags: ["Graphic Designer", "Photographer", "Set Designer", "Muah Artist", "Web Designer"],
          note: "depending on project"
        },
        timing: { en: "4-6 weeks", ru: "4-6 недель" }
      },
      layout: "row4",
      // Client-supplied mockups, one per sub-step — used as-is (see
      // css/brands.css's #visual-foundation override: a uniform 4:5
      // window since the four source images arrive at different
      // aspect ratios).
      workflow: [
        {
          id: "01",
          label: "Brand ID",
          visual: "image",
          image: "assets/images/brands/visual-foundation/brand-id.jpg",
          caseTag: "MOV | Fashion Brand",
          caption: {
            en: "Development of the brand’s visual identity system: logo, typography, colour palette, key visuals and brand applications.",
            ru: "Разработка визуальной системы бренда: логотип, типографика, цветовая палитра, key visuals и основные носители."
          }
        },
        {
          id: "02",
          label: "Photo Content",
          visual: "image",
          image: "assets/images/brands/visual-foundation/photo-content.jpg",
          caseTag: "Bogdan Kanuka | Artist",
          caption: {
            en: "Development and production of founder or product photo content — from creative concept and art direction to the final shoot.",
            ru: "Разработка и создание фотоконтента фаундера или продукта — от креативной концепции и art direction до финальной съёмки."
          }
        },
        {
          id: "03",
          label: "SMM Guide",
          visual: "image",
          image: "assets/images/brands/visual-foundation/smm-guide.jpg",
          caseTag: "Bogdan Kanuka | Artist",
          caption: {
            en: "Development of a social media visual system: content structure, templates, layouts, feed logic and application rules.",
            ru: "Разработка визуальной системы социальных медиа: структура контента, шаблоны, макеты, логика ленты и правила применения."
          }
        },
        {
          id: "04",
          label: "Web Design",
          visual: "image",
          image: "assets/images/brands/visual-foundation/web-design.jpg",
          caseTag: "Brand Ecosystem Design",
          caption: {
            en: "Translating the brand system into a digital experience through web design, interface logic and visual communication.",
            ru: "Перевод системы бренда в digital-среду через веб-дизайн, логику интерфейса и визуальную коммуникацию."
          }
        }
      ]
    },
    {
      id: "product-experience",
      index: "3",
      title: "Product Experience",
      meta: {
        goal: {
          en: "Shape the brand’s product logic: what we sell, to whom, in what format and at what price — and package it into a ready offer.",
          ru: "Сформировать продуктовую логику бренда: что мы продаём, кому, в каком формате и по какой цене — и упаковать это в готовое предложение."
        },
        scope: "Product Strategy · Product Portfolio · Offer · Packaging · Pricing logic · Customer Journey · Service · Digital Experience · Retail / Offline Experience",
        result: {
          en: "“Product & Customer Experience” System — the product system, offer, packaging, touchpoints, customer journey, retail / digital experience.",
          ru: "“Product & Customer Experience” System — продуктовая система, предложение, упаковка, точки контакта, customer journey, retail / digital experience."
        },
        team: "Marina Kazakova — Strategic & Creative Lead · Product / Graphic Designer · Web Team · Retail Designer · Production partners · other specialists depending on product",
        outsource: {
          tags: ["Product Specialist", "Graphic Designer", "Web Designer", "Production Partners"],
          note: "depending on product"
        },
        timing: { en: "6-8 weeks (depends on the product)", ru: "6-8 недель (зависит от продукта)" }
      },
      layout: "row3",
      // Three structural system-diagrams (styled like Brand Audit's own
      // GIF-style visuals, not photo mockups) — one per sub-step. Each
      // carries a purple "Result" button (bottom-right, hover/focus
      // reveals the outcome) instead of a case tag, since these aren't
      // client project frames.
      workflow: [
        {
          id: "01",
          label: "Product Building",
          visual: "product-building",
          caption: {
            en: "Shaping the product: what the brand sells, to whom, in what format, what the product or service consists of, what the result is, and the cost or pricing.",
            ru: "Формирование продукта: что бренд продает, кому, в каком формате, из чего состоит продукт/услуга, что является результатом и стоимость или тарифы."
          },
          result: {
            en: "A finished product with a clear structure, composition, price and value for the customer.",
            ru: "Готовый продукт с понятной структурой, составом, ценой и ценностью для клиента."
          }
        },
        {
          id: "02",
          label: "Product Architecture",
          visual: "product-architecture",
          caption: {
            en: "Building the product system: how the brand’s different products connect — entry offers, core, premium — and launching new formats based on existing resources.",
            ru: "Построение продуктовой системы: как разные продукты бренда связаны между собой: входные предложения, основные, premium, и запуск новых форматов, основанных на базе существующих ресурсов."
          },
          result: {
            en: "A product line-up and the customer’s path through it.",
            ru: "Продуктовая линейка и путь клиента."
          }
        },
        {
          id: "03",
          label: "Product Experience",
          visual: "product-journey",
          caption: {
            en: "Launching and promoting the product: description, packaging, customer journey, key touchpoints, sales materials, web presentation and product communication.",
            ru: "Запуск и продвижение продукта: описание, упаковка, customer journey, ключевые точки контакта, sales materials, web presentation и коммуникация продукта."
          },
          result: {
            en: "A market-ready product experience, prepared for promotion.",
            ru: "Понятный рынку и готовый к продвижению продуктовый опыт."
          }
        }
      ]
    },
    {
      id: "market-development",
      index: "4",
      title: "Market Development",
      meta: {
        goal: {
          en: "Bring the brand system to market and turn the strategy into sustainable growth.",
          ru: "Вывести систему бренда на рынок и перевести стратегию в устойчивое развитие."
        },
        scope: "Digital & SMM Launch · PR · Collaborations · Partnerships · Events · Influencers · Brand Activations · Growth",
        result: {
          en: "“Market Activation & Development” — the launch, market-communication system, partnerships, activations, channel development, and a long-term approach to growth.",
          ru: "“Market Activation & Development” — запуск, маркет-коммуникационная система, партнёрства, активации, развитие каналов, долгосрочный подход к росту."
        },
        team: "Marina Kazakova — Strategic & Creative Lead · SMM Manager · Digital Marketer · Target Specialist · SEO Specialist + Web Team · PR Manager · Influencer Manager · Event Producer · Photographer / Videographer · Graphic Designer · Retail Designer",
        outsource: {
          tags: [
            "SMM Manager", "Digital Marketer", "Target Specialist", "SEO Specialist",
            "PR Manager", "Influencer Manager", "Photographer / Videographer",
            "Graphic Designer", "Retail Designer"
          ],
          note: "depending on strategy"
        },
        timing: { en: "2+ months (depending on strategy)", ru: "2+ месяца (зависит от стратегии)" }
      },
      layout: "row4",
      workflow: [
        { id: "4.1", label: "" },
        { id: "4.2", label: "" },
        { id: "4.3", label: "" },
        { id: "4.4", label: "", open: true }
      ]
    }
  ]
};
