# USR Advisory & Consulting Services — Website

A multi-page, static, GitHub Pages–compatible website for USR Advisory & Consulting Services — a research-led strategy and AI-enabled advisory practice.

## Structure
- `index.html` — Home
- `about.html` — About USR, founder background, philosophy
- `services.html` — Four core capabilities overview
  - `research-intelligence.html` — Research & Market Intelligence
  - `strategy-advisory.html` — Strategy & Business Advisory
  - `ai-technology-advisory.html` — AI & Technology Advisory
  - `business-intelligence.html` — Business Intelligence & Commercial Analysis
- `industries.html` — Sector context
- `insights.html` — Market/strategy/AI perspectives
- `case-studies.html` — Illustrative engagements (clearly labeled as illustrative, not real client work)
- `approach.html` — Methodology and engagement models
- `contact.html` — Enquiry / contact
- `styles.css` — Shared design system (navy / white / light grey, teal & gold accents)
- `script.js` — Mobile navigation toggle and dynamic footer year
- `assets/` — Logo assets and SVG favicon
- `robots.txt`, `sitemap.xml`, `CNAME` — SEO and GitHub Pages custom-domain files

## Publishing to GitHub Pages
1. Upload the contents of this ZIP to the root of your GitHub repository (keep `index.html` at the root).
2. In the repo Settings → Pages, set the source to the branch/root containing these files.
3. `CNAME` is already set to `usr-advisory.in` — keep your existing DNS records (A/ALIAS or CNAME to GitHub Pages) as they were; this file does not change DNS, only tells GitHub which custom domain to serve.

## Content notes
- The founder's prior professional experience (PwC, Grant Thornton, Acuity Knowledge Partners, Aranca, Infiniti Research) is presented explicitly as individual background, not as USR clients or partners.
- "Illustrative Engagements" on the case-studies page are example scenarios, not real client work — labeled as such throughout.
- No fabricated clients, revenue figures, testimonials, awards or statistics are used anywhere on the site.
- Business Intelligence & Commercial Analysis content is worded to avoid implying regulated investment, securities or financial-product advice.
- Contact details (`usr.advisory.consultancy@gmail.com`, `+91 82405 23227`) are carried over unchanged from the previous site.

## What changed from the previous version
The site was restructured from six service lines (including a regulated insurance/financial-advisory line via a third-party affiliation) down to four core pillars — Research & Market Intelligence, Strategy & Business Advisory, AI & Technology Advisory, and Business Intelligence & Commercial Analysis — to match the requested positioning as a boutique research, strategy and AI advisory practice. The previous insurance-advisory and generic "business growth support" pages were removed; if you want the insurance-advisory line kept as a separate offering, it can be reinstated as its own page.

## Technical
- Fully static, no backend or build step required.
- Responsive (desktop/tablet/mobile), semantic HTML, no unnecessary JS libraries.
- Open Graph tags, canonical URLs and basic JSON-LD (ProfessionalService) schema included for SEO.
