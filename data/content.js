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
    en: { profile: "Profile", experience: "Experience", method: "Method", work: "Work With Me", backToExperience: "← Experience", backToProjects: "BACK TO PROJECTS PAGE", explore: "Explore:" },
    ru: { profile: "Профиль", experience: "Опыт", method: "Метод", work: "Работа со мной", backToExperience: "← Опыт", backToProjects: "НАЗАД К ПРОЕКТАМ", explore: "Другие направления:" }
  },

  profile: {
    en: {
      headlineWords: [
        { w: "I", accent: true }, { w: "SEE", accent: true },
        { w: "WHAT", accent: false }, { w: "IT", accent: false },
        { w: "CAN", accent: true }, { w: "BECOME", accent: true }
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
        { w: "МОЖЕТ", accent: true }, { w: "СТАТЬ", accent: true }
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
      cta: "HOW I WORK WITH BRANDS"
    },
    ru: {
      lead: "Моя работа соединяет:",
      quote: "«Как стратегический партнёр, я вхожу в бренд в момент создания, перезапуска или трансформации. Вижу его потенциал, формирую стратегическое направление, выстраиваю систему, подключаю нужных специалистов и сопровождаю реализацию. Именно в такой роли я работаю с брендами уже более 20 лет — в разных масштабах, индустриях и бизнес-контекстах».",
      quoteAuthor: "Марина Казакова",
      cta: "HOW I WORK WITH BRANDS"
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
      tagline: {
        en: "Turning brand strategy into customer and commercial experience.",
        ru: "Переводим стратегию бренда в клиентский и коммерческий опыт."
      },
      media: { type: "slider", cover: "assets/images/experience/retail/cover.jpeg",
        images: Array.from({length: 15}, (_, i) => `assets/images/experience/retail/retail-${String(i+1).padStart(2,"0")}.jpeg`) },
      links: {
        // Website stays retail-design.ru in both languages — untouched by design.
        website: { label: "retail-design.ru", href: "https://retail-design.ru/" },
        portfolio: { label: { en: "Portfolio", ru: "Портфолио" }, href: "assets/downloads/retail-design-presentation.pdf" },
        collaboration: { label: { en: "Collaboration", ru: "Сотрудничество" }, href: { en: "https://wa.me/79166156441", ru: "https://t.me/marinakazakova_ru" } }
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
          "Я обладаю глубокой экспертизой в **Retail Design и Visual Merchandising**, соединяя стратегию бренда, бизнес-задачи, покупательское поведение и современные тенденции ритейла. Для меня магазин — это **дом бренда**: пространство, где стратегия превращается в клиентский опыт и коммерческий результат.",
          "За годы работы с международными компаниями и сетевыми брендами я сформировала собственный подход к разработке **Retail Design Concept** — от стратегической идеи и пути клиента до дизайн-системы, документации и реализации в действующей сети.",
          "В моём опыте — более **300 реализованных магазинов** и более **100 retail-стандартов и guidelines**: концепции магазинов, стандарты Visual Merchandising, дизайн витрин, merchandising books, POSM и форматы для разных типов торговых пространств."
        ]
      }
    },
    {
      id: "business",
      navLabel: "Business",
      title: "Business | Building from inside",
      tagline: {
        en: "Building brands, products, teams and businesses from the inside.",
        ru: "Создаю бренды, продукты, команды и бизнесы изнутри."
      },
      media: { type: "slider", cover: "assets/images/experience/business/cover.jpeg",
        images: Array.from({length: 17}, (_, i) => `assets/images/experience/business/business-${String(i+1).padStart(2,"0")}.jpeg`) },
      links: {
        website: { label: "retail-design.ru", href: null },
        portfolio: { label: "Portfolio", href: null },
        collaboration: { label: { en: "Collaboration", ru: "Сотрудничество" }, href: { en: "https://wa.me/79166156441", ru: "https://t.me/marinakazakova_ru" } },
        trainings: { label: { en: "Trainings", ru: "Обучение" }, href: "https://retail-design.ru/corporate_edu" }
      },
      clientsIntro: {
        en: "Over 10 years of developing M&W, we trained employees and independent professionals from the following companies:",
        ru: "За 10 лет развития M&W мы обучали сотрудников компаний и независимых специалистов из следующих брендов:"
      },
      clients: ["INGKA", "IKEA", "OFFPRICE", "H&M", "Inditex", "ZARA", "12 STOREEZ", "TSUM Moscow", "United Colors of Benetton", "21 Shop", "Helly Hansen", "Debenhams", "Спортмастер", "Gloria Jeans", "BAON", "Intimissimi", "Calzedonia", "Clarks", "Ralf Ringer", "Stenders", "ALLSAINTS", "LYYK TEAM", "KIXBOX", "Fred Perry", "Albione", "BASK Kids", "COZY HOME", "TOGAS", "KARE Design"],
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
          "Я развивала бизнес и его услуги, формировала и усиливала команду, выстраивала клиентский сервис и управляла полным циклом проектов. В **Woodi Bureau** мы создали более **300 retail design-проектов**, участвовали в открытиях магазинов в России, Европе и странах СНГ и разрабатывали стандартизированные retail-концепции для крупных сетей. В **M&W** я создавала индивидуальные и корпоративные образовательные программы для **500+ студентов и 100+ корпоративных клиентов**.",
          "С 2014 по 2025 год оба проекта внесли вклад в развитие индустрии **Retail Design, Visual Merchandising и Visual Communications**."
        ]
      }
    },
    {
      id: "brands",
      navLabel: "Brands",
      title: "Brands | From vision to reality",
      tagline: {
        en: "Strategic partnership with founders — from an initial vision to a working brand ecosystem.",
        ru: "Стратегическое партнёрство с фаундерами — от первоначального видения до работающей экосистемы бренда."
      },
      media: { type: "slider", cover: "assets/images/experience/brands/cover.jpeg", images: [] },
      links: {
        website: null,
        portfolio: { label: "Portfolio", href: null },
        collaboration: { label: { en: "Collaboration", ru: "Сотрудничество" }, href: { en: "https://wa.me/79166156441", ru: "https://t.me/marinakazakova_ru" } },
        // Second, equal-weight entry point — same pill styling as the
        // other functional links, not emphasized over Collaboration.
        strategicSession: { label: "STRATEGIC SESSION", href: "strategic-session/index.html" }
      },
      clients: [],
      en: {
        body: [
          "I join projects as a **Strategic Brand Partner**. Bringing together strategic thinking, creative expertise and experience in leading teams, I help founders **move from an initial brand vision to its full expression in the market**.",
          "Vision · Strategy · Positioning · Product · Identity · Experience · Communication · Activation",
          "I build the brand ecosystem, bring together the right specialists and guide implementation — maintaining a clear strategic logic at every stage."
        ]
      },
      ru: {
        body: [
          "Я вхожу в проекты как **Strategic Brand Partner**. Соединяя стратегическое мышление, креативную экспертизу и опыт управления командами, я помогаю фаундеру пройти путь **от первоначального видения бренда до его полноценного проявления на рынке**.",
          "Vision · Strategy · Positioning · Product · Identity · Experience · Communication · Activation",
          "Я формирую экосистему бренда, собираю необходимых специалистов и сопровождаю реализацию — сохраняя единую стратегическую логику на всех этапах."
        ]
      }
    },
    {
      id: "films",
      navLabel: "Films",
      title: "Films | Documentary for Brands",
      tagline: {
        en: "We translate brand meaning into documentary cinema and support its further development.",
        ru: "Переводим смыслы бренда в документальное кино и сопровождаем его дальнейшее развитие."
      },
      media: { type: "video", video: null },
      links: {
        website: { label: "futurefilm.foundation", href: "https://futurefilm.foundation/" },
        portfolio: { label: "Portfolio", href: "assets/downloads/film-presentation.pdf" },
        collaboration: { label: "Collaboration", href: { en: "https://wa.me/79166156441", ru: "https://t.me/marinakazakova_ru" } }
      },
      clients: [],
      en: {
        body: [
          "I began my career within international corporations — **IKEA, Esprit, Banana Republic / Gap Inc.** — which gave me a deep understanding of how large companies work from the inside: how culture, processes, leadership, brand and relationships with audiences are built.",
          "Today, this experience comes together with my role as **Brand Strategist** at **Future Film Foundation**. Together with director Igor Shmelev and strategy coach Ivan Ershov, ~~we created a branded documentary film format at the intersection of Documentary Filmmaking × Brand Strategy × Founder Storytelling = HERO FILM.~~",
          "My role is to connect the story of the founder with the brand, the time we live in and its audience, and turn it into the narrative foundation of the film.",
          "This is how a corporate narrative becomes a **festival film** — at once a **corporate legacy, reputational asset and brand asset**, with the potential for an international festival life."
        ]
      },
      ru: {
        body: [
          "Я начинала карьеру внутри международных корпораций — **IKEA, Esprit, Banana Republic / Gap Inc.** — и хорошо понимаю, как устроены большие компании изнутри: как формируются культура, процессы, лидерство, бренд и отношения с аудиторией.",
          "Сегодня этот опыт соединяется с моей ролью **Brand Strategist** в **Future Film Foundation**. Вместе с режиссёром Игорем Шмелёвым и strategy coach Иваном Ершовым ~~мы создали формат брендового документального кино на пересечении Documentary Filmmaking × Brand Strategy × Founder Storytelling = HERO FILM.~~",
          "Моя роль — соединить историю основателя с брендом, временем и аудиторией и превратить её в фабулу фильма.",
          "Так корпоративный нарратив становится **festival film** — одновременно **корпоративным наследием, репутационным и бренд-активом** с потенциалом международной фестивальной жизни."
        ]
      }
    }
  ],

  // Films page's own "Studio" section (js/films.js's fff-studio block) —
  // was static English-only markup in films/index.html with the client's
  // Russian text hardcoded straight into it (showing on the EN site too).
  filmsStudio: {
    en: {
      eyebrow: "Studio",
      title: "We build brand reputation through documentary film.",
      lead: "We bring together brand strategy, documentary filmmaking and film development strategy, turning the story of the founder and the company into a long-term reputational asset.",
      col1Title: "Brand Story",
      col1Text: "For us, this is the instrument: a powerful human story that reveals the brand and the founder’s personality and becomes the foundation of the film narrative.",
      col2Title: "Reputation",
      col2Text: "For us, this is the result: trust, recognition and long-term brand value built through the life and distribution of the film.",
      col3Title: "Film Development Strategy",
      col3Text: "For us, this is the mechanism: a service that uses international distribution and targeted film activation to reach different audiences and improve the brand’s commercial performance."
    },
    ru: {
      eyebrow: "Studio",
      title: "Мы создаём репутацию бренда через документальное кино.",
      lead: "Соединяем бренд-стратегию, документальное кино и стратегию развития фильма, превращая историю основателя и компании в долгосрочный репутационный актив.",
      col1Title: "Brand Story",
      col1Text: "Для нас это — инструмент: сильная человеческая история, которая раскрывает бренд и личность основателя, идёт в фабулу фильма.",
      col2Title: "Репутация",
      col2Text: "Для нас — это результат: доверие, узнаваемость и долгосрочная ценность бренда, созданная во время проката фильма.",
      col3Title: "Стратегия развития фильма",
      col3Text: "Для нас это — механизм: услуга, в рамках которой международная дистрибуция и активация фильма на разные аудитории повышает коммерческие показатели бренда."
    }
  },

  // Films page's "3 disciplines" intro line (fff-disciplines section) —
  // same static-Russian-only bug as filmsStudio above.
  filmsDisciplines: {
    en: {
      intro: "FFF operates at the intersection of three disciplines. This is where films are created that capture audience interest, strengthen brand reputation and value, and preserve its story for future generations."
    },
    ru: {
      intro: "FFF работает на пересечении трёх дисциплин. Именно здесь рождаются фильмы, способные вызывать интерес аудитории, усиливать репутацию и ценность бренда и сохранять его историю для будущих поколений."
    }
  },

  // Films hero tagline, "Studio & Foundation" transition line, and the
  // "Watch Our Films" section title — same static-Russian-only bug as
  // filmsStudio/filmsDisciplines above. SCROLL stays English by design.
  filmsHero: {
    en: { tagline: "Cinema about the future unfolding now." },
    ru: { tagline: "Кино о настоящем будущем." }
  },
  filmsTransition: {
    en: { body: "We are a documentary film Studio and Foundation exploring people, culture and phenomena shaping the future." },
    ru: { body: "Мы — Студия и Фонд документального кино о людях, культуре и явлениях, влияющих на будущее." }
  },
  filmsFilms: {
    en: { title: "Watch Our Films" },
    ru: { title: "Смотреть наши фильмы" }
  },

  brandEcosystem: {
    title: "BRAND ECOSYSTEM DESIGN™",
    triptych: [
      "assets/images/brand-ecosystem/triptych-01-brand.jpeg",
      "assets/images/brand-ecosystem/triptych-02-system.jpeg",
      "assets/images/brand-ecosystem/triptych-03-growth.jpeg"
    ],
    en: {
      intro: "I see a brand as an integrated system in which business strategy, product, customer experience, communication, the digital environment, identity, creative direction, physical space, team and processes work together as one — driving the brand’s growth and development. ~~My method:~~"
    },
    ru: {
      intro: "Я рассматриваю бренд как целостную систему, в которой бизнес-стратегия, продукт, клиентский опыт, коммуникация, digital-среда, айдентика, creative direction и физическое пространство - работают как единое целое, создавая рост и развитие бренда. ~~Мой метод ниже:~~"
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
        title: "Visual Foundation",
        en: "The brand’s visual platform, communication, and its digital and physical environments.",
        ru: "Визуальная платформа бренда: айдентика, коммуникация, дизайн онлайн и офлайн каналов."
      },
      {
        title: "Product Experience",
        en: "Create the brand’s product logic: what we sell, to whom, in what format and at what price.",
        ru: "Формирование продуктовой логики бренда: что мы продаём, кому, в каком формате и по какой цене."
      },
      {
        title: "Market Launch",
        en: "Bringing the brand, product or renewed brand system to market through online and offline channels, communication, content, partnerships and activations.",
        ru: "Вывод бренда, продукта или обновлённой системы на рынок через online и offline-каналы, коммуникации, контент, партнёрства и активации."
      }
    ]
  },

  workTogether: {
    eyebrow: { en: "WAYS TO WORK TOGETHER", ru: "ФОРМАТЫ СОТРУДНИЧЕСТВА" },
    cta: "LET'S TALK",
    services: [
      {
        title: { en: "STRATEGIC CONSULTING", ru: "СТРАТЕГИЧЕСКИЙ КОНСАЛТИНГ" },
        titleLink: "strategic-session/index.html",
        timing: { en: "4 HOURS", ru: "4 ЧАСА" },
        body: {
          en: "A strategic session for a specific business request. For situations when a founder needs a strong outside perspective, a decision and direction.",
          ru: "Стратегическая сессия для конкретного бизнес-запроса. Для ситуаций, когда фаундеру нужен сильный внешний взгляд, решение и направление."
        },
        sectionLabel: { en: "POSSIBLE REQUESTS", ru: "ВОЗМОЖНЫЕ ЗАПРОСЫ" },
        // Each request pill reveals its real underlying ask on hover/tap.
        items: [
          {
            title: { en: "SCALE REVENUE", ru: "МАСШТАБИРОВАТЬ ДОХОД" },
            hover: {
              en: "For service founders — to rethink the business model, product and their role in order to grow through strategy.",
              ru: "Для владельцев услуг — пересобрать бизнес-модель, продукт и свою роль, чтобы расти за счёт стратегии."
            }
          },
          {
            title: { en: "RELAUNCH THE BRAND", ru: "ПЕРЕЗАПУСТИТЬ БРЕНД" },
            hover: {
              en: "For brands that have outgrown their current positioning, product and visual expression.",
              ru: "Для брендов, которые выросли из своего текущего позиционирования, продукта и визуального образа."
            }
          },
          {
            title: { en: "TRANSFORM RETAIL", ru: "ТРАНСФОРМИРОВАТЬ РИТЕЙЛ" },
            hover: {
              en: "For companies that need to rethink customer experience and the retail concept.",
              ru: "Для компаний, которым нужно переосмыслить клиентский опыт и ритейл-концепт."
            }
          }
        ]
      },
      {
        title: { en: "STRATEGIC BRAND PARTNERSHIP", ru: "СТРАТЕГИЧЕСКОЕ БРЕНД-ПАРТНЁРСТВО" },
        titleLink: "brands/index.html",
        timing: { en: "6+ MONTHS", ru: "ОТ 6 МЕСЯЦЕВ" },
        body: {
          en: "Long-term work with the brand, the owner and the team. I join the project as a strategic brand partner and guide the brand from strategy through to execution, building the contractor team we need and moving into delivery together.",
          ru: "Долгосрочная работа с брендом, собственником и командой. Я вхожу в проект как strategic brand partner и сопровождаю бренд от стратегии до реализации, формирую необходимую команду подрядчиков и вместе идём в работу."
        },
        sectionLabel: { en: "COOPERATION STRATEGY", ru: "МЕТОД СОТРУДНИЧЕСТВА" },
        steps: ["BRAND AUDIT", "BRAND FOUNDATION", "VISUAL FOUNDATION", "PRODUCT EXPERIENCE", "MARKET DEVELOPMENT", "SMM", "RETAIL DESIGN"]
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
   * STRATEGIC SESSION — new standalone page (/strategic-session/).
   * UX-skeleton pass per storyboard: hero + how-it-works + results +
   * approach + an interactive Strategic Brief (you -> context -> request
   * -> review -> thanks). All copy here is explicitly draft/working text
   * (client's own words) — will be edited in a later pass, same as the
   * visual character of the approach/brief blocks. See js/strategic-
   * session.js for how each piece is rendered.
   */
  strategicSession: {
    en: {
      title: "STRATEGIC SESSION",
      body: "You come to me with a specific business, brand, retail or product request. Before the session, I immerse myself in the context. During the session, we unpack the challenge and identify the direction. After the session, I consolidate everything into my vision, strategy and a concrete next step.",
      cta: "START YOUR BRIEF",

      howItWorks: {
        label: "HOW IT WORKS",
        stages: [
          {
            index: "01",
            title: "PREPARATION",
            duration: "2 DAYS",
            icons: ["web", "instagram", "docs", "ai", "materials"],
            text: "You send me your request, context and materials. Before we meet, I study your brand, business, market and the current state of the project."
          },
          {
            index: "02",
            title: "STRATEGIC SESSION",
            duration: "3 HOURS",
            icons: ["zoom", "timer"],
            text: "We unpack the request, ask questions, test assumptions, reflect, discuss and define the strategic direction together."
          },
          {
            index: "03",
            title: "PACKAGING THE RESULT",
            duration: "3 DAYS",
            icons: ["pdf", "result", "zoom"],
            text: "After the session, I analyse the material and the solutions we shaped, and put together the strategic vision, concept and next step."
          }
        ]
      },

      results: {
        label: "WHAT CAN COME OUT OF IT",
        title: "ONE SESSION. DIFFERENT RESULTS",
        columns: [
          {
            title: "PRODUCT",
            text: "If you came with a product or service request, the result can be a product concept, a clearly articulated value, the customer flow, the offer architecture, packaging and a direction for further development."
          },
          {
            title: "BRAND",
            text: "If you came with a brand request or a relaunch, the result can be the brand's strategic direction, positioning, product logic, communication and clarity on the next stage of development."
          },
          {
            title: "RETAIL",
            text: "If you own a store or are developing a retail concept, the result can be a concept for the space, the store's role within the brand, the customer journey, experience principles and a direction for implementation."
          }
        ]
      },

      approach: {
        title: "MY APPROACH TO THE SESSION",
        text: "A strategic session is not a project with several rounds of revisions. You are not buying a document. You are buying my time, experience, thinking and full attention to your request. The result is my professional vision of what your brand, product, business or retail could become. Further development and implementation can become the next stage of our work.",
        resultPlaceholder: "WHAT A RESULT CAN LOOK LIKE",
        transition: "YOUR TURN"
      },

      brief: {
        title: "STRATEGIC BRIEF",
        intro: "Let's formulate what you actually want to solve **in the session**.",
        steps: ["YOU", "CONTEXT", "REQUEST"],
        step1: {
          heading: "YOU",
          subheading: "BRAND OR CONSULTANT",
          name: "Name",
          email: "Email",
          company: "Company / brand",
          role: "What best describes you?",
          roleOptions: ["Founder", "Marketing / brand lead", "Consultant / agency", "Other"],
          next: "CONTINUE"
        },
        step2Links: {
          heading: "CONTEXT",
          website: "Website",
          instagram: "Instagram",
          linkedin: "LinkedIn",
          otherLinks: "Other relevant links",
          next: "CONTINUE",
          back: "BACK"
        },
        step2Question: {
          heading: "What's currently happening in your business, brand, product or project?",
          label: "CONTEXT",
          placeholder: "Tell me a bit about the context...",
          typeTab: "⌨ TYPE",
          speakTab: "🎤 SPEAK",
          startHint: "Tap the mic to start speaking",
          recordHint: "Tap again to stop",
          micUnsupported: "Voice input isn't supported in this browser — please type your answer instead.",
          micError: "Couldn't access the microphone. Please check your browser permissions or type your answer.",
          next: "CONTINUE",
          back: "BACK"
        },
        step3: {
          heading: "WHAT DO YOU ACTUALLY WANT TO SOLVE?",
          hint: "Don't try to make it sound “strategic.” Just tell me what you want to understand, change or solve.",
          label: "FORMULATE YOUR REQUEST",
          placeholder: "I want to understand...",
          typeTab: "⌨ TYPE",
          speakTab: "🎤 SPEAK",
          startHint: "Tap the mic to start speaking",
          recordHint: "Tap again to stop",
          micUnsupported: "Voice input isn't supported in this browser — please type your answer instead.",
          micError: "Couldn't access the microphone. Please check your browser permissions or type your answer.",
          next: "REVIEW",
          back: "BACK"
        },
        review: {
          heading: "YOUR STRATEGIC BRIEF",
          name: "Name",
          company: "Company / brand",
          links: "Links",
          context: "Context",
          request: "Your request",
          edit: "EDIT",
          send: "SEND TO MARINA",
          sending: "SENDING…",
          error: "Something went wrong. Please try again.",
          retry: "TRY AGAIN",
          requiredError: "Please fill in your name and email to continue."
        },
        thankYou: {
          heading: "THANK YOU.",
          text: "I'll personally look at your request. If I feel a strategic session is the right format for what you need, I'll get back to you with a next step."
        }
      }
    },
    ru: {
      title: "ЗАПРОС НА СЕССИЮ",
      body: "Вы приходите ко мне с конкретным бизнес-, бренд-, ритейл- или продуктовым запросом. До сессии я погружаюсь в контекст, во время сессии мы разбираем задачу и ищем направление, а после сессии я собираю всё в своё видение, стратегию и конкретный шаг.",
      cta: "СФОРМУЛИРОВАТЬ ЗАПРОС",

      howItWorks: {
        label: "КАК ЭТО РАБОТАЕТ?",
        stages: [
          {
            index: "01",
            title: "ПОДГОТОВКА",
            duration: "2 ДНЯ",
            icons: ["web", "instagram", "docs", "ai", "materials"],
            text: "Вы отправляете мне запрос, контекст и материалы. До нашей встречи я изучаю ваш бренд, бизнес, рынок и текущее состояние проекта."
          },
          {
            index: "02",
            title: "СТРАТЕГИЧЕСКАЯ СЕССИЯ",
            duration: "3 ЧАСА",
            icons: ["zoom", "timer"],
            text: "Мы разбираем запрос, задаём вопросы, проверяем предположения, рефлексируем, обсуждаем и вместе определяем стратегическое направление."
          },
          {
            index: "03",
            title: "УПАКОВКА РЕЗУЛЬТАТА",
            duration: "3 ДНЯ",
            icons: ["pdf", "result", "zoom"],
            text: "После встречи я анализирую материал и разработанные решения, собираю стратегическое видение, концепцию и следующий шаг."
          }
        ]
      },

      results: {
        label: "ЧТО МОЖЕТ СТАТЬ РЕЗУЛЬТАТОМ",
        title: "ОДНА СЕССИЯ. РАЗНЫЕ РЕЗУЛЬТАТЫ",
        columns: [
          {
            title: "ПРОДУКТ",
            text: "Если вы пришли с запросом на продукт или услугу, результатом может стать концепция продукта, сформулированная ценность, customer flow, архитектура предложения, упаковка и направление дальнейшего развития."
          },
          {
            title: "БРЕНД",
            text: "Если вы пришли с запросом на бренд или его перезапуск, результатом может стать стратегическое направление бренда, позиционирование, продуктовая логика, коммуникация и понимание следующего этапа развития."
          },
          {
            title: "РИТЕЙЛ",
            text: "Если вы владелец магазина или развиваете retail-концепцию, результатом может стать концепция пространства, роль магазина внутри бренда, customer journey, принципы опыта и направление дальнейшей реализации."
          }
        ]
      },

      approach: {
        title: "МОЙ ПОДХОД К ПРОВЕДЕНИЮ СЕССИИ",
        text: "Стратегическая сессия — это не проект с несколькими раундами правок. Вы покупаете не документ. Вы покупаете моё время, опыт, мышление и полное включение в ваш запрос. Результат — моё профессиональное видение того, чем может стать ваш бренд, продукт, бизнес или ритейл. Дальнейшая разработка и имплементация могут стать следующим этапом нашей работы.",
        resultPlaceholder: "КАК МОЖЕТ ВЫГЛЯДЕТЬ РЕЗУЛЬТАТ",
        transition: "ВАША ОЧЕРЕДЬ"
      },

      brief: {
        title: "STRATEGIC BRIEF",
        intro: "Давайте сформулируем, что именно вы хотите решить **на сессии**.",
        steps: ["ВЫ", "КОНТЕКСТ", "ЗАПРОС"],
        step1: {
          heading: "ВЫ",
          subheading: "БРЕНД ИЛИ КОНСУЛЬТАНТ",
          name: "Имя",
          email: "Email",
          company: "Компания / бренд",
          role: "Кем вы являетесь?",
          roleOptions: ["Основатель", "Маркетинг / бренд-лид", "Консультант / агентство", "Другое"],
          next: "ПРОДОЛЖИТЬ"
        },
        step2Links: {
          heading: "КОНТЕКСТ",
          website: "Website",
          instagram: "Instagram",
          linkedin: "LinkedIn",
          otherLinks: "Другие релевантные ссылки",
          next: "ПРОДОЛЖИТЬ",
          back: "НАЗАД"
        },
        step2Question: {
          heading: "Что сейчас происходит в вашем бизнесе, бренде, продукте или проекте?",
          label: "КОНТЕКСТ",
          placeholder: "Расскажите немного о контексте...",
          typeTab: "⌨ НАПИСАТЬ",
          speakTab: "🎤 СКАЗАТЬ ГОЛОСОМ",
          startHint: "Нажмите на микрофон, чтобы начать говорить",
          recordHint: "Нажмите ещё раз, чтобы остановить",
          micUnsupported: "Голосовой ввод не поддерживается в этом браузере — пожалуйста, напишите ответ.",
          micError: "Не удалось получить доступ к микрофону. Проверьте разрешения браузера или напишите ответ.",
          next: "ПРОДОЛЖИТЬ",
          back: "НАЗАД"
        },
        step3: {
          heading: "ЧТО ВЫ НА САМОМ ДЕЛЕ ХОТИТЕ РЕШИТЬ?",
          hint: "Не пытайтесь формулировать это «стратегически». Просто расскажите, что вы хотите понять, изменить или решить.",
          label: "СФОРМУЛИРУЙТЕ СВОЙ ЗАПРОС",
          placeholder: "Я хочу понять...",
          typeTab: "⌨ НАПИСАТЬ",
          speakTab: "🎤 СКАЗАТЬ ГОЛОСОМ",
          startHint: "Нажмите на микрофон, чтобы начать говорить",
          recordHint: "Нажмите ещё раз, чтобы остановить",
          micUnsupported: "Голосовой ввод не поддерживается в этом браузере — пожалуйста, напишите ответ.",
          micError: "Не удалось получить доступ к микрофону. Проверьте разрешения браузера или напишите ответ.",
          next: "К ПРОВЕРКЕ",
          back: "НАЗАД"
        },
        review: {
          heading: "ВАШ STRATEGIC BRIEF",
          name: "Имя",
          company: "Компания / бренд",
          links: "Ссылки",
          context: "Контекст",
          request: "Ваш запрос",
          edit: "РЕДАКТИРОВАТЬ",
          send: "ОТПРАВИТЬ МАРИНЕ",
          sending: "ОТПРАВКА…",
          error: "Что-то пошло не так. Попробуйте ещё раз.",
          retry: "ПОПРОБОВАТЬ СНОВА",
          requiredError: "Пожалуйста, укажите имя и email, чтобы продолжить."
        },
        thankYou: {
          heading: "СПАСИБО.",
          text: "Я лично посмотрю ваш запрос. Если я пойму, что стратегическая сессия — подходящий формат для вашей задачи, я свяжусь с вами и предложу следующий шаг."
        }
      }
    }
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
    // Icon-only social row (js/footer.js), same on all 5 pages.
    social: [
      { id: "telegram", href: "https://t.me/marinakazakova_ru" },
      { id: "whatsapp", href: "https://wa.me/79166156441" },
      { id: "instagram", href: "https://www.instagram.com/marina_kazakova/" },
      { id: "linkedin", href: "https://www.linkedin.com/in/marina-kazakova-b45a9a302" }
    ]
  }
};
