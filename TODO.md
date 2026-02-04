# TODO Roadmap (UG-SOC Portfolio)

This list reflects a fresh scan of the current site. Order is impact-first.

## Priority (High Impact)
- [ ] **Fix About section bullets** — Replace the inline “I” dots with proper list styling or remove the stray characters.  
  Files: `index.html`, `css/style.css`
- [ ] **Mobile projects memory** — Remember “Show more” state (localStorage) so users don’t re-expand every visit.  
  Files: `js/enhancements.js`
- [ ] **Project outcomes pass** — Add 1–2 impact bullets per project (time saved, throughput, error reduction).  
  Files: `index.html`
- [ ] **Live demo health check** — Verify each demo URL and fix broken routes or dead links.  
  Files: `index.html`
- [ ] **Accessibility sweep** — Add explicit `aria-label` on icon-only buttons and ensure focus styles for keyboard navigation.  
  Files: `index.html`, `css/style.css`

## Credibility + Clarity
- [ ] **Proof block refresh** — Replace vanity metrics with concrete, measurable wins (before/after).  
  Files: `index.html`
- [ ] **Add scoped highlights** — Small “Top 3” badge row (most-used tools, strongest skills, platforms).  
  Files: `index.html`
- [ ] **Resume CTA refinement** — Add 1-line context under Resume section title explaining value.  
  Files: `index.html`

## Performance + SEO
- [ ] **Add canonical + absolute OG URLs** — Use full URL for `og:url` and `og:image`.  
  Files: `index.html`
- [ ] **Lazy-load project thumbnails** — Add `loading="lazy"` + explicit `width/height` to thumbnails.  
  Files: `index.html`
- [ ] **Preload primary fonts** — Add `rel="preload"` for the 1–2 most used font files.  
  Files: `index.html`

## UX Polish
- [ ] **Project tag audit** — Ensure tag labels follow consistent casing (e.g., “PowerShell” vs “Powershell”).  
  Files: `index.html`
- [ ] **Section microcopy pass** — Add 1-line “why it matters” for Skills, Projects, Resume, and Terminal.  
  Files: `index.html`
- [ ] **Hover/tap parity** — Ensure popovers and hidden controls are usable on touch (add tap trigger or fallback).  
  Files: `js/enhancements.js`, `css/style.css`

## Content Expansion
- [ ] **Add 1–2 real case studies** — Replace placeholders with real screenshots + short narrative.  
  Files: `pages/case-studies.html`
- [ ] **Blog seed posts** — Add 2–3 real posts with dates and tags.  
  Files: `pages/blog.html`

