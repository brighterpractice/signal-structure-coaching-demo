# Deployment

Signal & Structure Coaching is a fictional Brighter Sites portfolio demo built as a static Astro site.

The intended production host is:

https://signal-structure.brightersites.app

The demo is intentionally excluded from search indexing.

## Cloudflare Pages

When the GitHub repository and Cloudflare Pages project are created, use:

- Production branch: main
- Framework preset: Astro
- Build command: npm run build
- Build output directory: dist
- Root directory: repository root
- Node.js: 22.12.0 or newer, matching package.json
- Environment variables: none currently required

Do not add the Cloudflare adapter, Pages Functions, Wrangler, or SSR for the current site. Astro produces the complete static deployment in dist.

## Deployment workflow

Preview deployments should be reviewed before production changes are merged to main.

Cloudflare Pages retains previous deployments. If a production issue is found, roll back to the last known-good deployment and follow with a source fix so the repository and live site remain aligned.

## Domain and DNS

Add signal-structure.brightersites.app as the Pages custom domain and follow Cloudflare's DNS prompts.

The Astro configuration, canonical URLs, sitemap, and robots configuration assume:

https://signal-structure.brightersites.app

Confirm HTTPS and the custom hostname before considering deployment complete.

Security and cache response headers live in public/_headers.

## Search indexing

This is a portfolio demonstration site, not an operating coaching business.

Normal pages intentionally render noindex, follow.

The 404 page renders noindex, nofollow.

Do not request indexing or submit this demo for ordinary Google search visibility. If that policy changes later, review the robots metadata, sitemap strategy, canonical URLs, and demo disclosures together.

## Analytics

Retain the existing data-track attributes and shared Brighter Sites analytics collector unless the analytics contract is intentionally changed across the demo system.

The internal analytics vocabulary includes appointment-oriented event names for compatibility with the shared collector even though the visible coaching CTA says "Book a discovery call."

Do not send form contents, URL query strings, sensitive personal information, or coaching details in analytics event payloads.

## Discovery-call destination

The current discovery-call CTA uses appointmentUrl in src/data/site.ts and points to /contact/.

If a real external scheduling destination is added later, update that destination deliberately and verify the required external-link behavior.

## Pre-deployment checks

Run npm run quality and git diff --check before deployment.

Confirm that:

- all 14 HTML pages build successfully
- all normal pages remain noindex, follow
- the 404 remains noindex, nofollow
- all four coaching detail pages are generated
- the About, Services, How Coaching Works, Packages, FAQ, Contact, Privacy, and Terms pages are present
- sitemap and robots files build correctly
- no inherited therapy-demo branding or routes remain
- the fictional-business disclosure remains present
