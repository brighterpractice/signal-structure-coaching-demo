# Deployment

Align Therapy Group is a static Astro site deployed from [align-therapy-demo](https://github.com/align-therapy-demo) to Cloudflare Pages.

## Cloudflare Pages project

Connect the GitHub repository in **Workers & Pages → Create → Pages → Connect to Git** and use:

- Production branch: `main`
- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: repository root
- Node.js: `22.12.0` or newer, matching `package.json`
- Environment variables: none currently required

Do not add the Cloudflare adapter, Pages Functions, Wrangler, or SSR for the current site. Astro produces the complete static deployment in `dist/`.

## Deployment workflow

Pull requests and non-production branches should receive Cloudflare preview deployments. Review the preview URL before merging. A merge to `main` triggers the production build and deployment.

Cloudflare Pages keeps previous deployments. If a production issue is discovered, select the last known-good production deployment in the Pages dashboard and use **Rollback to this deployment**. Follow with a source fix on `main` so the repository and live deployment remain aligned.

## Custom domain and DNS

Add `align.brightersites.app` under the Pages project's **Custom domains** settings and follow Cloudflare's DNS prompts. The site configuration, canonical URLs, sitemap, and robots file assume this production host:

`https://align.brightersites.app`

Use the configured `brightersites.app` subdomain as the single canonical host. Confirm Cloudflare's automatic HTTP-to-HTTPS redirect is active and test the custom domain before announcing launch.

Security and cache response headers live in `public/_headers`. After the first deployment, inspect representative HTML, `/_astro/` assets, images, `robots.txt`, and `sitemap.xml` in the browser network panel or with `curl -I` to confirm the rules are active.

## Search Console

1. Add a Google Search Console **Domain property** for `align.brightersites.app`.
2. Copy the verification TXT value supplied by Google; do not create one manually.
3. Add that TXT record in Cloudflare DNS and complete verification in Search Console.
4. Submit `https://align.brightersites.app/sitemap.xml`.
5. Inspect the homepage and representative service pages after deployment, then request indexing when appropriate.
6. Confirm the canonical URLs, sitemap URLs, and indexed host all agree.

DNS verification is preferred because it covers the domain and its protocol/subdomain variants without adding a verification tag to the site.

## Future integrations

- Appointment destination: set `appointmentExternalUrl` in `src/data/site.ts`.
- Client Portal destination: set `clientPortalExternalUrl` in `src/data/site.ts`.
- Analytics: retain the existing `data-track` attributes as the event vocabulary. Add a small provider integration in the shared layout only after the provider, privacy configuration, and identifier are confirmed. Never send query strings, user-entered text, or clinical information in event payloads. Update the Content Security Policy in `public/_headers` only for the exact provider origins required.

External appointment and portal links intentionally open in the same tab. If that policy changes, add `rel="noopener noreferrer"` whenever `target="_blank"` is introduced.

## Pre-deployment checks

Run:

```bash
npm run build
git diff --check
```

Confirm the 404 page, legal pages, nine service pages, sitemap, robots file, official branding, Jordan clinician profile, appointment fallback, and Client Portal fallback are present in `dist/`.
