/**
 * Bilingual site content (EN / RU), sourced verbatim from "Тексты на сайт.docx".
 * Titles, taglines, credentials and CTA labels are kept in English in both
 * languages — this mirrors the client's own document, which keeps these
 * exact elements in English under both the RU and EN sections.
 *
 * Inline emphasis uses **double asterisks**; rendered as <strong> at runtime
 * (see js/i18n.js -> renderInline). Bold placement follows the source PDF
 * mockup (02_EXPERIENCE_PANELS.pdf), mirrored consistently across languages.
 */
window.SITE_CONTENT = {
  nav: {
    en: { profile: "Profile", experience: "Experience", method: "Method", work: "Work With Me" },
    ru: { profile: "Профиль", experience: "Опыт", method: "Метод", work: "Работа со мной" }
  },

  profile: {
    en: {
      headlineWords: [
        { w: "I", accent: true }, { w: "SEE", accent: true },
        { w: "WHAT", accent: false }, { w: "IT", accent: false },
        { w: "CAN", accent: true }, { w: "BECOME.", accent: true }
      ],
      name: "Marina Kazakova",
      roles: "Strategic Brand Advisor · Brand Strategist · Retail Experience Expert",
      bioBold: "22+ years in brand development, customer experience and business transformation.",
      bioText: "Working internationally with founders, companies and creative & cultural projects.",
      cta: "LET'S TALK"
    },
    ru: {
      headlineWords: [
        { w: "Я", accent: true }, { w: "ВИЖУ,", accent: true },
        { w: "ЧЕМ", accent: false }, { w: "ЭТО", accent: false },
        { w: "МОЖЕТ", accent: true }, { w: "СТАТЬ.", accent: true }
      ],
      name: "Марина Казакова",
      roles: "Strategic Brand Advisor · Brand Strategist · Retail Experience Expert",
      bioBold: "22+ лет в развитии брендов, клиентском опыте и трансформации бизнеса.",
      bioText: "Работаю на международном рынке с основателями, компаниями, креативными и культурными проектами.",
      cta: "LET'S TALK"
    }
  },

  experienceIntro: {
    eyebrow: "Experience",
    formula: "Brand × Business × Product × Experience × Communication × Creative Direction × Retail",
    en: {
      lead: "My work connects:",
      quote: "“As a Brand Strategist and strategic partner, I step into a brand at moments of creation, relaunch or transformation. I see its potential, define the strategic direction, build the right system, bring in the specialists needed and guide the process through implementation. I have been working with brands in this role for more than 20 years — across different scales, industries and business contexts.”",
      quoteAuthor: "Marina Kazakova",
      cta: "LET'S TALK"
    },
    ru: {
      lead: "Моя работа соединяет:",
      quote: "«Как Brand Strategist и strategic partner, я вхожу в бренд в момент создания, перезапуска или трансформации. Вижу его потенциал, формирую стратегическое направление, выстраиваю систему, подключаю нужных специалистов и сопровождаю реализацию. Именно в такой роли я работаю с брендами уже более 20 лет — в разных масштабах, индустриях и бизнес-контекстах».",
      quoteAuthor: "Марина Казакова",
      cta: "LET'S TALK"
    }
  },

  /**
   * Experience directions — data-driven so BRANDS media / FILMS video can be
   * filled in later without touching layout or JS.
   */
  experienceDirections: [
    {
      id: "retail",
      navLabel: "Retail",
      title: "Retail | Brand into Experience",
      tagline: "Turning brand strategy into customer and commercial experience.",
      media: { type: "slider", cover: "assets/images/experience/retail/cover.jpeg",
        images: Array.from({length: 15}, (_, i) => `assets/images/experience/retail/retail-${String(i+1).padStart(2,"0")}.jpeg`) },
      links: {
        website: { label: "retail-design.ru", href: "https://retail-design.ru/" },
        portfolio: { label: "Portfolio", href: "assets/downloads/retail-design-presentation.pdf" },
        collaboration: { label: "Collaboration", href: "https://t.me/marinakazakova_ru" }
      },
      clients: ["IKEA", "MEGA", "Underline", "Fujifilm", "Tele2", "Askona", "L’Etoile", "Adidas Originals", "Reebok Classic", "ECCO", "G-STAR RAW", "No One", "Simple Wine", "U-BOAT", "EURODECOR", "Moppi", "Lamoda", "Gloria Jeans", "Yandex Market", "Alisa AI", "Sleep.8"],
      en: {
        body: [
          "I have deep expertise in **Retail Design and Visual Merchandising**, bringing together brand strategy, business objectives, customer behaviour and current retail design trends. For me, a store is **the home of the brand** — the place where strategy becomes customer experience and commercial performance.",
          "Through years of working with international companies and retail networks, I have developed my own approach to creating a **Retail Design Concept** — from the strategic idea and customer journey to the design system, documentation and implementation across an existing store network.",
          "My experience includes more than **300 implemented stores** and over **100 retail standards and guidelines**: store concepts, VM standards, window design, merchandising books, POSM and formats for different types of retail environments."
        ]
      },
      ru: {
        body: [
          "Я обладаю глубокой экспертизой в **Retail Design и Visual Merchandising** и умею соединять стратегию бренда, бизнес-задачи, покупательское поведение и тренды ритейл дизайна. Для меня магазин — это **дом бренда**: пространство, где стратегия превращается в клиентский опыт и коммерческие показатели.",
          "За годы работы с международными компаниями и сетевыми брендами я сформировала собственный метод разработки **Retail Design Concept** — от стратегической идеи и customer journey до дизайн-системы, документации и имплементации в действующую сеть.",
          "В моём опыте — более **300 реализованных магазинов** и более **100 retail-стандартов и guidelines**: концепции магазинов, VM standards, window design, merchandising books, POSM и форматы для различных типов торговых пространств."
        ]
      }
    },
    {
      id: "business",
      navLabel: "Business",
      title: "Business | Building from inside",
      tagline: "Building brands, products, teams and businesses from the inside.",
      media: { type: "slider", cover: "assets/images/experience/business/cover.jpeg",
        images: Array.from({length: 17}, (_, i) => `assets/images/experience/business/business-${String(i+1).padStart(2,"0")}.jpeg`) },
      links: {
        website: { label: "retail-design.ru", href: "https://retail-design.ru/" },
        portfolio: { label: "Portfolio", href: "assets/downloads/retail-design-presentation.pdf" },
        collaboration: { label: "Collaboration", href: "https://t.me/marinakazakova_ru" }
      },
      clients: [],
      en: {
        body: [
          "For almost 10 years, I ran my own **Retail Design Bureau, Woodi**, and the **M&W** educational platform — one of the first professional schools in Russia specialising in Visual Merchandising and Retail Design.",
          "I developed the business and its services, built and strengthened the team, established a high standard of client service, and managed projects from end to end. At **Woodi Bureau**, we created more than **300 retail design projects**, supported store openings across Russia, Europe and the CIS, and developed standardised retail concepts for large store networks. At **M&W**, I created individual and corporate educational programmes for more than **500 students and 100+ corporate clients**.",
          "From 2014 to 2025, both projects contributed to the development of the **Retail Design, Visual Merchandising and Visual Communications** industry."
        ]
      },
      ru: {
        body: [
          "Около 10 лет я управляла собственным **Retail Design Bureau Woodi** и образовательной платформой **M&W** — одной из первых профессиональных школ в России в области Visual Merchandising и Retail Design.",
          "Я развивала бизнес и услуги, формировала и усиливала команду, выстраивала клиентский сервис и управляла полным циклом проектов. В рамках **Woodi Bureau** мы создали более **300 retail design-проектов**, участвовали в открытиях магазинов в России, Европе и странах СНГ и разрабатывали стандартизированные retail-концепции для крупных сетей. В рамках **M&W** я создавала индивидуальные и корпоративные образовательные программы: **500+ студентов и 100+ корпоративных программ**.",
          "С 2014 по 2025 год оба проекта были частью развития индустрии **Retail Design, Visual Merchandising и Visual Communications**."
        ]
      }
    },
    {
      id: "brands",
      navLabel: "Brands",
      title: "Brands | From vision to reality",
      tagline: "Strategic partnership with founders — from an initial vision to a working brand ecosystem.",
      media: { type: "slider", cover: "assets/images/experience/brands/cover.jpeg", images: [] },
      links: {
        website: null,
        portfolio: { label: "Portfolio", href: null },
        collaboration: { label: "Collaboration", href: "https://t.me/marinakazakova_ru" }
      },
      clients: [],
      en: {
        body: [
          "Today, I work with projects as a **Strategic Brand Advisor**. Bringing together strategic thinking, creative expertise and experience in leading teams, I help founders **move from an initial brand vision to its full expression in the market**.",
          "Vision → Strategy → Positioning → Product → Identity → Experience → Communication → Activation",
          "I build the brand ecosystem, bring together the right specialists and guide implementation — maintaining a clear strategic logic at every stage."
        ]
      },
      ru: {
        body: [
          "Сегодня я вхожу в проекты как **Strategic Brand Advisor**. Соединяя стратегическое мышление, креативную экспертизу и опыт управления командами, я помогаю founder’у пройти путь **от первоначального видения бренда до его полноценного проявления на рынке**.",
          "Vision → Strategy → Positioning → Product → Identity → Experience → Communication → Activation",
          "Я формирую экосистему бренда, собираю необходимых специалистов и сопровождаю реализацию — сохраняя единую стратегическую логику на всех этапах."
        ]
      }
    },
    {
      id: "films",
      navLabel: "Films",
      title: "Films | Documentary for Brands",
      tagline: "Turning brand meaning into documentary cinema.",
      media: { type: "video", video: null },
      links: {
        website: { label: "futurefilm.foundation", href: "https://futurefilm.foundation/" },
        portfolio: { label: "Portfolio", href: "assets/downloads/film-presentation.pdf" },
        collaboration: { label: "Collaboration", href: "https://t.me/marinakazakova_ru" }
      },
      clients: [],
      en: {
        body: [
          "I began my career within international corporations — **IKEA, Banana Republic / Gap Inc., and Esprit** — which gave me a deep understanding of how large organisations work from the inside: how culture, processes, leadership, brand and relationships with audiences are built.",
          "Today, this experience comes together with my role as **Brand Strategist** at **Future Film Foundation**. Together with director Igor Shmelev and strategy coach Ivan Ershov, we created a format of branded documentary filmmaking at the intersection of **Documentary Filmmaking × Brand Strategy × Founder Storytelling**.",
          "My role is to uncover the **Big Idea**, connect the story of the founder and the company with the brand, its audience and the time we live in, and turn that idea into the foundation of the film.",
          "This is how a corporate narrative becomes a **festival film** — both a **legacy, reputational asset and brand asset**, with the potential for international festival distribution."
        ]
      },
      ru: {
        body: [
          "Я начинала карьеру внутри международных корпораций — **IKEA, Banana Republic / Gap Inc., Esprit** — и хорошо понимаю, как устроены большие компании изнутри: как формируются культура, процессы, лидерство, бренд и отношения с аудиторией.",
          "Сегодня этот опыт соединяется с моей ролью **Brand Strategist** в **Future Film Foundation**. Вместе с режиссёром Игорем Шмелёвым и strategy coach Иваном Ершовым мы создали формат брендового документального кино на пересечении **Documentary Filmmaking × Brand Strategy × Founder Storytelling**.",
          "Моя роль — найти **Big Idea**, связать историю основателя и компании с брендом, временем и аудиторией и превратить её в основу фильма.",
          "Так корпоративный нарратив становится **festival film** — одновременно **наследием, репутационным и бренд-активом** с потенциалом международной фестивальной жизни."
        ]
      }
    }
  ],

  brandEcosystem: {
    title: "BRAND ECOSYSTEM DESIGN™",
    triptych: [
      "assets/images/brand-ecosystem/triptych-01-brand.jpeg",
      "assets/images/brand-ecosystem/triptych-02-system.jpeg",
      "assets/images/brand-ecosystem/triptych-03-growth.jpeg"
    ],
    en: {
      intro: "I see a brand as an integrated system in which business strategy, product, customer experience, communication, the digital environment, identity, creative direction, physical space, team and processes work together as one — driving the brand’s growth and development. My method:"
    },
    ru: {
      intro: "Я рассматриваю бренд как целостную систему, в которой бизнес-стратегия, продукт, клиентский опыт, коммуникация, digital-среда, айдентика, creative direction, физическое пространство, команда и процессы работают как единое целое, создавая рост и развитие бренда. Мой метод ниже:"
    },
    method: [
      {
        title: "Strategic Audit",
        en: "An assessment of the brand’s current position, potential, limitations and opportunities for growth.",
        ru: "Аудит текущего состояния бренда, его потенциала, ограничений и точек роста."
      },
      {
        title: "Brand Foundation",
        en: "Positioning, brand architecture, audience, product logic, key messages and strategic direction.",
        ru: "Позиционирование, архитектура бренда, аудитория, продуктовая логика, ключевые сообщения и стратегическое направление."
      },
      {
        title: "Identity & Visual",
        en: "The brand’s visual platform, communication, and its digital and physical environments.",
        ru: "Визуальная платформа бренда, коммуникация, digital- и physical-среда бренда."
      },
      {
        title: "Market Launch",
        en: "Bringing the brand, product or renewed brand system to market through online and offline channels, communication, content, partnerships and activations.",
        ru: "Вывод бренда, продукта или обновлённой системы на рынок через online и offline-каналы, коммуникации, контент, партнёрства и активации."
      },
      {
        title: "Brand Development",
        en: "Long-term strategic guidance focused on developing the product, communications, customer experience and new opportunities for growth.",
        ru: "Стратегическое сопровождение, развитие продукта, коммуникаций, клиентского опыта и новых точек роста."
      }
    ]
  },

  workTogether: {
    eyebrow: "WAYS TO WORK TOGETHER",
    cta: "LET'S TALK",
    services: [
      {
        title: "Brand Strategy & Advisory",
        en: "Strategic partnership with the founder / owner and team: creating, relaunching and developing the brand.",
        ru: "Стратегическое партнёрство с founder / собственником и командой: создание, перезапуск и развитие бренда."
      },
      {
        title: "Retail Design & Experience Advisory",
        en: "Expert advisory in Retail Design & Visual Merchandising.",
        ru: "Экспертное сопровождение в области Retail Design и Visual Merchandising."
      }
    ],
    credentials: [
      { bold: "22+ years", rest: "of experience" },
      { bold: "500+", rest: "projects" },
      { bold: "10 years", rest: "as Founder & CEO" },
      { bold: "International", rest: "brand experience" },
      { bold: "Working", rest: "internationally" }
    ]
  },

  /**
   * Only Telegram has a confirmed URL from the client. Email / Instagram /
   * LinkedIn were requested in the footer spec but no real handles were
   * provided — add them here (same {label, href} shape) once available;
   * js/main.js renders whatever this array contains.
   */
  footer: {
    en: { copy: "© Marina Kazakova · Bangkok · Working internationally" },
    ru: { copy: "© Марина Казакова · Бангкок · Работает на международном рынке" },
    links: [
      { label: "Telegram", href: "https://t.me/marinakazakova_ru" }
    ]
  }
};
