import { site } from '../data/site';

interface Crumb {
  label: string;
  href?: string;
}

const absoluteUrl = (path: string) => new URL(path, site.publicUrl).href;

export function organizationSchema() {
  return {
    '@type': 'Organization',
    name: site.practice.name,
    url: absoluteUrl('/'),
  };
}

export function websiteSchema() {
  return { '@type': 'WebSite', name: site.practice.name, url: absoluteUrl('/') };
}

export function personSchema(pagePath: string) {
  return {
    '@type': 'Person',
    name: site.clinician.name,
    honorificSuffix: site.clinician.credentials,
    jobTitle: site.clinician.title,
    url: absoluteUrl(pagePath),
    worksFor: { '@type': 'Organization', name: site.practice.name, url: absoluteUrl('/') },
  };
}

// Mirrors the visually rendered breadcrumb trail, including the current page as the final item.
export function breadcrumbSchema(crumbs: Crumb[], currentPath: string) {
  const items = [{ label: 'Home', href: '/' }, ...crumbs];
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href ?? currentPath),
    })),
  };
}

// Wraps one or more entities in a single JSON-LD document (uses @graph when there is more than one).
export function pageSchema(entities: Record<string, unknown>[]) {
  return entities.length === 1
    ? { '@context': 'https://schema.org', ...entities[0] }
    : { '@context': 'https://schema.org', '@graph': entities };
}
