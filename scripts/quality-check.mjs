import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const canonicalOrigin = 'https://align.brightersites.app';

const failures = [];
const warnings = [];

const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function routeFromHtmlFile(file) {
  const rel = path.relative(dist, file).replaceAll(path.sep, '/');

  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404.html';

  if (rel.endsWith('/index.html')) {
    return `/${rel.slice(0, -'index.html'.length)}`;
  }

  return `/${rel}`;
}

function getAttr(tag, name) {
  const pattern = new RegExp(
    `\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`,
    'i'
  );
  const match = tag.match(pattern);
  return match ? (match[1] ?? match[2] ?? '') : null;
}

function getTitle(html) {
  return html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
}

function getMetaDescription(html) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of tags) {
    if ((getAttr(tag, 'name') ?? '').toLowerCase() === 'description') {
      return getAttr(tag, 'content') ?? '';
    }
  }

  return '';
}

function getCanonical(html) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];

  for (const tag of tags) {
    if ((getAttr(tag, 'rel') ?? '').toLowerCase() === 'canonical') {
      return getAttr(tag, 'href') ?? '';
    }
  }

  return '';
}

function isNoindex(html) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];

  return tags.some((tag) => {
    const name = (getAttr(tag, 'name') ?? '').toLowerCase();
    const content = (getAttr(tag, 'content') ?? '').toLowerCase();

    return name === 'robots' && content.includes('noindex');
  });
}

function normalizeInternalRoute(pathname) {
  if (pathname === '/') return '/';

  if (pathname.endsWith('/')) return pathname;

  const last = pathname.split('/').pop() ?? '';

  if (last.includes('.')) return pathname;

  return `${pathname}/`;
}

if (!fs.existsSync(dist)) {
  console.error('QUALITY CHECK FAILED: dist/ does not exist.');
  process.exit(1);
}

const htmlFiles = walk(dist).filter((file) => file.endsWith('.html'));
const pages = new Map();

for (const file of htmlFiles) {
  const route = routeFromHtmlFile(file);
  const html = fs.readFileSync(file, 'utf8');

  pages.set(route, {
    file,
    route,
    html,
    noindex: isNoindex(html),
    title: getTitle(html),
    description: getMetaDescription(html),
    canonical: getCanonical(html),
  });
}

const indexable = [...pages.values()].filter((page) => !page.noindex);

for (const page of pages.values()) {
  const h1Count = (page.html.match(/<h1\b/gi) ?? []).length;

  if (h1Count !== 1) {
    fail(`${page.route}: expected exactly one H1; found ${h1Count}`);
  }

  const images = page.html.match(/<img\b[^>]*>/gi) ?? [];

  for (const img of images) {
    if (getAttr(img, 'alt') === null) {
      fail(`${page.route}: image missing alt attribute`);
    }
  }

  if (!page.noindex) {
    if (!page.title) {
      fail(`${page.route}: missing title`);
    }

    if (!page.description) {
      fail(`${page.route}: missing meta description`);
    }

    if (!page.canonical) {
      fail(`${page.route}: missing canonical URL`);
    } else {
      let canonical;

      try {
        canonical = new URL(page.canonical);
      } catch {
        fail(`${page.route}: invalid canonical URL ${page.canonical}`);
      }

      if (canonical) {
        if (canonical.origin !== canonicalOrigin) {
          fail(
            `${page.route}: canonical uses ${canonical.origin}, expected ${canonicalOrigin}`
          );
        }

        const expectedPath = normalizeInternalRoute(page.route);

        if (canonical.pathname !== expectedPath) {
          fail(
            `${page.route}: canonical path ${canonical.pathname} does not match ${expectedPath}`
          );
        }
      }
    }
  }
}

// Duplicate titles and descriptions.
for (const [field, label] of [
  ['title', 'title'],
  ['description', 'meta description'],
]) {
  const seen = new Map();

  for (const page of indexable) {
    const value = page[field]?.trim();
    if (!value) continue;

    if (seen.has(value)) {
      fail(
        `Duplicate ${label}: ${seen.get(value)} and ${page.route}`
      );
    } else {
      seen.set(value, page.route);
    }
  }
}

// Internal links and anchors.
for (const page of pages.values()) {
  const links = page.html.match(/<a\b[^>]*href=(?:"[^"]*"|'[^']*')[^>]*>/gi) ?? [];

  for (const tag of links) {
    const href = getAttr(tag, 'href');

    if (
      !href ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:')
    ) {
      continue;
    }

    let url;

    try {
      url = new URL(href, new URL(page.route, canonicalOrigin));
    } catch {
      fail(`${page.route}: malformed href "${href}"`);
      continue;
    }

    if (url.origin !== canonicalOrigin) {
      continue;
    }

    const targetRoute = normalizeInternalRoute(url.pathname);

    // Assets and other non-HTML resources are not page-link targets.
    const lastSegment = targetRoute.split('/').filter(Boolean).at(-1) ?? '';

    if (lastSegment.includes('.') && targetRoute !== '/404.html') {
      continue;
    }

    const target = pages.get(targetRoute);

    if (!target) {
      fail(`${page.route}: broken internal link → ${href}`);
      continue;
    }

    if (url.hash) {
      const id = decodeURIComponent(url.hash.slice(1));

      const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const idPattern = new RegExp(
        `\\bid\\s*=\\s*(?:"${escaped}"|'${escaped}')`,
        'i'
      );

      if (!idPattern.test(target.html)) {
        fail(`${page.route}: broken anchor → ${href}`);
      }
    }
  }
}

// Sitemap completeness.
const sitemapPath = path.join(dist, 'sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
  fail('Missing dist/sitemap.xml');
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');

  const sitemapRoutes = new Set(
    [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => {
      try {
        return normalizeInternalRoute(new URL(match[1]).pathname);
      } catch {
        fail(`Invalid sitemap URL: ${match[1]}`);
        return null;
      }
    }).filter(Boolean)
  );

  for (const page of indexable) {
    const route = normalizeInternalRoute(page.route);

    if (!sitemapRoutes.has(route)) {
      fail(`${page.route}: indexable page missing from sitemap`);
    }
  }

  for (const route of sitemapRoutes) {
    if (!pages.has(route)) {
      fail(`Sitemap contains route with no generated HTML page: ${route}`);
    }
  }
}

// Old EMDR URL should only survive as a redirect.
for (const page of pages.values()) {
  if (page.html.includes('/services/emdr-therapy/')) {
    fail(`${page.route}: contains obsolete /services/emdr-therapy/ URL`);
  }
}

// Catch obvious development placeholders in generated HTML.
for (const page of pages.values()) {
  if (/localhost|127\.0\.0\.1|example\.com/i.test(page.html)) {
    fail(`${page.route}: contains development/placeholder hostname`);
  }
}

// Analytics privacy guardrails.
const analyticsPath = path.join(
  root,
  'public/brighter-analytics.js'
);

if (!fs.existsSync(analyticsPath)) {
  fail('Missing analytics script.');
} else {
  const analytics = fs.readFileSync(
    analyticsPath,
    'utf8'
  );

  if (!/\bsession_id\b/.test(analytics)) {
    fail(
      'Analytics does not provide the collector-required session_id.'
    );
  }

  if (!/sessionStorage/.test(analytics)) {
    fail(
      'Analytics session identifier is not limited to sessionStorage.'
    );
  }

  if (/document\.cookie/.test(analytics)) {
    fail(
      'Analytics must not use cookies.'
    );
  }

  if (
    !/bs_analytics_session_v2/.test(analytics) ||
    !/bs_analytics_visitor_v2/.test(analytics)
  ) {
    fail(
      'Analytics v2 storage keys are missing.'
    );
  }

  if (
    !/visitor_id/.test(analytics) ||
    !/visitor_is_returning/.test(analytics)
  ) {
    fail(
      'Analytics v2 visitor payload fields are missing.'
    );
  }

  if (
    !/VISITOR_LIFETIME_MS/.test(analytics) ||
    !/180\s*\*\s*24\s*\*\s*60\s*\*\s*60\s*\*\s*1000/.test(
      analytics
    )
  ) {
    fail(
      'Analytics v2 fixed 180-day visitor expiration is missing.'
    );
  }

  if (!/crypto\.randomUUID\(\)/.test(analytics)) {
    fail(
      'Analytics identifiers must use crypto.randomUUID().'
    );
  }

  if (/Math\.random\(/.test(analytics)) {
    fail(
      'Analytics must not use Math.random identifier fallbacks.'
    );
  }

  if (
    !/INACTIVITY_MS/.test(analytics) ||
    !/ABSOLUTE_MS/.test(analytics)
  ) {
    fail(
      'Analytics session expiration controls are missing.'
    );
  }

  if (
    !/globalPrivacyControl/.test(analytics) ||
    !/doNotTrack/.test(analytics)
  ) {
    fail(
      'Analytics does not honor expected browser privacy signals.'
    );
  }

  if (/window\.location\.search/.test(analytics)) {
    fail(
      'Analytics directly accesses the current page query string.'
    );
  }

  const safePagePath =
    /page_path:\s*eventName\s*===\s*['"]404_view['"]\s*\?\s*['"]\/404['"]\s*:\s*pagePath\(\)/;

  if (!safePagePath.test(analytics)) {
    fail(
      'Analytics page_path must use the pathname-only helper, except for the fixed /404 analytics path.'
    );
  }
}

// Pre-launch informational warnings.
const siteConfigPath = path.join(root, 'src/data/site.ts');

if (fs.existsSync(siteConfigPath)) {
  const siteConfig = fs.readFileSync(siteConfigPath, 'utf8');

  if (/appointmentExternalUrl[^=]*=\s*null/.test(siteConfig)) {
    warn('Appointment external URL is not configured yet.');
  }

  if (/clientPortalExternalUrl[^=]*=\s*null/.test(siteConfig)) {
    warn('Client Portal external URL is not configured yet.');
  }
}

console.log('');
console.log('=== SITE QUALITY REPORT ===');
console.log(`HTML pages checked: ${pages.size}`);
console.log(`Indexable pages: ${indexable.length}`);

if (warnings.length) {
  console.log('');
  console.log('Warnings:');
  for (const message of warnings) {
    console.log(`  - ${message}`);
  }
}

if (failures.length) {
  console.log('');
  console.log(`FAILED: ${failures.length} issue(s) found.`);
  for (const message of failures) {
    console.log(`  - ${message}`);
  }
  process.exit(1);
}

console.log('');
console.log('PASS: no blocking site-quality issues found.');
