/* ========================================================================
   BRANDS direction page — data for the shared intro (js/direction-page.js)
   AND the custom method/workflow system below it (js/brands.js). Text is
   taken verbatim from the client's own BRANDS page mockup — not rewritten
   or shortened.
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
        goal: "Понять, где бренд находится сейчас, какой у него потенциал и куда ему двигаться дальше.",
        scope: "Research · Founder unpacking · Brand analysis · Audience · Competitors · Market · Customer Experience · Growth opportunities",
        result: "“Brand Audit & Strategic Roadmap” — текущая позиция бренда, точки роста, стратегические гипотезы, приоритетные аудитории, направления развития продукта, roadmap дальнейшей работы.",
        team: "Marina Kazakova — Brand Strategist / Strategic Lead · Analyst / Industry Expert when required",
        timing: "3 недели"
      },
      layout: "row3",
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
        { id: "03", label: "Strategy & Road Map" }
      ]
    },
    {
      id: "brand-foundation",
      index: "1",
      title: "Brand Foundation",
      meta: {
        goal: "Сформулировать Бренд, его смыслы, позиционирование и место на рынке.",
        scope: "Brand vision & Positioning · Brand Idea · Values · Narrative · Audience · Brand Architecture · Tone of Voice · Communication Strategy · Founder Positioning",
        result: "“Brand Foundation & Brand Strategy” — единая стратегическая система, на которой дальше строится продукт, визуальный язык, коммуникация и customer experience.",
        team: "Marina Kazakova — Brand Strategist · Founder / Key Team · Industry Expert when required",
        timing: "3-6 недель"
      },
      layout: "cascade4",
      workflow: [
        { id: "1.1", label: "" },
        { id: "1.2", label: "" },
        { id: "1.3", label: "" },
        { id: "1.4", label: "" }
      ]
    },
    {
      id: "visual-foundation",
      index: "2",
      title: "Visual Foundation",
      meta: {
        goal: "Перевести стратегию бренда в узнаваемый визуальный и коммуникационный язык.",
        scope: "Visual Direction · Brand Identity · Art Direction · Graphic System · Photography · Video · Content System · Digital / Web Direction",
        result: "“Visual Brand System” — brand ID, photo content, SMM visual guide, web visual.",
        team: "Marina Kazakova — Brand Identity & Creative Lead · Photographer / Set Designer · Web / UX-UI Designer · Stylist / Makeup Artist when required",
        timing: "4-6 недель"
      },
      layout: "row4",
      workflow: [
        { id: "2.1", label: "" },
        { id: "2.2", label: "" },
        { id: "2.3", label: "" },
        { id: "2.4", label: "", open: true }
      ]
    },
    {
      id: "product-experience",
      index: "3",
      title: "Product Experience",
      meta: {
        goal: "Перевести стратегию в реальный продукт и клиентский опыт, который можно увидеть и купить.",
        scope: "Product Strategy · Product Portfolio · Offer · Packaging · Pricing logic · Customer Journey · Service · Digital Experience · Retail / Offline Experience",
        result: "“Product & Customer Experience” System — продуктовая система, предложение, упаковка, точки контакта, customer journey, retail / digital experience.",
        team: "Marina Kazakova — Strategic & Creative Lead · Product / Graphic Designer · Web Team · Retail Designer · Production partners · other specialists depending on product",
        timing: "6-8 недель (зависит от продукта)"
      },
      layout: "row4",
      workflow: [
        { id: "3.1", label: "" },
        { id: "3.2", label: "" },
        { id: "3.3", label: "" },
        { id: "3.4", label: "", open: true }
      ]
    },
    {
      id: "market-development",
      index: "4",
      title: "Market Development",
      meta: {
        goal: "Вывести систему бренда на рынок и перевести стратегию в устойчивое развитие.",
        scope: "Digital & SMM Launch · PR · Collaborations · Partnerships · Events · Influencers · Brand Activations · Growth",
        result: "“Market Activation & Development” — запуск, маркет-коммуникационная система, партнёрства, активации, развитие каналов, долгосрочный подход к росту.",
        team: "Marina Kazakova — Strategic & Creative Lead · SMM Manager · Digital Marketer · Target Specialist · SEO Specialist + Web Team · PR Manager · Influencer Manager · Event Producer · Photographer / Videographer · Graphic Designer · Retail Designer",
        timing: "2+ месяца (зависит от стратегии)"
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
