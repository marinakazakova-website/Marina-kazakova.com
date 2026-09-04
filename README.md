# Marina-kazakova.com

Personal website of Marina Kazakova — Strategic Brand Advisor & Brand Strategist. Brand strategy, business, experience, retail and creative direction.

Bilingual (EN default / RU), one-page, editorial/portfolio design implemented from `01_MAIN_WEBSITE.pdf` and `02_EXPERIENCE_PANELS.pdf`. Static site — no build step, no framework.

## Running locally

```
python3 -m http.server 8000
```

then open `http://localhost:8000`.

## Structure

```
index.html              Page markup (all sections)
css/                     tokens.css → variables; base.css → reset; one file per section/component
js/
  content.js is in data/ — see below
  i18n.js                language switching (EN default, no page reload)
  nav.js                 sticky nav, smooth scroll, mobile menu
  opening-animation.js   hero headline reveal
  slider.js              reusable arrow-controlled image slider
  experience.js          typographic direction nav + panels (Retail/Business/Brands/Films)
  method.js              interactive Brand Ecosystem Design method list
  work-together.js       final CTA card
  main.js                bootstraps everything on DOMContentLoaded
data/content.js           ALL bilingual text + Experience direction data (data-driven)
assets/
  images/profile/         hero + portrait photography
  images/backgrounds/     shared B&W backgrounds (experience panels, work-together)
  images/experience/{retail,business,brands,films}/   per-direction slider media
  images/brand-ecosystem/ triptych (Brand → System → Growth)
  logos/, icons/, downloads/, video/
```

## Adding content later

**BRANDS media** — drop images into `assets/images/experience/brands/` and add their
paths to the `images` array of the `brands` entry in `data/content.js`
(`experienceDirections`). Add a presentation PDF to `assets/downloads/` and set
`links.portfolio.href` on the same entry — the "Portfolio" link activates automatically.

**FILMS video** — in `data/content.js`, set the `films` entry's `media.video` to one of:

```js
media: { type: "video", video: { type: "mp4", src: "assets/video/your-file.mp4" } }
media: { type: "video", video: { type: "vimeo", id: "XXXXXXXX" } }
media: { type: "video", video: { type: "youtube", id: "XXXXXXXXXXX" } }
```

No layout or JS changes needed — `js/experience.js` renders whichever source is set.

## Editing text

All copy lives in `data/content.js`, in English and Russian side by side. Update the
matching `en` / `ru` value — nothing else needs to change.
