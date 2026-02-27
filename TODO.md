# TODO Roadmap (UG-SOC Portfolio)

This is the current pending list in logical implementation order.
Total pending tasks: **15**

## P0 - Immediate Fixes
- [ ] **Fix Education PDF preview modal**
  - Ensure all files open inline reliably (spaces/special chars).
  - Validate `Open in New Tab` and `Download` actions for each document.
  - Add fallback message when browser blocks embedded PDF.
  - Files: `index.html`, `js/enhancements.js`, `css/style.css`

- [ ] **Fix Continuous Learning card**
  - Rebuild card to the approved compact design and keep readability in dark/light themes.
  - Remove duplicated information between card and modal.
  - Files: `index.html`, `css/style.css`, `js/enhancements.js`

- [ ] **Command Palette expansion**
  - Add missing section/option entries for new Education and document actions.
  - Add direct actions where useful (open section, open doc, quick links).
  - Files: `js/CommandPalette.js`

## P1 - High Impact
- [ ] **Resume Console PDF preview modal**
  - Make Resume preview behave like cert preview (inline modal preview + open/download actions).
  - Keep layout responsive for tablet/laptop.
  - Files: `index.html`, `js/enhancements.js`, `css/style.css`

- [ ] **Fix About section bullet artifacts**
  - Remove stray characters and normalize list rendering.
  - Files: `index.html`, `css/style.css`

- [ ] **Mobile projects “Show more” memory**
  - Persist expanded/collapsed state.
  - Files: `js/enhancements.js`

- [ ] **Live demo link health check**
  - Validate and repair broken routes.
  - Files: `index.html`

- [ ] **Accessibility pass**
  - Add/verify `aria-label`s and keyboard focus states.
  - Files: `index.html`, `css/style.css`

## P2 - Credibility + Content
- [ ] **Project outcome bullets**
  - Add measurable impact for each project.
  - Files: `index.html`

- [ ] **Proof metrics refresh**
  - Replace generic metrics with evidence-driven numbers.
  - Files: `index.html`

- [ ] **Resume section microcopy**
  - Add concise value statement.
  - Files: `index.html`

## P3 - SEO + Performance
- [ ] **Canonical + OG URL cleanup**
  - Ensure absolute production URLs.
  - Files: `index.html`

- [ ] **Image optimization pass**
  - Add `loading=\"lazy\"` and explicit dimensions where missing.
  - Files: `index.html`

- [ ] **Font preload cleanup**
  - Preload only primary fonts.
  - Files: `index.html`

## P4 - UX Polish
- [ ] **Tag consistency**
  - Normalize naming/casing (e.g., PowerShell).
  - Files: `index.html`

- [ ] **Touch/hover parity**
  - Ensure hover-only interactions have mobile/touch fallback.
  - Files: `js/enhancements.js`, `css/style.css`
